import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

jest.mock(
  '@/data/events.generated.json',
  () => {
    const futureIso = (daysFromNow: number): string =>
      new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString()
    return {
      __esModule: true,
      default: {
        updatedAt: new Date().toISOString(),
        events: [
          {
            id: 'google:vol-1',
            source: 'google',
            title: 'Volunteer Orientation',
            description: 'Welcome new volunteers to the team.',
            startUtc: futureIso(7),
            endUtc: futureIso(7.05),
            allDay: false,
            location: '123 Main St',
            url: 'https://example.org/orientation',
          },
          {
            id: 'microsoft:training-2',
            source: 'microsoft',
            title: 'Quarterly Training',
            startUtc: futureIso(14),
            endUtc: futureIso(14.1),
            allDay: false,
            url: 'https://example.org/training',
          },
          {
            id: 'facebook:gala-3',
            source: 'facebook',
            title: 'Annual Gala',
            startUtc: futureIso(30),
            endUtc: futureIso(30.2),
            allDay: false,
            url: 'https://www.facebook.com/events/gala-3',
          },
        ],
      },
    }
  },
  { virtual: false }
)

import Events from '../../src/components/home-page/Events'

describe('Events component', () => {
  // The visibility predicate is client-safe and reads only the derived
  // booleans next.config.ts inlines; the snapshot mock above is invisible
  // to it, so mark the snapshot as populated the same way a real build
  // with a non-empty committed snapshot would.
  const originalHasEvents = process.env.EVENTS_SNAPSHOT_HAS_EVENTS
  beforeEach(() => {
    process.env.EVENTS_SNAPSHOT_HAS_EVENTS = 'true'
  })
  afterAll(() => {
    if (originalHasEvents === undefined) delete process.env.EVENTS_SNAPSHOT_HAS_EVENTS
    else process.env.EVENTS_SNAPSHOT_HAS_EVENTS = originalHasEvents
  })

  it('renders the section heading and intro', () => {
    render(<Events />)
    // h2 because the page-level h1 lives in the Hero section.
    expect(screen.getByRole('heading', { name: /upcoming events/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/aggregated from our Google Calendar/i)).toBeInTheDocument()
  })

  it('renders one card per event with the source badge and CTA', () => {
    render(<Events />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(screen.getByText('Volunteer Orientation')).toBeInTheDocument()
    expect(screen.getByText('Quarterly Training')).toBeInTheDocument()
    expect(screen.getByText('Annual Gala')).toBeInTheDocument()
    // Each card's CTA aria-label contains "View ... on {source} (opens in new tab)".
    expect(
      screen.getByRole('link', { name: /view .*orientation.*google calendar.*opens/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view .*training.*microsoft 365.*opens/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view .*annual gala.*facebook.*opens/i })
    ).toHaveAttribute('href', 'https://www.facebook.com/events/gala-3')
  })

  it('exposes Add to calendar controls for each event', () => {
    render(<Events />)
    const buttons = screen.getAllByRole('button', { name: /add to calendar/i })
    expect(buttons).toHaveLength(3)
    for (const button of buttons) {
      // Disclosure pattern: the toggle advertises expansion state, not an ARIA menu.
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls')
    }
  })

  it('groups events under month headings', () => {
    render(<Events />)
    // Month buckets are h3 now (Events section heading is h2).
    const h3s = screen.getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBeGreaterThan(0)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Events />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
