import React from 'react'
import { render, screen } from '@testing-library/react'
import Volunteer from '../../../src/components/home-page/Volunteer-with-Us'

describe('Volunteer-with-Us', () => {
  it('renders the section heading', () => {
    render(<Volunteer />)
    expect(screen.getByRole('heading', { name: /Volunteer with Us/i })).toBeInTheDocument()
  })

  it('mounts under the #volunteer section landmark id', () => {
    const { container } = render(<Volunteer />)
    expect(container.querySelector('#volunteer')).not.toBeNull()
  })
})
