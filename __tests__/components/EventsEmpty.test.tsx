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
  it('shows the empty placeholder when no events are configured', () => {
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
