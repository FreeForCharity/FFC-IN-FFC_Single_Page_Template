/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://www.example.org/"}
 */

/**
 * Cookie expiry contract for `deleteTrackingCookies` / `expireCookies`.
 *
 * Three properties, none of which the ordering suite touches:
 *
 *  1. Deletion is scoped BY CATEGORY. Withdrawing marketing must not expire
 *     the analytics cookies of a visitor who still consents to analytics —
 *     the earlier implementation expired both sets on either withdrawal.
 *  2. Denying analytics expires the fixed GA/Clarity names AND the dynamic
 *     `_ga_<measurement-id>` cookie, which is discovered by scanning
 *     `document.cookie` and so is the part most likely to rot silently.
 *  3. Each name is expired host-only AND against every registrable-domain
 *     candidate, because a cookie set with `domain=.example.org` is NOT
 *     removed by a host-only expiry of the same name.
 *
 * These assert on what the component WRITES to `document.cookie`, not on the
 * resulting jar: jsdom does not implement domain matching, so a jar-based
 * check would pass or fail for reasons that have nothing to do with this
 * code. The write log is the behaviour a real browser acts on.
 *
 * The `@jest-environment-options` URL above is load-bearing. jsdom defaults
 * to `localhost`, a single label, for which the domain walk is correctly a
 * no-op — so property 3 would vacuously "pass" on the default environment
 * while asserting nothing at all.
 */
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CookieConsent from '../../src/components/cookie-consent'

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

Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true })

// A pre-existing jar, including one dynamic _ga_* name the component has to
// discover by scanning rather than by knowing it up front.
const EXISTING_JAR = '_ga=GA1.1.123; _ga_G-TEST1234567=GS1.1.456; _fbp=fb.1.789'

describe('CookieConsent cookie expiry', () => {
  let writes: string[]

  beforeEach(() => {
    localStorageMock.clear()
    writes = []
    // Shadow the prototype accessor with an own property on `document`, so
    // the real one is restored by deleting it rather than by reassignment.
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => EXISTING_JAR,
      set: (value: string) => {
        writes.push(value)
      },
    })
  })

  afterEach(() => {
    delete (document as unknown as { cookie?: unknown }).cookie
  })

  /** Every write that expires `name` (ignores the consent cookie itself). */
  const expiriesFor = (name: string) =>
    writes.filter((w) => w.startsWith(`${name}=;`) && w.includes('01 Jan 1970'))

  const renderWith = async (prefs: { analytics: boolean; marketing: boolean }): Promise<void> => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, ...prefs })
    )
    render(<CookieConsent />)
    await waitFor(() => {
      expect(writes.length).toBeGreaterThan(0)
    })
  }

  it('does not expire analytics cookies when only marketing is declined', async () => {
    await renderWith({ analytics: true, marketing: false })

    for (const name of ['_ga', '_gid', '_clck', '_clsk', '_ga_G-TEST1234567']) {
      expect(expiriesFor(name)).toHaveLength(0)
    }
    // …while the marketing cookies it WAS asked to clear are cleared, so the
    // assertions above cannot pass merely because nothing ran.
    expect(expiriesFor('_fbp').length).toBeGreaterThan(0)
    expect(expiriesFor('fr').length).toBeGreaterThan(0)
  })

  it('expires the fixed and the dynamic analytics cookies when analytics is declined', async () => {
    await renderWith({ analytics: false, marketing: true })

    for (const name of ['_ga', '_gid', '_clck', '_clsk']) {
      expect(expiriesFor(name).length).toBeGreaterThan(0)
    }
    // Discovered by scanning the jar, not from a hard-coded list.
    expect(expiriesFor('_ga_G-TEST1234567').length).toBeGreaterThan(0)
    // Marketing still granted, so its cookies are left alone.
    expect(expiriesFor('_fbp')).toHaveLength(0)
  })

  it('expires each name host-only and against every domain candidate', async () => {
    await renderWith({ analytics: false, marketing: false })

    const gaWrites = expiriesFor('_ga')
    // Host-only: no domain attribute at all.
    expect(gaWrites.some((w) => !w.includes('domain='))).toBe(true)
    // Every registrable-domain candidate for www.example.org, dot-prefixed
    // and not, since a cookie set either way needs the matching expiry.
    for (const domain of ['www.example.org', '.www.example.org', 'example.org', '.example.org']) {
      expect(gaWrites.some((w) => w.includes(`domain=${domain};`))).toBe(true)
    }
  })

  it('expires both categories when the visitor clicks Decline All', async () => {
    // The other cases drive the RESTORE path (a stored choice replayed on
    // mount). This one drives the banner button, which is a separate code
    // path and the one a first-time visitor actually takes.
    //
    // It also guards a deliberate removal: `handleDeclineAll` used to call
    // `deleteTrackingCookies()` itself AND then call `applyConsent`, which
    // deletes again — duplicate expiry writes for every name, multiplied by
    // the domain walk. The explicit call is gone; this asserts that
    // declining still clears both categories without it.
    render(<CookieConsent />)

    // /^decline/i, not /decline all/i: two forks label this button just
    // "Decline". It stays unambiguous — the other banner buttons are
    // "Accept All" and "Customize".
    const declineButton = await screen.findByRole('button', { name: /^decline/i })
    fireEvent.click(declineButton)

    await waitFor(() => {
      expect(expiriesFor('_ga').length).toBeGreaterThan(0)
    })
    for (const name of ['_ga', '_gid', '_clck', '_clsk', '_fbp', 'fr']) {
      expect(expiriesFor(name).length).toBeGreaterThan(0)
    }
    expect(expiriesFor('_ga_G-TEST1234567').length).toBeGreaterThan(0)
  })
})
