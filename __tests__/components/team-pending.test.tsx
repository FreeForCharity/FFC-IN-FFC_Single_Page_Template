import React from 'react'
import { render, screen } from '@testing-library/react'

// A pending team (siteConfig.pending includes 'team') has no configured member
// yet. Mock the data module to that state for this file only — `team` stays
// non-empty (blanked JSON files) while `configuredTeam` is empty, as a fork
// would have it. Declared before the component imports.
jest.mock('@/data/team', () => ({
  team: [{ name: '', role: '' }],
  configuredTeam: [],
}))

import Team, { teamHeading } from '@/components/home-page/TheFreeForCharityTeam'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { PENDING_TEXT, siteConfig } from '@/lib/site.config'
import { asCharitySite, CHARITY, restoreSiteConfig } from '../helpers/site-identity'

describe('pending team', () => {
  afterEach(restoreSiteConfig)

  it('renders the Team section with a visible, non-link placeholder', () => {
    asCharitySite({ pending: ['team'] })
    const { container } = render(<Team />)
    expect(container.querySelector('#team')).not.toBeNull()
    expect(screen.getByRole('heading', { name: teamHeading(CHARITY.name!) })).toBeInTheDocument()
    const note = screen.getByText(PENDING_TEXT)
    expect(note.closest('a')).toBeNull()
  })

  it('keeps the Header and Footer Team links, since the #team section renders', () => {
    asCharitySite({ pending: ['team'] })
    render(<Header />)
    expect(screen.queryAllByText('Team').length).toBeGreaterThan(0)
    render(<Footer />)
    const footerTeam = screen
      .getAllByText('Team')
      .map((el) => el.closest('a'))
      .filter((a) => a?.getAttribute('href') === '/#team')
    expect(footerTeam.length).toBeGreaterThan(0)
  })

  it('self-hides (with its nav links) when the empty team is NOT pending', () => {
    asCharitySite()
    // asCharitySite() clears any pending list the site ships with.
    expect(siteConfig.pending).toBeUndefined()
    const { container } = render(<Team />)
    expect(container).toBeEmptyDOMElement()
    render(<Footer />)
    expect(screen.queryAllByText('Team')).toHaveLength(0)
  })
})
