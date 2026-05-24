import React from 'react'
import { render, screen } from '@testing-library/react'
import TeamMemberCard from '../../../src/components/ui/TeamMemberCard'

describe('TeamMemberCard', () => {
  const baseProps = {
    imageUrl: '/Images/member1.webp',
    name: 'Jane Doe',
    title: 'Executive Director',
    linkedinUrl: 'https://www.linkedin.com/in/janedoe',
  }

  it('renders the team member name and title', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Jane Doe' })).toBeInTheDocument()
    expect(screen.getByText('Executive Director')).toBeInTheDocument()
  })

  it('uses the name as the alt text on the portrait image', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument()
  })

  it('wires the LinkedIn link to the provided URL with safe rel attributes', () => {
    render(<TeamMemberCard {...baseProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', baseProps.linkedinUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('renders the linkedin icon image with alt text', () => {
    render(<TeamMemberCard {...baseProps} />)
    expect(screen.getByAltText('linkedin icon')).toBeInTheDocument()
  })
})
