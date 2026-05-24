import React from 'react'
import { render, screen } from '@testing-library/react'
import OurPrograms from '../../../src/components/home-page/Our-Programs'

describe('Our-Programs', () => {
  it('renders the section heading', () => {
    render(<OurPrograms />)
    expect(screen.getByRole('heading', { name: /Our Programs/i })).toBeInTheDocument()
  })

  it('mounts under the #programs section landmark id', () => {
    const { container } = render(<OurPrograms />)
    expect(container.querySelector('#programs')).not.toBeNull()
  })
})
