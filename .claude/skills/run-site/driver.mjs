#!/usr/bin/env node
/*
 * driver.mjs — headless-Chromium harness for an FFC static-export site.
 *
 * Site-agnostic: works for any FFC static-export site (Next.js
 * `output: 'export'`). It drives Chromium through Playwright's
 * API via `@playwright/test` (the package the repo already depends on) — pointed
 * at the container's pre-installed browser via executablePath, not a
 * Playwright-bundled download. It navigates one or more routes against a
 * running server, screenshots each, and reports same-origin request
 * failures, bad HTTP responses (>=400), and uncaught page errors. A page
 * that throws or 404s makes the run exit non-zero; blocked third-party
 * requests are counted but never fail the run.
 *
 * Prereqs: `npm run build` then a server on BASE_URL (see SKILL.md).
 *
 * Usage:
 *   node .claude/skills/run-site/driver.mjs                 # smoke the default route set
 *   node .claude/skills/run-site/driver.mjs / /privacy-policy/   # specific routes
 *   BASE_URL=http://localhost:3000 node .../driver.mjs /    # override server origin
 *   ROUTES="/,/about/,/contact/" node .../driver.mjs        # override default route set
 *   EXPECT="Some heading" node .../driver.mjs /             # assert text is present
 *
 * Screenshots land in .claude/skills/run-site/screenshots/<slug>.png
 * Exit code: 0 = every route clean, 1 = any route failed.
 */

import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { existsSync, statSync, accessSync, constants } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// The repo's Playwright pins a browser build that may not match the one
// pre-installed in the container. Prefer the container's stable chromium
// symlink so we never need `npx playwright install`. Override with
// CHROME_PATH if needed — validated up front so a bad path fails loudly
// here instead of as an opaque Playwright launch error later.
function resolveChrome() {
  const override = process.env.CHROME_PATH
  if (override) {
    try {
      if (!statSync(override).isFile()) throw new Error('not a file')
      accessSync(override, constants.X_OK)
    } catch {
      console.error(`CHROME_PATH="${override}" is not an executable file.`)
      process.exit(1)
    }
    return override
  }
  return ['/opt/pw-browsers/chromium'].find((p) => existsSync(p)) || undefined
}
const CHROME = resolveChrome()

const here = dirname(fileURLToPath(import.meta.url))
const shotDir = resolve(here, 'screenshots')

// Default origin: the static export served on :3000 (see SKILL.md for how).
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const EXPECT = process.env.EXPECT || ''
const VIEWPORT = { width: 1280, height: 800 }

// Default route set: `/` only — the one route every site has. Override with
// ROUTES="/a/,/b/" or pass routes as args to cover more of a multi-page site.
const DEFAULT_ROUTES = (process.env.ROUTES || '/')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean)

const routes = process.argv.slice(2)
const targets = routes.length ? routes : DEFAULT_ROUTES

const slug = (p) => (p.replace(/^\/|\/$/g, '') || 'home').replace(/[^a-z0-9]+/gi, '-')

const PASS = '\x1b[32m✓\x1b[0m'
const FAIL = '\x1b[31m✗\x1b[0m'

async function main() {
  await mkdir(shotDir, { recursive: true })
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    ...(CHROME ? { executablePath: CHROME } : {}),
  })
  const context = await browser.newContext({ viewport: VIEWPORT })
  let failures = 0

  for (const path of targets) {
    const rel = path.startsWith('/') ? path : `/${path}`
    // Only a real scheme counts as absolute — otherwise a route like
    // `http-status/` would be mistaken for a URL and crash `new URL()`.
    const url = /^https?:\/\//.test(path) ? path : `${BASE_URL}${rel}`
    // Classify by the target's own origin, not BASE_URL — an absolute-URL
    // arg has its own origin, and BASE_URL wouldn't match it.
    const origin = new URL(url).origin
    const sameOrigin = (u) => {
      try {
        return new URL(u).origin === origin
      } catch {
        return false
      }
    }
    const page = await context.newPage()
    const pageErrors = []
    const localFails = [] // same-origin resource failures — real bugs
    const extBlocks = [] // third-party hosts blocked by the sandbox — informational
    page.on('pageerror', (e) => pageErrors.push(String(e)))
    page.on('requestfailed', (r) => {
      const err = r.failure()?.errorText || ''
      if (err.includes('ERR_ABORTED')) return // aborted <Link> prefetches are normal
      if (sameOrigin(r.url())) localFails.push(`${r.url()} (${err})`)
      else extBlocks.push(r.url())
    })
    page.on('response', (r) => {
      if (sameOrigin(r.url()) && r.status() >= 400)
        localFails.push(`${r.url()} (HTTP ${r.status()})`)
    })

    const shot = resolve(shotDir, `${slug(path)}.png`)
    const shotRel = relative(process.cwd(), shot)
    let ok = true
    let detail = ''
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 30000 })
      // Best-effort quiet-network wait: blocked third-party embeds can keep
      // the network busy indefinitely, so cap it instead of failing on it.
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
      const status = res?.status() ?? 0
      if (status >= 400) {
        ok = false
        detail = `HTTP ${status}`
      }
      if (EXPECT && !(await page.content()).includes(EXPECT)) {
        ok = false
        detail = `${detail} missing text "${EXPECT}"`.trim()
      }
      await page.screenshot({ path: shot, fullPage: true })
      if (pageErrors.length) {
        ok = false
        detail = `${detail} pageerror: ${pageErrors[0]}`.trim()
      }
      if (localFails.length) {
        ok = false
        detail = `${detail} same-origin fail: ${localFails[0]}`.trim()
      }
    } catch (e) {
      ok = false
      detail = String(e).split('\n')[0]
      // Best-effort artifact even when navigation failed, so the printed
      // screenshot path points at something on a failing route.
      await page.screenshot({ path: shot, fullPage: true }).catch(() => {})
    }

    if (!ok) failures++
    const note = extBlocks.length ? ` (${extBlocks.length} third-party blocked)` : ''
    process.stdout.write(
      `${ok ? PASS : FAIL} ${path}${detail ? ` — ${detail}` : ''}${note} -> ${shotRel}\n`
    )
    await page.close()
  }

  await browser.close()
  process.stdout.write(
    `\n${failures ? FAIL : PASS} ${targets.length - failures}/${targets.length} routes clean\n`
  )
  // Set exitCode rather than process.exit() so stdout flushes fully first.
  process.exitCode = failures ? 1 : 0
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
