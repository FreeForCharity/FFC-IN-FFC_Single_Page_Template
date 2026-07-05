#!/usr/bin/env node
/**
 * FFC rebrand checklist — a guide for a charity that just forked the template.
 *
 * It reports every value that still matches the template's Free For Charity
 * defaults, grouped by category, so a fork knows exactly what to change to make
 * the site its own. Unlike `check-drift.mjs`, this is NOT a CI gate on the
 * template repo: the canonical template intentionally keeps FFC's real values,
 * so a gating check would fail every PR here. It therefore exits 0 by default.
 *
 * A fork that wants to enforce "fully rebranded before deploy" can run it with
 * `--strict`, which exits non-zero while any template default remains.
 *
 *   node scripts/rebrand-check.mjs            # report only, exit 0
 *   node scripts/rebrand-check.mjs --strict   # exit 1 if anything is unchanged
 *   npm run check:rebrand                     # same as the first form
 *
 * Always resolves paths relative to the repo root, so it works regardless of
 * the CWD a developer invokes it from.
 */
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const STRICT = process.argv.includes('--strict')

// Recursively collect files under `dir` whose basename passes `predicate`.
// Skips node_modules and dot-directories, mirroring scripts/check-drift.mjs.
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

async function readText(rel) {
  try {
    return await readFile(join(ROOT, rel), 'utf8')
  } catch {
    return null
  }
}

// True if any file under `relDir` contains `needle`.
async function dirContains(relDir, needle) {
  const files = await walk(join(ROOT, relDir), (n) => n.endsWith('.json'))
  for (const file of files) {
    const body = await readFile(file, 'utf8')
    if (body.includes(needle)) return true
  }
  return false
}

// Each finding: a template default still present that a fork should replace.
const findings = []
function flag(category, label, where) {
  findings.push({ category, label, where })
}

// --- Organization identity (src/lib/site.config.ts) ---------------------------
// These are the FFC values a fork must replace with its own. We look for each
// default string in the config file; substring presence is the right signal
// for a "did you change this yet?" checklist (mirrors check-drift's approach).
async function checkSiteConfig() {
  const rel = 'src/lib/site.config.ts'
  const cfg = await readText(rel)
  if (cfg === null) {
    flag('Organization identity', `${rel} is missing — restore it from the template`, rel)
    return
  }
  const defaults = [
    ['Charity name still "Free For Charity"', 'Free For Charity'],
    ['Domain still ffcworkingsite1.org', 'ffcworkingsite1.org'],
    ['EIN (tax ID) still 46-2471893', '46-2471893'],
    ['Phone still (520) 222-8104', '5202228104'],
    ['Contact email still security@freeforcharity.org', 'security@freeforcharity.org'],
    // Match the twitterHandle assignment specifically — a bare "freeforcharity"
    // needle also hits the email and the Facebook/LinkedIn/GitHub social URLs,
    // so it would mis-fire even after a fork updated the handle.
    ['Twitter/X handle still @freeforcharity', "twitterHandle: '@freeforcharity'"],
    ['Mailing address still FFC (Wake Forrest Road)', 'Wake Forrest Road'],
    // foundingDate feeds the public JSON-LD (schema.org foundingDate); a fork
    // that keeps FFC's value publishes 2014 as ITS founding year.
    ['Founding date still FFC 2014', "foundingDate: '2014'"],
  ]
  for (const [label, needle] of defaults) {
    if (cfg.includes(needle)) flag('Organization identity', label, rel)
  }
}

// --- Analytics (src/lib/analytics.config.ts) ----------------------------------
// The GA/Pixel/Clarity values ship as inert "XXXX" placeholders, so leaving
// them is harmless. The GTM container ID, however, is FFC's REAL container —
// leaving it sends the fork's analytics to Free For Charity. Flag it loudly.
async function checkAnalyticsConfig() {
  const rel = 'src/lib/analytics.config.ts'
  const cfg = await readText(rel)
  if (cfg === null) return
  if (cfg.includes('GTM-TQ5H8HPR')) {
    flag(
      'Analytics',
      'GTM container still GTM-TQ5H8HPR (FFC’s own) — your analytics will flow to FFC',
      rel
    )
  }
}

// --- Deployment files ---------------------------------------------------------
async function checkDeployment() {
  const cname = await readText('public/CNAME')
  if (cname && cname.includes('ffcworkingsite1.org')) {
    flag('Deployment', 'public/CNAME still points at ffcworkingsite1.org', 'public/CNAME')
  }
  // The site ships TWO security.txt copies (root + .well-known/) that must stay
  // in sync. Scan both so a fork that updated only one copy is still flagged.
  // Check the Contact email and the Canonical/Policy URLs separately — a fork
  // might update one and forget the other.
  const securityFiles = ['public/security.txt', 'public/.well-known/security.txt']
  const bodies = []
  for (const rel of securityFiles) {
    const body = await readText(rel)
    if (body !== null) bodies.push([rel, body])
  }
  const filesWith = (needle) => bodies.filter(([, b]) => b.includes(needle)).map(([rel]) => rel)

  const withEmail = filesWith('security@freeforcharity.org')
  if (withEmail.length) {
    flag(
      'Deployment',
      `security.txt Contact still security@freeforcharity.org`,
      withEmail.join(', ')
    )
  }
  const withUrl = filesWith('ffcworkingsite1.org')
  if (withUrl.length) {
    flag(
      'Deployment',
      'security.txt Canonical/Policy URLs still point at ffcworkingsite1.org',
      withUrl.join(', ')
    )
  }
}

// --- Sample content -----------------------------------------------------------
// Flag the demo data if the recognizable FFC sample entries are untouched.
async function checkSampleContent() {
  if (await dirContains('src/data/team', 'Clarke Moyer')) {
    flag('Sample content', 'Team still shows the FFC sample members', 'src/data/team/*.json')
  }
  if (await dirContains('src/data/testimonials', 'American Legion Ahwatukee')) {
    flag(
      'Sample content',
      'Testimonials still show the FFC samples',
      'src/data/testimonials/*.json'
    )
  }
  if (await dirContains('src/data/faqs', 'Are you really a Charity')) {
    flag('Sample content', 'FAQ still shows the FFC sample questions', 'src/data/faqs/*.json')
  }
}

await checkSiteConfig()
await checkAnalyticsConfig()
await checkDeployment()
await checkSampleContent()

if (findings.length === 0) {
  console.log('\n✅ Rebrand complete — no Free For Charity template defaults detected.')
  process.exit(0)
}

// Group findings by category for a readable checklist.
const byCategory = new Map()
for (const f of findings) {
  if (!byCategory.has(f.category)) byCategory.set(f.category, [])
  byCategory.get(f.category).push(f)
}

console.log('\n📋 Rebrand checklist — values still matching the Free For Charity template:\n')
for (const [category, items] of byCategory) {
  console.log(`  ${category}:`)
  for (const item of items) {
    console.log(`    ☐ ${item.label}`)
    console.log(`        → edit ${item.where}`)
  }
  console.log('')
}
const n = findings.length
console.log(
  `${n} template default${n === 1 ? '' : 's'} still present. ` +
    'Update them to make this site your own. See TEMPLATE_CUSTOMIZATION.md.'
)

if (STRICT) {
  console.error('\n❌ --strict: failing because template defaults remain.')
  process.exit(1)
}
process.exit(0)
