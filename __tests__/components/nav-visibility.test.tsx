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
    sourcesConfigured: process.env.EVENTS_SOURCES_CONFIGURED,
  }
  afterEach(() => {
    siteConfig.sections.showPrograms = original.showPrograms
    siteConfig.sections.showEvents = original.showEvents
    if (original.sourcesConfigured === undefined) {
      delete process.env.EVENTS_SOURCES_CONFIGURED
    } else {
      process.env.EVENTS_SOURCES_CONFIGURED = original.sourcesConfigured
    }
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
    // Even with a configured source the flag alone must drop the link.
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
    render(<Footer />)
    expect(screen.queryAllByText('Team')).toHaveLength(0)
    expect(screen.queryAllByText('Programs')).toHaveLength(0)
    expect(screen.queryAllByText('Events')).toHaveLength(0)
  })

  it('Footer drops Events when no sources are configured even if the flag is on', () => {
    // The template default: flag on, no EVENTS_* sources wired up, and the
    // committed snapshot empty — the section self-hides, so the quick-link
    // must go with it (dead-anchor guard).
    siteConfig.sections.showEvents = true
    delete process.env.EVENTS_SOURCES_CONFIGURED
    render(<Footer />)
    expect(screen.queryAllByText('Events')).toHaveLength(0)
  })

  it('Footer keeps Events when the flag is on and a source is configured', () => {
    siteConfig.sections.showEvents = true
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
    render(<Footer />)
    expect(screen.queryAllByText('Events').length).toBeGreaterThan(0)
  })
})
