import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

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

  itWithTestimonials('marks each testimonial as a numbered slide', () => {
    render(<Testimonials />)
    const slides = screen
      .getAllByRole('group')
      .filter((el) => el.getAttribute('aria-roledescription') === 'slide')
    expect(slides).toHaveLength(configuredTestimonials.length)
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide')
    expect(slides[0]).toHaveAccessibleName(`1 of ${configuredTestimonials.length}`)
  })

  itWithTestimonials('starts on the first slide', () => {
    render(<Testimonials />)
    expect(screen.getByRole('button', { name: 'Go to testimonial 1' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  itWithTestimonials('Next moves to the second slide', () => {
    render(<Testimonials />)
    fireEvent.click(screen.getByRole('button', { name: /next testimonial/i }))
    expect(screen.getByRole('button', { name: 'Go to testimonial 2' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  itWithTestimonials('Previous from the first slide goes to the last', () => {
    render(<Testimonials />)
    fireEvent.click(screen.getByRole('button', { name: /previous testimonial/i }))
    expect(
      screen.getByRole('button', { name: `Go to testimonial ${configuredTestimonials.length}` })
    ).toHaveAttribute('aria-current', 'true')
  })

  itWithTestimonials('does not rotate or offer a pause button under reduced motion', () => {
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
})
