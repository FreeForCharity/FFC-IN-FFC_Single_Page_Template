import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CookieConsent from '../../src/components/cookie-consent'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CookieConsent component', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should show cookie banner on first visit', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('should display banner when no preferences are saved', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        const banner = screen.queryByText(/cookies/i)
        expect(banner).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('should not show banner if preferences are already saved', () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      })
    )

    render(<CookieConsent />)

    // Banner should not appear immediately if consent is already saved
    const banner = screen.queryByText(/We use cookies/i)
    expect(banner).not.toBeInTheDocument()
  })

  it('should have a link to privacy policy', async () => {
    render(<CookieConsent />)

    await waitFor(
      () => {
        const privacyLinks = screen.queryAllByText(/Privacy Policy/i)
        expect(privacyLinks.length).toBeGreaterThanOrEqual(1)
      },
      { timeout: 2000 }
    )
  })

  it('should not have accessibility violations when visible', async () => {
    const { container } = render(<CookieConsent />)

    await waitFor(
      async () => {
        const banner = screen.queryByText(/cookies/i)
        if (banner) {
          const results = await axe(container)
          expect(results).toHaveNoViolations()
        }
      },
      { timeout: 2000 }
    )
  })
})

describe('CookieConsent Google Consent Mode integration', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  afterEach(() => {
    delete window.gtag
  })

  it('pushes a gtag consent update when restoring a stored choice on load', async () => {
    const gtag = jest.fn()
    window.gtag = gtag
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: true, marketing: false })
    )

    render(<CookieConsent />)

    await waitFor(() => {
      expect(gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        expect.objectContaining({
          analytics_storage: 'granted',
          ad_storage: 'denied',
          security_storage: 'granted',
        })
      )
    })
  })

  it('pushes a denied gtag consent update when the stored choice declined tracking', async () => {
    const gtag = jest.fn()
    window.gtag = gtag
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: false, marketing: false })
    )

    render(<CookieConsent />)

    await waitFor(() => {
      expect(gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        expect.objectContaining({
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      )
    })
  })

  it('keeps the direct GA4 loader inert while the measurement ID is the placeholder', async () => {
    // The template ships the placeholder G-XXXXXXXXXX, so even though the
    // GA4 loader now runs on every pageview (Consent Mode gates storage,
    // not loading), no gtag.js script may be injected until a real ID is
    // configured — GTM delivers GA4 for fleet sites.
    render(<CookieConsent />)

    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    })

    expect(document.querySelector('script[src*="googletagmanager.com/gtag"]')).toBeNull()
  })

  it('deletes non-granted categories’ cookies on load, even without a prior stored grant', async () => {
    // Under the regional Consent Mode defaults, Google tags can set cookies
    // BEFORE the visitor makes any choice (outside the EEA/UK/CH). Applying
    // a denying choice must therefore delete per category on every apply,
    // not only on withdrawal of a previously stored grant.
    document.cookie = '_ga=stale-regional-default'
    document.cookie = '_fbp=stale-regional-default'
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: false, marketing: false })
    )

    render(<CookieConsent />)

    await waitFor(() => {
      expect(document.cookie).not.toContain('_ga=')
      expect(document.cookie).not.toContain('_fbp=')
    })
  })

  it('does not load Clarity or Meta Pixel without an explicit grant', async () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: false, marketing: false })
    )

    render(<CookieConsent />)

    expect(document.querySelector('script[src*="clarity.ms"]')).toBeNull()
    expect(document.querySelector('script[src*="fbevents.js"]')).toBeNull()
  })
})
