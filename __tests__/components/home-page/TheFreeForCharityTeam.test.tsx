import React from 'react'
import { render, screen } from '@testing-library/react'
import Team, { teamHeading } from '../../../src/components/home-page/TheFreeForCharityTeam'
import { configuredTeam } from '@/data/team'
import { siteConfig } from '@/lib/site.config'
import { teamSectionVisible } from '@/lib/section-visibility'
import { asCharitySite, CHARITY, restoreSiteConfig } from '../../helpers/site-identity'

// The section renders when the checked-in roster has a member (or is pending);
// a charity with neither gets nothing, covered by the empty-roster tests.
const itWhenVisible = teamSectionVisible() ? it : it.skip

describe('TheFreeForCharityTeam', () => {
  itWhenVisible('renders the section heading', () => {
    render(<Team />)
    expect(screen.getByRole('heading', { name: teamHeading(siteConfig.name) })).toBeInTheDocument()
  })

  itWhenVisible("names a charity's team after the charity", () => {
    asCharitySite()
    try {
      render(<Team />)
      expect(screen.getByRole('heading', { name: teamHeading(CHARITY.name!) })).toBeInTheDocument()
    } finally {
      restoreSiteConfig()
    }
  })

  itWhenVisible('mounts under the #team section landmark id', () => {
    const { container } = render(<Team />)
    expect(container.querySelector('#team')).not.toBeNull()
  })

  itWhenVisible('renders a card per member with initials monograms and no photos', () => {
    const { container } = render(<Team />)
    // One card per configured member, each exposing its name as a heading.
    // Counted from the data rather than from the template's sample roster: a
    // provisioned charity may list a single board member.
    // queryAll, not getAll: a pending roster has no configured member yet.
    const names = screen.queryAllByRole('heading', { level: 3 })
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

// The heading prefixes "The", so a name that already starts with the article
// must not render "The The ... Team".
describe('teamHeading', () => {
  it('prefixes the article to a name without one', () => {
    expect(teamHeading('Example Pantry')).toBe('The Example Pantry Team')
    // Only the whole word counts as the article.
    expect(teamHeading('Theatre Guild')).toBe('The Theatre Guild Team')
  })

  it('does not double an article the name already has, in any case', () => {
    expect(teamHeading('The Brain Injury Research Foundation (TheBIRF)')).toBe(
      'The Brain Injury Research Foundation (TheBIRF) Team'
    )
    expect(teamHeading('the example society')).toBe('the example society Team')
    expect(teamHeading('  THE Example Society ')).toBe('THE Example Society Team')
  })

  itWhenVisible('renders the heading once for a charity whose name starts with "The"', () => {
    asCharitySite({ name: 'The Example Society' })
    try {
      render(<Team />)
      expect(screen.getByRole('heading', { name: 'The Example Society Team' })).toBeInTheDocument()
      expect(screen.queryByText(/The The/)).not.toBeInTheDocument()
    } finally {
      restoreSiteConfig()
    }
  })
})
