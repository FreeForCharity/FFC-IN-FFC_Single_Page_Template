import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('renders the click-to-play facade instead of the video element', () => {
    const { container } = render(<Mission />)
    expect(
      screen.getByRole('button', { name: /play the free for charity mission video/i })
    ).toBeInTheDocument()
    // The mp4 must not be referenced until the facade is activated
    expect(container.querySelector('video')).toBeNull()
  })

  it('mounts the mission video element after the facade is clicked', () => {
    const { container } = render(<Mission />)
    fireEvent.click(
      screen.getByRole('button', { name: /play the free for charity mission video/i })
    )
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video?.querySelector('source')).toHaveAttribute('type', 'video/mp4')
  })
})
