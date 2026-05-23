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

async function checkAssetPathUsage() {
  const files = await walk(SRC_DIR, (n) => /\.(tsx?|jsx?)$/.test(n))
  // Match raw string literals like "/Images/foo.png", "/Svgs/bar.svg",
  // or "/videos/x.mp4" that aren't wrapped by assetPath(). We also flag
  // template-literal patterns like `${basePath}/Images/...` since that
  // is the anti-pattern assetPath() exists to replace.
  const literalPattern = /(["'`])(\/(?:Images|Svgs|videos)\/[^"'`\n]+?)\1/g
  const templateBasePattern = /\$\{[^}]*basePath[^}]*\}\/(?:Images|Svgs|videos)\//g
  // Generous 200-char lookback so multi-line prettier-wrapped calls
  // like `assetPath(\n  '/Images/x.png'\n)` are recognized.
  const wrappedInAssetPath = /assetPath\s*\(\s*[^)]{0,40}$/
  for (const file of files) {
    const rel = relative(ROOT, file)
    if (rel.includes('__tests__') || rel.startsWith('tests' + sep)) continue
    // The drift script itself contains the example patterns it scans for —
    // skip the assetPath helper and this script so we don't flag ourselves.
    if (rel === join('src', 'lib', 'assetPath.ts')) continue
    const body = await readFile(file, 'utf8')

    literalPattern.lastIndex = 0
    let match
    while ((match = literalPattern.exec(body))) {
      const lookback = body.slice(Math.max(0, match.index - 200), match.index)
      if (wrappedInAssetPath.test(lookback)) continue
      const line = body.slice(0, match.index).split('\n').length
      warnings.push(
        `${rel}:${line} references "${match[2]}" without assetPath(). ` +
          `Wrap in assetPath('${match[2]}') so it works on GitHub Pages subpaths.`
      )
    }

    templateBasePattern.lastIndex = 0
    while ((match = templateBasePattern.exec(body))) {
      const line = body.slice(0, match.index).split('\n').length
      warnings.push(
        `${rel}:${line} hand-rolls basePath concatenation ("${match[0]}…"). ` +
          `Use assetPath('/Images/...') instead so the helper stays the single source of truth.`
      )
    }
  }
}

async function checkSecrets() {
  const files = await walk(SRC_DIR, (n) => /\.(tsx?|jsx?|json|md|yml|yaml)$/.test(n))
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

  // CNAME points to a real custom domain. Surface every file that still
  // references the template placeholder so the rebrand is actually complete.
  // Each of these has a known good single source of truth, so a remaining
  // reference is a drift signal — not a stylistic warning.
  const filesToCheck = [
    join('src', 'lib', 'site.config.ts'),
    join('public', '.well-known', 'security.txt'),
    join('public', '_headers'),
    join('public', 'site.webmanifest'),
  ]
  for (const rel of filesToCheck) {
    try {
      const body = await readFile(join(ROOT, rel), 'utf8')
      if (body.includes(PLACEHOLDER_HOST)) {
        warnings.push(
          `public/CNAME points to "${customDomain}" but ${rel} still references ` +
            `${PLACEHOLDER_HOST}. Update it to match your custom domain.`
        )
      }
    } catch {
      /* file missing — not all sites carry every file */
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
