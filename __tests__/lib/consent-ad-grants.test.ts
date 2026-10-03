/**
 * Google Ad Grants machinery: the universal opt-out signal (GPC), the
 * site's own "Do Not Sell or Share" control, and the child-directed lock.
 *
 * WHY THIS FILE EXISTS SEPARATELY. consent-mode.test.ts asserts the
 * regional contract and passed unchanged when this machinery was added —
 * it does not read the opt-out path at all. A suite that goes green for a
 * feature it never exercises is worse than no suite, so these assertions
 * are deliberately written to FAIL if the opt-out is removed, inverted, or
 * quietly downgraded to "analytics too".
 */
import {
  CONSENT_MODE_BOOTSTRAP,
  SALE_SHARE_OPT_OUT_EVENT,
  SALE_SHARE_OPT_OUT_KEY,
  setSaleShareOptOut,
  updateGoogleConsent,
} from '../../src/lib/consent-mode'

/**
 * The opt-out keeps an in-memory session flag, so it survives a storage
 * failure. That flag is module state: without this hook a case that opts out
 * leaks into every later case in this file, and the symptom is a later
 * assertion of "not opted out" failing for a reason that is nowhere near it.
 *
 * Cleared through the public API rather than by reaching into the module --
 * this is what a visitor opting back in does, and it keeps the test honest
 * about what the production code actually offers.
 */
beforeEach(() => {
  setSaleShareOptOut(false)
})
describe('the bootstrap reads a universal opt-out before any tag loads', () => {
  it('reads GPC and the stored opt-out BEFORE the first consent default', () => {
    const gpc = CONSENT_MODE_BOOTSTRAP.indexOf('navigator.globalPrivacyControl')
    const stored = CONSENT_MODE_BOOTSTRAP.indexOf(SALE_SHARE_OPT_OUT_KEY)
    const firstDefault = CONSENT_MODE_BOOTSTRAP.indexOf("gtag('consent', 'default'")

    expect(gpc).toBeGreaterThan(-1)
    expect(stored).toBeGreaterThan(-1)
    // Reading it after the defaults would be decorative: the tags would
    // already have their permissive state.
    expect(gpc).toBeLessThan(firstDefault)
    expect(stored).toBeLessThan(firstDefault)
  })

  it('wraps the storage read so a private window cannot break the bootstrap', () => {
    // localStorage throws outright in some privacy modes. An unguarded read
    // would abort the script and leave NO consent defaults at all — which
    // fails open, granting everything.
    expect(CONSENT_MODE_BOOTSTRAP).toContain('try {')
    expect(CONSENT_MODE_BOOTSTRAP).toContain('catch (e) {}')
    const tryIndex = CONSENT_MODE_BOOTSTRAP.indexOf('try {')
    expect(tryIndex).toBeLessThan(CONSENT_MODE_BOOTSTRAP.indexOf('localStorage.getItem'))
  })

  it('gates ONLY the advertising signals on the opt-out, never analytics', () => {
    const unscoped = CONSENT_MODE_BOOTSTRAP.slice(
      CONSENT_MODE_BOOTSTRAP.lastIndexOf("gtag('consent', 'default'")
    )

    // The three advertising signals must be conditional on the flag.
    expect(unscoped).toContain("'ad_storage': ffcAdsDenied ? 'denied' : 'granted'")
    expect(unscoped).toContain("'ad_user_data': ffcAdsDenied ? 'denied' : 'granted'")

    // Analytics must NOT be. GPC is an opt-out of sale/share, not of
    // first-party measurement — conflating them throws away data the
    // charity is entitled to, and no law asks for it.
    expect(unscoped).toContain("'analytics_storage': 'granted'")
    expect(unscoped).not.toContain("'analytics_storage': ffcAdsDenied")
  })

  it('leaves ad_personalization denied by default — Ad Grants cannot use it', () => {
    const unscoped = CONSENT_MODE_BOOTSTRAP.slice(
      CONSENT_MODE_BOOTSTRAP.lastIndexOf("gtag('consent', 'default'")
    )
    // Grants accounts are search-only. Granting the remarketing signal
    // would buy nothing and carry the heaviest CPRA weight, so the shipped
    // default is denied and a site opts in via analyticsConfig.
    expect(unscoped).toContain("'ad_personalization': 'denied'")

    // personalization_storage too. Copilot's point on the canary PR: an
    // absence check that names only SOME signals lets a regression grant the
    // unnamed ones and still pass. These two move together — both govern
    // personalisation, and the implementation comments treat them as one
    // policy — so a test that pins one and not the other is only half a test.
    expect(unscoped).toContain("'personalization_storage': 'denied'")
  })

  it('still denies everything inside the EEA/UK/CH, unconditionally', () => {
    const scoped = CONSENT_MODE_BOOTSTRAP.slice(
      CONSENT_MODE_BOOTSTRAP.indexOf("gtag('consent', 'default'"),
      CONSENT_MODE_BOOTSTRAP.lastIndexOf("gtag('consent', 'default'")
    )
    // The opt-out may only ever tighten. If the flag leaked into the
    // region-scoped call it could loosen the EEA default, which is the one
    // outcome Google's EU User Consent Policy forbids.
    expect(scoped).not.toContain('ffcAdsDenied')
    expect(scoped).toContain("'ad_storage': 'denied'")
    expect(scoped).toContain("'analytics_storage': 'denied'")
    expect(scoped).toContain("'region'")
  })
})

describe('setSaleShareOptOut may only tighten when no preferences are passed', () => {
  const realGtag = window.gtag

  beforeEach(() => {
    window.localStorage.clear()
    window.gtag = jest.fn()
  })
  afterEach(() => {
    window.gtag = realGtag
    window.localStorage.clear()
  })

  it('never pushes a GRANT when called without preferences', () => {
    // Regression guard. An earlier revision pushed ad_storage/ad_user_data
    // 'granted' here, overriding the banner's marketing toggle on no
    // evidence — including for an EEA visitor who never accepted.
    setSaleShareOptOut(false)

    const calls = (window.gtag as jest.Mock).mock.calls
    const granted = calls.filter(([, , payload]) =>
      Object.values((payload ?? {}) as Record<string, string>).includes('granted')
    )
    expect(granted).toHaveLength(0)
  })

  it('denies every advertising signal when opting out', () => {
    setSaleShareOptOut(true)

    const update = (window.gtag as jest.Mock).mock.calls.find(
      ([cmd, action]) => cmd === 'consent' && action === 'update'
    )
    expect(update).toBeDefined()
    expect(update?.[2]).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
    })
  })

  it('still denies when localStorage is blocked, e.g. a private window', () => {
    // Copilot's finding. The deny used to be gated on hasSaleShareOptOut(),
    // which re-reads localStorage; when that read throws, its catch reports
    // false, so the denial was skipped entirely and the control did nothing
    // — in precisely the browsers whose users are most likely to use it.
    // The storage write may fail silently; the live denial may not.
    const store = window.localStorage
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('storage blocked')
      },
    })

    try {
      setSaleShareOptOut(true)
      const update = (window.gtag as jest.Mock).mock.calls.find(
        ([cmd, action]) => cmd === 'consent' && action === 'update'
      )
      expect(update?.[2]).toMatchObject({ ad_storage: 'denied', ad_user_data: 'denied' })
    } finally {
      Object.defineProperty(window, 'localStorage', { configurable: true, value: store })
    }
  })

  it('defers to the banner when preferences ARE passed', () => {
    // The prefs path is the only one allowed to grant, because it is the
    // only one that knows what the visitor actually chose.
    setSaleShareOptOut(false, {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })

    const update = (window.gtag as jest.Mock).mock.calls.find(
      ([cmd, action]) => cmd === 'consent' && action === 'update'
    )
    expect(update?.[2]).toMatchObject({ ad_storage: 'granted' })
  })
})

/**
 * The opt-out has to survive two things that previously defeated it: a
 * storage write that throws, and a non-Google tag that cannot hear a Consent
 * Mode update at all. Both were reported by Copilot on
 * FFC-IN-Footer_Only_Template#140 and were real.
 */
describe('the opt-out cannot be lost to a storage failure', () => {
  const realLocalStorage = window.localStorage

  function withStorageThrowing<T>(fn: () => T): T {
    const boom = () => {
      throw new Error('storage disabled')
    }
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: boom, setItem: boom, removeItem: boom, clear: () => {} },
    })
    try {
      return fn()
    } finally {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: realLocalStorage,
      })
    }
  }

  afterEach(() => {
    delete window.gtag
    window.localStorage.clear()
  })

  it('WITH prefs, still denies ads when localStorage throws', () => {
    const gtag = jest.fn()
    window.gtag = gtag

    // The hole this closes: setSaleShareOptOut(true, prefs) wrote the flag,
    // and when the write threw it delegated to updateGoogleConsent, which
    // re-read storage, threw, and reported "not opted out" from its catch. A
    // prefs.marketing === true then GRANTED advertising, discarding the
    // opt-out argument that was the entire point of the call.
    //
    // Same defect class as the no-prefs path, surviving one branch over: an
    // invariant stated in one layer and violated in the next.
    withStorageThrowing(() =>
      setSaleShareOptOut(true, {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      })
    )

    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'update',
      expect.objectContaining({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        // Analytics is untouched: this is an opt-out of sale/sharing.
        analytics_storage: 'granted',
      })
    )
  })

  it('honours an explicit adsDenied override even when storage says nothing', () => {
    const gtag = jest.fn()
    window.gtag = gtag

    updateGoogleConsent(
      { necessary: true, functional: true, analytics: true, marketing: true },
      { adsDenied: true }
    )

    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'update',
      expect.objectContaining({ ad_storage: 'denied', analytics_storage: 'granted' })
    )
  })
})

describe('the opt-out reaches tags that do not speak Consent Mode', () => {
  afterEach(() => {
    delete window.gtag
    window.localStorage.clear()
  })

  it('announces an opt-out so the Meta Pixel can be stopped', () => {
    const seen: string[] = []
    const onOptOut = () => seen.push('opt-out')
    window.addEventListener(SALE_SHARE_OPT_OUT_EVENT, onOptOut)
    try {
      setSaleShareOptOut(true)
    } finally {
      window.removeEventListener(SALE_SHARE_OPT_OUT_EVENT, onOptOut)
    }

    // Without this the footer control denied ad_storage while Meta kept its
    // cookies and reloaded on the next page, so the control's own label was
    // false.
    expect(seen).toEqual(['opt-out'])
  })

  it('does NOT announce an opt-out when clearing the flag', () => {
    const seen: string[] = []
    const onOptOut = () => seen.push('opt-out')
    window.addEventListener(SALE_SHARE_OPT_OUT_EVENT, onOptOut)
    try {
      setSaleShareOptOut(false)
    } finally {
      window.removeEventListener(SALE_SHARE_OPT_OUT_EVENT, onOptOut)
    }
    expect(seen).toEqual([])
  })
})
