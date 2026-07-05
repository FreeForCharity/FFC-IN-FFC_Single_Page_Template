import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Mission Video Tests
 *
 * The mission video uses a click-to-play facade: only the poster image is in
 * the initial HTML, and the real <video> mounts on first click. These tests
 * verify both the facade and the activated video player.
 *
 * Note: Test expectations use values from test.config.ts for easy customization
 */

test.describe('Mission Video', () => {
  test('should show the click-to-play facade without loading the video', async ({ page }) => {
    await page.goto('/')

    // The facade button is what ships in the initial HTML
    const facade = page.getByRole('button', { name: testConfig.missionVideo.playLabel })
    await expect(facade).toBeVisible()
    await expect(facade).toHaveAttribute('title', testConfig.missionVideo.title)

    // The multi-megabyte mp4 must not be referenced before activation
    await expect(page.locator('video')).toHaveCount(0)
  })

  test('should display video in mission section after activation', async ({ page }) => {
    await page.goto('/')

    // Activate the facade
    await page.getByRole('button', { name: testConfig.missionVideo.playLabel }).click()

    // Find the video element with the aria-label
    const missionVideo = page.locator(`video[aria-label="${testConfig.missionVideo.ariaLabel}"]`)

    // Verify the video exists and is visible
    await expect(missionVideo).toBeVisible()

    // Verify the video has the correct accessibility attributes
    await expect(missionVideo).toHaveAttribute('aria-label', testConfig.missionVideo.ariaLabel)
    await expect(missionVideo).toHaveAttribute('title', testConfig.missionVideo.title)

    // Verify the video has controls enabled
    await expect(missionVideo).toHaveAttribute('controls', '')
  })

  test('should have video source configured correctly', async ({ page }) => {
    await page.goto('/')

    // Activate the facade
    await page.getByRole('button', { name: testConfig.missionVideo.playLabel }).click()

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
