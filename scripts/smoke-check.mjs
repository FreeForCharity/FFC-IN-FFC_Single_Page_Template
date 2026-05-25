#!/usr/bin/env node
/**
 * Post-deploy smoke check for FFC template sites.
 *
 * Usage: node scripts/smoke-check.mjs <base-url>
 *
 * Verifies that everything the template ships actually serves on the
 * deployed site:
 *   - Home page is reachable, status 200, includes a CSP <meta>
 *     tag, theme-color, OG / Twitter cards, and a <link rel="manifest">
 *   - /robots.txt is 200 and lists Sitemap:
 *   - /sitemap.xml is 200 and contains <urlset>
 *   - /.well-known/security.txt is 200 with a Contact: line and a
 *     future RFC 3339 Expires: date
 *   - /manifest.webmanifest (current) or /site.webmanifest (legacy)
 *     returns 200 JSON with name + icons
 *   - 404 page returns the branded heading
 *   - favicon.ico and icon.png are reachable
 *
 * Includes the retry-with-backoff the inline Python script had so the
 * check survives Pages-propagation lag right after a deploy.
 *
 * Exit codes:
 *   0  every check passed
 *   1  one or more checks failed (details on stderr)
 *   2  invalid usage
 */

const baseArg = process.argv[2]
if (!baseArg) {
  console.error('Usage: node scripts/smoke-check.mjs <base-url>')
  process.exit(2)
}
const BASE = baseArg.replace(/\/$/, '')

const TOTAL_DEADLINE_MS = 180 * 1000
const REQUEST_TIMEOUT_MS = 15 * 1000
const RETRY_DELAY_MS = 5 * 1000
const deadline = Date.now() + TOTAL_DEADLINE_MS

async function fetchWithRetry(path) {
  const url = `${BASE}${path}`
  let lastErr = null
  for (let attempt = 1; Date.now() < deadline; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'ffc-smoke-check' },
      })
      clearTimeout(timer)
      // Only retry on 5xx or transient. 4xx is a real failure.
      if (res.status >= 500 || res.status === 429) {
        lastErr = `HTTP ${res.status}`
        await sleep(RETRY_DELAY_MS)
        continue
      }
      return res
    } catch (err) {
      clearTimeout(timer)
      lastErr = err && err.message ? err.message : String(err)
      await sleep(RETRY_DELAY_MS)
    }
  }
  throw new Error(`Fetch deadline exceeded for ${url}: ${lastErr}`)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const results = []
function record(name, ok, detail = '') {
  results.push({ name, ok, detail })
  const mark = ok ? '✓' : '✗'
  const line = detail ? `${mark} ${name} — ${detail}` : `${mark} ${name}`
  console.log(line)
}

async function expect200(path, name = path) {
  try {
    const res = await fetchWithRetry(path)
    record(name, res.status === 200, `HTTP ${res.status}`)
    return res
  } catch (err) {
    record(name, false, err.message)
    return null
  }
}

async function smoke() {
  console.log(`Smoke checking ${BASE}\n`)

  // 1. Home page.
  const homeRes = await expect200('/', 'home page returns 200')
  if (homeRes) {
    const html = await homeRes.text()
    record(
      'home has Content-Security-Policy <meta>',
      /<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]+content=/i.test(html)
    )
    record('home has <meta name="theme-color">', /<meta[^>]+name=["']theme-color["']/i.test(html))
    record('home has Open Graph title', /<meta[^>]+property=["']og:title["']/i.test(html))
    record('home has Twitter card meta', /<meta[^>]+name=["']twitter:card["']/i.test(html))
    record('home has <link rel="manifest">', /<link[^>]+rel=["']manifest["']/i.test(html))
    record(
      'home advertises strict referrer policy',
      /<meta[^>]+name=["']referrer["'][^>]+content=["']strict-origin-when-cross-origin["']/i.test(
        html
      )
    )
  }

  // 2. robots + sitemap.
  const robotsRes = await expect200('/robots.txt')
  if (robotsRes) {
    const body = await robotsRes.text()
    record('robots.txt references Sitemap:', /^Sitemap:\s+https?:/im.test(body))
  }
  const sitemapRes = await expect200('/sitemap.xml')
  if (sitemapRes) {
    const body = await sitemapRes.text()
    record('sitemap.xml has <urlset>', /<urlset[\s>]/.test(body))
    record('sitemap.xml lists at least one URL', /<loc>https?:\/\//.test(body))
  }

  // 3. security.txt — try /.well-known/security.txt first (RFC 9116 §3
  // canonical location), fall back to /security.txt (root fallback that
  // ships because GitHub Pages does NOT serve dot-prefixed directories).
  // The check passes if EITHER serves a valid RFC 9116 file; we surface
  // which one we hit so deploys on Cloudflare/Netlify (both should work)
  // vs GH-Pages (only the root copy will serve) are visible.
  async function tryText(path) {
    try {
      const r = await fetchWithRetry(path)
      if (r.status === 200) return { path, body: await r.text() }
    } catch {
      /* fall through */
    }
    return null
  }
  const secFile = (await tryText('/.well-known/security.txt')) ?? (await tryText('/security.txt'))
  if (!secFile) {
    record('security.txt served at /.well-known/security.txt or /security.txt', false)
  } else {
    record(`security.txt served at ${secFile.path}`, true)
    const contactMatch = /^Contact:\s*(.+)$/im.exec(secFile.body)
    record('security.txt has Contact:', !!contactMatch, contactMatch?.[1]?.trim() || '')
    const expiresMatch = /^Expires:\s*(.+)$/im.exec(secFile.body)
    if (expiresMatch) {
      const expires = new Date(expiresMatch[1].trim())
      const valid = !isNaN(expires.getTime()) && expires.getTime() > Date.now()
      record('security.txt Expires is in the future', valid, expiresMatch[1].trim())
    } else {
      record('security.txt has Expires:', false)
    }
  }

  // 4. Manifest. Prefer /manifest.webmanifest (post-#259), fall back to
  // /site.webmanifest (legacy).
  let manifestPath = '/manifest.webmanifest'
  let manifestRes = await fetchWithRetry(manifestPath).catch(() => null)
  if (!manifestRes || manifestRes.status === 404) {
    manifestPath = '/site.webmanifest'
    manifestRes = await fetchWithRetry(manifestPath).catch(() => null)
  }
  if (!manifestRes || manifestRes.status !== 200) {
    record('manifest served at /manifest.webmanifest or /site.webmanifest', false)
  } else {
    record(`manifest served at ${manifestPath}`, true, `HTTP ${manifestRes.status}`)
    const ct = manifestRes.headers.get('content-type') || ''
    let manifest = null
    try {
      manifest = await manifestRes.json()
    } catch {
      record(`${manifestPath} parses as JSON`, false, `content-type: ${ct}`)
    }
    if (manifest) {
      record('manifest has name', !!manifest.name, manifest.name || '')
      record(
        'manifest has icons[]',
        Array.isArray(manifest.icons) && manifest.icons.length > 0,
        `${manifest.icons?.length ?? 0} icon(s)`
      )
      record(
        'manifest has theme_color or background_color',
        !!(manifest.theme_color || manifest.background_color)
      )
      // Verify every icon URL the manifest advertises actually resolves.
      // Catches the bug fixed in #319: a custom-domain deploy with
      // NEXT_PUBLIC_BASE_PATH=/repo would emit icon srcs like
      // /repo/android-chrome-192x192.png that 404 on the root-served
      // custom domain. The PWA install prompt fails silently otherwise.
      if (Array.isArray(manifest.icons)) {
        for (const icon of manifest.icons) {
          if (!icon?.src) continue
          const iconUrl = icon.src.startsWith('http')
            ? icon.src
            : icon.src.startsWith('/')
              ? icon.src
              : `/${icon.src}`
          const iconPath = iconUrl.startsWith('http') ? iconUrl.replace(BASE, '') : iconUrl
          const r = await fetchWithRetry(iconPath).catch(() => null)
          const ok = r && r.status === 200
          record(`manifest icon ${icon.src} resolves`, ok, r ? `HTTP ${r.status}` : 'fetch failed')
        }
      }
    }
  }

  // 5. Branded 404.
  const notFoundUrl = `/this-page-definitely-does-not-exist-${Date.now()}`
  const notFoundRes = await fetchWithRetry(notFoundUrl).catch(() => null)
  if (!notFoundRes) {
    record('404 page reachable', false)
  } else {
    const body = await notFoundRes.text()
    // GitHub Pages serves 404.html with HTTP 404; some proxies / preview
    // hosts return 200 with the same HTML. Either is OK as long as the
    // branded heading is in the response.
    record(
      '404 page renders the branded heading',
      /can[&#x27;']?t find that page/i.test(body),
      `status ${notFoundRes.status}`
    )
  }

  // 6. Favicon + icon are reachable.
  await expect200('/favicon.ico')
  await expect200('/icon.png')

  // 7. Summary.
  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.error('\nFailures:')
    for (const r of failed) console.error(`  - ${r.name}${r.detail ? ` (${r.detail})` : ''}`)
    process.exit(1)
  }
}

smoke().catch((err) => {
  console.error('\nSmoke check crashed:', err && err.stack ? err.stack : err)
  process.exit(1)
})
