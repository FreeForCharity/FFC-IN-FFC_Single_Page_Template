import { test, expect, type Page } from '@playwright/test'
import { testConfig } from './test.config'

// Navigation needs at least two slides. The carousel shows visibleTestimonials()
// (FFC's own testimonials only on FFC's own site), so a charity site with none of
// its own renders no carousel and the absence spec below runs instead.
const count = testConfig.testimonials.count
const navigable = count > 1
// Rotating from slide 1 to slide 2 and on to a third needs at least three.
const rotatable = count >= 3

test.describe('testimonials absence', () => {
  test.skip(testConfig.testimonials.count > 0, 'This site renders testimonials')

  test("does not render another organization's testimonials", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('#testimonials')).toHaveCount(0)
  })
})

/** The testimonial headings, and which one is actually scrolled into view. */
function carousel(page: Page) {
  const region = page.getByRole('region', { name: 'Testimonials' })
  const slides = region.locator('[aria-roledescription="slide"]')
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
    test.skip(!navigable, 'Fewer than two testimonials on this site')

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
 * Step the fake clock until slide `index` is the active one, after something
 * the visitor did (Play, the pointer leaving) should restart rotation.
 *
 * The rotation timer is created by a React effect that runs only after that
 * event has been handled, so on a slow CI runner one big `runFor` can run out
 * before the timer exists, and the slide never moves. Small steps let the
 * effect land first. The step (250 ms) is far shorter than a rotation
 * (5 s), so this stops on `index` and cannot skip past it, and the cap (two
 * rotations) still fails a carousel that never resumes.
 */
async function tickUntilActive(page: Page, index: number) {
  const slide = carousel(page).slides.nth(index)
  for (let elapsed = 0; elapsed < 10_000; elapsed += 250) {
    await page.clock.runFor(250)
    await page.waitForTimeout(20)
    if ((await slide.getAttribute('data-active')) === 'true') break
  }
  await expect(slide).toHaveAttribute('data-active', 'true')
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
  test.skip(!rotatable, 'Fewer than three testimonials on this site')
  // Each test steps a fake clock through several rotations and smooth
  // scrolls. That takes about 5 s here, but on a busy CI runner it has run
  // past the default 30 s.
  test.describe.configure({ timeout: 90_000 })

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
    await page.mouse.move(0, 0)
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')

    // Play resumes it, even though focus is still on the button.
    await region.getByRole('button', { name: 'Play testimonials' }).click()
    await page.mouse.move(0, 0)
    await tickUntilActive(page, 2)
  })

  test('Pause still pauses when the button takes focus before the click', async ({ page }) => {
    // Chrome on Android, and desktop browsers on mousedown, focus the button
    // first; focus moving into the carousel must not undo the press.
    const { region, slides } = carousel(page)
    await waitForFirstRotation(page)
    const pause = region.getByRole('button', { name: 'Pause testimonials' })
    await pause.focus()
    await expect(pause).toHaveAccessibleName('Pause testimonials')
    await pause.click()
    await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible()
    await page.mouse.move(0, 0)
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')
  })

  test('the pause button comes first in the carousel tab order', async ({ page }) => {
    const { region } = carousel(page)
    const first = region.locator('button, [tabindex="0"]').first()
    await expect(first).toHaveAccessibleName(/Pause testimonials|Play testimonials/)
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

  test('keyboard focus moving in stops rotation until Play is pressed', async ({ page }) => {
    const { region, slides } = carousel(page)
    await waitForFirstRotation(page)
    const scroller = region.getByRole('group', { name: 'Testimonial slides' })
    await scroller.focus()
    await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible()
    // Focus leaving does not restart it.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')

    await region.getByRole('button', { name: 'Play testimonials' }).click()
    await page.mouse.move(0, 0)
    await tickUntilActive(page, 2)
  })

  test('the mouse over the carousel holds rotation, and leaving resumes it', async ({ page }) => {
    const { slides } = carousel(page)
    await waitForFirstRotation(page)
    await slides.nth(1).hover()
    await tick(page, 12_000)
    await expect(slides.nth(1)).toHaveAttribute('data-active', 'true')
    await page.mouse.move(0, 0)
    await tickUntilActive(page, 2)
  })

  test('automatic rotation is not announced', async ({ page }) => {
    const { region } = carousel(page)
    await waitForFirstRotation(page)
    await tick(page, 5500)
    await expect(region.locator('[aria-live="polite"]')).toHaveText('')
  })
})

test('reduced motion: no rotation and no pause button', async ({ page }) => {
  test.skip(!navigable, 'Fewer than two testimonials on this site')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto('/')
  const { region, slides } = carousel(page)
  // The server render shows the button; it goes once the page has hydrated.
  await expect(region.getByRole('button', { name: /Pause testimonials/ })).toHaveCount(0)
  await tick(page, 12_000)
  await expect(slides.nth(0)).toHaveAttribute('data-active', 'true')
})

test('the target dot stays current for the whole of a smooth scroll', async ({ page }) => {
  test.skip(!navigable, 'Fewer than two testimonials on this site')
  // Real clock and no reduced motion, so the jump really animates.
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const { region } = carousel(page)
  const lastDot = region.getByRole('button', { name: `Go to testimonial ${count}` })
  // Wait for hydration: the pause button responds once it has happened.
  await expect(async () => {
    await region.getByRole('button', { name: /testimonials$/ }).click()
    await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible({
      timeout: 1000,
    })
  }).toPass({ timeout: 15_000 })

  const samples = await lastDot.evaluate(async (button: HTMLButtonElement) => {
    const dots = [...document.querySelectorAll('[aria-label^="Go to testimonial"]')]
    const seen: number[] = []
    button.click()
    const start = performance.now()
    while (performance.now() - start < 1200) {
      await new Promise((resolve) => setTimeout(resolve, 30))
      seen.push(dots.findIndex((dot) => dot.getAttribute('aria-current') === 'true'))
    }
    return seen
  })
  expect(new Set(samples)).toEqual(new Set([count - 1]))
  await expectShown(page, count - 1)
  await expect(region.locator('[aria-live="polite"]')).toHaveText(
    `Testimonial ${count} of ${count}`
  )
})

test.describe('testimonials on a touch screen', () => {
  test.use({ hasTouch: true, viewport: { width: 412, height: 915 } })
  test.skip(!navigable, 'Fewer than two testimonials on this site')

  test('tapping the slides stops rotation', async ({ page }) => {
    await page.goto('/')
    const { region } = carousel(page)
    const slides = region.getByRole('group', { name: 'Testimonial slides' })
    await slides.scrollIntoViewIfNeeded()
    await expect(async () => {
      await slides.tap()
      await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible({
        timeout: 1000,
      })
    }).toPass({ timeout: 15_000 })
  })
})

test('an interrupted jump leaves the dots on the slide where it stopped', async ({ page }) => {
  // A jump to the last slide has to pass slide 2 to be cut short there.
  test.skip(!rotatable, 'Fewer than three testimonials on this site')
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const { region } = carousel(page)
  await expect(async () => {
    await region.getByRole('button', { name: /testimonials$/ }).click()
    await expect(region.getByRole('button', { name: 'Play testimonials' })).toBeVisible({
      timeout: 1000,
    })
  }).toPass({ timeout: 15_000 })

  // Start a smooth jump to the last slide, then cut it short on slide 2,
  // as a swipe would.
  await region.getByRole('button', { name: `Go to testimonial ${count}` }).evaluate(
    (button: HTMLButtonElement) =>
      new Promise<void>((resolve) => {
        button.click()
        setTimeout(() => {
          const row = document.querySelector('[aria-label="Testimonial slides"]') as HTMLElement
          row.scrollTo({ left: row.clientWidth, behavior: 'instant' })
          resolve()
        }, 80)
      })
  )
  await expectShown(page, 1)
  await expect(region.getByRole('button', { name: 'Go to testimonial 2' })).toHaveAttribute(
    'aria-current',
    'true'
  )
})
