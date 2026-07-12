#!/usr/bin/env node
/**
 * FFC drift guard — runs in CI and as a pre-commit hook.
 *
 * Catches common ways a child site can drift away from FFC best practices:
 *  1. Top-level route folders under src/app/ that are not kebab-case
 *     (SEO requirement per Google Search Central).
 *  2. Hardcoded `/Images/...`, `/Svgs/...`, or `/videos/...` paths and
 *     `${basePath}/...` template literals missing `assetPath()`.
 *  3. Common secret patterns committed under src/ or public/.
 *  4. The template's placeholder URL `ffcworkingsite1.org` left in source
 *     or public files after a child site rebrands.
 *  5. Two CSPs (public/_headers and src/app/layout.tsx meta tag) drifting
 *     out of sync on third-party origins.
 *  6. Leftover Free For Charity brand identity (org name, freeforcharity.org
 *     URLs, EIN, phone, @freeforcharity.org emails) in rendered pages/
 *     components after a child site rebrands — the footer platform-credit
 *     attribution is the one allowlisted exception. This is the enforced
 *     complement to the advisory `npm run check:rebrand` config/data checklist.
 *
 * Run: `node scripts/check-drift.mjs` or `npm run check:drift`.
 * Always resolves paths relative to the repo root, so it works regardless
 * of the CWD a developer invokes it from.
 * Exits non-zero on errors; warnings do not fail the check.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// Anchor everything to the repo root (scripts/check-drift.mjs lives one
// level down) so the check produces the same result no matter where it's
// invoked from. Previously this used process.cwd() which silently scanned
// nothing if you ran the script from a subdirectory.
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
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

function hostnameOf(rawUrl) {
  if (!rawUrl) return null
  try {
    return new URL(rawUrl).hostname
  } catch {
    return null
  }
}

async function checkPlaceholderUrl() {
  // Trigger the scan if EITHER the CNAME or the siteConfig.url has been
  // updated away from the template default. The previous behavior — only
  // running when CNAME pointed to a custom domain — missed two real cases:
  // 1) Sites deploying only to github.io subpath (no CNAME) that still
  //    forgot to update security.txt or other public assets.
  // 2) Sites that updated siteConfig.url before touching CNAME.
  // The web manifest is now generated from siteConfig, so it doesn't need
  // a separate placeholder check — it inherits the URL automatically.
  const cnamePath = join(ROOT, 'public', 'CNAME')
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  let customDomain = null
  let cfgUrl = null
  try {
    customDomain = (await readFile(cnamePath, 'utf8')).trim()
  } catch {
    /* no CNAME — OK, may be github.io-only */
  }
  try {
    const cfg = await readFile(cfgPath, 'utf8')
    const m = cfg.match(/url:\s*['"]([^'"]+)['"]/)
    cfgUrl = m ? m[1] : null
  } catch {
    /* config missing — handled elsewhere */
  }

  // Compare exact hostnames rather than substring-search — avoids the
  // CodeQL "incomplete URL substring sanitization" false positive and
  // also avoids matching `myffcworkingsite1.org.evil.com`-style strings.
  const cnameRebranded = customDomain && customDomain !== PLACEHOLDER_HOST
  const cfgHost = hostnameOf(cfgUrl)
  const cfgRebranded = cfgHost && cfgHost !== PLACEHOLDER_HOST
  if (!cnameRebranded && !cfgRebranded) return

  // Walk every text source under src/ and public/ (plus a small set of
  // well-known config files at the repo root) for the placeholder host.
  // The extra files below are functional metadata that ships real data (funding
  // links, citation URL, issue-template contact links) — not template-authoring
  // guides, which legitimately keep the placeholder as a "replace-me" example.
  const interestingExt = /\.(tsx?|jsx?|md|mdx|txt|json|yml|yaml|webmanifest)$|^_headers$|^CNAME$/
  const roots = [join(ROOT, 'src'), join(ROOT, 'public')]
  const rootFiles = [
    'next.config.ts',
    'package.json',
    'README.md',
    'CITATION.cff',
    '.github/FUNDING.yml',
    '.github/ISSUE_TEMPLATE/config.yml',
  ]
  const candidates = []
  for (const root of roots) {
    candidates.push(...(await walk(root, (n) => interestingExt.test(n))))
  }
  for (const name of rootFiles) {
    candidates.push(join(ROOT, name))
  }
  const customRef = cnameRebranded ? customDomain : cfgUrl
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
          `${rel}:${line} still references the template placeholder ${PLACEHOLDER_HOST} ` +
            `(this site has rebranded to "${customRef}"). Update it.`
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

// CSP directives that are honored in <meta http-equiv> AND in HTTP headers.
// We diff each of these between public/_headers and src/app/layout.tsx so
// the two stay in lockstep on third-party origins.
// Includes the security-floor directives (default-src, object-src, base-uri)
// alongside the third-party allowlists — a one-sided tightening of object-src
// or base-uri would silently degrade one host while leaving the other safe.
const SYNCED_CSP_DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-src',
  'media-src',
  'form-action',
  'object-src',
  'base-uri',
]

function extractCspDirectives(policy) {
  const out = new Map()
  if (!policy) return out
  for (const part of policy.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const [name, ...sources] = trimmed.split(/\s+/)
    out.set(name, new Set(sources))
  }
  return out
}

async function checkCspSync() {
  let headersBody, layoutBody
  try {
    headersBody = await readFile(join(ROOT, 'public', '_headers'), 'utf8')
  } catch {
    errors.push(
      'public/_headers is missing. CSP and other security headers will not be served on ' +
        'Cloudflare/Netlify deploys. Restore the file from the template.'
    )
    return
  }
  try {
    layoutBody = await readFile(join(ROOT, 'src', 'app', 'layout.tsx'), 'utf8')
  } catch {
    errors.push('src/app/layout.tsx is missing. Restore the file from the template.')
    return
  }
  const headersMatch = headersBody.match(/Content-Security-Policy:\s*([^\n]+)/)
  // Tolerate single or double quotes around the content attribute and
  // multi-line JSX formatting. The CSP itself contains nested quotes
  // (e.g. 'self', 'unsafe-inline') so we match the OUTER delimiter
  // exactly and accept either flavor.
  const layoutMatch =
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content="([^"]+)"/) ||
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content='([^']+)'/) ||
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content=\{`([^`]+)`\}/)
  if (!headersMatch) {
    errors.push(
      'public/_headers has no Content-Security-Policy directive. Add one to keep the site ' +
        'protected on Cloudflare/Netlify deploys.'
    )
    return
  }
  if (!layoutMatch) {
    errors.push(
      'src/app/layout.tsx has no <meta http-equiv="Content-Security-Policy"> tag. Add one so ' +
        'GitHub Pages deploys still get baseline CSP protection.'
    )
    return
  }

  const headersCsp = extractCspDirectives(headersMatch[1])
  const layoutCsp = extractCspDirectives(layoutMatch[1])

  for (const directive of SYNCED_CSP_DIRECTIVES) {
    const hSet = headersCsp.get(directive) || new Set()
    const lSet = layoutCsp.get(directive) || new Set()
    const onlyInHeaders = [...hSet].filter((s) => !lSet.has(s))
    const onlyInLayout = [...lSet].filter((s) => !hSet.has(s))
    if (onlyInHeaders.length || onlyInLayout.length) {
      const detail = []
      if (onlyInHeaders.length) detail.push(`only in _headers: ${onlyInHeaders.join(' ')}`)
      if (onlyInLayout.length) detail.push(`only in layout.tsx: ${onlyInLayout.join(' ')}`)
      errors.push(
        `CSP "${directive}" drifted between public/_headers and src/app/layout.tsx — ${detail.join(' / ')}. ` +
          `Resource will load on one host and fail on the other. Update both files together.`
      )
    }
  }
}

async function checkSiteConfigUrl() {
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  let cfg
  try {
    cfg = await readFile(cfgPath, 'utf8')
  } catch {
    return // missing config handled in checkSiteConfigExists
  }
  const m = cfg.match(/url:\s*['"]([^'"]+)['"]/)
  if (!m) return
  const raw = m[1]
  if (!raw.startsWith('https://')) {
    errors.push(
      `src/lib/site.config.ts: siteConfig.url "${raw}" must start with "https://". ` +
        `metadataBase = new URL(siteConfig.url) will throw at build time otherwise.`
    )
  }
  if (raw.endsWith('/')) {
    errors.push(
      `src/lib/site.config.ts: siteConfig.url "${raw}" must not end with "/". ` +
        `The siteUrl helper assumes no trailing slash; OG/Twitter card URLs will be malformed.`
    )
  }
  try {
    const u = new URL(raw)
    if (u.pathname !== '/' && u.pathname !== '') {
      errors.push(
        `src/lib/site.config.ts: siteConfig.url "${raw}" should be the bare origin (no path). ` +
          `Move any path component into the helpers that consume it.`
      )
    }
  } catch {
    errors.push(`src/lib/site.config.ts: siteConfig.url "${raw}" is not a parseable URL.`)
  }
}

async function checkSecurityTxtSync() {
  const wellKnownPath = join(ROOT, 'public', '.well-known', 'security.txt')
  const rootPath = join(ROOT, 'public', 'security.txt')
  let wellKnownBody, rootBody
  try {
    wellKnownBody = await readFile(wellKnownPath, 'utf8')
  } catch {
    errors.push('public/.well-known/security.txt is missing. Restore it from the template.')
    return
  }
  try {
    rootBody = await readFile(rootPath, 'utf8')
  } catch {
    errors.push(
      'public/security.txt is missing. It is required as a root-path fallback ' +
        'because GitHub Pages does not serve files in dot-prefixed directories.'
    )
    return
  }
  // Compare everything from the first non-comment, non-blank line onward.
  // The two files share the same body but have different header comments.
  function payload(body) {
    return body
      .split('\n')
      .filter((line) => !line.startsWith('#') && line.trim() !== '')
      .join('\n')
      .trim()
  }
  if (payload(wellKnownBody) !== payload(rootBody)) {
    errors.push(
      'public/security.txt and public/.well-known/security.txt have drifted. ' +
        'They must serve identical Contact/Expires/Canonical/Policy/Acknowledgments lines ' +
        'so RFC 9116 clients see the same data regardless of which path they hit.'
    )
  }
}

// The template's own identity. A child site is considered "rebranded" once
// siteConfig.name has been changed away from this default, at which point any
// leftover FFC identity in rendered pages is a real drift bug. On the template
// itself (name unchanged) this gate stays dormant, so it never fails template PRs.
const TEMPLATE_ORG_NAME = 'Free For Charity'

// Patterns that identify the Free For Charity organization specifically.
// Safe to hard-fail on once a site has rebranded — none has a legitimate use in
// a child site's own rendered pages. FFC references a child legitimately keeps
// (e.g. a parent-org credit) live in src/lib/site.config.ts via siteConfig, not
// as literals in src/app or src/components, so they are out of this scan's scope.
const FFC_IDENTITY_PATTERNS = [
  { re: /Free For Charity|Free for Charity/, label: 'the template org name "Free For Charity"' },
  { re: /freeforcharity\.org/i, label: 'a freeforcharity.org URL' },
  { re: /46-?2471893/, label: "Free For Charity's EIN (46-2471893)" },
  { re: /520[\s.-]?222[\s.-]?8104/, label: "Free For Charity's phone number (520-222-8104)" },
  { re: /[A-Za-z0-9._%+-]+@freeforcharity\.org/i, label: 'a @freeforcharity.org email address' },
]

// A child site that customizes its footer with a hardcoded "Built with Free For
// Charity" platform credit may keep it. Allow ONLY those specific lines (the
// credit text, the exact attribution href, and the FFC donation-policy label —
// that page documents FFC's own policy, so its label intentionally keeps FFC's
// name after a rebrand) so any other freeforcharity.org URL — or an EIN, phone,
// or email — is still flagged even inside the footer.
function isAllowedIdentityLine(relPath, line) {
  const normalized = relPath.split(sep).join('/')
  if (normalized !== 'src/components/footer/index.tsx') return false
  return (
    /Built with Free For Charity/.test(line) ||
    /href="https:\/\/freeforcharity\.org"/i.test(line) ||
    /Free For Charity Donation Policy/.test(line)
  )
}

// siteConfig.supportedBy intentionally keeps Free For Charity's name and URL
// forever: it is the permanent "Supported by" attribution required by the FFC
// footer standard, not leftover branding. Blank exactly that block (preserving
// newlines so reported line numbers stay accurate) before the identity scan,
// so every OTHER FFC reference in site.config.ts is still flagged.
function withoutSupportedByBlock(relPath, body) {
  const normalized = relPath.split(sep).join('/')
  if (normalized !== 'src/lib/site.config.ts') return body
  return body.replace(/supportedBy:\s*\{[^}]*\}/g, (block) => block.replace(/[^\n]/g, ' '))
}

async function checkBrandIdentity() {
  const cfgPath = join(SRC_DIR, 'lib', 'site.config.ts')
  let name = null
  try {
    const cfg = await readFile(cfgPath, 'utf8')
    const m = cfg.match(/name:\s*['"]([^'"]+)['"]/)
    name = m ? m[1] : null
  } catch {
    return // missing config handled in checkSiteConfigExists
  }
  // Dormant on the upstream template itself: FFC identity is correct there.
  if (!name || name === TEMPLATE_ORG_NAME) return

  // Scan the whole src/ tree (app, components, lib, data) — leftover FFC
  // identity in config or data modules is just as wrong as in a page.
  const files = await walk(SRC_DIR, (n) => /\.(tsx?|jsx?)$/.test(n))
  for (const full of files) {
    const rel = relative(ROOT, full)
    let body
    try {
      body = await readFile(full, 'utf8')
    } catch {
      continue
    }
    const lines = withoutSupportedByBlock(rel, body).split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (isAllowedIdentityLine(rel, line)) continue
      for (const p of FFC_IDENTITY_PATTERNS) {
        if (p.re.test(line)) {
          errors.push(
            `${rel}:${i + 1} still references ${p.label} after this site rebranded to "${name}". ` +
              `Replace it with the new organization's details.`
          )
        }
      }
    }
  }
}

await checkSiteConfigExists()
await checkSiteConfigUrl()
await checkKebabCaseRoutes()
await checkAssetPathUsage()
await checkSecrets()
await checkPlaceholderUrl()
await checkBrandIdentity()
await checkCspSync()
await checkSecurityTxtSync()

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
