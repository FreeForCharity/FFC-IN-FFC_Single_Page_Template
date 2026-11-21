import React from 'react'
import { render, screen } from '@testing-library/react'

// Results-2023 renders four ResultCards → AnimatedNumber, which now uses native
// IntersectionObserver + matchMedia (stubbed in jest.setup.js to report
// prefers-reduced-motion: reduce), so the static value path is taken here.
// Fixture data, not the checked-in results: a provisioned charity starts with
// no stats (the section self-hides, covered at the end of this file).
const SAMPLE = {
  heading: 'Results - 2023',
  stats: [
    { value: '10', label: 'Sample stat one' },
    { value: '20', label: 'Sample stat two' },
    { value: '30', label: 'Sample stat three' },
    { value: '40', label: 'Sample stat four' },
  ],
}
let mockResults = SAMPLE
jest.mock('@/data/results', () => ({
  get results() {
    return mockResults
  },
}))

import Results from '../../../src/components/home-page/Results-2023'

describe('Results-2023', () => {
  it('renders the section heading', () => {
    render(<Results />)
    expect(screen.getByRole('heading', { level: 2, name: /Results - 2023/i })).toBeInTheDocument()
  })

  it('mounts under the #results section landmark id', () => {
    const { container } = render(<Results />)
    expect(container.querySelector('#results')).not.toBeNull()
  })

  it('renders four stat cards', () => {
    const { container } = render(<Results />)
    // The section heading is an <h2>; each ResultCard wraps its value in an
    // <h3> (one level below the section), so there are 1 <h2> and 4 <h3>s.
    expect(container.querySelectorAll('h2').length).toBe(1)
    expect(container.querySelectorAll('h3').length).toBe(4)
  })

  it('renders nothing when there are no stats', () => {
    mockResults = { heading: 'Results', stats: [] }
    try {
      const { container } = render(<Results />)
      expect(container).toBeEmptyDOMElement()
    } finally {
      mockResults = SAMPLE
    }
  })
})
