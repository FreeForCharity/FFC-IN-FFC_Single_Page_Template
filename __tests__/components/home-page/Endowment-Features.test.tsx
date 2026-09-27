import React from 'react'
import { render, screen } from '@testing-library/react'
import EndowmentFeatures from '../../../src/components/home-page/Endowment-Features'
import { siteConfig } from '@/lib/site.config'
import { asSupporterSite, restoreSiteConfig } from '../../helpers/site-identity'

// The endowment is the supporting organization's, so the populated render is
// its own site; the hidden paths are covered in section-visibility.test.tsx.
describe('Endowment-Features', () => {
  beforeEach(asSupporterSite)
  afterEach(restoreSiteConfig)

  it('renders the section heading', () => {
    render(<EndowmentFeatures />)
    expect(
      screen.getByRole('heading', { name: `${siteConfig.supportedBy.name} Endowment Features` })
    ).toBeInTheDocument()
  })
})
