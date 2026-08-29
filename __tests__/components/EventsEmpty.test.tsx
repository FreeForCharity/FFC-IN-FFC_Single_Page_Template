import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock(
  '@/data/events.generated.json',
  () => ({
    __esModule: true,
    default: { updatedAt: null, events: [] },
  }),
  { virtual: false }
)

import Events from '../../src/components/home-page/Events'

describe('Events empty state', () => {
  // With NO sources configured and an empty snapshot the whole section
  // self-hides (covered in section-visibility.test.tsx). The empty state is
  // the "sources configured, zero upcoming events" path, so mark a source as
  // configured for these renders.
  const originalFlag = process.env.EVENTS_SOURCES_CONFIGURED
  beforeAll(() => {
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
  })
  afterAll(() => {
    if (originalFlag === undefined) {
      delete process.env.EVENTS_SOURCES_CONFIGURED
    } else {
      process.env.EVENTS_SOURCES_CONFIGURED = originalFlag
    }
  })

  it('shows the empty placeholder when a source is configured but has no events', () => {
    render(<Events />)
    expect(screen.getByTestId('events-empty-state')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /no upcoming events right now/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /follow us on facebook/i })).toHaveAttribute(
      'target',
      '_blank'
    )
  })
})
