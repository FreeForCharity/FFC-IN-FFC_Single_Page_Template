import React from 'react'
import { render, screen } from '@testing-library/react'
import Volunteer from '../../../src/components/home-page/Volunteer-with-Us'
import { siteConfig } from '@/lib/site.config'
import {
  asCharitySite,
  asSupporterSite,
  CHARITY,
  restoreSiteConfig,
} from '../../helpers/site-identity'

describe('Volunteer-with-Us', () => {
  it('renders the section heading', () => {
    render(<Volunteer />)
    expect(screen.getByRole('heading', { name: /Volunteer with Us/i })).toBeInTheDocument()
  })

  it('mounts under the #volunteer section landmark id', () => {
    const { container } = render(<Volunteer />)
    expect(container.querySelector('#volunteer')).not.toBeNull()
  })

  afterEach(restoreSiteConfig)

  it("links the supporting organization's own site to its Idealist listing", () => {
    asSupporterSite()
    render(<Volunteer />)
    expect(screen.getByRole('link', { name: 'Volunteer' })).toHaveAttribute(
      'href',
      siteConfig.integrations.idealistUrl
    )
  })

  it("links a charity's site to its own volunteer page, never the supporter's", () => {
    asCharitySite({ volunteerUrl: 'https://www.idealist.org/en/nonprofit/riverbend-test' })
    const { container } = render(<Volunteer />)
    const link = screen.getByRole('link', { name: 'Volunteer' })
    expect(link).toHaveAttribute('href', 'https://www.idealist.org/en/nonprofit/riverbend-test')
    expect(container.innerHTML).not.toContain(siteConfig.integrations.idealistUrl)
  })

  it('opens an external volunteer page in a new tab whatever the scheme casing', () => {
    asCharitySite({ volunteerUrl: 'HTTPS://www.idealist.org/en/nonprofit/riverbend-test' })
    render(<Volunteer />)
    expect(screen.getByRole('link', { name: 'Volunteer' })).toHaveAttribute('target', '_blank')
  })

  it('emails the charity when it has no volunteer page', () => {
    asCharitySite({ volunteerUrl: '' })
    render(<Volunteer />)
    const link = screen.getByRole('link', { name: 'Volunteer' })
    expect(link.getAttribute('href')).toMatch(
      new RegExp(`^mailto:${CHARITY.contactEmail}\\?subject=`)
    )
    expect(link).not.toHaveAttribute('target')
  })
})
