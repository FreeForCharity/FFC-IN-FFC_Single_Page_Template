import React from 'react'
import { render, screen } from '@testing-library/react'
import OurPrograms from '../../../src/components/home-page/Our-Programs'
import { asSupporterSite, restoreSiteConfig } from '../../helpers/site-identity'

// The populated render is the supporting organization's own site; the hidden
// paths (flag off, charity site) are covered in section-visibility.test.tsx.
describe('Our-Programs', () => {
  beforeEach(asSupporterSite)
  afterEach(restoreSiteConfig)

  it('renders the section heading', () => {
    render(<OurPrograms />)
    expect(screen.getByRole('heading', { name: /Our Programs/i })).toBeInTheDocument()
  })

  it('mounts under the #programs section landmark id', () => {
    const { container } = render(<OurPrograms />)
    expect(container.querySelector('#programs')).not.toBeNull()
  })
})
