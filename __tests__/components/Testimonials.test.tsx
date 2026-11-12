import React from 'react'
import { render, screen } from '@testing-library/react'

// Swiper ships ESM that jest's transform doesn't process; stub the carousel
// shell so we can test the component's own markup (headings, slides, controls).
// The CSS side-effect imports are virtual-mocked to avoid resolving real files.
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('swiper/modules', () => ({ Navigation: {}, Autoplay: {} }))
jest.mock('swiper/css', () => ({}), { virtual: true })
jest.mock('swiper/css/navigation', () => ({}), { virtual: true })

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
