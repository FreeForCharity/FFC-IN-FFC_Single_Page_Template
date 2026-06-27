#!/usr/bin/env node
/**
 * Bundle-size budget guard — keeps the template's shipped JavaScript lean.
 *
 * After `npm run build`, this sums the JavaScript under
 * `out/_next/static/chunks/` and fails if the gzipped total exceeds a budget.
 * Gzip is a stable, deterministic proxy for transfer size — real browsers may
 * receive Brotli (smaller) depending on the host, but gzip is a good guardrail
 * and easy to reproduce. The budget carries generous headroom above the current
 * size so normal feature work doesn't trip it — only a real regression (e.g.
 * accidentally re-adding a heavy dependency) does.
 *
 * Run AFTER a build: `npm run build && npm run check:bundle`.
 * Exits non-zero when over budget.
 *
 * Raising the budget: if a fork legitimately needs more JS, bump
 * BUDGET_GZIP_KB below — deliberately, so the increase is visible in review.
 */
import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const CHUNKS_DIR = join(ROOT, 'out', '_next', 'static', 'chunks')

// Current gzipped JS is ~237 KB. 300 KB leaves ~25% headroom: enough that
// routine changes pass, tight enough that a large bloat regression fails.
const BUDGET_GZIP_KB = 300

async function walkJs(dir, results = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (err) {
    // A missing chunks dir is expected pre-build and handled by the empty-list
    // check below. Any other I/O error (permissions, transient FS) must fail
    // loudly — swallowing it could undercount JS and pass the budget falsely.
    if (err.code === 'ENOENT') return results
    throw err
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkJs(full, results)
    } else if (entry.name.endsWith('.js')) {
      results.push(full)
    }
  }
  return results
}

const files = await walkJs(CHUNKS_DIR)
if (files.length === 0) {
  console.error(
    `\n❌ No JS chunks found under ${relative(ROOT, CHUNKS_DIR)}. ` +
      'Run `npm run build` first so the static export exists.'
  )
  process.exit(1)
}

let totalRaw = 0
let totalGzip = 0
const perFile = []
for (const file of files) {
  const buf = await readFile(file)
  const gzip = gzipSync(buf).length
  totalRaw += buf.length
  totalGzip += gzip
  perFile.push({ rel: relative(CHUNKS_DIR, file), gzip })
}

const kb = (bytes) => (bytes / 1024).toFixed(1)
const totalGzipKb = totalGzip / 1024

// Show the few largest chunks so a regression is easy to attribute.
perFile.sort((a, b) => b.gzip - a.gzip)
console.log('\nLargest JS chunks (gzipped):')
for (const f of perFile.slice(0, 5)) {
  console.log(`  ${kb(f.gzip).padStart(7)} KB  ${f.rel}`)
}

console.log(
  `\nTotal JS: ${kb(totalRaw)} KB raw, ${kb(totalGzip)} KB gzipped ` +
    `(budget ${BUDGET_GZIP_KB} KB gzipped).`
)

if (totalGzipKb > BUDGET_GZIP_KB) {
  console.error(
    `\n❌ Bundle over budget by ${(totalGzipKb - BUDGET_GZIP_KB).toFixed(1)} KB gzipped. ` +
      'Trim JS (remove/lazy-load a dependency) or, if the growth is intended, raise ' +
      'BUDGET_GZIP_KB in scripts/check-bundle-size.mjs.'
  )
  process.exit(1)
}

console.log(
  `\n✅ Bundle within budget (${(BUDGET_GZIP_KB - totalGzipKb).toFixed(1)} KB gzipped to spare).`
)
