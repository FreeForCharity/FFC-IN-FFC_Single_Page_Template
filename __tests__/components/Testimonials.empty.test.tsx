import React from 'react'
import { render } from '@testing-library/react'

// Self-hiding behavior (FFC-Cloudflare-Automation#816 Part B): a fork that
// empties src/data/testimonials/*.json should render NOTHING rather than the
// FFC sample testimonials carousel. Mock the data module to the empty case for
// this file only; the populated render is covered by Testimonials.test.tsx.
//
// Swiper ships ESM that jest's transform doesn't process; stub it (and its CSS
// side-effect imports) exactly as Testimonials.test.tsx does so the module can
// be imported at all — the empty-data guard returns before Swiper is used.
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('swiper/modules', () => ({ Navigation: {}, Autoplay: {} }))
jest.mock('swiper/css', () => ({}), { virtual: true })
jest.mock('swiper/css/navigation', () => ({}), { virtual: true })
jest.mock('@/data/testimonials', () => ({ testimonials: [], configuredTestimonials: [] }))

import TestimonialSlider from '../../src/components/home-page/Testimonials'

describe('Testimonials — self-hiding', () => {
  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<TestimonialSlider />)
    expect(container).toBeEmptyDOMElement()
  })
})
