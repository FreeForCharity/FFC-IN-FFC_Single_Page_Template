import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogCard from '../../../src/components/ui/BlogCard'

describe('BlogCard', () => {
  it('renders the heading and description', () => {
    render(<BlogCard heading="Headline copy" description="Body copy" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Headline copy' })).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('omits the date paragraph when no date prop is provided', () => {
    render(<BlogCard heading="Headline" description="Body" />)
    // Date paragraph has the orange-text class id; absence is asserted by text.
    expect(screen.queryByText(/202[0-9]/)).toBeNull()
  })

  it('renders the date when provided', () => {
    render(<BlogCard heading="Headline" description="Body" date="May 24, 2026" />)
    expect(screen.getByText('May 24, 2026')).toBeInTheDocument()
  })

  it('wraps the heading in a link when href is provided', () => {
    render(<BlogCard heading="Click me" description="Body" href="https://example.org" />)
    const link = screen.getByRole('link', { name: 'Click me' })
    expect(link).toHaveAttribute('href', 'https://example.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('does not render an image when imageUrl is not provided', () => {
    const { container } = render(<BlogCard heading="No image" description="Body" />)
    expect(container.querySelector('img')).toBeNull()
  })
})
