import { test, expect } from '@playwright/test'

/**
 * Header scroll behaviour, driven by IntersectionObserver instead of scroll
 * listeners: the header shrinks once the page scrolls, and the menu link for
 * the section under the header is highlighted (scroll spy).
 */

test.use({ viewport: { width: 1280, height: 800 } })

test.describe('Header scroll behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('shrinks after scrolling and grows back at the top', async ({ page }) => {
    const header = page.locator('header#header')
    await expect(header).toHaveClass(/h-\[80px\]/)

    await page.evaluate(() => window.scrollTo(0, 400))
    await expect(header).toHaveClass(/h-\[55px\]/)

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(header).toHaveClass(/h-\[80px\]/)
  })

  test('highlights the menu link for the section under the header', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    const home = nav.getByRole('link', { name: 'Home', exact: true })
    const mission = nav.getByRole('link', { name: 'Mission', exact: true })
    const volunteer = nav.getByRole('link', { name: 'Volunteer', exact: true })

    await expect(home).toHaveClass(/text-blue-600/)

    const scrollToSection = (id: string) =>
      page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId)
        if (!el) throw new Error(`#${sectionId} missing`)
        // Put the section top just above the 100px spy line.
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80)
      }, id)

    await scrollToSection('mission')
    await expect(mission).toHaveClass(/text-blue-600/)
    await expect(home).not.toHaveClass(/text-blue-600/)

    await scrollToSection('volunteer')
    await expect(volunteer).toHaveClass(/text-blue-600/)
    await expect(mission).not.toHaveClass(/text-blue-600/)

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(home).toHaveClass(/text-blue-600/)
    await expect(volunteer).not.toHaveClass(/text-blue-600/)
  })
})
