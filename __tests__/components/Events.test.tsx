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
  it('renders the section heading and intro', () => {
    render(<Events />)
    expect(screen.getByRole('heading', { name: /upcoming events/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/aggregated from our Google Calendar/i)).toBeInTheDocument()
  })

  it('renders one card per event with the source badge and CTA', () => {
    render(<Events />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(screen.getByText('Volunteer Orientation')).toBeInTheDocument()
    expect(screen.getByText('Quarterly Training')).toBeInTheDocument()
    expect(screen.getByText('Annual Gala')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view on google calendar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view on microsoft 365/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view on facebook/i })).toHaveAttribute(
      'href',
      'https://www.facebook.com/events/gala-3'
    )
  })

  it('exposes Add to calendar controls for each event', () => {
    render(<Events />)
    const buttons = screen.getAllByRole('button', { name: /add to calendar/i })
    expect(buttons).toHaveLength(3)
    for (const button of buttons) {
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    }
  })

  it('groups events under month headings', () => {
    render(<Events />)
    const h2s = screen.getAllByRole('heading', { level: 2 })
    expect(h2s.length).toBeGreaterThan(0)
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Events />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
