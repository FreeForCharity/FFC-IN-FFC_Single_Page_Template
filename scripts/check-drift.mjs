#!/usr/bin/env node
/**
 * FFC drift guard — runs in CI and as a pre-commit hook.
 *
 * Catches common ways a child site can drift away from FFC best practices:
 *  1. Route folders that are not kebab-case (SEO requirement)
 *  2. Hardcoded `/Images/...` or `/Svgs/...` paths missing `assetPath()`
 *  3. Common secret patterns committed by accident
 *  4. The template's placeholder URL `ffcworkingsite1.org` left behind in
 *     non-config files after a child site rebrands
 *  5. `src/lib/site.config.ts` left at template defaults but with a custom
 *     domain pushed via CNAME (warn only)
 *
 * Run: `node scripts/check-drift.mjs` or `npm run check:drift`.
 * Exits non-zero on errors; warnings do not fail the check.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'src', 'app')
const SRC_DIR = join(ROOT, 'src')
const errors = []
const warnings = []

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// App router conventions we don't want to flag.
const APP_RESERVED = new Set(['api', '_components', '_lib'])
// Single-file conventions (have a leading dot or @-symbol) handled separately.

async function walk(dir, predicate, results = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      await walk(full, predicate, results)
    } else if (predicate(entry.name)) {
      results.push(full)
    }
  }
  return results
}

async function checkKebabCaseRoutes() {
  let entries
  try {
    entries = await readdir(APP_DIR, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('(') || entry.name.startsWith('_')) continue
    if (entry.name.startsWith('@')) continue
    if (APP_RESERVED.has(entry.name)) continue
    if (!KEBAB_CASE.test(entry.name)) {
      errors.push(
        `Route folder "src/app/${entry.name}" is not kebab-case (SEO requirement). ` +
          `Rename it to lowercase letters and digits separated by hyphens.`
      )
    }
  }
}

function lineAt(body, index) {
  return body.slice(0, index).split('\n').length
}

// True if the match is inside a `//` or `/* */` comment. Coarse but cheap:
// looks at the line preceding the match for `//` and at the body before
// the match for an unclosed `/*`.
function insideComment(body, index) {
  const lineStart = body.lastIndexOf('\n', index - 1) + 1
  const line = body.slice(lineStart, index)
  if (/(^|[^:])\/\//.test(line)) return true
  const beforeOpen = body.lastIndexOf('/*', index)
  if (beforeOpen === -1) return false
  const beforeClose = body.lastIndexOf('*/', index)
  return beforeOpen > beforeClose
}

async function checkAssetPathUsage() {
  const files = await walk(SRC_DIR, (n) => /\.(tsx?|jsx?)$/.test(n))
  // Match raw string literals like "/Images/foo.png", "/Svgs/bar.svg",
  // or "/videos/x.mp4" that aren't wrapped by assetPath(). We also flag
  // template-literal patterns like `${basePath}/Images/...` since that
  // is the anti-pattern assetPath() exists to replace.
  //
  // As of the round-2 cleanup these are ERRORS rather than warnings —
  // the codebase is clean and any new occurrence is a real bug
  // (the resource will 404 on GitHub Pages subpath deploys).
  const literalPattern = /(["'`])(\/(?:Images|Svgs|videos)\/[^"'`\n]+?)\1/g
  const templateBasePattern = /\$\{[^}]*basePath[^}]*\}\/(?:Images|Svgs|videos)\//g
  // 400-char lookback covers prettier-wrapped multi-line calls with
  // inline comments between `assetPath(` and the literal.
  const wrappedInAssetPath = /assetPath\s*\([^)]*$/
  for (const file of files) {
    const rel = relative(ROOT, file)
    if (rel.includes('__tests__') || rel.startsWith('tests' + sep)) continue
    // The drift script itself contains the example patterns it scans for —
    // skip the assetPath helper so we don't flag ourselves.
    if (rel === join('src', 'lib', 'assetPath.ts')) continue
    const body = await readFile(file, 'utf8')

    literalPattern.lastIndex = 0
    let match
    while ((match = literalPattern.exec(body))) {
      if (insideComment(body, match.index)) continue
      const lookback = body.slice(Math.max(0, match.index - 400), match.index)
      if (wrappedInAssetPath.test(lookback)) continue
      errors.push(
        `${rel}:${lineAt(body, match.index)} references "${match[2]}" without assetPath(). ` +
          `Wrap in assetPath('${match[2]}') so it works on GitHub Pages subpaths.`
      )
    }

    templateBasePattern.lastIndex = 0
    while ((match = templateBasePattern.exec(body))) {
      if (insideComment(body, match.index)) continue
      errors.push(
        `${rel}:${lineAt(body, match.index)} hand-rolls basePath concatenation ("${match[0]}…"). ` +
          `Use assetPath('/Images/...') instead so the helper stays the single source of truth.`
      )
    }
  }
}

async function checkSecrets() {
  // Scan src/ AND public/ — anything under public/ is deployed verbatim,
  // so a token accidentally committed there leaks straight to the live site.
  const srcFiles = await walk(SRC_DIR, (n) =>
    /\.(tsx?|jsx?|json|md|yml|yaml|txt|webmanifest)$/.test(n)
  )
  const publicFiles = await walk(join(ROOT, 'public'), (n) =>
    /\.(tsx?|jsx?|json|md|yml|yaml|txt|webmanifest)$|^_headers$|^CNAME$/.test(n)
  )
  const files = [...srcFiles, ...publicFiles]
  // Add patterns sparingly — false positives are noisy.
  const secretPatterns = [
    {
      name: 'AWS access key',
      re: /\bAKIA[0-9A-Z]{16}\b/,
    },
    {
      name: 'Google API key',
      re: /\bAIza[0-9A-Za-z_\-]{35}\b/,
    },
    {
      name: 'GitHub personal access token',
      re: /\bghp_[A-Za-z0-9]{36,}\b/,
    },
    {
      name: 'GitHub fine-grained token',
      re: /\bgithub_pat_[A-Za-z0-9_]{82,}\b/,
    },
    {
      // Covers bot (xoxb), user (xoxp), app-level (xoxa), refresh (xoxr),
      // legacy (xoxs), and OAuth client-secret (xoxe) tokens.
      name: 'Slack token',
      re: /\bxox[abeprs]-[A-Za-z0-9-]{10,}\b/,
    },
    {
      name: 'Private key block',
      re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    },
  ]
  for (const file of files) {
    const body = await readFile(file, 'utf8')
    for (const p of secretPatterns) {
      const m = body.match(p.re)
      if (m) {
        errors.push(
          `Possible ${p.name} committed in ${relative(ROOT, file)}. ` +
            `Move it to a .env file (gitignored) or GitHub Secrets and rotate the credential immediately.`
        )
      }
    }
  }
}

const PLACEHOLDER_HOST = 'ffcworkingsite1.org'

async function checkPlaceholderUrl() {
  const cnamePath = join(ROOT, 'public', 'CNAME')
  let customDomain = null
  try {
    customDomain = (await readFile(cnamePath, 'utf8')).trim()
  } catch {
    /* no CNAME, fine */
  }
  if (!customDomain || customDomain === PLACEHOLDER_HOST) return

  // CNAME points to a real custom domain. Walk every text source under
  // src/ and public/ (plus a small set of well-known config files at the
  // repo root) for the placeholder host. Walking — rather than a fixed
  // file list — means stale references in component READMEs, future docs,
  // or freshly-added config files don't get missed.
  const interestingExt = /\.(tsx?|jsx?|md|mdx|txt|json|yml|yaml|webmanifest)$|^_headers$|^CNAME$/
  const roots = [join(ROOT, 'src'), join(ROOT, 'public')]
  const rootFiles = ['next.config.ts', 'package.json', 'README.md']
  const candidates = []
  for (const root of roots) {
    candidates.push(...(await walk(root, (n) => interestingExt.test(n))))
  }
  for (const name of rootFiles) {
    candidates.push(join(ROOT, name))
  }
  for (const full of candidates) {
    const rel = relative(ROOT, full)
    try {
      const body = await readFile(full, 'utf8')
      // lgtm [js/incomplete-url-substring-sanitization] -- intentional:
      // we are LOOKING FOR the placeholder host anywhere in the file body
      // (string content, comments, URLs alike). This is a drift warning, not
      // a security filter against malicious URLs.
      if (body.includes(PLACEHOLDER_HOST)) {
        const line = lineAt(body, body.indexOf(PLACEHOLDER_HOST))
        warnings.push(
          `public/CNAME points to "${customDomain}" but ${rel}:${line} still references ` +
            `${PLACEHOLDER_HOST}. Update it to match your custom domain.`
        )
      }
    } catch {
      /* file missing or unreadable — skip */
    }
  }
}

async function checkSiteConfigExists() {
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  try {
    await stat(cfgPath)
  } catch {
    errors.push('src/lib/site.config.ts is missing. Restore it from the template.')
  }
}

await checkSiteConfigExists()
await checkKebabCaseRoutes()
await checkAssetPathUsage()
await checkSecrets()
await checkPlaceholderUrl()

if (warnings.length) {
  console.warn('\n⚠️  Drift warnings:')
  for (const w of warnings) console.warn('  - ' + w)
}
if (errors.length) {
  console.error('\n❌ Drift errors:')
  for (const e of errors) console.error('  - ' + e)
  console.error(
    '\nThese violate FFC best practices. Fix them or open an issue if you believe one is a false positive.'
  )
  process.exit(1)
}

console.log(
  warnings.length
    ? `\n✅ No drift errors (${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`
    : '\n✅ No drift detected. Repo aligned with FFC best practices.'
)
