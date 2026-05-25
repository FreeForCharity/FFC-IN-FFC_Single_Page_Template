import { test, expect } from '@playwright/test'

/**
 * WCAG 2.3.3 guardrail: when the user has prefers-reduced-motion: reduce,
 * animated UI must not subject them to motion. The Results section's
 * AnimatedNumber is the canonical case — under reduced motion it should
 * render its final value immediately rather than counting up.
 *
 * NOTE: this spec calls `page.emulateMedia` explicitly *before* navigating
 * rather than relying on the `reducedMotion` test-fixture option. The
 * fixture is applied per-context but framer-motion's `useReducedMotion`
 * subscribes to the live media-query at mount time, so we set it before
 * the first paint so the component's `prefersReducedMotion` value is
 * `true` from the very first render.
 */

test.describe('prefers-reduced-motion', () => {
  test('Results-2023 stat numbers settle without a multi-frame animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Scroll Results-2023 into view so AnimatedNumber's useInView fires.
    await page.locator('#results').scrollIntoViewIfNeeded()

    // Find the four stat-card headings (the first <h1> under #results is
    // the section title "Results - 2023"; the four numeric ones come next).
    const statHeadings = page.locator('#results h1').filter({ hasText: /^\d/ })
    await expect(statHeadings).toHaveCount(4)

    // Poll until two consecutive reads match. Under reduced-motion the
    // component renders its final value as a plain <span> as soon as the
    // useReducedMotion effect commits — so a stable read should arrive
    // within a few hundred milliseconds. Under a full spring (the regular
    // motion path) the value would change on every frame for ~1s and this
    // loop would never converge inside the allotted window.
    const settled = await page.evaluate(async () => {
      const reads = (): string[] =>
        Array.from(document.querySelectorAll('#results h1'))
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
