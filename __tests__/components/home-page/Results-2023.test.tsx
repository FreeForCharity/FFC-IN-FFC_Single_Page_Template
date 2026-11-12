import React from 'react'
import { render, screen } from '@testing-library/react'

// Results-2023 renders one ResultCard per stat → AnimatedNumber, which now uses
// native IntersectionObserver + matchMedia (stubbed in jest.setup.js to report
// prefers-reduced-motion: reduce), so the static value path is taken here.
import Results from '../../../src/components/home-page/Results-2023'
import { results } from '@/data/results'
import { asCharitySite, asSupporterSite, restoreSiteConfig } from '../../helpers/site-identity'

// Expectations come from src/data/results.ts rather than from the template's
// sample numbers, so the same suite holds on every charity site. The populated
// render is exercised on the supporting organization's own site, where even its
// own (`supportingOrgOnly`) numbers show; a site with no stats skips it (the
// empty case is Results-2023.empty.test.tsx).
const itWithStats = results.stats.length > 0 ? it : it.skip

describe('Results-2023', () => {
  beforeEach(() => asSupporterSite())
  afterEach(() => restoreSiteConfig())

  itWithStats('renders the section heading', () => {
    render(<Results />)
    expect(screen.getByRole('heading', { level: 2, name: results.heading })).toBeInTheDocument()
  })

  itWithStats('mounts under the #results section landmark id', () => {
    const { container } = render(<Results />)
    expect(container.querySelector('#results')).not.toBeNull()
  })

  itWithStats('renders one stat card per stat', () => {
    const { container } = render(<Results />)
    // The section heading is an <h2>; each ResultCard wraps its value in an
    // <h3> (one level below the section).
    expect(container.querySelectorAll('h2').length).toBe(1)
    expect(container.querySelectorAll('h3').length).toBe(results.stats.length)
    for (const stat of results.stats) {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    }
  })

  it("never shows the supporting organization's own results on a charity site", () => {
    asCharitySite()
    const { container } = render(<Results />)
    const expectShown = results.stats.length > 0 && !results.supportingOrgOnly
    expect(container.querySelector('#results') !== null).toBe(expectShown)
  })
})
