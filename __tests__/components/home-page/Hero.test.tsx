import React from 'react'
import { render, screen } from '@testing-library/react'
import Hero from '../../../src/components/home-page/Hero'
import { siteConfig } from '@/lib/site.config'
import {
  asCharitySite,
  asSupporterSite,
  CHARITY,
  restoreSiteConfig,
} from '../../helpers/site-identity'

describe('Hero', () => {
  afterEach(restoreSiteConfig)

  it('renders the welcome headline with the site name', () => {
    render(<Hero />)
    // The heading mixes text with a <br/>, so the rendered DOM is two text
    // nodes inside the same <h1>; RTL collapses the whitespace between them.
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent?.replace(/\s+/g, ' ').trim()).toBe(`Welcome to ${siteConfig.name}`)
  })

  it('mounts under the #hero section landmark id', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).not.toBeNull()
  })

  it("keeps the supporting organization's strapline and Programs link on its own site", () => {
    asSupporterSite()
    render(<Hero />)
    expect(screen.getByText(/Connecting Students, Professionals/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Programs' })).toHaveAttribute('href', '#programs')
  })

  it("welcomes visitors to a charity's own site in the charity's own words", () => {
    asCharitySite()
    const { container } = render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(CHARITY.name)
    expect(screen.getByText(CHARITY.shortDescription as string)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Free For Charity|Connecting Students/)
    // The Programs section does not render on a charity site, so neither may
    // the button that scrolls to it.
    expect(screen.queryByRole('link', { name: 'Our Programs' })).toBeNull()
  })
})
