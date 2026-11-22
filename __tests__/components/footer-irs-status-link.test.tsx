import React from 'react'
import { render, screen } from '@testing-library/react'
import { siteConfig } from '@/lib/site.config'
import Footer from '@/components/footer'

// The footer links the charity's own IRS 501(c)(3) record on ProPublica, derived
// from its EIN, and only when the site makes the 501(c)(3) claim.
describe('footer IRS 501(c)(3) status link', () => {
  const original = {
    ein: siteConfig.ein,
    taxStatusLabel: siteConfig.taxStatusLabel,
    pending: siteConfig.pending,
  }
  afterEach(() => {
    Object.assign(siteConfig, original)
  })
  const linkName = 'Verify our IRS 501(c)(3) status (ProPublica)'

  it("links the site's own EIN record when the site claims 501(c)(3)", () => {
    siteConfig.ein = '12-3456780'
    siteConfig.taxStatusLabel = 'a US 501c3 Non Profit'
    siteConfig.pending = []
    render(<Footer />)
    const link = screen.getByRole('link', { name: linkName })
    expect(link).toHaveAttribute(
      'href',
      'https://projects.propublica.org/nonprofits/organizations/123456780'
    )
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('shows no link when the site makes no 501(c)(3) claim', () => {
    siteConfig.ein = '12-3456780'
    siteConfig.taxStatusLabel = ''
    siteConfig.pending = []
    render(<Footer />)
    expect(screen.queryByRole('link', { name: linkName })).toBeNull()
  })

  it('shows no link while the EIN is pending or not a 9-digit EIN', () => {
    siteConfig.taxStatusLabel = 'a US 501c3 Non Profit'
    siteConfig.ein = ''
    siteConfig.pending = ['ein']
    const { unmount } = render(<Footer />)
    expect(screen.queryByRole('link', { name: linkName })).toBeNull()
    unmount()
    siteConfig.ein = '12-345'
    siteConfig.pending = []
    render(<Footer />)
    expect(screen.queryByRole('link', { name: linkName })).toBeNull()
  })
})
