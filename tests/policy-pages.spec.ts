import { test, expect, type Page } from '@playwright/test'
import { siteConfig } from '../src/lib/site.config'

/**
 * FFC footer standard: SIX policy pages, every one the site's own
 * organization's, with ONE donation policy. The separate "Free For Charity
 * Donation Policy" page and footer link were retired; its charity-relevant
 * terms now live in the site's own /donation-policy.
 *
 * Each page is reached by clicking its footer link rather than by `goto`:
 * the preview server (`serve -s out`) answers a direct request for
 * /<route> with the home page, because the export writes both <route>.html
 * and a <route>/ segment directory and serve resolves the directory first.
 */
const POLICIES: { path: string; heading: RegExp }[] = [
  { path: '/donation-policy', heading: /Donation Policy/ },
  { path: '/privacy-policy', heading: /Privacy Policy/ },
  { path: '/cookie-policy', heading: /Cookie Policy/ },
  { path: '/terms-of-service', heading: /Terms of Service/ },
  { path: '/vulnerability-disclosure-policy', heading: /Vulnerability Disclosure Policy/ },
  { path: '/security-acknowledgements', heading: /Security Acknowledgements/ },
]

async function openFromFooter(page: Page, path: string) {
  await page.goto('/')
  const policyNav = page.getByRole('navigation', { name: 'Policy links' })
  await policyNav.locator(`a[href^="${path}"]`).click()
  await expect(page).toHaveURL(new RegExp(`${path}/?$`))
}

test.describe('footer policy pages', () => {
  test('the footer links exactly the six policy pages', async ({ page }) => {
    await page.goto('/')
    const policyNav = page.getByRole('navigation', { name: 'Policy links' })
    await expect(policyNav).toBeVisible()
    const hrefs = await policyNav
      .locator('a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')?.replace(/\/$/, '')))
    expect(hrefs).toEqual(POLICIES.map((p) => p.path))
    await expect(page.locator('footer a[href*="free-for-charity-donation-policy"]')).toHaveCount(0)
  })

  for (const { path, heading } of POLICIES) {
    test(`the footer link to ${path} opens that policy`, async ({ page }) => {
      await openFromFooter(page, path)
      await expect(page.locator('h1')).toHaveText(heading)
    })
  }

  test('the donation policy is branded to the site and covers deductibility, receipts and refunds', async ({
    page,
  }) => {
    await openFromFooter(page, '/donation-policy')
    await expect(page.locator('h1')).toHaveText(`${siteConfig.name} Donation Policy`)
    for (const heading of ['Tax Deductibility', 'Receipts and Acknowledgment', 'Refunds']) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible()
    }
    // Its contact block publishes the site's own public email and city/state
    // (each only once the site has one; pending values show a placeholder).
    const prose = page.locator('.prose')
    if (siteConfig.contactEmail.trim()) {
      await expect(prose.locator('a[href^="mailto:"]').first()).toBeVisible()
    }
    if (siteConfig.addresses.length > 0 || siteConfig.pending?.includes('address')) {
      await expect(prose).toContainText('Location:')
    }
  })
})
