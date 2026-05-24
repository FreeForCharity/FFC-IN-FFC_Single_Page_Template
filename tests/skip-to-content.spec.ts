import { test, expect } from '@playwright/test'

/**
 * WCAG 2.4.1 — a "Skip to main content" link must be the first focusable
 * element in the body so keyboard users can bypass the header navigation.
 * The link is visually hidden until focused; once focused it becomes
 * visible and, when activated, focuses the <main> landmark.
 */

test.describe('skip-to-content link', () => {
  test('is the first focusable element and targets #main-content', async ({ page }) => {
    await page.goto('/')

    // Pressing Tab once from a fresh load should focus the skip link.
    await page.keyboard.press('Tab')
    const focusedHref = await page.evaluate(() => {
      const el = document.activeElement as HTMLAnchorElement | null
      return el && el.tagName === 'A' ? el.getAttribute('href') : null
    })
    expect(focusedHref).toBe('#main-content')
  })

  test('skip link is visually hidden until focused', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('a[href="#main-content"]').first()

    // sr-only collapses to a 1px clipped element; bounding box width ≤ 1.
    const beforeFocus = await link.boundingBox()
    expect(beforeFocus?.width ?? 0).toBeLessThanOrEqual(1)

    await page.keyboard.press('Tab')

    // After focus the link should grow to a tappable size.
    const afterFocus = await link.boundingBox()
    expect(afterFocus?.width ?? 0).toBeGreaterThan(50)
  })

  test('<main id="main-content"> wraps the page', async ({ page }) => {
    await page.goto('/')
    const main = page.locator('main#main-content')
    await expect(main).toHaveCount(1)
  })
})
