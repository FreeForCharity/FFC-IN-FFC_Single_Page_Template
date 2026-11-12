import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Social Links Tests
 *
 * These tests verify that:
 * 1. Social media links are present and functional
 * 2. Defunct platforms (like Google+) are not present
 * 3. All social icons link to correct destinations
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Footer Social Links', () => {
  test('should not contain Google+ social link', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Check that Google+ link is not present
    const googlePlusLink = page.locator('footer a[href*="plus.google.com"]')
    await expect(googlePlusLink).toHaveCount(0)

    // Also check that Google Plus label is not present
    const googlePlusLabel = page.locator('footer a[aria-label="Google Plus"]')
    await expect(googlePlusLabel).toHaveCount(0)
  })

  test('should display active social media links', async ({ page }) => {
    // The links come from siteConfig.social (via test.config.ts), so this runs
    // unchanged on the template and on every provisioned charity site.
    test.skip(testConfig.socialLinks.active.length === 0, 'No social links configured')
    await page.goto('/')

    for (const { href, ariaLabel } of testConfig.socialLinks.active) {
      const link = page.locator(`footer a[href="${href}"]`)
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('aria-label', ariaLabel)
    }
  })

  test('should render one icon per configured social link', async ({ page }) => {
    await page.goto('/')

    const expected = testConfig.socialLinks.active
    const labels = [...new Set(expected.map((s) => s.ariaLabel))]
    // Count only the social icons (target=_blank links whose aria-label is a
    // configured social label), not other external links in the footer.
    const selector = labels.length
      ? labels.map((l) => `footer a[target="_blank"][aria-label="${l}"]`).join(', ')
      : 'footer a[data-no-social-links]'
    await expect(page.locator(selector)).toHaveCount(expected.length)
  })
})
