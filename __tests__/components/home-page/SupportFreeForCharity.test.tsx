import React from 'react'
import { render, screen } from '@testing-library/react'
import Support from '../../../src/components/home-page/SupportFreeForCharity'
import { siteConfig } from '@/lib/site.config'
import {
  asCharitySite,
  asSupporterSite,
  CHARITY,
  restoreSiteConfig,
} from '../../helpers/site-identity'

describe('SupportFreeForCharity', () => {
  afterEach(restoreSiteConfig)

  it('renders the section heading', () => {
    render(<Support />)
    expect(screen.getByRole('heading', { name: `Support ${siteConfig.name}` })).toBeInTheDocument()
  })

  it('mounts under the #donate section landmark id', () => {
    const { container } = render(<Support />)
    expect(container.querySelector('#donate')).not.toBeNull()
  })

  it("keeps the supporting organization's appeal on its own site", () => {
    asSupporterSite()
    render(<Support />)
    expect(screen.getByText(/Domain, Website, and other services/)).toBeInTheDocument()
  })

  it("asks for support for a charity's own mission, not the supporter's services", () => {
    asCharitySite()
    const { container } = render(<Support />)
    expect(screen.getByRole('heading', { name: `Support ${CHARITY.name}` })).toBeInTheDocument()
    expect(container.textContent).toContain(`${CHARITY.name}'s mission`)
    expect(container.textContent).not.toMatch(/Domain, Website, and other services/)
  })

  // FreeForCharity/FFC-Cloudflare-Automation#1391: integrations.zeffyDonationUrl
  // is the supporting organization's endowment form. A charity site embedding
  // it would collect donations to another organization under its own name.
  it("embeds the supporting organization's own donation form on its own site", () => {
    asSupporterSite()
    const { container } = render(<Support />)
    expect(container.querySelector('iframe')?.getAttribute('src')).toBe(
      siteConfig.integrations.zeffyDonationUrl
    )
  })

  it("never embeds the supporting organization's form on a charity's site", () => {
    asCharitySite({ donationUrl: 'https://www.zeffy.com/en-US/donation-form/riverbend-test' })
    const { container } = render(<Support />)
    expect(container.querySelector('iframe')).toBeNull()
    expect(container.innerHTML).not.toContain(siteConfig.integrations.zeffyDonationUrl)
    const link = screen.getByRole('link', { name: `Donate to ${CHARITY.name}` })
    expect(link).toHaveAttribute('href', 'https://www.zeffy.com/en-US/donation-form/riverbend-test')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('opens an external donation page in a new tab whatever the scheme casing', () => {
    asCharitySite({ donationUrl: 'HTTPS://www.zeffy.com/en-US/donation-form/riverbend-test' })
    render(<Support />)
    const link = screen.getByRole('link', { name: `Donate to ${CHARITY.name}` })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('emails the charity when it has no donation page', () => {
    asCharitySite({ donationUrl: '' })
    render(<Support />)
    const link = screen.getByRole('link', { name: `Donate to ${CHARITY.name}` })
    expect(link.getAttribute('href')).toMatch(
      new RegExp(`^mailto:${CHARITY.contactEmail}\\?subject=`)
    )
    expect(link).not.toHaveAttribute('target')
  })
})
