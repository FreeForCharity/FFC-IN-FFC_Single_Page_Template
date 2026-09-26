import React from 'react'
import { render, screen } from '@testing-library/react'
import Team from '../../../src/components/home-page/TheFreeForCharityTeam'
import { configuredTeam } from '@/data/team'
import { siteConfig } from '@/lib/site.config'
import { asCharitySite, CHARITY, restoreSiteConfig } from '../../helpers/site-identity'

describe('TheFreeForCharityTeam', () => {
  it('renders the section heading', () => {
    render(<Team />)
    expect(screen.getByRole('heading', { name: `The ${siteConfig.name} Team` })).toBeInTheDocument()
  })

  it("names a charity's team after the charity", () => {
    asCharitySite()
    try {
      render(<Team />)
      expect(screen.getByRole('heading', { name: `The ${CHARITY.name} Team` })).toBeInTheDocument()
    } finally {
      restoreSiteConfig()
    }
  })

  it('mounts under the #team section landmark id', () => {
    const { container } = render(<Team />)
    expect(container.querySelector('#team')).not.toBeNull()
  })

  it('renders a card per member with initials monograms and no photos', () => {
    const { container } = render(<Team />)
    // One card per configured member, each exposing its name as a heading.
    // Counted from the data rather than from the template's sample roster: a
    // provisioned charity may list a single board member.
    const names = screen.getAllByRole('heading', { level: 3 })
    expect(names.map((n) => n.textContent)).toEqual(configuredTeam.map((m) => m.name))
    // No portrait images anywhere in the team section.
    expect(container.querySelectorAll('img').length).toBe(0)
  })
})

describe('TheFreeForCharityTeam with an empty roster', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('renders nothing when the team array is empty', () => {
    jest.isolateModules(() => {
      jest.doMock('@/data/team', () => ({ team: [], configuredTeam: [] }))
      const EmptyTeam = require('../../../src/components/home-page/TheFreeForCharityTeam').default
      const { container } = render(<EmptyTeam />)
      expect(container.firstChild).toBeNull()
    })
  })
})
