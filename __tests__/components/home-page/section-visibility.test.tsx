import React from 'react'
import { render } from '@testing-library/react'
import { siteConfig } from '@/lib/site.config'
import EndowmentFeatures from '../../../src/components/home-page/Endowment-Features'
import OurPrograms from '../../../src/components/home-page/Our-Programs'
import Events from '../../../src/components/home-page/Events'

// Self-hiding behavior (FFC-Cloudflare-Automation#816 Part B): the FFC-specific
// marketing sections are gated behind siteConfig.sections.* so a rebranded fork
// can hide them (they carry FFC copy, not per-charity data). Defaults are true,
// so the FFC template site still renders them — the populated render is covered
// by each section's own test. Here we exercise the hidden path by mutating the
// shared config object (the established pattern in site.config.test.ts) and
// restoring it afterward.
describe('home-page section visibility flags', () => {
  const original = {
    showEndowment: siteConfig.sections.showEndowment,
    showPrograms: siteConfig.sections.showPrograms,
    showEvents: siteConfig.sections.showEvents,
    sourcesConfigured: process.env.EVENTS_SOURCES_CONFIGURED,
  }
  afterEach(() => {
    siteConfig.sections.showEndowment = original.showEndowment
    siteConfig.sections.showPrograms = original.showPrograms
    siteConfig.sections.showEvents = original.showEvents
    if (original.sourcesConfigured === undefined) {
      delete process.env.EVENTS_SOURCES_CONFIGURED
    } else {
      process.env.EVENTS_SOURCES_CONFIGURED = original.sourcesConfigured
    }
  })

  it('Endowment-Features renders nothing when showEndowment is false', () => {
    siteConfig.sections.showEndowment = false
    const { container } = render(<EndowmentFeatures />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Our-Programs renders nothing when showPrograms is false', () => {
    siteConfig.sections.showPrograms = false
    const { container } = render(<OurPrograms />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Events renders nothing when showEvents is false', () => {
    siteConfig.sections.showEvents = false
    // Even with a configured source the flag alone must hide the section.
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
    const { container } = render(<Events />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Events renders nothing when no sources are configured and the snapshot is empty', () => {
    // The template default: flag on, no EVENTS_* sources wired up, and the
    // committed src/data/events.generated.json snapshot is empty.
    siteConfig.sections.showEvents = true
    delete process.env.EVENTS_SOURCES_CONFIGURED
    const { container } = render(<Events />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Events renders (empty state) when a source is configured but has no events yet', () => {
    siteConfig.sections.showEvents = true
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
    const { container } = render(<Events />)
    expect(container).not.toBeEmptyDOMElement()
    expect(container.querySelector('[data-testid="events-empty-state"]')).not.toBeNull()
  })
})
