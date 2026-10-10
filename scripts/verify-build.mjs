#!/usr/bin/env node
/**
 * Built-output verification — the post-build complement to check-drift.mjs
 * (which is source-based) and rebrand-check.mjs (which is config/data-based).
 *
 * Runs against the static export in `out/` and asserts the invariants a
 * rebrand most often breaks but that source linting can't see, because they
 * only exist in the rendered HTML:
 *
 *   1. Every indexable page has exactly ONE <h1> (WCAG 1.3.1 / 2.4.6, and the
 *      heading-hierarchy bug the template's legal pages historically shipped).
 *   2. Every indexable page has a self-referential <link rel="canonical">
 *      (per-page canonical, not the homepage's — the App Router inheritance
 *      trap).
 *
 * Run: `npm run build` first, then `node scripts/verify-build.mjs`
 * (or `npm run verify:build`). Exits non-zero on any violation.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const OUT = join(ROOT, 'out')

// Error/utility pages are not indexable content, so the invariants don't apply.
const SKIP = new Set(['404.html', '_not-found.html'])

async function walkHtml(dir, results = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkHtml(full, results)
    } else if (entry.name.endsWith('.html') && !SKIP.has(entry.name)) {
      results.push(full)
    }
  }
  return results
}

const errors = []

try {
  await stat(OUT)
} catch {
  console.error('\n❌ out/ not found. Run `npm run build` before verify:build.')
  process.exit(1)
}

const pages = await walkHtml(OUT)
if (pages.length === 0) {
  console.error('\n❌ No HTML pages found under out/. Did the build succeed?')
  process.exit(1)
}

for (const page of pages) {
  const rel = relative(ROOT, page)
  const html = await readFile(page, 'utf8')

  const h1Count = (html.match(/<h1[\s>]/g) || []).length
  if (h1Count !== 1) {
    errors.push(`${rel}: expected exactly one <h1>, found ${h1Count}.`)
  }

  if (!/<link[^>]+rel="canonical"/i.test(html)) {
    errors.push(`${rel}: missing <link rel="canonical">.`)
  }
}

if (errors.length) {
  console.error('\n❌ Built-output verification failed:')
  for (const e of errors) console.error('  - ' + e)
  console.error(
    '\nFix the page source (one <h1> per page; a per-page alternates.canonical) and rebuild.'
  )
  process.exit(1)
}

console.log(
  `\n✅ Built-output verified — ${pages.length} pages each have one <h1> and a canonical.`
)
