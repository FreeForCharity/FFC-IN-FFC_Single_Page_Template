import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Events Section Tests
 *
 * Covers the unified Events section that aggregates Google Calendar,
 * Microsoft 365, and Facebook events into a single branded card grid.
 *
 * When no events are configured (the default snapshot in the template
 * is empty), the section shows a friendly empty state with a link to
 * the Facebook page. Both code paths are exercised here so the test
 * suite stays green regardless of whether the host charity has wired
 * up calendar sources yet.
 */

test.describe('Events Section', () => {
  test('renders the Events section heading on homepage', async ({ page }) => {
    await page.goto('/')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    await expect(section).toBeVisible()
    const heading = section.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(testConfig.events.heading)
  })

  test('section is reachable via the #events anchor', async ({ page }) => {
    await page.goto(`/#${testConfig.events.sectionId}`)
    await page.waitForLoadState('domcontentloaded')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    await expect(section).toBeVisible()
    const box = await section.boundingBox()
    expect(box).toBeTruthy()
  })

  test('renders either an event grid or the empty state', async ({ page }) => {
    await page.goto('/')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    await section.scrollIntoViewIfNeeded()

    const grid = section.locator('[data-testid="events-grid"]').first()
    const emptyState = section.locator('[data-testid="events-empty-state"]')

    const hasGrid = (await grid.count()) > 0
    if (hasGrid) {
      const cards = section.locator('article')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
      await expect(cards.first().getByRole('button', { name: /add to calendar/i })).toBeVisible()
    } else {
      await expect(emptyState).toBeVisible()
      await expect(
        emptyState.getByRole('heading', { name: testConfig.events.emptyStateHeading })
      ).toBeVisible()
      await expect(
        emptyState.getByRole('link', { name: testConfig.events.emptyStateButton })
      ).toBeVisible()
    }
  })

  test('does not embed a SociableKit iframe', async ({ page }) => {
    await page.goto('/')
    const sociableKitFrames = page.locator('iframe[src*="sociablekit"]')
    await expect(sociableKitFrames).toHaveCount(0)
  })

  test('exposes a working Facebook link', async ({ page }) => {
    await page.goto('/')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    const facebookLink = section.locator(`a[href*="${testConfig.events.facebookUrl}"]`).first()
    await expect(facebookLink).toBeVisible()
    await expect(facebookLink).toHaveAttribute('target', '_blank')
    const rel = await facebookLink.getAttribute('rel')
    expect(rel ?? '').toContain('noopener')
  })

  test('is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    await section.scrollIntoViewIfNeeded()
    const link = section.locator('a').first()
    await link.focus()
    await expect(link).toBeFocused()
  })

  test('appears in footer navigation and scrolls to section', async ({ page }) => {
    await page.goto('/')
    const footerLink = page.locator(`footer a[href="/#${testConfig.events.sectionId}"]`)
    await expect(footerLink).toBeVisible()
    await expect(footerLink).toContainText(testConfig.events.footerLinkText)
    await footerLink.click()
    await page.waitForTimeout(500)
    await expect(page.locator(`#${testConfig.events.sectionId}`)).toBeVisible()
  })

  test('renders on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    const section = page.locator(`#${testConfig.events.sectionId}`)
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
    await expect(section.locator('h1')).toBeVisible()
  })
})
