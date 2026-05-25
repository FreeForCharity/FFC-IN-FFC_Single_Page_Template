import React from 'react'
import { render, screen, act } from '@testing-library/react'
import VoicesofGratitude from '../../../src/components/home-page/VoicesofGratitude'

describe('VoicesofGratitude', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('renders the section heading', () => {
    render(<VoicesofGratitude />)
    expect(screen.getByRole('heading', { name: /Voices of Gratitude/i })).toBeInTheDocument()
  })

  it('renders at least one testimonial quote on initial mount', () => {
    render(<VoicesofGratitude />)
    // Each testimonial text starts with a typographic open-quote character.
    expect(screen.getAllByText(/“/i).length).toBeGreaterThan(0)
  })
})
