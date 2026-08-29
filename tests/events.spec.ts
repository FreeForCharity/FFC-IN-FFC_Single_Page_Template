import { test, expect, type Page } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Events Section Tests
 *
 * Covers the unified Events section that aggregates Google Calendar,
 * Microsoft 365, and Facebook events into a single branded card grid.
 *
 * The section follows the FFC self-hide convention: it renders nothing when
 * `siteConfig.sections.showEvents` is off, or when no EVENTS_* calendar
 * source was configured at build time and the committed snapshot is empty.
 * The default template build has no sources wired up, so the hidden path is
 * what this repo's CI exercises; a charity build with sources configured
 * exercises the rendered path. Both are covered below — the inapplicable
 * describe block skips itself against the build under test.
 */

async function eventsSectionCount(page: Page): Promise<number> {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  return page.locator(`#${testConfig.events.sectionId}`).count()
}

test.describe('Events Section', () => {
  test('never embeds a SociableKit iframe', async ({ page }) => {
    await page.goto('/')
    const sociableKitFrames = page.locator('iframe[src*="sociablekit"]')
    await expect(sociableKitFrames).toHaveCount(0)
  })

  test('footer Events link presence matches section presence (no dead anchors)', async ({
    page,
  }) => {
    const sectionCount = await eventsSectionCount(page)
    const footerLink = page.locator(`footer a[href="/#${testConfig.events.sectionId}"]`)
    await expect(footerLink).toHaveCount(sectionCount > 0 ? 1 : 0)
  })

  test.describe('when self-hidden (default template build: no sources, empty snapshot)', () => {
    test.beforeEach(async ({ page }) => {
      const count = await eventsSectionCount(page)
      test.skip(count > 0, 'Events section is rendered in this build')
    })

    test('renders no #events section and no empty-state placeholder', async ({ page }) => {
      await expect(page.locator(`#${testConfig.events.sectionId}`)).toHaveCount(0)
      await expect(page.locator('[data-testid="events-empty-state"]')).toHaveCount(0)
      await expect(page.locator('[data-testid="events-grid"]')).toHaveCount(0)
    })
  })

  test.describe('when rendered (a calendar source is configured or the snapshot has events)', () => {
    test.beforeEach(async ({ page }) => {
      const count = await eventsSectionCount(page)
      test.skip(count === 0, 'Events section self-hides in this build')
    })

    test('renders the Events section heading', async ({ page }) => {
      const section = page.locator(`#${testConfig.events.sectionId}`)
      await expect(section).toBeVisible()
      // The page-level h1 lives in the Hero; Events section heading is h2.
      const heading = section.getByRole('heading', {
        level: 2,
        name: testConfig.events.heading,
      })
      await expect(heading).toBeVisible()
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

    test('exposes a working Facebook link', async ({ page }) => {
      const section = page.locator(`#${testConfig.events.sectionId}`)
      const facebookLink = section.locator(`a[href*="${testConfig.events.facebookUrl}"]`).first()
      await expect(facebookLink).toBeVisible()
      await expect(facebookLink).toHaveAttribute('target', '_blank')
      const rel = await facebookLink.getAttribute('rel')
      expect(rel ?? '').toContain('noopener')
    })

    test('is keyboard accessible', async ({ page }) => {
      const section = page.locator(`#${testConfig.events.sectionId}`)
      await section.scrollIntoViewIfNeeded()
      const link = section.locator('a').first()
      await link.focus()
      await expect(link).toBeFocused()
    })

    test('appears in footer navigation and scrolls to section', async ({ page }) => {
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
      await expect(
        section.getByRole('heading', { level: 2, name: testConfig.events.heading })
      ).toBeVisible()
    })
  })
})
