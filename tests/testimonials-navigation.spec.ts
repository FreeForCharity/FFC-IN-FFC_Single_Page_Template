import { test, expect, type Page } from '@playwright/test'

/** The testimonial headings, and which one is actually scrolled into view. */
function carousel(page: Page) {
  const region = page.getByRole('region', { name: 'Testimonials' })
  const slides = region.getByRole('group')
  return { region, slides }
}

/**
 * Slide `index` is the one scrolled into the carousel's view: its left edge
 * sits at the scroller's left edge, and it is marked active.
 */
async function expectShown(page: Page, index: number, timeout = 5000) {
  const slide = carousel(page).slides.nth(index)
  await expect
    .poll(
      () =>
        slide.evaluate((el) => {
          const scroller = el.parentElement as HTMLElement
          return Math.abs(scroller.scrollLeft - (el as HTMLElement).offsetLeft) < 2
        }),
      { timeout }
    )
    .toBe(true)
  await expect(slide).toHaveAttribute('data-active', 'true', { timeout })
}

for (const viewport of [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 412, height: 915 },
]) {
  test.describe(`testimonial navigation on ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('arrows and dots scroll the matching testimonial into view', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' }) // no rotation, instant scroll
      await page.goto('/')
      const { region, slides } = carousel(page)
      await region.scrollIntoViewIfNeeded()
      await expectShown(page, 0)

      const next = region.getByRole('button', { name: 'Next testimonial', exact: true })
      // Retry the first press until the page has hydrated.
      await expect(async () => {
        await next.click()
        await expectShown(page, 1, 1000)
      }).toPass({ timeout: 15_000 })

      await region.getByRole('button', { name: 'Previous testimonial', exact: true }).click()
      await expectShown(page, 0)

      const last = (await slides.count()) - 1
      await region.getByRole('button', { name: `Go to testimonial ${last + 1}` }).click()
      await expectShown(page, last)
      await expect(
        region.getByRole('button', { name: `Go to testimonial ${last + 1}` })
      ).toHaveAttribute('aria-current', 'true')
      // Next wraps around from the last testimonial, and keeps focus.
      await next.focus()
      await page.keyboard.press('Enter')
      await expectShown(page, 0)
      await expect(next).toBeFocused()
    })
  })
}

/**
 * Advance the fake clock, then keep it moving in small steps so a smooth
 * scroll the rotation started can finish: with the clock faked, Chromium's
 * scroll animation only progresses as the clock does.
 */
async function tick(page: Page, ms: number) {
  await page.clock.runFor(ms)
  for (let i = 0; i < 30; i++) {
    await page.clock.runFor(50)
    await page.waitForTimeout(20)
  }
}

/**
 * Advance the fake clock until the carousel rotates to slide 2. The first
 * rotation is also the sign the page has hydrated: before that, the timer
 * does not exist yet.
 */
async function waitForFirstRotation(page: Page) {
  const dot2 = carousel(page).region.getByRole('button', { name: 'Go to testimonial 2' })
  await expect(async () => {
    await tick(page, 5500)
    await expect(dot2).toHaveAttribute('aria-current', 'true', { timeout: 500 })
  }).toPass({ timeout: 15_000 })
}

test.describe('testimonial rotation', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await page.clock.install()
    await page.goto('/')
    await page.mouse.move(0, 0) // keep the pointer off the carousel
  })

  test('rotates on its own, and the pause button stops it', async ({ page }) => {
    const { region, slides } = carousel(page)
    await waitForFirstRotation(page)

    await region.getByRole('button', { name: 'Pause testimonials' }).click()
    await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible()
    // The click moved focus into the carousel, which pauses it too. Move
    // focus out and the pointer away so only the pause state is left.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.mouse.move(0, 0)
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')

    // Play resumes it.
    await region.getByRole('button', { name: 'Play testimonials' }).click()
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.mouse.move(0, 0)
    await tick(page, 5500)
    await expect(slides.nth(2)).toHaveAttribute('data-active', 'true')
  })

  test('after the last testimonial it rotates back to the first', async ({ page }) => {
    const { slides } = carousel(page)
    await waitForFirstRotation(page)
    const count = await slides.count()
    for (let i = 2; i <= count; i++) {
      await tick(page, 5500)
      await expect(slides.nth(i % count)).toHaveAttribute('data-active', 'true')
    }
    await expectShown(page, 0)
  })

  test('focus inside the carousel stops rotation', async ({ page }) => {
    const { region, slides } = carousel(page)
    await waitForFirstRotation(page)
    // A keyboard user tabbing in lands on the scrollable slides first.
    await slides.nth(1).locator('xpath=..').focus()
    await expect(slides.nth(1).locator('xpath=..')).toBeFocused()
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')
  })

  test('the mouse over the carousel stops rotation', async ({ page }) => {
    const { region, slides } = carousel(page)
    await waitForFirstRotation(page)
    await slides.nth(1).hover()
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')
  })
})

test('reduced motion: no rotation and no pause button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto('/')
  const { region, slides } = carousel(page)
  // The server render shows the button; it goes once the page has hydrated.
  await expect(region.getByRole('button', { name: /Pause testimonials/ })).toHaveCount(0)
  await tick(page, 12_000)
  await expect(slides.nth(0)).toHaveAttribute('data-active', 'true')
})
