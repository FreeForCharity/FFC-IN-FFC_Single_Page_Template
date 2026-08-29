import React from 'react'
import { render, screen } from '@testing-library/react'

// ResultCard renders AnimatedNumber for numeric titles. AnimatedNumber now uses
// native IntersectionObserver + matchMedia, both stubbed in jest.setup.js
// (matchMedia reports prefers-reduced-motion: reduce), so it renders the static
// value path here.
import ResultCard from '../../../src/components/ui/ResultCard'

describe('ResultCard', () => {
  it('renders the title and description when title is non-numeric', () => {
    render(<ResultCard title="N/A" description="No data this year" />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
    expect(screen.getByText('No data this year')).toBeInTheDocument()
  })

  it('wraps a numeric title in AnimatedNumber (renders the parsed number)', () => {
    render(<ResultCard title="125" description="Volunteers" />)
    expect(screen.getByText('125')).toBeInTheDocument()
    expect(screen.getByText('Volunteers')).toBeInTheDocument()
  })

  it('renders the title inside an <h3>', () => {
    render(<ResultCard title="50" description="Partners" />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('50')
  })

  it('falls back to plain text for titles that mix digits and letters', () => {
    render(<ResultCard title="100+" description="Hours" />)
    expect(screen.getByText('100+')).toBeInTheDocument()
  })
})
