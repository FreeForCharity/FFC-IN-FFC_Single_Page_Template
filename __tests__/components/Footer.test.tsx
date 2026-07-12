import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'
import { siteConfig } from '../../src/lib/site.config'

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

  it('should have GuideStar profile link', () => {
    render(<Footer />)
    const guidestarLink = screen.getByText(/GuideStar Profile/i)
    expect(guidestarLink).toBeInTheDocument()
  })

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

  it('keeps the FFC donation policy label hardcoded (not siteConfig.name-branded)', () => {
    render(<Footer />)
    // This page documents FFC's own donation policy, so its label must not
    // pick up a fork's rebranded siteConfig.name.
    const ffcPolicyLink = screen.getByText('Free For Charity Donation Policy').closest('a')
    expect(ffcPolicyLink).toHaveAttribute('href', '/free-for-charity-donation-policy')
    // The charity's own donation policy remains a separate entry.
    const ownPolicyLink = screen.getByText('Donation Policy').closest('a')
    expect(ownPolicyLink).toHaveAttribute('href', '/donation-policy')
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
