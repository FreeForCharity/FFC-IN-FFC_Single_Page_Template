import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Copyright Notice Tests
 *
 * These tests verify that the copyright notice in the footer:
 * 1. Contains the copyright symbol (©)
 * 2. Displays the current year
 * 3. Renders the complete copyright text
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Footer Copyright Notice', () => {
  test('should display copyright notice with current year', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Get the current year
    const currentYear = new Date().getFullYear()

    // Find the footer paragraph containing the copyright text
    const footerText = page.locator(`footer p:has-text("${testConfig.copyright.searchText}")`)

    // Verify the copyright notice is visible
    await expect(footerText).toBeVisible()

    // Verify it contains the copyright symbol and current year
    await expect(footerText).toContainText(`© ${currentYear}`)

    // Verify the complete copyright text is present
    await expect(footerText).toContainText(testConfig.copyright.text)
  })

  test('should display link to organization website in copyright notice', async ({ page }) => {
    // The footer only renders the "A project of" parent-org link when a parent
    // org is configured. Skip this assertion for standalone charities.
    test.skip(!testConfig.copyright.linkUrl, 'No parent organization configured')

    // Navigate to the homepage
    await page.goto('/')

    // Find the link within the copyright notice
    const copyrightLink = page.locator(
      `footer p:has-text("${testConfig.copyright.searchText}") a[href="${testConfig.copyright.linkUrl}"]`
    )

    // Verify the link is visible
    await expect(copyrightLink).toBeVisible()

    // Verify the link text
    await expect(copyrightLink).toContainText(testConfig.copyright.linkText)
  })
})
