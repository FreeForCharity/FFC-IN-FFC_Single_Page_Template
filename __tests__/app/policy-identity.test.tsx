import React from 'react'
import { render } from '@testing-library/react'

import PrivacyPage from '../../src/app/privacy-policy/page'
import CookiePolicyPage from '../../src/app/cookie-policy/page'
import TermsPage from '../../src/app/terms-of-service/page'
import VulnDisclosurePage from '../../src/app/vulnerability-disclosure-policy/page'
import SecurityAckPage from '../../src/app/security-acknowledgements/page'
import DonationPolicyPage from '../../src/app/donation-policy/page'
import FfcDonationPolicyPage from '../../src/app/free-for-charity-donation-policy/page'
import { siteConfig } from '../../src/lib/site.config'
import {
  asCharitySite,
  asSupporterSite,
  CHARITY,
  FFC_IDENTITY,
  restoreSiteConfig,
} from '../helpers/site-identity'

/**
 * The policies a site publishes as its OWN must be about that site's
 * organization and route enquiries to it.
 *
 * The template shipped these documents with Free For Charity's name, EIN,
 * email addresses, phone number and domain written into the body, so a
 * provisioned charity site served a privacy policy naming a different
 * organization as the data controller and a donation policy quoting another
 * organization's EIN. `check:drift` catches the literals in source; these tests
 * catch the rendered result, which is what a visitor actually reads.
 *
 * Each test sets the identity it is about (see helpers/site-identity.ts), so
 * the suite asserts the same thing in the template and in every provisioned
 * charity repo, whatever the checked-in config says.
 */

jest.mock('next/navigation', () => ({ usePathname: jest.fn(() => '/') }))

const charityOwnedPolicies = [
  { name: 'Privacy Policy', Component: PrivacyPage },
  { name: 'Cookie Policy', Component: CookiePolicyPage },
  { name: 'Terms of Service', Component: TermsPage },
  { name: 'Vulnerability Disclosure Policy', Component: VulnDisclosurePage },
  { name: 'Security Acknowledgements', Component: SecurityAckPage },
  { name: 'Donation Policy', Component: DonationPolicyPage },
]

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

/** Every email address in a subtree, read one text node at a time plus mailto hrefs. */
function renderedEmails(container: HTMLElement): Set<string> {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const found = new Set<string>()
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    for (const match of node.textContent?.match(EMAIL_RE) ?? []) found.add(match)
  }
  for (const link of Array.from(container.querySelectorAll('a[href^="mailto:"]'))) {
    found.add((link.getAttribute('href') ?? '').replace(/^mailto:/, '').replace(/\?.*$/, ''))
  }
  return found
}

/** Visible text plus every link target: identity can hide in either. */
function renderedSurface(container: HTMLElement): string {
  const hrefs = Array.from(container.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
  return `${container.textContent ?? ''}\n${hrefs.join('\n')}`
}

describe("policies a charity's site publishes as its own", () => {
  beforeEach(() => asCharitySite())
  afterEach(restoreSiteConfig)

  it.each(charityOwnedPolicies)('$name carries none of FFC’s identity', ({ Component }) => {
    const { container } = render(<Component />)
    const surface = renderedSurface(container)
    for (const pattern of FFC_IDENTITY) expect(surface).not.toMatch(pattern)
  })

  it.each(charityOwnedPolicies)('$name names the charity', ({ Component }) => {
    const { container } = render(<Component />)
    expect(container.textContent).toContain(CHARITY.name)
  })

  it.each(charityOwnedPolicies)(
    '$name shows no email address but the charity’s',
    ({ Component }) => {
      const { container } = render(<Component />)
      for (const email of renderedEmails(container)) expect(email).toBe(CHARITY.contactEmail)
    }
  )

  it.each(charityOwnedPolicies)(
    '$name publishes no phone number when the charity has none',
    ({ Component }) => {
      asCharitySite({ phone: { display: '', tel: '' } })
      const { container } = render(<Component />)
      expect(container.querySelectorAll('a[href^="tel:"], a[href^="sms:"]')).toHaveLength(0)
      expect(container.textContent).not.toMatch(/Phone:|Text:/)
    }
  )

  it('publishes the charity’s phone number where the policies offer one', () => {
    for (const Component of [PrivacyPage, CookiePolicyPage, TermsPage, DonationPolicyPage]) {
      const { container, unmount } = render(<Component />)
      expect(container.textContent).toContain(CHARITY.phone?.display)
      unmount()
    }
  })

  it('scopes the vulnerability disclosure policy to the charity’s own site', () => {
    const { container } = render(<VulnDisclosurePage />)
    expect(container.textContent).toContain(CHARITY.url)
    expect(renderedSurface(container)).not.toContain(siteConfig.supportedBy.hubUrl)
  })
})

describe('the donation policy’s tax claims follow siteConfig.taxStatusLabel', () => {
  afterEach(restoreSiteConfig)

  it('states 501(c)(3) status and deductibility for a recognized charity', () => {
    asCharitySite({ taxStatusLabel: 'a US 501c3 Non Profit' })
    const { container } = render(<DonationPolicyPage />)
    const text = container.textContent ?? ''
    expect(text).toContain(`${CHARITY.name} is a qualified 501(c)(3) nonprofit organization`)
    expect(text).toContain(`(EIN: ${CHARITY.ein})`)
    expect(text).toMatch(/tax-deductible to the full extent allowed by law/)
    expect(text).toMatch(/receipt for tax purposes/)
  })

  it('makes no 501(c)(3) or deductibility claim for an organization without recognition', () => {
    // What provisioning writes for a pre-501(c)(3) charity.
    asCharitySite({ taxStatusLabel: '' })
    const { container } = render(<DonationPolicyPage />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/is a qualified 501\(c\)\(3\)/)
    expect(text).not.toMatch(/tax-deductible to the full extent/)
    expect(text).not.toMatch(/for tax purposes/)
    expect(text).toContain('has not yet received IRS recognition as a 501(c)(3) organization')
    expect(text).toMatch(/may not be tax-deductible/)
  })

  it('describes the use of donations with the organization’s own description', () => {
    asCharitySite()
    const { container } = render(<DonationPolicyPage />)
    const text = container.textContent ?? ''
    expect(text).toContain(CHARITY.description)
    // The template's list was the supporting organization's own programs.
    expect(text).not.toMatch(/Free domain registration and hosting services/)
    expect(text).not.toMatch(/Technology consultation and support/)
  })
})

describe("the supporting organization's own site", () => {
  beforeEach(asSupporterSite)
  afterEach(restoreSiteConfig)

  it('keeps its infrastructure in the vulnerability disclosure scope', () => {
    const { container } = render(<VulnDisclosurePage />)
    const surface = renderedSurface(container)
    expect(surface).toContain(siteConfig.supportedBy.url)
    expect(surface).toContain(siteConfig.supportedBy.hubUrl)
  })
})

describe('Free For Charity’s own donation policy', () => {
  afterEach(restoreSiteConfig)

  // Deliberately NOT charity-owned: every site links to it from the footer as
  // FFC's document, so it keeps FFC's identity after a rebrand (and
  // check:drift exempts exactly this page).
  it('keeps FFC’s name on a charity’s site', () => {
    asCharitySite()
    const { container } = render(<FfcDonationPolicyPage />)
    expect(container.textContent).toContain('Free For Charity Donation Policy')
  })
})
