import React from 'react'
import { render, screen } from '@testing-library/react'

// Swiper ships ESM that jest's transform doesn't process; stub it exactly as
// Testimonials.test.tsx does.
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('swiper/modules', () => ({ Navigation: {}, Autoplay: {} }))
jest.mock('swiper/css', () => ({}), { virtual: true })
jest.mock('swiper/css/navigation', () => ({}), { virtual: true })

// Fixed data for this file, so both directions are exercised whatever the
// checked-in src/data says: one results set and testimonials of each kind.
jest.mock('@/data/results', () => ({
  results: {
    supportingOrgOnly: true,
    heading: 'Supporter Results',
    stats: [{ value: '221', label: 'Supporter partners' }],
  },
}))
jest.mock('@/data/testimonials', () => {
  const list = [
    { heading: 'About the supporter', text: 'Supporter praise', supportingOrgOnly: true },
    { heading: 'About the charity', text: 'Charity praise' },
  ]
  return { testimonials: list, configuredTestimonials: list }
})

import Results from '../../../src/components/home-page/Results-2023'
import Testimonials from '../../../src/components/home-page/Testimonials'
import { results } from '@/data/results'
import { resultsSectionVisible, visibleTestimonials } from '@/lib/section-visibility'
import { asCharitySite, asSupporterSite, restoreSiteConfig } from '../../helpers/site-identity'

// Results and testimonials marked `supportingOrgOnly` are the supporting
// organization's (FFC's) own. A charity site provisioned from the template must
// never present them as its own, while still showing data it supplies itself.
describe("supporting organization's own results and testimonials", () => {
  afterEach(() => {
    restoreSiteConfig()
    results.supportingOrgOnly = true
  })

  it('shows on the supporting organization site', () => {
    asSupporterSite()
    expect(resultsSectionVisible()).toBe(true)
    render(<Results />)
    expect(screen.getByRole('heading', { level: 2, name: 'Supporter Results' })).toBeInTheDocument()
    expect(visibleTestimonials().map((t) => t.heading)).toEqual([
      'About the supporter',
      'About the charity',
    ])
  })

  it('is hidden on a charity site', () => {
    asCharitySite()
    expect(resultsSectionVisible()).toBe(false)
    const { container } = render(<Results />)
    expect(container).toBeEmptyDOMElement()
    render(<Testimonials />)
    expect(screen.queryByText('Supporter praise')).not.toBeInTheDocument()
    expect(screen.getByText('Charity praise')).toBeInTheDocument()
  })

  it("shows a charity's own results on its site", () => {
    asCharitySite()
    results.supportingOrgOnly = false
    expect(resultsSectionVisible()).toBe(true)
    render(<Results />)
    expect(screen.getByText('Supporter partners')).toBeInTheDocument()
  })
})
