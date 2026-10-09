import { test, expect, type Page } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Application Form Button Tests
 *
 * These tests verify the ApplicationFormButton modal functionality:
 * 1. Modal opens and closes correctly
 * 2. Microsoft Forms iframe loads with proper sandbox attributes
 * 3. Focus management works properly
 * 4. Escape key closes the modal
 * 5. Click-outside closes the modal
 * 6. Loading indicator displays before iframe loads
 * 7. Body scroll is locked when modal is open
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

// Control the iframe response so loading assertions never depend on Microsoft
// Forms or its network timing. Release it with a local fixture after asserting.
async function holdApplicationForm(page: Page): Promise<() => void> {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/forms.office.com/**', async (route) => {
    await gate
    await route
      .fulfill({ contentType: 'text/html', body: '<!doctype html><p>Application form fixture</p>' })
      .catch(() => {}) // The page may have closed after an assertion failed.
  })
  return release
}

test.describe('Application Form Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for page to be loaded
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display application form button', async ({ page }) => {
    // Find the application button
    const button = page.getByRole('button', { name: testConfig.applicationForm.buttonText })
    await expect(button).toBeVisible()
  })

  test('should open modal when button is clicked', async ({ page }) => {
    // Click the button
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    // Modal should be visible
    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Verify modal has proper ARIA attributes
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    await expect(modal).toHaveAttribute('aria-labelledby', 'application-form-title')
  })

  test('should display loading indicator before iframe loads', async ({ page }) => {
    const release = await holdApplicationForm(page)
    const loadingIndicator = page.getByText(testConfig.applicationForm.loadingText)
    try {
      await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()
      await expect(loadingIndicator).toBeVisible()
    } finally {
      release()
    }
    await expect(loadingIndicator).toBeHidden()
  })

  test('should display close button in modal', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    // Close button should be visible
    const closeButton = page.getByRole('button', {
      name: testConfig.applicationForm.closeButtonAriaLabel,
    })
    await expect(closeButton).toBeVisible()
  })

  test('should close modal when close button is clicked', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Click close button
    await page
      .getByRole('button', { name: testConfig.applicationForm.closeButtonAriaLabel })
      .click()

    // Modal should be hidden
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when pressing Escape key', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')

    // Modal should be hidden
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when clicking outside (overlay)', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Click on the overlay (outside the modal content)
    await page.locator('[role="dialog"]').click({ position: { x: 10, y: 10 } })

    // Modal should be hidden
    await expect(modal).not.toBeVisible()
  })

  test('should have Microsoft Forms iframe with correct attributes', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Find the iframe element
    const iframeElement = page.locator(`iframe[title="${testConfig.applicationForm.modalTitle}"]`)

    // Verify iframe is present
    await expect(iframeElement).toBeVisible()

    // Verify iframe has correct title
    await expect(iframeElement).toHaveAttribute('title', testConfig.applicationForm.modalTitle)

    // Verify iframe has correct sandbox attribute with allow-same-origin
    const sandboxAttr = await iframeElement.getAttribute('sandbox')
    expect(sandboxAttr).toContain('allow-scripts')
    expect(sandboxAttr).toContain('allow-forms')
    expect(sandboxAttr).toContain('allow-popups')
    expect(sandboxAttr).toContain('allow-same-origin')
  })

  test('should have Microsoft Forms URL in iframe src', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    // Find the iframe
    const iframeElement = page.locator(`iframe[title="${testConfig.applicationForm.modalTitle}"]`)
    await expect(iframeElement).toBeVisible()

    // Verify iframe src contains Microsoft Forms URL
    const src = await iframeElement.getAttribute('src')
    expect(src).toContain('forms.office.com/r/')
  })

  test('should lock body scroll when modal is open', async ({ page }) => {
    // Get initial body overflow style
    const initialOverflow = await page.evaluate(() => document.body.style.overflow)

    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Body overflow should be set to 'hidden'
    const modalOverflow = await page.evaluate(() => document.body.style.overflow)
    expect(modalOverflow).toBe('hidden')

    // Close modal
    await page.keyboard.press('Escape')

    // Body overflow should be restored
    const restoredOverflow = await page.evaluate(() => document.body.style.overflow)
    expect(restoredOverflow).toBe(initialOverflow)
  })

  test('should manage focus properly when modal opens', async ({ page }) => {
    // Store reference to button before opening modal
    const openButton = page.getByRole('button', { name: testConfig.applicationForm.buttonText })

    // Open modal
    await openButton.click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Focus should move to the first focusable element (close button)
    const closeButton = page.getByRole('button', {
      name: testConfig.applicationForm.closeButtonAriaLabel,
    })
    await expect(closeButton).toBeFocused()
  })

  test('should restore focus to trigger button when modal closes', async ({ page }) => {
    // Store reference to button
    const openButton = page.getByRole('button', { name: testConfig.applicationForm.buttonText })

    // Open modal
    await openButton.click()

    const modal = page.locator('[role="dialog"][aria-modal="true"]')
    await expect(modal).toBeVisible()

    // Close modal with Escape
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Focus should return to the trigger button
    await expect(openButton).toBeFocused()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Verify ARIA attributes
    await expect(modal).toHaveAttribute('role', 'dialog')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    await expect(modal).toHaveAttribute('aria-labelledby', 'application-form-title')

    // Verify screen reader heading exists
    const heading = modal.locator('#application-form-title')
    await expect(heading).toHaveClass(/sr-only/)
    await expect(heading).toHaveText(testConfig.applicationForm.modalTitle)
  })

  test('should handle multiple open/close cycles correctly', async ({ page }) => {
    const button = page.getByRole('button', { name: testConfig.applicationForm.buttonText })
    const modal = page.locator('[role="dialog"][aria-modal="true"]')

    // First open/close cycle
    await button.click()
    await expect(modal).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // Second open/close cycle
    await button.click()
    await expect(modal).toBeVisible()
    await page
      .getByRole('button', { name: testConfig.applicationForm.closeButtonAriaLabel })
      .click()
    await expect(modal).not.toBeVisible()

    // Third open/close cycle
    await button.click()
    await expect(modal).toBeVisible()
    await page.locator('[role="dialog"]').click({ position: { x: 10, y: 10 } })
    await expect(modal).not.toBeVisible()
  })
})

test.describe('Application Form Iframe Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display loading indicator and iframe elements', async ({ page }) => {
    const release = await holdApplicationForm(page)
    const loadingIndicator = page.getByText(testConfig.applicationForm.loadingText)
    const iframe = page.locator(`iframe[title="${testConfig.applicationForm.modalTitle}"]`)
    try {
      await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()
      const modal = page.locator('[role="dialog"][aria-modal="true"]')
      await expect(modal).toBeVisible()
      await expect(loadingIndicator).toBeVisible()
      await expect(iframe).toBeVisible()
    } finally {
      release()
    }
    await expect(loadingIndicator).toBeHidden()
    await expect(iframe).toBeVisible()
  })
})
