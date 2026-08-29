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
    widgetUrl: siteConfig.integrations.sociableKitEventsWidgetUrl,
  }
  afterEach(() => {
    siteConfig.sections.showEndowment = original.showEndowment
    siteConfig.sections.showPrograms = original.showPrograms
    siteConfig.sections.showEvents = original.showEvents
    siteConfig.integrations.sociableKitEventsWidgetUrl = original.widgetUrl
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
    const { container } = render(<Events />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Events renders nothing when the widget URL is empty even if enabled', () => {
    siteConfig.sections.showEvents = true
    siteConfig.integrations.sociableKitEventsWidgetUrl = ''
    const { container } = render(<Events />)
    expect(container).toBeEmptyDOMElement()
  })

  it('Events treats a whitespace-only widget URL as unconfigured', () => {
    siteConfig.sections.showEvents = true
    siteConfig.integrations.sociableKitEventsWidgetUrl = '   '
    const { container } = render(<Events />)
    expect(container).toBeEmptyDOMElement()
  })
})
