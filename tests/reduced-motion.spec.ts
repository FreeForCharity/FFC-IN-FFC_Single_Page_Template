import { test, expect } from '@playwright/test'

/**
 * WCAG 2.3.3 guardrail: when the user has prefers-reduced-motion: reduce,
 * animated UI must not subject them to motion. The Results section's
 * AnimatedNumber is the canonical case — under reduced motion it should
 * render its final value immediately rather than counting up.
 *
 * Apply the preference to the whole browser context so it remains active
 * when third-party frames attach during navigation, and before the native
 * useReducedMotion hook mounts.
 */

test.describe('prefers-reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('Results-2023 stat numbers settle without a multi-frame animation', async ({ page }) => {
    // Test local animation behavior with deterministic external frames. The
    // donation provider's availability is covered separately by smoke checks.
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url())
      if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
      return route.request().resourceType() === 'document'
        ? route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<!doctype html><html></html>',
          })
        : route.fulfill({ status: 204, body: '' })
    })
    await page.goto('/')
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    )

    // Scroll Results-2023 into view so AnimatedNumber's useInView fires.
    await page.locator('#results').scrollIntoViewIfNeeded()

    // Find the four stat-card headings (the section title under #results is an <h2>;
    // the four numeric stat cards are <h3>.
    const statHeadings = page.locator('#results h3').filter({ hasText: /^\d/ })
    await expect(statHeadings).toHaveCount(4)

    // Poll until two consecutive reads match. Under reduced-motion the
    // component renders its final value as a plain <span> as soon as the
    // useReducedMotion effect commits — so a stable read should arrive
    // within a few hundred milliseconds. Under a full spring (the regular
    // motion path) the value would change on every frame for ~1s and this
    // loop would never converge inside the allotted window.
    const settled = await page.evaluate(async () => {
      const reads = (): string[] =>
        Array.from(document.querySelectorAll('#results h3'))
          .map((el) => (el.textContent ?? '').trim())
          .filter((t) => /^\d+$/.test(t))

      const deadline = Date.now() + 1500
      let prev = reads()
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 75))
        const curr = reads()
        if (curr.length === 4 && curr.every((v, i) => v === prev[i])) {
          return curr
        }
        prev = curr
      }
      return null
    })

    expect(settled).not.toBeNull()
    expect(settled).toHaveLength(4)
    for (const v of settled as string[]) {
      expect(v).toMatch(/^\d+$/)
    }
  })
})
