import { chromium } from '@playwright/test'

async function main() {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.goto('data:text/html,<title>Offline scanner browser</title><h1>Ready</h1>')
    if ((await page.title()) !== 'Offline scanner browser') {
      throw new Error('Chromium did not render the offline fixture')
    }
    console.log('Chromium launched and rendered successfully without external requests')
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
