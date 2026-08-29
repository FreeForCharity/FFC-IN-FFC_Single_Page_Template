import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Google Tag Manager (GTM) Tests
 *
 * These tests verify that Google Tag Manager is properly integrated:
 * 1. GTM script is loaded in the head section
 * 2. dataLayer is initialized
 * 3. GTM noscript fallback exists in body
 * 4. GTM ID is configured in the component
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Google Tag Manager Integration', () => {
  test('should initialize dataLayer on page load', async ({ page }) => {
    await page.goto('/')

    // GTM loads via next/script (lazyOnload), so dataLayer appears after the
    // load event — wait for it rather than reading immediately (avoids a race).
    await page.waitForFunction(
      () => typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer),
      null,
      { timeout: 15000 }
    )

    const hasDataLayer = await page.evaluate(() => {
      return typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer)
    })

    expect(hasDataLayer).toBe(true)
  })

  test('should load GTM script with correct ID', async ({ page }) => {
    await page.goto('/')

    // The GTM snippet is injected by next/script (lazyOnload) after load, so
    // wait for it to attach instead of counting immediately (avoids a race).
    const gtmScript = page.locator('script[id="gtm-script"]')
    await expect(gtmScript.first()).toBeAttached({ timeout: 15000 })

    // Verify script contains GTM initialization code
    const scriptContent = await gtmScript.first().innerHTML()
    expect(scriptContent).toContain('googletagmanager.com/gtm.js')
    expect(scriptContent).toContain('dataLayer')
  })

  test('should have GTM noscript fallback in body', async ({ page }) => {
    await page.goto('/')

    // Check for noscript iframe element
    // We verify it exists in the HTML even though it won't render with JavaScript enabled
    const pageContent = await page.content()
    expect(pageContent).toContain('googletagmanager.com/ns.html')
    expect(pageContent).toContain('noscript')
  })

  test('should push events to dataLayer', async ({ page }) => {
    await page.goto('/')

    // dataLayer is initialized by the lazyOnload GTM snippet — wait for it.
    await page.waitForFunction(() => typeof window.dataLayer !== 'undefined', null, {
      timeout: 15000,
    })

    // Verify we can push events to dataLayer
    const canPushToDataLayer = await page.evaluate(() => {
      if (typeof window.dataLayer === 'undefined') return false

      const initialLength = window.dataLayer.length
      window.dataLayer.push({ event: 'test_event', test: true })
      return window.dataLayer.length > initialLength
    })

    expect(canPushToDataLayer).toBe(true)
  })

  test('should load GTM script after page interaction', async ({ page }) => {
    await page.goto('/')

    // Next.js Script (lazyOnload) defers the GTM snippet + dataLayer until
    // after the page is interactive — wait for both before asserting.
    await page.waitForFunction(
      () =>
        document.querySelector('script[id="gtm-script"]') !== null &&
        typeof window.dataLayer !== 'undefined',
      null,
      { timeout: 15000 }
    )

    const gtmScript = await page.evaluate(() => {
      const script = document.querySelector('script[id="gtm-script"]')
      return script !== null
    })

    expect(gtmScript).toBe(true)

    // Verify dataLayer is initialized (may be delayed with lazyOnload)
    const dataLayerInitialized = await page.evaluate(() => {
      return typeof window.dataLayer !== 'undefined'
    })

    expect(dataLayerInitialized).toBe(true)
  })

  test('should work with cookie consent system', async ({ page, context }) => {
    // Clear cookies and localStorage
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Wait for cookie banner
    const banner = page.locator('[role="region"][aria-label="Cookie consent notice"]')
    await expect(banner).toBeVisible()

    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()

    // Verify dataLayer receives consent update event
    const hasConsentEvent = await page.evaluate(() => {
      if (typeof window.dataLayer === 'undefined') return false

      // Check if dataLayer has any consent-related events
      return window.dataLayer.some((item: { event?: string }) => item.event === 'consent_update')
    })

    expect(hasConsentEvent).toBe(true)
  })
})

test.describe('Google Tag Manager Configuration', () => {
  test('should load GTM script with configured ID', async ({ page }) => {
    // This test verifies that GTM loads with the configured ID from test.config.ts
    // The GTM_ID is configured in the component

    await page.goto('/')

    // GTM snippet is injected by next/script (lazyOnload) after load — wait for
    // it to attach rather than counting immediately (avoids a race).
    const gtmScript = page.locator('script[id="gtm-script"]')
    await expect(gtmScript.first()).toBeAttached({ timeout: 15000 })

    // Verify the script contains the correct GTM ID
    const scriptContent = await gtmScript.first().innerHTML()
    expect(scriptContent).toContain(testConfig.googleTagManager.id)
  })
})
