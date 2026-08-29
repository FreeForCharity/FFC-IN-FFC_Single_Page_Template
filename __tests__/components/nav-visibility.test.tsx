import React from 'react'
import { render, screen } from '@testing-library/react'

// Dead-anchor guard (FFC-Cloudflare-Automation#816 Part B follow-up): when a
// home-page section self-hides, its Header/Footer in-page nav link must go with
// it, or the fork ends up with a link to a missing #anchor. Team visibility
// keys off `configuredTeam` (members with a populated name), NOT raw
// `team.length` — a fork that blanks the team JSON leaves `team` non-empty but
// `configuredTeam` empty. Programs/Events key off siteConfig.sections. The
// default (all sections shown) is covered by Header.test.tsx / Footer.test.tsx.
//
// The mock deliberately keeps `team` NON-empty while `configuredTeam` is empty,
// so this test fails if the nav ever regresses to keying off `team.length`.
// Declared before the Header/Footer imports (which read the data module at
// module load) so they resolve the mock without relying on jest.mock hoisting.
jest.mock('@/data/team', () => ({
  team: [{ name: 'Sample Member', role: 'Volunteer' }],
  configuredTeam: [],
}))

import { siteConfig } from '@/lib/site.config'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
