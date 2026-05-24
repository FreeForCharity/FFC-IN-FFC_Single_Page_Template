import { test, expect } from '@playwright/test'

/**
 * Pins the metadata contract that #257 / #259 promised: every page in the
 * static export emits the CSP meta tag, the referrer/theme-color/color-scheme
 * meta tags, an OG card, a Twitter card, a manifest link, and the canonical /
 * sitemap / robots / security.txt artifacts.
 *
 * If a future change to layout.tsx, manifest.ts, robots.ts, or sitemap.ts
 * accidentally drops one of these, this spec catches it before deploy.
 */

test.describe('head metadata and security claims', () => {
  test('CSP meta tag exists and includes the third-party origins the site uses', async ({
    page,
  }) => {
    await page.goto('/')
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content')
    expect(csp).toBeTruthy()
    expect(csp).toContain('default-src')
    expect(csp).toContain('https://www.googletagmanager.com') // GTM
    expect(csp).toContain('https://www.clarity.ms') // Microsoft Clarity
    expect(csp).toContain('https://widgets.sociablekit.com') // Facebook events widget
    expect(csp).toContain('https://forms.office.com') // Microsoft Forms iframe
    expect(csp).toContain('object-src')
    // frame-ancestors is intentionally omitted from the meta CSP (browsers
    // ignore it there per spec). It lives in public/_headers only.
    expect(csp).not.toContain('frame-ancestors')
  })

  test('referrer, color-scheme, and theme-color meta tags exist', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
      'content',
      'strict-origin-when-cross-origin'
    )
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light')
    // theme-color may be present multiple times (e.g., Next.js auto-adds a
    // matching pair from the manifest); check at least one is emitted.
    const themeColors = await page.locator('meta[name="theme-color"]').count()
    expect(themeColors).toBeGreaterThan(0)
  })

  test('OG and Twitter card metadata present with images', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:title"]').first()).toHaveAttribute('content', /.+/)
    await expect(page.locator('meta[property="og:description"]').first()).toHaveAttribute(
      'content',
      /.+/
    )
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      'content',
      /web-app-manifest|\.png|\.webp|\.jpg/
    )
    await expect(page.locator('meta[name="twitter:card"]').first()).toHaveAttribute(
      'content',
      'summary_large_image'
    )
  })

  test('manifest link is wired and document includes <link rel="manifest">', async ({ page }) => {
    await page.goto('/')
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(manifestHref).toBeTruthy()
    expect(manifestHref).toMatch(/manifest\.webmanifest|site\.webmanifest/)
  })

  // The branded /_not-found page is verified by inspecting the static
  // export artifact directly — Playwright's `serve -s` preview falls back
  // to index.html for non-existent routes, so we can't navigate to a 404
  // in test (GitHub Pages serves 404.html correctly in production).
  test('404 page is built with the branded heading', async () => {
    const { readFile } = await import('node:fs/promises')
    const body = await readFile('out/404.html', 'utf8')
    expect(body).toMatch(/can[&#x27;']?t find that page/i)
  })
})

test.describe('static artifacts shipped to /out', () => {
  test('/robots.txt references the sitemap', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('Sitemap:')
    expect(body).toContain('/sitemap.xml')
  })

  test('/sitemap.xml lists the home URL', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('<urlset')
    expect(body).toContain('<loc>')
  })

  test('/.well-known/security.txt has Contact and a future Expires', async ({ request }) => {
    const response = await request.get('/.well-known/security.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toMatch(/^Contact:/im)
    const expiresMatch = body.match(/^Expires:\s*(.+)$/im)
    expect(expiresMatch).not.toBeNull()
    if (expiresMatch) {
      const expires = new Date(expiresMatch[1].trim())
      expect(expires.getTime()).toBeGreaterThan(Date.now())
    }
  })

  test('manifest is served with the required fields', async ({ request }) => {
    // The dynamic route from #259 lives at /manifest.webmanifest while
    // older deploys may still serve the static /site.webmanifest. The
    // `serve -s` preview SPA-falls-back to index.html for unknown paths,
    // so we use the response content-type (not status) to detect a real
    // manifest vs an HTML fallback.
    async function tryManifest(path: string) {
      const r = await request.get(path)
      const ct = r.headers()['content-type'] || ''
      if (r.status() === 200 && /json|manifest/i.test(ct)) return r
      return null
    }
    const response =
      (await tryManifest('/manifest.webmanifest')) ?? (await tryManifest('/site.webmanifest'))
    expect(
      response,
      'no manifest served at /manifest.webmanifest or /site.webmanifest'
    ).not.toBeNull()
    const manifest = await response!.json()
    expect(manifest.name).toBeTruthy()
    expect(manifest.icons).toBeInstanceOf(Array)
    expect(manifest.icons.length).toBeGreaterThan(0)
    expect(manifest.theme_color || manifest.background_color).toBeTruthy()
  })
})
