import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

// The FAQ accordions are native <details>/<summary> (Modern Web Guidance:
// ui-components/accordion). These checks cover what the browser now does for
// us: mouse and keyboard toggling, expanded state exposed to assistive tech,
// and answers that stay in the page for find-in-page.
test.describe('FAQ accordion', () => {
  // The FAQ section is the supporting organization's own content and does not
  // render on a provisioned charity site.
  test.skip(!testConfig.supportingOrgSite, 'FAQ section not rendered on this site')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('opens and closes from a click on the question', async ({ page }) => {
    const item = page.locator('#faq details').first()
    const summary = item.locator('summary')
    await expect(item).not.toHaveAttribute('open')

    await summary.click()
    await expect(item).toHaveAttribute('open', '')
    // The answer is now visible below the question
    await expect(item.locator('summary + *')).toBeVisible()

    await summary.click()
    await expect(item).not.toHaveAttribute('open')
  })

  test('opens and closes from the keyboard', async ({ page }) => {
    const item = page.locator('#faq details').first()
    const summary = item.locator('summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(item).toHaveAttribute('open', '')
    await page.keyboard.press('Space')
    await expect(item).not.toHaveAttribute('open')
  })

  test('keeps closed answers in the page so find-in-page can reach them', async ({ page }) => {
    const item = page.locator('#faq details').first()
    await expect(item).not.toHaveAttribute('open')
    // Closed <details> content is hidden with content-visibility, not removed
    const answerText = await item.evaluate((el) => el.textContent ?? '')
    expect(answerText.length).toBeGreaterThan(100)
  })
})
