import React from 'react'
import { render, screen } from '@testing-library/react'
import Mission from '../../../src/components/home-page/Mission'

describe('Mission', () => {
  it('renders the section heading', () => {
    render(<Mission />)
    expect(
      screen.getByRole('heading', {
        name: /Free For Charity has a simple mission with broad implications/i,
      })
    ).toBeInTheDocument()
  })

  it('mounts under the #mission section landmark id', () => {
    const { container } = render(<Mission />)
    expect(container.querySelector('#mission')).not.toBeNull()
  })

  it('renders the embedded mission video element', () => {
    const { container } = render(<Mission />)
    expect(container.querySelector('video')).not.toBeNull()
  })
})
