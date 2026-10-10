import React from 'react'
import { render, screen } from '@testing-library/react'
import SupportFreeForCharity from '@/components/home-page/SupportFreeForCharity'
import { asSupporterSite, restoreSiteConfig } from '../helpers/site-identity'

// Locks in the perceived-performance + accessibility behavior of the
// third-party iframe embed: it lazy-loads and sits over a decorative,
// reduced-motion-safe loading skeleton. (The Events section no longer embeds
// an iframe — it renders a first-party card grid from the committed events
// snapshot; see __tests__/components/Events.test.tsx.)
describe('iframe embeds', () => {
  // Only the supporting organization's own site embeds the form (a charity
  // site links to its own donation page instead), so these tests set that
  // identity rather than depend on the checked-in config.
  describe('Zeffy donation form', () => {
    beforeEach(asSupporterSite)
    afterEach(restoreSiteConfig)

    it('lazy-loads the donation iframe', () => {
      render(<SupportFreeForCharity />)
      expect(screen.getByTitle('Donation form powered by Zeffy').getAttribute('loading')).toBe(
        'lazy'
      )
    })

    it('renders a decorative, reduced-motion-safe loading skeleton', () => {
      const { container } = render(<SupportFreeForCharity />)
      const skeleton = container.querySelector('[aria-hidden="true"].animate-pulse')
      expect(skeleton).not.toBeNull()
      expect(skeleton?.className).toContain('pointer-events-none')
      expect(skeleton?.className).toContain('motion-reduce:animate-none')
    })
  })
})
