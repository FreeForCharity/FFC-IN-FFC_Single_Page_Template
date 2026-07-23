import React from 'react'
import { render, screen } from '@testing-library/react'
import { siteConfig } from '@/lib/site.config'
import Footer from '@/components/footer'

// Configurable footer tax-status label (FFC-Cloudflare-Automation#816 Part B):
// the copyright line's tax-status clause is no longer the hardcoded fleet-wide
// "a US 501c3 Non Profit" assumption — it comes from siteConfig.taxStatusLabel,
// so a pre-501(c)(3) fork can set its own wording (or clear it entirely).
describe('footer tax-status label', () => {
  const original = siteConfig.taxStatusLabel
  afterEach(() => {
    siteConfig.taxStatusLabel = original
  })

  it('renders the configured tax-status label after the org name', () => {
    siteConfig.taxStatusLabel = 'a pre-501(c)(3) nonprofit'
    render(<Footer />)
    const bar = screen.getByText(/All Rights Are Reserved/)
    expect(bar).toHaveTextContent(`${siteConfig.name} a pre-501(c)(3) nonprofit`)
  })

  it('omits the status clause entirely when the label is empty', () => {
    siteConfig.taxStatusLabel = ''
    render(<Footer />)
    const bar = screen.getByText(/All Rights Are Reserved/)
    // No stray "501c3" wording and no dangling text after the name.
    expect(bar).not.toHaveTextContent('501c3')
    expect(bar).toHaveTextContent(`Reserved by ${siteConfig.name}`)
  })

  it('treats a whitespace-only label as empty (no dangling space)', () => {
    siteConfig.taxStatusLabel = '   '
    render(<Footer />)
    const bar = screen.getByText(/All Rights Are Reserved/)
    // Normalized text ends at the org name — the trimmed clause adds nothing.
    expect(bar).toHaveTextContent(`Reserved by ${siteConfig.name}`)
  })
})
