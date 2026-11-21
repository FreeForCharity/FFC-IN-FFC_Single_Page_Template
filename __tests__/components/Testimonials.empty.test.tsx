import React from 'react'
import { render } from '@testing-library/react'

// Self-hiding behavior (FFC-Cloudflare-Automation#816 Part B): a fork that
// empties src/data/testimonials/*.json should render NOTHING rather than the
// FFC sample testimonials carousel. Mock the data module to the empty case for
// this file only; the populated render is covered by Testimonials.test.tsx.

jest.mock('@/data/testimonials', () => ({ testimonials: [], configuredTestimonials: [] }))

import TestimonialSlider from '../../src/components/home-page/Testimonials'

describe('Testimonials — self-hiding', () => {
  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<TestimonialSlider />)
    expect(container).toBeEmptyDOMElement()
  })
})
