/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.example.org/"}
 */

/**
 * The sale/share opt-out has to reach the NON-Google tags.
 *
 * Consent Mode governs Google only. Denying `ad_storage` does nothing to the
 * Meta Pixel, which this component loads from `prefs.marketing` alone — so
 * before this contract existed, a visitor who accepted marketing and then used
 * the footer's "Do Not Sell or Share" control got Google advertising denied
 * while Meta kept receiving PageView data and kept its `_fbp`/`fr` cookies.
 * The control's own label said "Advertising sharing is off", which was false.
 *
 * Reported by Copilot on FFC-IN-Footer_Only_Template#140 and on the canary
 * fork; it was real in both, and in the reference template they were copied
 * from.
 *
 * Two properties, because fixing only one leaves the claim false:
 *
 *  1. An opted-out visitor's Pixel is NOT loaded, even with a stored
 *     `marketing: true`. This is also what makes the child-directed
 *     guarantee true for non-Google tags, since `hasSaleShareOptOut()`
 *     returns true whenever that knob is set.
 *  2. Opting out expires the Pixel's cookies, via the same
 *     domain-candidate helper the component uses everywhere else.
 *
 * What is deliberately NOT claimed: a Pixel already executing in the current
 * page cannot be unloaded. Expiring its cookies and refusing to load it again
 * is the honest limit of a client-side control, and the policy text says that
 * rather than promising more.
 */
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CookieConsent from '../../src/components/cookie-consent'
import { SALE_SHARE_OPT_OUT_EVENT, SALE_SHARE_OPT_OUT_KEY } from '../../src/lib/consent-mode'

/**
 * The Meta Pixel id comes from `analyticsConfig`, not an environment variable,
 * and `isConfigured()` refuses the shipped placeholder. So the config module is
 * mocked with a real-looking id: without it the Pixel never loads at all and
 * the "does not load when opted out" assertion below would pass while
 * exercising nothing.
 *
 * That is not hypothetical. The first version of this suite in the sibling
 * footer-only template had no real id, the opt-out assertion passed, and only
 * the positive control revealed that the Pixel had never been loadable.
 *
 * `jest.mock` is hoisted, so this applies before the component module reads the
 * config. Note the sibling template needs a different mechanism for the same
 * problem -- it reads NEXT_PUBLIC_META_PIXEL_ID at module scope -- which is why
 * this file is adapted per repo rather than copied.
 */
jest.mock('../../src/lib/analytics.config', () => {
  const actual = jest.requireActual('../../src/lib/analytics.config')
  return {
    ...actual,
    analyticsConfig: { ...actual.analyticsConfig, metaPixelId: '123456789012345' },
  }
})

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const ACCEPTED_ALL = JSON.stringify({
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
})

/** Every value written to document.cookie during the test. */
function captureCookieWrites(): string[] {
  const writes: string[] = []
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get: () => '',
    set: (v: string) => {
      writes.push(v)
    },
  })
  return writes
}

describe('sale/share opt-out and the non-Google marketing tag', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.querySelectorAll('script').forEach((s) => s.remove())
  })

  it('does NOT load the Meta Pixel for an opted-out visitor who accepted marketing', async () => {
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    render(<CookieConsent />)

    // Give the restore path a chance to run and load what it is going to load.
    await waitFor(() => {
      expect(localStorageMock.getItem('cookie-consent')).toBe(ACCEPTED_ALL)
    })

    const pixelLoaded = Array.from(document.querySelectorAll('script')).some((s) =>
      (s.textContent ?? '').includes('fbevents.js')
    )
    expect(pixelLoaded).toBe(false)
  })

  it('DOES load the Meta Pixel for the same choice without an opt-out', async () => {
    // The guard above must pass by discrimination, not because the Pixel
    // never loads in this harness at all.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)

    render(<CookieConsent />)

    await waitFor(() => {
      const pixelLoaded = Array.from(document.querySelectorAll('script')).some((s) =>
        (s.textContent ?? '').includes('fbevents.js')
      )
      expect(pixelLoaded).toBe(true)
    })
  })

  it('expires the Meta cookies on restore for an opted-out visitor', async () => {
    // Distinct from the event case below. This is the RESTORE path: a visitor
    // who accepted marketing and is now opted out must not keep the Pixel's
    // cookies just because their stored preference still says marketing:true.
    // deleteTrackingCookies therefore treats a sale/share opt-out as forcing
    // marketing deletion, which is a separate clause from the load gate --
    // and was initially shipped with no test, which a mutation run caught.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    const writes = captureCookieWrites()
    render(<CookieConsent />)

    await waitFor(() => {
      expect(writes.some((w) => w.startsWith('_fbp='))).toBe(true)
    })
    expect(writes.some((w) => w.startsWith('fr='))).toBe(true)

    // The analytics cookies must SURVIVE: the opt-out is of sale/sharing, and
    // this visitor still consents to analytics. Deleting both sets on either
    // withdrawal is a regression this repo has had before.
    expect(writes.some((w) => w.startsWith('_ga='))).toBe(false)
  })

  it('expires the Meta cookies when the opt-out is announced', async () => {
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    render(<CookieConsent />)

    await waitFor(() => {
      expect(localStorageMock.getItem('cookie-consent')).toBe(ACCEPTED_ALL)
    })

    const writes = captureCookieWrites()
    window.dispatchEvent(new Event(SALE_SHARE_OPT_OUT_EVENT))

    await waitFor(() => {
      expect(writes.some((w) => w.startsWith('_fbp='))).toBe(true)
    })
    expect(writes.some((w) => w.startsWith('fr='))).toBe(true)
    // Expired, not set: an expiry in the past is what removes them.
    expect(writes.every((w) => w.includes('expires=Thu, 01 Jan 1970'))).toBe(true)
  })
})
