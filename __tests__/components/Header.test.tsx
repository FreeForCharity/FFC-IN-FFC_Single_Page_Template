import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Header from '../../src/components/header'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Header component', () => {
  it('should render the header', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should display the Free For Charity logo', () => {
    render(<Header />)
    // Check for logo image with alt text
    expect(screen.getByAltText('Free For Charity')).toBeInTheDocument()
  })

  it('should display Home navigation link', () => {
    render(<Header />)
    // Home link should always be present in navigation
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should have navigation links', () => {
    render(<Header />)
    // Check that navigation has at least some links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have a mobile menu button', () => {
    render(<Header />)
    // Look for the menu icon button
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should have search functionality button', () => {
    render(<Header />)
    const buttons = screen.getAllByRole('button')
    // Should have at least menu and search buttons
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Header />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
