import React from 'react'
import { render, screen } from '@testing-library/react'
import Hero from '../../../src/components/home-page/Hero'

describe('Hero', () => {
  it('renders the welcome headline', () => {
    render(<Hero />)
    // The heading mixes text with a <br/>, so the rendered DOM is two text
    // nodes inside the same <h1>. Match the whole heading by accessible name
    // and let RTL collapse whitespace.
    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to\s+Free For Charity/i })
    ).toBeInTheDocument()
  })

  it('mounts under the #hero section landmark id', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).not.toBeNull()
  })
})
