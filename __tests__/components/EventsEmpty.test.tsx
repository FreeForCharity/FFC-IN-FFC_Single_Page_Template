import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock(
  '@/data/events.generated.json',
  () => ({
    __esModule: true,
    default: { updatedAt: null, events: [] },
  }),
  { virtual: false }
)

import Events from '../../src/components/home-page/Events'
import { asCharitySite, restoreSiteConfig } from '../helpers/site-identity'

const FACEBOOK = 'https://www.facebook.com/riverbend-pantry'

describe('Events empty state', () => {
  // The Facebook link comes from the charity's own social links, which a
  // provisioned fork may not have yet (`social` pending), so pin one here.
  beforeEach(() => asCharitySite({ social: [{ label: 'Facebook', href: FACEBOOK }] }))
  afterEach(restoreSiteConfig)

  // With NO sources configured and an empty snapshot the whole section
  // self-hides (covered in section-visibility.test.tsx). The empty state is
  // the "sources configured, zero upcoming events" path, so mark a source as
  // configured for these renders.
  const originalFlag = process.env.EVENTS_SOURCES_CONFIGURED
  beforeAll(() => {
    process.env.EVENTS_SOURCES_CONFIGURED = 'true'
  })
  afterAll(() => {
    if (originalFlag === undefined) {
      delete process.env.EVENTS_SOURCES_CONFIGURED
    } else {
      process.env.EVENTS_SOURCES_CONFIGURED = originalFlag
    }
  })

  it('shows the empty placeholder when a source is configured but has no events', () => {
    render(<Events />)
    expect(screen.getByTestId('events-empty-state')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /no upcoming events right now/i })
    ).toBeInTheDocument()
    const facebook = screen.getByRole('link', { name: /follow us on facebook/i })
    expect(facebook).toHaveAttribute('href', FACEBOOK)
    expect(facebook).toHaveAttribute('target', '_blank')
  })

  it('omits the Facebook link when the charity lists no Facebook page', () => {
    asCharitySite({ social: [] })
    render(<Events />)
    expect(screen.getByTestId('events-empty-state')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /follow us on facebook/i })).not.toBeInTheDocument()
  })
})
