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
// Deploy base path, e.g. '' on a custom domain or '/<repo>' on a github.io
// project deploy. Used to de-dupe sub-resource paths that already include it.
const BASE_PATHNAME = (() => {
  try {
    return new URL(BASE).pathname.replace(/\/+$/, '')
  } catch {
    return ''
  }
})()

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

// Non-fatal note: logged but never added to results, so it can't fail the run.
function warn(msg) {
  console.log(`! ${msg}`)
}

// Extract the URLs the home page needs in order to actually render:
// stylesheets, (module)preloads, and scripts. Used to catch "page is 200 but
// its assets 404" — the whole-bundle blind spot the fixed per-file checks miss.
function extractSubresourceUrls(html) {
  const urls = []
  let m
  const linkRe = /<link\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/gi
  while ((m = linkRe.exec(html))) {
    if (/\brel=["'](?:stylesheet|preload|modulepreload)["']/i.test(m[0])) urls.push(m[1])
  }
  const scriptRe = /<script\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi
  while ((m = scriptRe.exec(html))) urls.push(m[1])
  return urls
}

// Same-origin guard: root-relative paths are same-origin by definition; absolute
// URLs must match `origin`. Cross-origin assets (font/analytics CDNs) are skipped
// so a flaky or rate-limiting third party can never fail a deploy.
function isSameOrigin(url, origin) {
  if (/^\/(?!\/)/.test(url)) return true
  try {
    return new URL(url).origin === origin
  } catch {
    return false
  }
}

async function smoke() {
  console.log(`Smoke checking ${BASE}\n`)

  // 1. Home page.
  let homeHtml = ''
  const homeRes = await expect200('/', 'home page returns 200')
  if (homeRes) {
    const html = await homeRes.text()
    homeHtml = html
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

  // 4b. Same-origin sub-resources the home page references actually load.
  // The per-file checks above only cover a fixed list; this covers the real
  // CSS/JS bundle. Run against BASE (the deploy URL), so it validates the
  // build is self-consistent at its own deploy URL. Capped + de-duped to bound
  // request volume; same-origin only.
  if (homeHtml) {
    let originBase = BASE
    try {
      originBase = new URL(BASE).origin
    } catch {
      /* keep BASE */
    }
    const refs = [
      ...new Set(extractSubresourceUrls(homeHtml).filter((u) => isSameOrigin(u, originBase))),
    ]
    const sample = refs.slice(0, 30)
    let bad = 0
    for (const ref of sample) {
      // Normalize to a BASE-relative path, mirroring the manifest-icon logic so
      // the deploy base path isn't doubled on a github.io subpath deploy.
      let p = ref.startsWith('http') ? new URL(ref).pathname : ref
      if (BASE_PATHNAME && p.startsWith(`${BASE_PATHNAME}/`)) p = p.slice(BASE_PATHNAME.length)
      const r = await fetchWithRetry(p).catch(() => null)
      if (!r || r.status !== 200) {
        bad++
        record(`sub-resource ${ref}`, false, r ? `HTTP ${r.status}` : 'fetch failed')
      }
    }
    record(
      'home sub-resources (same-origin) resolve',
      bad === 0,
      `${sample.length - bad}/${sample.length} ok${refs.length > sample.length ? ` (capped from ${refs.length})` : ''}`
    )
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

  // 6b. Optional production-domain pass (best effort). Set PROD_URL to the live
  // custom domain (e.g. https://example.org/) to verify the build also works
  // when served at the apex *root*, not just at its deploy URL. This is the ONLY
  // check that catches a basePath/custom-domain mismatch.
  //
  // It is deliberately fail-SOFT about reachability: a freshly-attached domain
  // may not have DNS/TLS yet, and a brand-new site's first deploy may have no
  // custom domain at all. We therefore only FAIL on a *definitive* mismatch —
  // the prod home serving HTTP 200 while its own same-origin sub-resources 404.
  // If prod is unreachable, cert-not-ready, or non-200, we warn and move on, so
  // propagation lag never reds an otherwise-good deploy.
  const prodUrl = (process.env.PROD_URL || '').trim()
  if (prodUrl) {
    const PROD = prodUrl.replace(/\/$/, '')
    let prodOrigin = PROD
    try {
      prodOrigin = new URL(PROD).origin
    } catch {
      /* keep PROD */
    }
    const fetchProd = async (target) => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      try {
        return await fetch(target, {
          signal: controller.signal,
          redirect: 'follow',
          headers: { 'User-Agent': 'ffc-smoke-check' },
        })
      } finally {
        clearTimeout(timer)
      }
    }
    let prodHome = null
    try {
      prodHome = await fetchProd(`${PROD}/`)
    } catch (err) {
      warn(
        `prod ${PROD} not reachable yet (${(err && err.message) || err}) — skipping prod asset check`
      )
    }
    if (prodHome && prodHome.status === 200) {
      const phtml = await prodHome.text()
      // No base-path stripping here: fetch the literal href against the prod
      // origin, so a /<repo>/... asset will 404 at the apex root and be caught.
      const prefs = [
        ...new Set(extractSubresourceUrls(phtml).filter((u) => isSameOrigin(u, prodOrigin))),
      ].slice(0, 30)
      let pbad = 0
      const broken = []
      for (const ref of prefs) {
        const target = ref.startsWith('http')
          ? ref
          : `${prodOrigin}${ref.startsWith('/') ? '' : '/'}${ref}`
        let r = null
        try {
          r = await fetchProd(target)
        } catch {
          /* treated as failure below */
        }
        if (!r || r.status !== 200) {
          pbad++
          if (broken.length < 5) broken.push(`${ref} -> ${r ? r.status : 'ERR'}`)
        }
      }
      record(
        `prod ${PROD} serves its own home assets`,
        pbad === 0,
        pbad === 0 ? `${prefs.length} ok` : `${pbad}/${prefs.length} broken: ${broken.join(', ')}`
      )
    } else if (prodHome) {
      warn(
        `prod ${PROD} home returned HTTP ${prodHome.status} — skipping prod asset check (propagation?)`
      )
    }
  }

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
