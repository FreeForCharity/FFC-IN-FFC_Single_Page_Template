import React from 'react'
import { render, screen } from '@testing-library/react'
import { siteConfig } from '@/lib/site.config'
import Header from '@/components/header'
import Footer from '@/components/footer'

// Dead-anchor guard (FFC-Cloudflare-Automation#816 Part B follow-up): when a
// home-page section self-hides, its Header/Footer in-page nav link must go with
// it, or the fork ends up with a link to a missing #anchor. Team keys off empty
// `team` data (mocked here); Programs/Events key off siteConfig.sections. The
// default (all sections shown) is covered by Header.test.tsx / Footer.test.tsx.
jest.mock('@/data/team', () => ({ team: [] }))

describe('nav links respect section visibility', () => {
  const original = {
    showPrograms: siteConfig.sections.showPrograms,
    showEvents: siteConfig.sections.showEvents,
    widgetUrl: siteConfig.integrations.sociableKitEventsWidgetUrl,
  }
  afterEach(() => {
    siteConfig.sections.showPrograms = original.showPrograms
    siteConfig.sections.showEvents = original.showEvents
    siteConfig.integrations.sociableKitEventsWidgetUrl = original.widgetUrl
  })

  it('Header drops Team (empty data) and Programs (flag off) links', () => {
    siteConfig.sections.showPrograms = false
    render(<Header />)
    expect(screen.queryAllByText('Team')).toHaveLength(0)
    expect(screen.queryAllByText('Programs')).toHaveLength(0)
    // A section that does not self-hide keeps its link.
    expect(screen.queryAllByText('Mission').length).toBeGreaterThan(0)
  })

  it('Header keeps the Programs link when the flag is on', () => {
    siteConfig.sections.showPrograms = true
    render(<Header />)
    expect(screen.queryAllByText('Programs').length).toBeGreaterThan(0)
  })

  it('Footer drops Team, Programs, and Events links when hidden', () => {
    siteConfig.sections.showPrograms = false
    siteConfig.sections.showEvents = false
    render(<Footer />)
    expect(screen.queryAllByText('Team')).toHaveLength(0)
    expect(screen.queryAllByText('Programs')).toHaveLength(0)
    expect(screen.queryAllByText('Events')).toHaveLength(0)
  })

  it('Footer drops Events when the widget URL is empty even if the flag is on', () => {
    siteConfig.sections.showEvents = true
    siteConfig.integrations.sociableKitEventsWidgetUrl = ''
    render(<Footer />)
    expect(screen.queryAllByText('Events')).toHaveLength(0)
  })
})
