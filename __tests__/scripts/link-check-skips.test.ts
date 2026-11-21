import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteConfig } from '../../src/lib/site.config'

/**
 * The link checker's skip list, measured against the URLs this build actually
 * hands it.
 *
 * `scripts/check-links.mjs` serves the static export and crawls it, so every
 * absolute URL in the markup gets fetched — including the Zeffy donation
 * form's iframe `src`. Zeffy serves its form paths behind a Cloudflare WAF
 * that answers an automated client with `403 Attention Required!`, so that
 * URL can never pass a crawl: `Link check` was red on `main` from 2026-10-19
 * on a single finding, with a browser User-Agent making no difference and
 * `https://www.zeffy.com/` itself answering 200. It is a crawler false
 * positive, not link rot, and the skip list is where that belongs.
 *
 * The property under test is that the skip stays NARROW. Blanket-skipping
 * Zeffy would hide real rot in the privacy/legal links the policy pages cite,
 * so the third case fails on an over-broad fix exactly as the first two fail
 * on a missing one.
 */
const skips: string[] = JSON.parse(
  readFileSync(join(__dirname, '..', '..', '.linkinatorrc.json'), 'utf8')
).skip

const isSkipped = (url: string) => skips.some((pattern) => new RegExp(pattern).test(url))

describe('linkinator skip list', () => {
  it('skips the configured Zeffy donation-form embed', () => {
    // The iframe src the supporting organization's own site renders.
    expect(siteConfig.integrations.zeffyDonationUrl).toMatch(/^https:\/\/www\.zeffy\.com\//)
    expect(isSkipped(siteConfig.integrations.zeffyDonationUrl)).toBe(true)
  })

  it('skips a rebranded charity donationUrl pointing at a Zeffy form', () => {
    // `donationUrl` is free-form per charity, and a Zeffy donation page is the
    // documented case. Its non-embed path is WAF-blocked the same way.
    expect(isSkipped('https://www.zeffy.com/donation-form/some-other-charity-fund')).toBe(true)
  })

  it('still checks the rest of the Zeffy surface', () => {
    // Cited by src/app/cookie-policy/page.tsx; answers 301, so rot here is
    // detectable and must stay detected.
    expect(isSkipped('https://support.zeffy.com/legal-data-privacy-security')).toBe(false)
    expect(isSkipped('https://www.zeffy.com/')).toBe(false)
  })
})
