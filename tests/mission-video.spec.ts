import { test, expect, type Page } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Mission Video Tests
 *
 * The mission video uses a click-to-play facade: only the poster image is in
 * the initial HTML (a <noscript> block carries a plain <video> for non-JS
 * visitors), and the real <video> mounts on first click. These tests verify
 * both the facade and the activated video player.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

/**
 * Clicks the facade until the video mounts. The statically-exported button is
 * visible before React hydrates, and a click landing in that gap is silently
 * swallowed (no onClick attached yet) — so retry the click-then-check pair
 * instead of clicking once and hoping hydration already happened.
 */
async function activateMissionVideo(page: Page) {
  const facade = page.getByRole('button', { name: testConfig.missionVideo.playLabel })
  await expect(async () => {
    await facade.click()
    await expect(
      page.locator(`video[aria-label="${testConfig.missionVideo.ariaLabel}"]`)
    ).toBeVisible({ timeout: 1000 })
  }).toPass()
}

test.describe('Mission Video', () => {
  test('should show the click-to-play facade without loading the video', async ({ page }) => {
    await page.goto('/')

    // The facade button is what ships in the initial HTML
    const facade = page.getByRole('button', { name: testConfig.missionVideo.playLabel })
    await expect(facade).toBeVisible()
    await expect(facade).toHaveAttribute('title', testConfig.missionVideo.title)

    // The multi-megabyte mp4 must not be referenced before activation.
    // (The <noscript> fallback video doesn't count: browsers with scripting
    // enabled parse noscript content as text, so no <video> element exists.)
    await expect(page.locator('video')).toHaveCount(0)
  })

  test('should display video in mission section after activation', async ({ page }) => {
    await page.goto('/')

    await activateMissionVideo(page)

    // Find the video element with the aria-label
    const missionVideo = page.locator(`video[aria-label="${testConfig.missionVideo.ariaLabel}"]`)

    // Verify the video exists and is visible
    await expect(missionVideo).toBeVisible()

    // Verify the video has the correct accessibility attributes
    await expect(missionVideo).toHaveAttribute('aria-label', testConfig.missionVideo.ariaLabel)
    await expect(missionVideo).toHaveAttribute('title', testConfig.missionVideo.title)

    // Verify the video has controls enabled
    await expect(missionVideo).toHaveAttribute('controls', '')

    // Focus moves onto the mounted video so keyboard users land on the
    // controls instead of falling back to <body> (WCAG 2.4.3)
    await expect(missionVideo).toBeFocused()
  })

  test('should have video source configured correctly', async ({ page }) => {
    await page.goto('/')

    await activateMissionVideo(page)

    // Find the video source element
    const videoSource = page.locator(
      `video[aria-label="${testConfig.missionVideo.ariaLabel}"] source`
    )

    // Verify the source exists
    await expect(videoSource).toHaveCount(1)

    // Verify the source has the correct type
    await expect(videoSource).toHaveAttribute('type', 'video/mp4')
  })
})
