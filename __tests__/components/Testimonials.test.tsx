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
import { configuredTestimonials } from '@/data/testimonials'
import { asSupporterSite, restoreSiteConfig } from '../helpers/site-identity'

// Expectations come from src/data/testimonials rather than the template's
// samples, so the same suite holds on every charity site. The populated render
// is exercised on the supporting organization's own site, where every complete
// testimonial shows (including its own `supportingOrgOnly` ones); a site with
// none skips it (the empty case is Testimonials.empty.test.tsx, and which
// testimonials a charity site shows is supporting-org-data.test.tsx).
const itWithTestimonials = configuredTestimonials.length > 0 ? it : it.skip

describe('Testimonials component', () => {
  beforeEach(() => asSupporterSite())
  afterEach(() => restoreSiteConfig())

  itWithTestimonials('renders the section heading', () => {
    render(<Testimonials />)
    expect(screen.getByRole('heading', { name: 'Testimonials' })).toBeInTheDocument()
  })

  itWithTestimonials('renders the first testimonial heading and text', () => {
    render(<Testimonials />)
    // The heading text can also appear as the testimonial's location label, so
    // assert at least one match; the body text is unique.
    expect(screen.getAllByText(configuredTestimonials[0].heading).length).toBeGreaterThan(0)
    expect(screen.getByText(configuredTestimonials[0].text)).toBeInTheDocument()
  })

  itWithTestimonials('exposes accessible prev/next controls', () => {
    render(<Testimonials />)
    expect(screen.getByRole('button', { name: /previous testimonial/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next testimonial/i })).toBeInTheDocument()
  })
})
