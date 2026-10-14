import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'
import { PENDING_TEXT, isPending, siteConfig } from '../../src/lib/site.config'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Footer component', () => {
  it('should render the footer', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('should display Endorsements section', () => {
    render(<Footer />)
    expect(screen.getByText('Endorsements')).toBeInTheDocument()
  })

  it('should display Quick Links section', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })

  it('should display Contact Us section with contact information', () => {
    render(<Footer />)
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
  })

  it('should have social media links', () => {
    render(<Footer />)
    // Check for social media links by their aria-labels or visible text
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display the current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  // The GuideStar links render only for a configured profile. A charity with
  // none yet has them pending (placeholder) or not at all; both states are
  // covered in pending-placeholders.test.tsx.
  const hasGuidestar = Boolean(siteConfig.guidestar.directProfileUrl.trim())
  ;(hasGuidestar ? it : it.skip)('should have GuideStar profile link', () => {
    render(<Footer />)
    const guidestarLink = screen.getByText(/GuideStar Profile/i)
    expect(guidestarLink).toBeInTheDocument()
  })

  ;(isPending('guidestar') ? it : it.skip)(
    'shows the GuideStar placeholder while GuideStar is pending',
    () => {
      render(<Footer />)
      expect(screen.getByText('GuideStar / Candid Profile')).toBeInTheDocument()
      expect(screen.queryByText(/GuideStar Profile Link/i)).not.toBeInTheDocument()
      expect(screen.getAllByText(PENDING_TEXT).length).toBeGreaterThan(0)
    }
  )

  it('should have email contact link', () => {
    render(<Footer />)
    // Look for email link
    const links = screen.getAllByRole('link')
    const emailLink = links.find((link) => link.getAttribute('href')?.includes('mailto:'))
    expect(emailLink).toBeDefined()
  })

  it('renders the EIN from siteConfig', () => {
    render(<Footer />)
    expect(screen.getByText(`${siteConfig.name} EIN: ${siteConfig.ein}`)).toBeInTheDocument()
  })

  it('renders the phone number from siteConfig as a tel link', () => {
    render(<Footer />)
    const telLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === `tel:${siteConfig.phone.tel}`)
    expect(telLink).toBeDefined()
    expect(telLink).toHaveTextContent(siteConfig.phone.display)
  })

  it('omits the Call Us block when the charity publishes no phone number', () => {
    const saved = { ...siteConfig.phone }
    siteConfig.phone = { display: '', tel: '' }
    try {
      render(<Footer />)
      expect(screen.queryByText('Call Us Today')).not.toBeInTheDocument()
      const telLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('tel:'))
      expect(telLinks).toHaveLength(0)
    } finally {
      siteConfig.phone = saved
    }
  })

  it('always renders the permanent "Supported by" attribution in the bottom bar', () => {
    render(<Footer />)
    // FFC footer standard: the attribution renders unconditionally (it does
    // not depend on the optional parentOrg), naming the supporting org and
    // linking to its site.
    const bottomBar = screen.getByText(/All Rights Are Reserved/)
    expect(bottomBar).toHaveTextContent(`Supported by ${siteConfig.supportedBy.name}`)
    const attributionLink = screen
      .getAllByRole('link')
      .find(
        (link) =>
          link.getAttribute('href') === siteConfig.supportedBy.url &&
          link.textContent === siteConfig.supportedBy.name
      )
    expect(attributionLink).toBeDefined()
  })

  it('always renders the Supported Charity Login quick link to the hub', () => {
    render(<Footer />)
    const hubLink = screen.getByText('Supported Charity Login').closest('a')
    expect(hubLink).toHaveAttribute('href', siteConfig.supportedBy.hubUrl)
  })

  it('links exactly the six policy pages of the footer standard, each branded to the site', () => {
    render(<Footer />)
    const policyNav = screen.getByRole('navigation', { name: 'Policy links' })
    const links = Array.from(policyNav.querySelectorAll('a')).map((a) => ({
      name: a.textContent,
      href: a.getAttribute('href'),
    }))
    expect(links).toEqual([
      { name: `${siteConfig.name} Donation Policy`, href: '/donation-policy' },
      { name: `${siteConfig.name} Privacy Policy`, href: '/privacy-policy' },
      { name: `${siteConfig.name} Cookie Policy`, href: '/cookie-policy' },
      { name: `${siteConfig.name} Terms of Service`, href: '/terms-of-service' },
      {
        name: `${siteConfig.name} Vulnerability Disclosure Policy`,
        href: '/vulnerability-disclosure-policy',
      },
      { name: `${siteConfig.name} Security Acknowledgement`, href: '/security-acknowledgements' },
    ])
  })

  it('no longer links a separate Free For Charity donation policy', () => {
    const { container } = render(<Footer />)
    // One donation policy per site: the retired FFC-branded page is gone. (On
    // the template itself the site's own label reads "Free For Charity
    // Donation Policy", so assert on the link target, not the text.)
    expect(container.querySelector('a[href*="free-for-charity-donation-policy"]')).toBeNull()
    expect(container.querySelectorAll('a[href="/donation-policy"]')).toHaveLength(1)
  })

  it('renders every configured office address with a maps link', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    for (const address of siteConfig.addresses) {
      expect(screen.getByText(address.label)).toBeInTheDocument()
      expect(links.some((link) => link.getAttribute('href') === address.mapUrl)).toBe(true)
    }
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Footer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
