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
})
