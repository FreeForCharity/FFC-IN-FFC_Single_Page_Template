import React from 'react'
import { render, screen } from '@testing-library/react'
import TeamMemberCard, {
  memberInitials,
  safeLinkedInUrl,
} from '../../../src/components/ui/TeamMemberCard'

describe('safeLinkedInUrl', () => {
  it('accepts https LinkedIn URLs (including subdomains)', () => {
    expect(safeLinkedInUrl('https://www.linkedin.com/in/janedoe')).toBe(
      'https://www.linkedin.com/in/janedoe'
    )
    expect(safeLinkedInUrl('https://linkedin.com/in/x')).toBe('https://linkedin.com/in/x')
    expect(safeLinkedInUrl('https://uk.linkedin.com/in/x')).toBe('https://uk.linkedin.com/in/x')
  })
  it('normalizes the returned URL (trims surrounding whitespace)', () => {
    expect(safeLinkedInUrl('  https://www.linkedin.com/in/x  ')).toBe(
      'https://www.linkedin.com/in/x'
    )
  })
  it('rejects non-https schemes and off-site or malformed hosts', () => {
    expect(safeLinkedInUrl('javascript:alert(1)')).toBeUndefined()
    expect(safeLinkedInUrl('http://www.linkedin.com/in/x')).toBeUndefined()
    expect(safeLinkedInUrl('https://evil.com/in/x')).toBeUndefined()
    expect(safeLinkedInUrl('https://notlinkedin.com/in/x')).toBeUndefined()
    expect(safeLinkedInUrl('not a url')).toBeUndefined()
    expect(safeLinkedInUrl(undefined)).toBeUndefined()
  })
})

describe('memberInitials', () => {
  it('takes the first + last initial and upper-cases them', () => {
    expect(memberInitials('Jane Doe')).toBe('JD')
    expect(memberInitials('clarke moyer')).toBe('CM')
  })
  it('handles a single-word name', () => {
    expect(memberInitials('Cher')).toBe('C')
  })
  it('ignores middle names and extra whitespace', () => {
    expect(memberInitials('  Mary  Anne   Smith ')).toBe('MS')
  })
  it('degrades to a placeholder for an empty name', () => {
    expect(memberInitials('   ')).toBe('?')
  })
})

describe('TeamMemberCard', () => {
  const baseProps = {
    name: 'Jane Doe',
    role: 'Executive Director',
    linkedinUrl: 'https://www.linkedin.com/in/janedoe',
  }

  it('renders the team member name and role', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Jane Doe' })).toBeInTheDocument()
    expect(screen.getByText('Executive Director')).toBeInTheDocument()
  })

  it('renders an initials monogram instead of a photo', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
    // No portrait image should be requested for a team member.
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('links the whole card to LinkedIn with safe rel attributes when a URL is given', () => {
    render(<TeamMemberCard {...baseProps} />)
    const link = screen.getByRole('link', { name: /Jane Doe/i })
    expect(link).toHaveAttribute('href', baseProps.linkedinUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  /**
   * WCAG 2.5.3 "Label in Name" / axe `label-content-name-mismatch` (serious):
   * the link's accessible name must CONTAIN its visible text, and the card's
   * visible text is the name AND the role. An `aria-label` of
   * `<name> on LinkedIn` replaced the name outright, dropping the role, so
   * every linked card violated the rule — 5 nodes on the template homepage.
   *
   * `getByRole`'s `name` option computes the real accessible name (via
   * dom-accessibility-api), so this asserts the rule rather than the markup:
   * it fails for an accessible name that omits the role, however that name is
   * produced, and passes for any spelling that keeps the visible text whole.
   */
  it('gives the link an accessible name containing all of its visible text', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(
      screen.getByRole('link', { name: /Jane Doe\s+Executive Director\s+on LinkedIn/i })
    ).toBeInTheDocument()
  })

  it('renders no link when linkedinUrl is omitted', () => {
    render(<TeamMemberCard name="No Link" role="Volunteer" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'No Link' })).toBeInTheDocument()
  })

  it('renders no link for an unsafe (non-https / off-site) linkedinUrl', () => {
    render(<TeamMemberCard name="Bad Link" role="Advisor" linkedinUrl="javascript:alert(1)" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Bad Link' })).toBeInTheDocument()
  })
})
