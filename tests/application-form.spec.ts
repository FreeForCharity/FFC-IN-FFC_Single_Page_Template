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
  // The button is in the Programs section, which a provisioned charity site
  // does not render. Skip there instead of failing on FFC-only content.
  test.skip(
    !testConfig.applicationForm.rendered,
    'Programs section (application form) not rendered on this site'
  )
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
    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // Native modal <dialog>: the browser exposes it as a modal dialog
    await expect(
      page.getByRole('dialog', { name: testConfig.applicationForm.modalTitle })
    ).toBeVisible()
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

    const modal = page.locator('dialog[open]')
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

    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')

    // Modal should be hidden
    await expect(modal).not.toBeVisible()
  })

  test('should close modal when clicking outside (overlay)', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // Click the backdrop, outside the dialog box (light dismiss)
    await page.mouse.click(5, 5)

    // Modal should be hidden
    await expect(modal).not.toBeVisible()
  })

  test('should close on a backdrop click through the script fallback when closedby is missing', async ({
    page,
  }) => {
    // Chromium supports closedby="any" natively; remove it so the fallback runs.
    await page.addInitScript(() => {
      delete (HTMLDialogElement.prototype as unknown as Record<string, unknown>).closedBy
      // Deleting the property is not enough: Chromium still honours the closedby
      // attribute, so strip it before the dialog opens.
      const showModal = HTMLDialogElement.prototype.showModal
      HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.removeAttribute('closedby')
        return showModal.call(this)
      }
    })
    await page.reload()
    expect(await page.evaluate(() => 'closedBy' in HTMLDialogElement.prototype)).toBe(false)
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // A drag that starts inside the dialog and ends on the backdrop keeps it open.
    const box = await modal.boundingBox()
    if (!box) throw new Error('dialog has no box')
    await page.mouse.move(box.x + 20, box.y + 20)
    await page.mouse.down()
    await page.mouse.move(5, 5, { steps: 5 })
    await page.mouse.up()
    await expect(modal).toBeVisible()

    // A full click on the backdrop closes it.
    await page.mouse.click(5, 5)
    await expect(modal).not.toBeVisible()
  })

  test('should have Microsoft Forms iframe with correct attributes', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    // Wait for modal to be visible
    const modal = page.locator('dialog[open]')
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

  test('should open as a modal without locking body scroll by hand', async ({ page }) => {
    const initialOverflow = await page.evaluate(() => document.body.style.overflow)

    // Open modal
    await page.getByRole('button', { name: testConfig.applicationForm.buttonText }).click()

    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // showModal() puts the dialog in the top layer and makes the page inert;
    // scroll chaining is contained by CSS (overscroll-behavior), not by
    // setting overflow:hidden on <body>.
    expect(await modal.evaluate((el) => el.matches(':modal'))).toBe(true)
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(initialOverflow)

    // Close modal
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('should manage focus properly when modal opens', async ({ page }) => {
    // Store reference to button before opening modal
    const openButton = page.getByRole('button', { name: testConfig.applicationForm.buttonText })

    // Open modal
    await openButton.click()

    const modal = page.locator('dialog[open]')
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

    const modal = page.locator('dialog[open]')
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

    const modal = page.locator('dialog[open]')
    await expect(modal).toBeVisible()

    // Native modal <dialog>: role and modality come from the element itself,
    // so no hand-written role/aria-modal attributes
    expect(await modal.evaluate((el) => el.matches(':modal'))).toBe(true)
    await expect(modal).not.toHaveAttribute('aria-modal')
    await expect(modal).toHaveAttribute('aria-labelledby', 'application-form-title')
    await expect(
      page.getByRole('dialog', { name: testConfig.applicationForm.modalTitle })
    ).toBeVisible()

    // Verify screen reader heading exists
    const heading = modal.locator('#application-form-title')
    await expect(heading).toHaveClass(/sr-only/)
    await expect(heading).toHaveText(testConfig.applicationForm.modalTitle)
  })

  test('should handle multiple open/close cycles correctly', async ({ page }) => {
    const button = page.getByRole('button', { name: testConfig.applicationForm.buttonText })
    const modal = page.locator('dialog[open]')

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
    await page.mouse.click(5, 5)
    await expect(modal).not.toBeVisible()
  })
})

test.describe('Application Form Iframe Loading', () => {
  // The button is in the Programs section, which a provisioned charity site
  // does not render. Skip there instead of failing on FFC-only content.
  test.skip(
    !testConfig.applicationForm.rendered,
    'Programs section (application form) not rendered on this site'
  )
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
      const modal = page.locator('dialog[open]')
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
