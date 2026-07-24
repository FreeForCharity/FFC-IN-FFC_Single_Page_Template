import React from 'react'
import { render, screen } from '@testing-library/react'
import Team from '../../../src/components/home-page/TheFreeForCharityTeam'

describe('TheFreeForCharityTeam', () => {
  it('renders the section heading', () => {
    render(<Team />)
    expect(screen.getByRole('heading', { name: /The Free For Charity Team/i })).toBeInTheDocument()
  })

  it('mounts under the #team section landmark id', () => {
    const { container } = render(<Team />)
    expect(container.querySelector('#team')).not.toBeNull()
  })

  it('renders a card per member with initials monograms and no photos', () => {
    const { container } = render(<Team />)
    // Sample team ships five members; each card exposes its name as a heading.
    const names = screen.getAllByRole('heading', { level: 3 })
    expect(names.length).toBeGreaterThanOrEqual(3)
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
