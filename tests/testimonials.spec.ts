import { test, expect } from '@playwright/test'

test('testimonial carousel: slides render, arrows navigate, dots navigate', async ({ page }) => {
  await page.goto('/')
  const region = page.locator('[aria-roledescription="carousel"]')
  await expect(region).toBeVisible()

  // Slides rendered by swiper/react
  const slides = region.locator('.swiper-slide')
  const slideCount = await slides.count()
  expect(slideCount).toBeGreaterThan(1)

  // Initial state: first dot active (w-8 class), prev disabled
  const prev = page.getByRole('button', { name: 'Previous testimonial' })
  const next = page.getByRole('button', { name: 'Next testimonial' })
  await expect(prev).toBeDisabled()
  await expect(next).toBeEnabled()

  // Click next → active slide advances (dot 2 becomes the wide one, prev enables)
  await next.click()
  await expect(prev).toBeEnabled()
  const dot2 = page.getByRole('button', { name: 'Go to testimonial 2' }).locator('span')
  await expect(dot2).toHaveClass(/w-8/)

  // Dot navigation → jump back to slide 1
  await page.getByRole('button', { name: 'Go to testimonial 1' }).click()
  const dot1 = page.getByRole('button', { name: 'Go to testimonial 1' }).locator('span')
  await expect(dot1).toHaveClass(/w-8/)
  await expect(prev).toBeDisabled()
})
