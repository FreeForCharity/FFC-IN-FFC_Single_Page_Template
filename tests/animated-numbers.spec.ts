import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Animated Numbers Tests
 *
 * These tests verify that the Results-2023 section numbers animate correctly
 * when scrolled into view.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Results 2023 Animated Numbers', () => {
  // Helper selector for ResultCard components - uses the distinctive border class
  // to identify the card containing a specific description
  const getResultCard = (page: import('@playwright/test').Page, description: string) =>
    page.locator(`div.border-\\[\\#F58629\\]:has(p:text-is("${description}"))`)

  test('should display the Results section with all statistics', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Find the Results section heading
    const resultsHeading = page.locator(
      `h2:has-text("${testConfig.animatedNumbers.sectionHeading}")`
    )
    await expect(resultsHeading).toBeVisible()

    // Scroll to the Results section to trigger animations
    await resultsHeading.scrollIntoViewIfNeeded()

    // Wait for animation to complete by checking final values
    for (const stat of testConfig.animatedNumbers.statistics) {
      await expect(getResultCard(page, stat.description).locator('h3')).toContainText(stat.value, {
        timeout: 5000,
      })
    }
  })

  test('should start with numbers at 0 before scrolling into view', async ({ page }) => {
    // Navigate to the homepage without scrolling
    await page.goto('/')

    // Verify the numbers start at 0 before scrolling into view
    const firstStat = testConfig.animatedNumbers.statistics[0]
    const firstCardNumber = getResultCard(page, firstStat.description).locator('h3')
    await expect(firstCardNumber).toContainText('0')

    const resultsSection = page.locator(
      `h2:has-text("${testConfig.animatedNumbers.sectionHeading}")`
    )
    await expect(resultsSection).toBeAttached()
  })

  test('should animate numbers only once when scrolled into view', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Find and scroll to the Results section
    const resultsHeading = page.locator(
      `h2:has-text("${testConfig.animatedNumbers.sectionHeading}")`
    )
    await resultsHeading.scrollIntoViewIfNeeded()

    // Wait for animation to complete by checking the final value
    const firstStat = testConfig.animatedNumbers.statistics[0]
    const firstCardNumber = getResultCard(page, firstStat.description).locator('h3')
    await expect(firstCardNumber).toContainText(firstStat.value, { timeout: 5000 })

    // Scroll away and back
    await page.locator('h1:has-text("Welcome to")').scrollIntoViewIfNeeded()
    await resultsHeading.scrollIntoViewIfNeeded()

    // Value should still be the final animated value (not reset to 0)
    await expect(firstCardNumber).toContainText(firstStat.value)
  })

  test('should display correct descriptions for each statistic', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Verify all descriptions are present
    for (const stat of testConfig.animatedNumbers.statistics) {
      await expect(page.locator(`text=${stat.description}`)).toBeVisible()
    }
  })

  test('should respect prefers-reduced-motion preference', async ({ browser }) => {
    // Create a context with reduced motion preference
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()

    await page.goto('/')
    const resultsHeading = page.locator(
      `h2:has-text("${testConfig.animatedNumbers.sectionHeading}")`
    )
    // Wait for the element to be visible before scrolling
    await expect(resultsHeading).toBeVisible({ timeout: 5000 })
    await resultsHeading.scrollIntoViewIfNeeded()

    // With reduced motion, numbers should appear instantly at final value
    const firstStat = testConfig.animatedNumbers.statistics[0]
    const firstCardNumber = getResultCard(page, firstStat.description).locator('h3')
    await expect(firstCardNumber).toContainText(firstStat.value, { timeout: 1000 })

    await context.close()
  })
})
