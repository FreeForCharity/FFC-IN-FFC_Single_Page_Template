import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Cookie Consent Tests
 *
 * These tests verify the cookie consent functionality:
 * 1. Banner display on first visit
 * 2. Accept All, Decline All, and Customize buttons work correctly
 * 3. Preferences modal opens and closes properly
 * 4. Selections are saved to localStorage and respected on subsequent visits
 * 5. Modal accessibility (focus management, escape key)
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and localStorage before each test
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should display cookie consent banner on first visit', async ({ page }) => {
    // Find the cookie consent banner
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()

    // Verify banner has the correct heading
    const heading = banner.locator('h3')
    await expect(heading).toHaveText(testConfig.cookieConsent.bannerHeading)

    // Verify all three buttons are present
    await expect(
      banner.getByRole('button', { name: testConfig.cookieConsent.buttons.declineAll })
    ).toBeVisible()
    await expect(
      banner.getByRole('button', { name: testConfig.cookieConsent.buttons.customize })
    ).toBeVisible()
    await expect(
      banner.getByRole('button', { name: testConfig.cookieConsent.buttons.acceptAll })
    ).toBeVisible()

    // Verify policy links are present
    await expect(banner.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
    await expect(banner.getByRole('link', { name: 'Cookie Policy' })).toBeVisible()
  })

  test('should hide banner after clicking Accept All', async ({ page }) => {
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()

    // Click Accept All
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.acceptAll }).click()

    // Banner should be hidden
    await expect(banner).not.toBeVisible()
  })

  test('should hide banner after clicking Decline All', async ({ page }) => {
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()

    // Click Decline All
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.declineAll }).click()

    // Banner should be hidden
    await expect(banner).not.toBeVisible()
  })

  test('should persist Accept All choice and not show banner on subsequent visits', async ({
    page,
  }) => {
    // Accept all cookies
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.acceptAll }).click()

    // Reload the page
    await page.reload()

    // Banner should not be visible
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).not.toBeVisible()

    // Verify localStorage was set correctly
    const consent = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(consent).toBeTruthy()
    const preferences = JSON.parse(consent!)
    expect(preferences.necessary).toBe(true)
    expect(preferences.functional).toBe(true)
    expect(preferences.analytics).toBe(true)
    expect(preferences.marketing).toBe(true)
  })

  test('should persist Decline All choice and not show banner on subsequent visits', async ({
    page,
  }) => {
    // Decline all cookies
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.declineAll }).click()

    // Reload the page
    await page.reload()

    // Banner should not be visible
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).not.toBeVisible()

    // Verify localStorage was set correctly
    const consent = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(consent).toBeTruthy()
    const preferences = JSON.parse(consent!)
    expect(preferences.necessary).toBe(true)
    expect(preferences.functional).toBe(true) // Functional is always true even when declining
    expect(preferences.analytics).toBe(false)
    expect(preferences.marketing).toBe(false)
  })
})

test.describe('Cookie Preferences Modal', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies and localStorage before each test
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should open preferences modal when clicking Customize', async ({ page }) => {
    // Click Customize button
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    // Modal should be visible
    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Verify modal has the correct heading
    const heading = modal.locator('h2')
    await expect(heading).toHaveText(testConfig.cookieConsent.modalHeading)

    // Verify cookie category sections are present
    await expect(modal.getByText('Necessary Cookies')).toBeVisible()
    await expect(modal.getByText('Functional Cookies')).toBeVisible()
    await expect(modal.getByText('Analytics Cookies')).toBeVisible()
    await expect(modal.getByText('Marketing Cookies')).toBeVisible()

    // Verify action buttons are present
    await expect(
      modal.getByRole('button', { name: testConfig.cookieConsent.buttons.savePreferences })
    ).toBeVisible()
    await expect(
      modal.getByRole('button', { name: testConfig.cookieConsent.buttons.cancel })
    ).toBeVisible()
  })

  test('should close modal when clicking Cancel', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Click Cancel
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.cancel }).click()

    // Modal should be hidden but banner should still be visible
    await expect(modal).not.toBeVisible()
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()
  })

  test('should close modal when pressing Escape key', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')

    // Modal should be hidden but banner should still be visible
    await expect(modal).not.toBeVisible()
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()
  })

  test('should close modal when clicking outside (overlay)', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Click on the overlay (outside the modal content)
    await page.locator('[role="dialog"]').click({ position: { x: 10, y: 10 } })

    // Modal should be hidden but banner should still be visible
    await expect(modal).not.toBeVisible()
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()
  })

  test('should have necessary and functional cookies always checked and disabled', async ({
    page,
  }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Find disabled checkboxes by their section heading (more specific selector)
    // The disabled checkboxes are within the section that has both h3 heading and the checkbox
    const necessaryHeading = modal.getByRole('heading', { name: 'Necessary Cookies' })
    await expect(necessaryHeading).toBeVisible()

    const functionalHeading = modal.getByRole('heading', { name: 'Functional Cookies' })
    await expect(functionalHeading).toBeVisible()

    // All disabled checkboxes in the modal should be checked (necessary and functional)
    const disabledCheckboxes = modal.locator('input[type="checkbox"][disabled]')
    await expect(disabledCheckboxes).toHaveCount(2)

    // Use first() and nth(1) to check each checkbox
    await expect(disabledCheckboxes.first()).toBeChecked()
    await expect(disabledCheckboxes.first()).toBeDisabled()
    await expect(disabledCheckboxes.nth(1)).toBeChecked()
    await expect(disabledCheckboxes.nth(1)).toBeDisabled()

    // Verify "Always Active" text is shown (twice - for necessary and functional)
    const alwaysActiveTexts = modal.getByText('Always Active')
    await expect(alwaysActiveTexts).toHaveCount(2)
  })

  test('should allow toggling analytics and marketing cookies', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Find analytics toggle (the checkbox with aria-label)
    const analyticsToggle = modal.getByRole('checkbox', { name: 'Enable analytics cookies' })
    await expect(analyticsToggle).not.toBeChecked()

    // Find marketing toggle
    const marketingToggle = modal.getByRole('checkbox', { name: 'Enable marketing cookies' })
    await expect(marketingToggle).not.toBeChecked()

    // Toggle analytics on (use force: true because the toggle switch has an overlay div)
    await analyticsToggle.click({ force: true })
    await expect(analyticsToggle).toBeChecked()

    // Toggle marketing on
    await marketingToggle.click({ force: true })
    await expect(marketingToggle).toBeChecked()
  })

  test('should save custom preferences correctly', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.customize }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Enable only analytics (not marketing) - use force: true because the toggle switch has an overlay div
    const analyticsToggle = modal.getByRole('checkbox', { name: 'Enable analytics cookies' })
    await analyticsToggle.click({ force: true })
    await expect(analyticsToggle).toBeChecked()

    // Save preferences
    await page
      .getByRole('button', { name: testConfig.cookieConsent.buttons.savePreferences })
      .click()

    // Modal and banner should be hidden
    await expect(modal).not.toBeVisible()
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).not.toBeVisible()

    // Verify localStorage has correct preferences
    const consent = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(consent).toBeTruthy()
    const preferences = JSON.parse(consent!)
    expect(preferences.necessary).toBe(true)
    expect(preferences.functional).toBe(true)
    expect(preferences.analytics).toBe(true)
    expect(preferences.marketing).toBe(false)

    // Reload and verify banner doesn't appear
    await page.reload()
    await expect(banner).not.toBeVisible()
  })
})

test.describe('Google Consent Mode bootstrap', () => {
  test('sets the regional consent defaults inline, before any Google tag loads', async ({
    page,
  }) => {
    await page.goto('/')

    // The bootstrap is an inline <head> script, so the two consent defaults
    // are in the dataLayer synchronously — no waiting on lazyOnload GTM.
    const defaults = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer || []
      return dl
        .map((entry) => Array.from(entry as ArrayLike<unknown>))
        .filter((args) => args[0] === 'consent' && args[1] === 'default')
        .map((args) => args[2] as Record<string, unknown>)
    })

    expect(defaults).toHaveLength(2)

    // Region-scoped denial first: EEA/UK/CH (32 codes) denied by default,
    // holding tags briefly for a stored choice.
    expect(defaults[0].analytics_storage).toBe('denied')
    expect(defaults[0].ad_storage).toBe('denied')
    expect(defaults[0].wait_for_update).toBe(500)
    expect(Array.isArray(defaults[0].region)).toBe(true)
    expect(defaults[0].region as string[]).toHaveLength(32)

    // Then the unscoped grant for everyone else (region-specific settings
    // take precedence, so this does not weaken the EEA/UK/CH denial).
    expect(defaults[1].analytics_storage).toBe('granted')
    expect(defaults[1].ad_storage).toBe('granted')
    expect(defaults[1].region).toBeUndefined()
  })

  test('accepting the banner pushes a gtag consent update', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await page.getByRole('button', { name: testConfig.cookieConsent.buttons.acceptAll }).click()

    const updates = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer || []
      return dl
        .map((entry) => Array.from(entry as ArrayLike<unknown>))
        .filter((args) => args[0] === 'consent' && args[1] === 'update')
        .map((args) => args[2] as Record<string, unknown>)
    })

    expect(updates.length).toBeGreaterThanOrEqual(1)
    const last = updates[updates.length - 1]
    expect(last.analytics_storage).toBe('granted')
    expect(last.ad_storage).toBe('granted')
  })
})

test.describe('Cookie Consent Accessibility', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('modal should have proper ARIA attributes', async ({ page }) => {
    // Open the preferences modal
    await page.getByRole('button', { name: 'Customize' }).click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    await expect(modal).toHaveAttribute('aria-labelledby', 'cookie-preferences-title')
  })

  test('banner should have proper ARIA attributes', async ({ page }) => {
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toHaveAttribute('aria-label', 'Cookie consent notice')
  })
})
