#!/usr/bin/env node
/**
 * PreToolUse(Bash) guard for Claude Code.
 *
 * Blocks a small, high-signal set of catastrophic or guardrail-bypassing
 * shell commands BEFORE they run. This complements (does not replace) the
 * `deny` list in .claude/settings.json — that list is a coarse pattern match;
 * this hook understands flags and targets, so it can allow the safe cases
 * (e.g. a feature-branch force-push) while blocking the dangerous ones.
 *
 * Contract: read the tool call JSON on stdin. To block, print a reason to
 * stderr and exit 2 (Claude Code feeds stderr back to the model). For any
 * other case — including the hook itself failing — exit 0 (fail open) so we
 * never wedge a legitimate session on a parser bug.
 */

async function readInput() {
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

function deny(reason) {
  process.stderr.write(`🛑 Blocked by guard-bash hook: ${reason}\n`)
  process.exit(2)
}

const DANGEROUS_RM_TARGETS = new Set([
  '/',
  '/*',
  '~',
  '~/',
  '$HOME',
  '${HOME}',
  '.',
  './',
  '..',
  '../',
  '*',
])

/**
 * Find `rm` invocations that are BOTH recursive and forced AND aimed at a
 * top-level / home / wildcard target. We deliberately allow targeted
 * recursive deletes (e.g. `rm -rf out`, `rm -rf node_modules`) — those are
 * routine and safe.
 *
 * Every target of every `rm` is inspected, not just the first: `rm -rf out /`
 * mixes a safe and a catastrophic target, and the catastrophic one must still
 * be caught. The command is split on shell separators so each simple command
 * (e.g. `rm -rf a && rm -rf /`) is checked independently.
 */
function checkRm(cmd) {
  for (const segment of cmd.split(/[\n;|&]+/)) {
    const tokens = segment.trim().split(/\s+/)
    const rmIdx = tokens.findIndex((t) => t === 'rm' || t.endsWith('/rm'))
    if (rmIdx === -1) continue

    let recursive = false
    let forced = false
    const targets = []
    for (const arg of tokens.slice(rmIdx + 1)) {
      if (arg === '--') continue
      if (arg.startsWith('--')) {
        if (arg === '--recursive') recursive = true
        if (arg === '--force') forced = true
      } else if (arg.startsWith('-')) {
        // Short flags, possibly bundled: -r, -R, -f, -rf, -fr.
        if (/r/i.test(arg)) recursive = true
        if (/f/.test(arg)) forced = true
      } else {
        targets.push(arg)
      }
    }

    if (recursive && forced) {
      const danger = targets.find((t) => DANGEROUS_RM_TARGETS.has(t))
      if (danger) {
        return `"rm ... ${danger}" targets the filesystem root, home, or a wildcard. Delete a specific, named path instead.`
      }
    }
  }
  return null
}

const input = await readInput()
const cmd = String(input?.tool_input?.command ?? '')
if (!cmd.trim()) process.exit(0)

// 1. Catastrophic recursive deletes.
const rmReason = checkRm(cmd)
if (rmReason) deny(rmReason)

// 2. Bypassing the husky pre-commit / commit-msg guardrails. The whole point
//    of those hooks is that they run on every commit — let them.
if (/\bgit\s+commit\b[^\n]*--no-verify\b/.test(cmd) || /\bgit\s+commit\b[^\n]*\s-n\b/.test(cmd)) {
  deny(
    'git commit --no-verify skips the husky format/lint/drift and commitlint checks. Fix the issue the hook reports instead of bypassing it.'
  )
}

// 3. Force-pushing a protected branch. Feature-branch force-pushes are fine
//    and intentionally NOT blocked.
if (
  /\bgit\s+push\b/.test(cmd) &&
  /(--force\b|--force-with-lease\b|\s-f\b)/.test(cmd) &&
  /\b(main|master)\b/.test(cmd)
) {
  deny(
    'Force-pushing to main/master can destroy shared history. Push to your feature branch and open a PR.'
  )
}

// 4. Piping a remote download straight into a shell (arbitrary RCE).
if (/\b(curl|wget)\b[^\n]*\|\s*(sudo\s+)?(ba|z)?sh\b/.test(cmd)) {
  deny(
    'Piping a downloaded script directly into a shell runs unaudited remote code. Download it, read it, then run it deliberately.'
  )
}

// 5. World-writable permissions.
if (/\bchmod\s+(-[a-zA-Z]+\s+)*0?777\b/.test(cmd)) {
  deny(
    'chmod 777 makes files world-writable. Use the least permission that works (e.g. 644 for files, 755 for executables).'
  )
}

// 6. Publishing this private template to a public registry.
if (/\bnpm\s+publish\b/.test(cmd)) {
  deny(
    'npm publish would push this private nonprofit template to the npm registry. This package is marked private and is not meant to be published.'
  )
}

process.exit(0)
