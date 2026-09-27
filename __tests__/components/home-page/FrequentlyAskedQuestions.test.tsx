import React from 'react'
import { render, screen } from '@testing-library/react'
import FAQ from '../../../src/components/home-page/FrequentlyAskedQuestions'
import { siteConfig } from '@/lib/site.config'
import { asSupporterSite, restoreSiteConfig } from '../../helpers/site-identity'

// The populated render is the supporting organization's own site; the hidden
// path (a charity site) is covered in section-visibility.test.tsx.
describe('FrequentlyAskedQuestions', () => {
  beforeEach(asSupporterSite)
  afterEach(restoreSiteConfig)

  it('renders the section heading', () => {
    render(<FAQ />)
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeInTheDocument()
  })

  it('mounts under the #faq section landmark id', () => {
    const { container } = render(<FAQ />)
    expect(container.querySelector('#faq')).not.toBeNull()
  })

  it('names the supporting organization and quotes its EIN from siteConfig', () => {
    const { container } = render(<FAQ />)
    expect(container.textContent).toContain(
      `${siteConfig.supportedBy.name} is all about efficiency`
    )
    expect(container.textContent).toContain(`(EIN) is ${siteConfig.ein}`)
    // A name substituted at a JSX line break must not run into the next word.
    expect(container.textContent).not.toMatch(new RegExp(`${siteConfig.name}[a-z]`))
  })
})
