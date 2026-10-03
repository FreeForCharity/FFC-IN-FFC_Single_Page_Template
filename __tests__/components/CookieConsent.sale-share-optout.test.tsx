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
import { render, screen, waitFor } from '@testing-library/react'
import CookieConsent from '../../src/components/cookie-consent'
import {
  SALE_SHARE_OPT_OUT_EVENT,
  SALE_SHARE_OPT_OUT_KEY,
  hasSaleShareOptOut,
  setSaleShareOptOut,
} from '../../src/lib/consent-mode'

/**
 * An observed opt-out is latched for the session, so it cannot be un-observed
 * by a later storage failure. That latch is module state: without this hook a
 * case that reads a stored opt-out leaves every later case in this file opted
 * out, and three of them assert the opposite. Cleared through the public API,
 * which is what a visitor opting back in does.
 */
beforeEach(() => {
  setSaleShareOptOut(false)
})

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

  it('expires the Meta cookies for an opted-out visitor with NO stored choice', async () => {
    // The right does not depend on a banner record existing. A visitor sending
    // GPC whose stored choice has been cleared -- or whose storage cannot be
    // read -- previously had Google's advertising signals denied by the
    // bootstrap and kept `_fbp`/`fr`, because every missing-choice branch
    // returned without running any cleanup. The privacy policy says an opt-out
    // deletes those cookies.
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    const writes = captureCookieWrites()
    render(<CookieConsent />)

    await waitFor(() => {
      expect(writes.some((w) => w.startsWith('_fbp='))).toBe(true)
    })
    expect(writes.some((w) => w.startsWith('fr='))).toBe(true)
    // Expired, not set.
    expect(writes.every((w) => w.includes('expires=Thu, 01 Jan 1970'))).toBe(true)
    // And the analytics cookies are left alone: there is no stored choice to
    // withdraw, and this is an opt-out of sale/sharing either way.
    expect(writes.some((w) => w.startsWith('_ga='))).toBe(false)
  })

  it('positive control: with no stored choice and no opt-out, nothing is expired', async () => {
    // Otherwise the case above would also pass if the restore path had simply
    // started expiring the Meta cookies for every undecided visitor.
    const writes = captureCookieWrites()
    render(<CookieConsent />)

    // Waits for the BANNER, which is the component's own signal that the
    // missing-choice path has run. The first draft waited on
    // `querySelectorAll('script').length >= 0`, which is true on the first
    // tick and therefore waited for nothing: a regression that expired these
    // cookies asynchronously would have been asserted away before it
    // happened. Reported by Copilot.
    await screen.findByText('Accept All')
    expect(writes.some((w) => w.startsWith('_fbp='))).toBe(false)
    expect(writes.some((w) => w.startsWith('fr='))).toBe(false)
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

/**
 * The opt-out has to take GOOGLE'S advertising cookies too, not just Meta's.
 *
 * Reported by Copilot on FFC-EX-canary#40. Outside the EEA/UK/CH this site
 * grants Google `ad_storage` for Ad Grants conversion tracking, so Google Ads
 * and the conversion linker can have written `_gcl_*` and `_gac_*` cookies
 * before the visitor opts out. Consent Mode denying storage stops new ones; it
 * does not remove those. Every deletion site carried `['_fbp', 'fr']` and
 * nothing else, so the privacy policy's promise that an opt-out deletes
 * advertising cookies was true of Meta and false of Google.
 */
describe('the opt-out expires Google advertising cookies as well as Meta\u2019s', () => {
  // A jar as a returning visitor who arrived from an ad would have it. The
  // dynamic names are the point: `_gcl_aw` depends on the click parameter and
  // `_gac_G-...` on the configured property, so they are swept by prefix and
  // an enumerated list would miss them.
  const JAR = [
    '_ga=GA1.1.123',
    '_ga_G-TEST1234567=GS1.1.456',
    '_fbp=fb.1.789',
    '_gcl_au=1.1.111.222',
    '_gcl_aw=GCL.1.aaa',
    '_gac_G-TEST1234567=1.1.bbb',
  ].join('; ')

  /** Cookie writes, with a populated jar on the way in. */
  function captureWithJar(): string[] {
    const writes: string[] = []
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => JAR,
      set: (v: string) => {
        writes.push(v)
      },
    })
    return writes
  }

  const expired = (writes: string[], name: string) =>
    writes.some((w) => w.startsWith(`${name}=`) && w.includes('expires=Thu, 01 Jan 1970'))

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('expires _gcl_au, the dynamic _gcl_* and the dynamic _gac_* on opt-out', async () => {
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    const writes = captureWithJar()
    render(<CookieConsent />)

    await waitFor(() => {
      expect(expired(writes, '_fbp')).toBe(true)
    })
    expect(expired(writes, '_gcl_au')).toBe(true)
    expect(expired(writes, '_gcl_aw')).toBe(true)
    expect(expired(writes, '_gac_G-TEST1234567')).toBe(true)

    // Analytics survives. The opt-out is of sale and sharing for advertising,
    // and `_ga`/`_ga_*` are this visitor's analytics consent, which stands.
    expect(expired(writes, '_ga')).toBe(false)
    expect(expired(writes, '_ga_G-TEST1234567')).toBe(false)
  })

  it('positive control: the same jar survives when marketing is granted and nothing is opted out', async () => {
    // Otherwise the case above would pass just as well if the component had
    // started expiring the advertising cookies on every restore.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)

    const writes = captureWithJar()
    render(<CookieConsent />)

    await waitFor(() => {
      expect(localStorageMock.getItem('cookie-consent')).toBe(ACCEPTED_ALL)
    })

    expect(expired(writes, '_gcl_au')).toBe(false)
    expect(expired(writes, '_gcl_aw')).toBe(false)
    expect(expired(writes, '_gac_G-TEST1234567')).toBe(false)
    expect(expired(writes, '_fbp')).toBe(false)
  })

  it('takes them on the window event too, not only on restore', async () => {
    // The mid-page opt-out path has its own deletion call site, and before
    // these were one list it had its own copy of the Meta-only names.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    render(<CookieConsent />)

    await waitFor(() => {
      expect(localStorageMock.getItem('cookie-consent')).toBe(ACCEPTED_ALL)
    })

    const writes = captureWithJar()
    window.dispatchEvent(new Event(SALE_SHARE_OPT_OUT_EVENT))

    await waitFor(() => {
      expect(expired(writes, '_gcl_au')).toBe(true)
    })
    expect(expired(writes, '_gcl_aw')).toBe(true)
    expect(expired(writes, '_gac_G-TEST1234567')).toBe(true)
    expect(expired(writes, '_fbp')).toBe(true)
    expect(expired(writes, '_ga')).toBe(false)
  })
})

/**
 * `consent_update` is a DOCUMENTED integration point -- the GTM README tells
 * container authors to key tags on it -- so what it publishes is a contract,
 * not an internal detail.
 *
 * It published `prefs.marketing` verbatim. A visitor who accepted marketing
 * and then opted out of sale/sharing (footer control, GPC, or a child-directed
 * site) therefore had `marketing_consent: 'granted'` republished on every
 * later pageview, and any container tag trusting it fired. The opt-out was
 * honoured for Google tags through Consent Mode and discarded for everything
 * downstream of this payload. Reported by Copilot on
 * FFC-IN-Footer_Only_Template#140.
 *
 * Four cases, because three of them pass for the wrong reasons on their own:
 * the denial needs a positive control to show it discriminates; the analytics
 * signal must NOT be swept up, since the opt-out is of sale/sharing and not of
 * the first-party analytics the visitor still consented to; and a mid-page
 * opt-out has to correct the published value WITHOUT re-firing the event.
 */
describe('consent_update publishes the effective marketing state', () => {
  beforeEach(() => {
    localStorageMock.clear()
    window.dataLayer = []
  })

  /** Every `consent_update` event pushed so far. */
  function consentEvents() {
    return (window.dataLayer ?? []).filter(
      (e) => (e as { event?: string }).event === 'consent_update'
    ) as Array<Record<string, unknown>>
  }

  it('publishes denied for an opted-out visitor whose stored choice accepted marketing', async () => {
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    render(<CookieConsent />)

    await waitFor(() => {
      expect(consentEvents()).toHaveLength(1)
    })
    expect(consentEvents()[0].marketing_consent).toBe('denied')
  })

  it('publishes granted for the SAME stored choice without an opt-out', async () => {
    // The positive control. Without it the assertion above would also pass if
    // the payload stopped carrying marketing_consent at all, or if this
    // harness never reached applyConsent.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)

    render(<CookieConsent />)

    await waitFor(() => {
      expect(consentEvents()).toHaveLength(1)
    })
    expect(consentEvents()[0].marketing_consent).toBe('granted')
  })

  it('leaves analytics_consent granted for that opted-out visitor', async () => {
    // Scope. The opt-out is of sale/sharing for advertising; withdrawing the
    // analytics consent the visitor did give would be a different wrong answer
    // that the denial assertion above cannot tell apart.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    render(<CookieConsent />)

    await waitFor(() => {
      expect(consentEvents()).toHaveLength(1)
    })
    expect(consentEvents()[0].analytics_consent).toBe('granted')
    expect(consentEvents()[0].functional_consent).toBe('granted')
  })

  it('corrects the published value on a mid-page opt-out without re-firing the event', async () => {
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)

    render(<CookieConsent />)

    await waitFor(() => {
      expect(consentEvents()).toHaveLength(1)
    })
    expect(consentEvents()[0].marketing_consent).toBe('granted')

    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    window.dispatchEvent(new Event(SALE_SHARE_OPT_OUT_EVENT))

    await waitFor(() => {
      const last = window.dataLayer[window.dataLayer.length - 1] as Record<string, unknown>
      expect(last.marketing_consent).toBe('denied')
    })

    const last = window.dataLayer[window.dataLayer.length - 1] as Record<string, unknown>
    // No `event` key: GTM merges dataLayer keys, so the variable is corrected
    // without re-triggering tags. Re-firing `consent_update` would make an
    // analytics tag whose conditions still hold send a duplicate pageview.
    expect(last.event).toBeUndefined()
    expect(consentEvents()).toHaveLength(1)
  })

  it('expires the Meta cookies when storage stops working after the opt-out was seen', async () => {
    // The reported divergence. The apply does not read the opt-out once: the
    // deletion helper and the Meta loader read it again. With storage failing
    // in between, the published state said denied while the deletion saw false
    // from its catch and left `_fbp`/`fr` in place -- Consent Mode honouring a
    // right the cookies did not.
    //
    // Stated the way it actually happens: a read succeeds earlier in the
    // session (the inline bootstrap, or the footer control the visitor just
    // used), and storage then stops working. Once latched, later reads never
    // reach storage at all, which is the mechanism rather than a gap in the
    // test -- so this case proves storage IS broken for them.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    // The earlier successful read, as the bootstrap or the control would make it.
    expect(hasSaleShareOptOut()).toBe(true)

    const realGetItem = localStorageMock.getItem
    localStorageMock.getItem = (key: string) => {
      if (key === SALE_SHARE_OPT_OUT_KEY) throw new Error('storage unavailable')
      return realGetItem(key)
    }

    const writes = captureCookieWrites()
    try {
      // Every later read of the opt-out key throws, so nothing below can learn
      // the opt-out from storage.
      expect(() => window.localStorage.getItem(SALE_SHARE_OPT_OUT_KEY)).toThrow()

      render(<CookieConsent />)

      await waitFor(() => {
        expect(consentEvents()).toHaveLength(1)
      })
      expect(consentEvents()[0].marketing_consent).toBe('denied')
      expect(writes.some((w) => w.startsWith('_fbp='))).toBe(true)
      expect(writes.some((w) => w.startsWith('fr='))).toBe(true)
      // And the analytics cookies survive, as everywhere else.
      expect(writes.some((w) => w.startsWith('_ga='))).toBe(false)
    } finally {
      localStorageMock.getItem = realGetItem
    }
  })

  it('does not let storage failing mid-apply split the Google update from the published event', async () => {
    // applyConsent reads the opt-out ONCE and passes the answer to every
    // decision that depends on it. This is the case that makes that
    // load-bearing: a version re-deriving it per decision has the second read
    // throw, is told `false` by the catch, and GRANTS advertising it has just
    // published as denied -- for the same visitor, in the same apply.
    //
    // Not hypothetical about the mechanism: that is exactly how an earlier
    // defect in this feature worked, where setSaleShareOptOut(true, prefs)
    // lost its own argument to a storage read that threw.
    localStorageMock.setItem('cookie-consent', ACCEPTED_ALL)
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    const gtagMock = jest.fn()
    window.gtag = gtagMock

    // The opt-out key reads correctly once, then storage goes away.
    const realGetItem = localStorageMock.getItem
    let optOutReads = 0
    localStorageMock.getItem = (key: string) => {
      if (key === SALE_SHARE_OPT_OUT_KEY) {
        optOutReads += 1
        if (optOutReads > 1) throw new Error('storage unavailable')
      }
      return realGetItem(key)
    }

    try {
      render(<CookieConsent />)

      await waitFor(() => {
        expect(consentEvents()).toHaveLength(1)
      })
      expect(consentEvents()[0].marketing_consent).toBe('denied')

      // Typed rather than left to inference: `mock.calls` is `any[][]`, so an
      // un-annotated callback parameter is an implicit any that fails the
      // project's noImplicitAny, and the annotation also gives the payload
      // below a real shape instead of `any`.
      const calls = gtagMock.mock.calls as Array<[string, string, Record<string, string>]>
      const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update')
      expect(updates).toHaveLength(1)
      expect(updates[0][2]).toMatchObject({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
      // The visitor's analytics consent survives: this is a sale/share
      // opt-out, and storage misbehaving is not a reason to withdraw it.
      expect(updates[0][2]).toMatchObject({ analytics_storage: 'granted' })
    } finally {
      localStorageMock.getItem = realGetItem
      window.gtag = undefined
    }
  })
})
