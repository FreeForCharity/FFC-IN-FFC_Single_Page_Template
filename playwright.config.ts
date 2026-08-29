import { defineConfig, devices } from '@playwright/test'
import { execFileSync } from 'child_process'

/**
 * Finds the system Chromium browser executable.
 *
 * Supported operating systems: Unix-like systems (Linux, macOS). This function uses the `which` command,
 * which is not available on Windows. On unsupported systems, returns undefined to use Playwright's browser.
 *
 * Browser selection priority: The function checks for the following browser executables in order:
 *   1. chromium
 *   2. chromium-browser
 *   3. google-chrome
 *   4. google-chrome-stable
 * The first browser found in this order is selected.
 *
 * If multiple browsers are installed, the one with the highest priority (earliest in the list) is used.
 * If none are found, returns undefined to use Playwright's bundled browser.
 *
 * @returns {string | undefined} Path to the Chromium executable, or undefined if not found or unsupported OS.
 */
function findChromiumExecutable(): string | undefined {
  const browserNames = ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable']
  for (const name of browserNames) {
    try {
      const path = execFileSync('which', [name], {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
      }).trim()
      if (path) {
        return path
      }
    } catch {
      // Ignore and try next browser name
    }
  }
  // If none found, return undefined to use Playwright's browser
  return undefined
}

/**
 * Playwright configuration for Free For Charity web application
 * Tests run against the built static site served locally
 *
 * Performance Optimizations:
 * - Parallel execution enabled for faster test runs
 * - Configurable workers based on environment
 * - Tests run in isolation to prevent side effects
 */
export default defineConfig({
  testDir: './tests',
  // Run tests in parallel for better performance
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Use more workers for better performance (1 in CI for stability, 4 locally for speed)
  workers: process.env.CI ? 1 : 4,
  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use system chromium browser if available to avoid network issues
        // when downloading Playwright browsers in restricted environments
        launchOptions: {
          executablePath: findChromiumExecutable(),
        },
      },
    },
  ],

  // Run local dev server before starting the tests
  webServer: {
    command: 'pnpm run preview',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
