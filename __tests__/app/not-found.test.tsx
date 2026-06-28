import React from 'react'
import { render, screen } from '@testing-library/react'
import NotFound, { metadata } from '@/app/not-found'
import { siteConfig } from '@/lib/site.config'

describe('not-found page', () => {
  it('renders branded 404 copy', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: /can.?t find that page/i })).toBeInTheDocument()
    // Substring match (not a RegExp built from config) so a fork name with
    // regex metacharacters can't break or throw.
    expect(screen.getByText(siteConfig.name, { exact: false })).toBeInTheDocument()
  })

  it('links to the homepage and the disclosure path', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: /go to homepage/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /report an issue/i })).toHaveAttribute(
      'href',
      siteConfig.vulnerabilityDisclosurePath
    )
  })

  it('is excluded from search indexing', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})
