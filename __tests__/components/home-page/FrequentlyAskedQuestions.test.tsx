import React from 'react'
import { render, screen } from '@testing-library/react'
import FAQ from '../../../src/components/home-page/FrequentlyAskedQuestions'

describe('FrequentlyAskedQuestions', () => {
  it('renders the section heading', () => {
    render(<FAQ />)
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeInTheDocument()
  })

  it('mounts under the #faq section landmark id', () => {
    const { container } = render(<FAQ />)
    expect(container.querySelector('#faq')).not.toBeNull()
  })
})
