import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import Mission from '../../../src/components/home-page/Mission'
import { siteConfig } from '@/lib/site.config'
import {
  asCharitySite,
  asSupporterSite,
  CHARITY,
  restoreSiteConfig,
} from '../../helpers/site-identity'

/**
 * Note on <noscript>: in jsdom (unlike real browsers with scripting on) the
 * children of <noscript> are parsed as real DOM nodes, so the no-JS fallback
 * <video> is queryable here. Facade assertions therefore distinguish videos
 * inside vs outside <noscript>.
 */
const videoOutsideNoscript = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('video')).find((v) => !v.closest('noscript')) ?? null

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const playButtonName = () =>
  new RegExp(`play the ${escapeRegExp(siteConfig.name)} mission video`, 'i')

describe("Mission (the supporting organization's own site)", () => {
  beforeEach(asSupporterSite)
  afterEach(restoreSiteConfig)

  it('renders the section heading', () => {
    render(<Mission />)
    expect(
      screen.getByRole('heading', {
        name: `${siteConfig.name} has a simple mission with broad implications`,
      })
    ).toBeInTheDocument()
  })

  it('mounts under the #mission section landmark id', () => {
    const { container } = render(<Mission />)
    expect(container.querySelector('#mission')).not.toBeNull()
  })

  it('renders the click-to-play facade instead of the video element', () => {
    const { container } = render(<Mission />)
    expect(screen.getByRole('button', { name: playButtonName() })).toBeInTheDocument()
    // The mp4 must not be referenced (outside the noscript fallback) until
    // the facade is activated
    expect(videoOutsideNoscript(container)).toBeNull()
  })

  it('keeps a no-JS fallback video inside <noscript> in the server HTML', () => {
    // React omits <noscript> children on the CLIENT (they can never display
    // there), so the fallback only exists in server-rendered markup — which
    // is exactly what a no-JS browser receives from the static export.
    const html = renderToStaticMarkup(<Mission />)
    expect(html).toMatch(/<noscript>[\s\S]*mission-video\.mp4[\s\S]*<\/noscript>/)
    expect(html).toMatch(/<noscript>[\s\S]*video\/mp4[\s\S]*<\/noscript>/)
  })

  it('mounts the mission video element after the facade is clicked', () => {
    const { container } = render(<Mission />)
    fireEvent.click(screen.getByRole('button', { name: playButtonName() }))
    const video = videoOutsideNoscript(container)
    expect(video).not.toBeNull()
    expect(video?.querySelector('source')).toHaveAttribute('type', 'video/mp4')
  })
})

describe("Mission (a charity's own site)", () => {
  beforeEach(() => asCharitySite())
  afterEach(restoreSiteConfig)

  it("states the charity's own mission, not the supporting organization's", () => {
    const { container } = render(<Mission />)
    expect(container.querySelector('#mission')).not.toBeNull()
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getByText(CHARITY.description as string)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/simple mission with broad implications/)
    expect(container.textContent).not.toMatch(/charity for charities/)
  })

  it("does not embed the supporting organization's mission video", () => {
    const html = renderToStaticMarkup(<Mission />)
    expect(html).not.toMatch(/mission-video/)
  })
})
