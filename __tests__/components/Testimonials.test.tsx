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

import Testimonials from '@/components/home-page/Testimonials'
import { testimonials } from '@/data/testimonials'

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
})
