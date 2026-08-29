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
    const link = screen.getByRole('link', { name: /Jane Doe on LinkedIn/i })
    expect(link).toHaveAttribute('href', baseProps.linkedinUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
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
