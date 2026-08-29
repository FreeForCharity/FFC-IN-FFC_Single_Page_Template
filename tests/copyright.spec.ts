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

  test('should display the permanent "Supported by" attribution', async ({ page }) => {
    // FFC footer standard: every supported charity site carries a permanent
    // "Supported by <org>" link in the bottom bar. Unlike the parent-org
    // clause below, this is always rendered — it must never be skipped.
    await page.goto('/')

    // On the template itself the supporting org and the parent org are both
    // FFC, so this href can appear twice. The "Supported by" clause renders
    // first (before the optional "A project of" clause) — assert on it.
    const attributionLink = page
      .locator(
        `footer p:has-text("${testConfig.copyright.searchText}") a[href="${testConfig.copyright.supportedByUrl}"]`
      )
      .first()

    await expect(attributionLink).toBeVisible()
    await expect(attributionLink).toContainText(testConfig.copyright.supportedByText)

    const footerText = page.locator(`footer p:has-text("${testConfig.copyright.searchText}")`)
    await expect(footerText).toContainText(`Supported by ${testConfig.copyright.supportedByText}`)
  })

  test('should display link to organization website in copyright notice', async ({ page }) => {
    // The footer only renders the "A project of" parent-org link when a parent
    // org is configured. Skip this assertion for standalone charities.
    test.skip(!testConfig.copyright.linkUrl, 'No parent organization configured')

    // Navigate to the homepage
    await page.goto('/')

    // Find the link within the copyright notice. On the template itself the
    // parent org and the supporting org are both FFC, so the same href appears
    // twice ("Supported by" first, then "A project of") — assert on the last
    // match, which is the parent-org clause.
    const copyrightLink = page
      .locator(
        `footer p:has-text("${testConfig.copyright.searchText}") a[href="${testConfig.copyright.linkUrl}"]`
      )
      .last()

    // Verify the link is visible
    await expect(copyrightLink).toBeVisible()

    // Verify the link text
    await expect(copyrightLink).toContainText(testConfig.copyright.linkText)
  })
})
