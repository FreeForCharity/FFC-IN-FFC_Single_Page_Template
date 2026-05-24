import React from 'react'
import { render, screen } from '@testing-library/react'
import Support from '../../../src/components/home-page/SupportFreeForCharity'

describe('SupportFreeForCharity', () => {
  it('renders the section heading', () => {
    render(<Support />)
    expect(screen.getByRole('heading', { name: /Support Free For Charity/i })).toBeInTheDocument()
  })

  it('mounts under the #donate section landmark id', () => {
    const { container } = render(<Support />)
    expect(container.querySelector('#donate')).not.toBeNull()
  })
})
