import React from 'react'
import { render, screen } from '@testing-library/react'
import Events from '@/components/home-page/Events'
import { siteConfig } from '@/lib/site.config'

describe('Events component', () => {
  it('renders the section heading', () => {
    render(<Events />)
    expect(screen.getByRole('heading', { name: 'Upcoming Events' })).toBeInTheDocument()
  })

  it('renders the SociableKit events iframe from siteConfig with safe attributes', () => {
    render(<Events />)
    const iframe = screen.getByTitle('Facebook Events')
    expect(iframe).toBeInTheDocument()
    expect(iframe.getAttribute('src')).toBe(siteConfig.integrations.sociableKitEventsWidgetUrl)
    expect(iframe.getAttribute('loading')).toBe('lazy')
    expect(iframe.getAttribute('sandbox')).toContain('allow-scripts')
  })
})
