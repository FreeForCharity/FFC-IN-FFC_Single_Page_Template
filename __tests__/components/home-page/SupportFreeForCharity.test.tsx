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
})
