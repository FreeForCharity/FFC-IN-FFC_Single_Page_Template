import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

// Fixture data, not the checked-in testimonials: a provisioned charity starts
// with none (the section self-hides, covered at the end of this file).
const SAMPLE = [
  { heading: 'Sample Partner One', text: 'A sample testimonial body used by the tests.' },
  { heading: 'Sample Partner Two', text: 'A second sample testimonial body.' },
]
let mockTestimonials = SAMPLE
jest.mock('@/data/testimonials', () => ({
  get testimonials() {
    return mockTestimonials
  },
  get configuredTestimonials() {
    return mockTestimonials
  },
}))

import Testimonials from '@/components/home-page/Testimonials'
const testimonials = SAMPLE

describe('Testimonials component', () => {
  it('renders the section heading', () => {
    render(<Testimonials />)
    expect(screen.getByRole('heading', { name: 'Testimonials' })).toBeInTheDocument()
  })

  it('renders the first testimonial heading and text', () => {
    render(<Testimonials />)
    // The heading text can also appear as the testimonial's location label, so
    // assert at least one match; the body text is unique.
    expect(screen.getAllByText(testimonials[0].heading).length).toBeGreaterThan(0)
    expect(screen.getByText(testimonials[0].text)).toBeInTheDocument()
  })

  it('exposes accessible prev/next controls', () => {
    render(<Testimonials />)
    expect(screen.getByRole('button', { name: /previous testimonial/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next testimonial/i })).toBeInTheDocument()
  })

  it('marks each testimonial as a numbered slide', () => {
    render(<Testimonials />)
    const slides = screen
      .getAllByRole('group')
      .filter((el) => el.getAttribute('aria-roledescription') === 'slide')
    expect(slides).toHaveLength(testimonials.length)
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide')
    expect(slides[0]).toHaveAccessibleName(`1 of ${testimonials.length}`)
  })

  it('starts on the first slide', () => {
    render(<Testimonials />)
    expect(screen.getByRole('button', { name: 'Go to testimonial 1' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  it('Next moves to the second slide', () => {
    render(<Testimonials />)
    fireEvent.click(screen.getByRole('button', { name: /next testimonial/i }))
    expect(screen.getByRole('button', { name: 'Go to testimonial 2' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  it('Previous from the first slide goes to the last', () => {
    render(<Testimonials />)
    fireEvent.click(screen.getByRole('button', { name: /previous testimonial/i }))
    expect(
      screen.getByRole('button', { name: `Go to testimonial ${testimonials.length}` })
    ).toHaveAttribute('aria-current', 'true')
  })

  it('does not rotate or offer a pause button under reduced motion', () => {
    // jest.setup's matchMedia reports prefers-reduced-motion: reduce.
    jest.useFakeTimers()
    render(<Testimonials />)
    expect(screen.queryByRole('button', { name: /pause testimonials/i })).toBeNull()
    jest.advanceTimersByTime(20000)
    expect(screen.getByRole('button', { name: 'Go to testimonial 1' })).toHaveAttribute(
      'aria-current',
      'true'
    )
    jest.useRealTimers()
  })

  it('renders nothing when no testimonial is configured', () => {
    mockTestimonials = []
    try {
      const { container } = render(<Testimonials />)
      expect(container).toBeEmptyDOMElement()
    } finally {
      mockTestimonials = SAMPLE
    }
  })
})
