import { test, expect } from '@playwright/test'

for (const viewport of [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 412, height: 915 },
]) {
  test.describe(`testimonial navigation on ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('arrows change the visible testimonial and return to the first one', async ({ page }) => {
      await page.goto('/')
      const carousel = page.getByRole('region', { name: 'Testimonials' })
      await expect(carousel.locator('.swiper-initialized')).toBeVisible()
      // Stop automatic rotation so only the clicked control can satisfy the assertion.
      await carousel.locator('.swiper').evaluate((element) => {
        const swiper = (element as HTMLElement & { swiper: { autoplay: { stop(): void } } }).swiper
        swiper.autoplay.stop()
      })
      await carousel.hover()
      await page.getByRole('button', { name: 'Go to testimonial 1', exact: true }).click()
      // Swiper ignores another navigation while the preceding transition is active.
      await expect
        .poll(() =>
          carousel.locator('.swiper').evaluate((element) => {
            const swiper = (element as HTMLElement & { swiper?: { animating: boolean } }).swiper
            return swiper?.animating
          })
        )
        .toBe(false)
      const heading = carousel.locator('.swiper-slide-active h3')
      const first = await heading.innerText()
      await carousel.getByRole('button', { name: 'Next testimonial', exact: true }).click()
      await expect(heading).not.toHaveText(first)
      await expect
        .poll(() =>
          carousel.locator('.swiper').evaluate((element) => {
            const swiper = (element as HTMLElement & { swiper?: { animating: boolean } }).swiper
            return swiper?.animating
          })
        )
        .toBe(false)
      await carousel.getByRole('button', { name: 'Previous testimonial', exact: true }).click()
      await expect(heading).toHaveText(first)
    })
  })
}
