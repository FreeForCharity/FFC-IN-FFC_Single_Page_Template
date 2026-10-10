/**
 * @jest-environment jsdom
 */

/**
 * The opt-out may be TIGHTENED. It may never be loosened.
 *
 * Two ways it could be, both reported by Copilot on FFC-EX-canary#40, and
 * both of which end with advertising GRANTED for a visitor who refused it:
 *
 *  1. The `adsDenied` override used `??`, so an explicit
 *     `{ adsDenied: false }` REPLACED the enforced state and granted
 *     `ad_storage` on a child-directed site or to a visitor sending GPC --
 *     the two cases that are not the visitor's to waive and not a caller's
 *     either. The override exists to stop an opt-out being lost; it could
 *     also be used to lose one.
 *
 *  2. A storage failure made the opt-out last exactly one call.
 *     `setSaleShareOptOut(true)` applied the live denial, the write threw, and
 *     the next `hasSaleShareOptOut()` re-read the storage that had just
 *     refused it and answered false -- so a later preference save in the same
 *     tab re-granted advertising, the Meta loader ran again, and the footer
 *     control rendered as though the visitor had never clicked it.
 *
 * This file is SEPARATE on purpose. Both holes sat under suites that were
 * fully green, because neither suite ever asked what happens after an opt-out
 * that storage refused, or what an adversarial caller can pass. A suite that
 * passes for a property it does not exercise is the failure mode here, so
 * every case below is written to fail if the enforcement is removed -- and the
 * two positive controls are there so they cannot pass by refusing everything.
 */
import {
  CONSENT_MODE_BOOTSTRAP,
  SALE_SHARE_OPT_OUT_GLOBAL,
  SALE_SHARE_OPT_OUT_KEY,
  hasSaleShareOptOut,
  setSaleShareOptOut,
  updateGoogleConsent,
} from '../../src/lib/consent-mode'

const ALL_ON = { necessary: true, functional: true, analytics: true, marketing: true }

/** Run `fn` with localStorage refusing every read and write, as a private window does. */
function withStorageRefusing<T>(fn: () => T): T {
  const real = window.localStorage
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
    Object.defineProperty(window, 'localStorage', { configurable: true, value: real })
  }
}

/** Run `fn` with the browser sending Global Privacy Control. */
function withGpc<T>(fn: () => T): T {
  Object.defineProperty(window.navigator, 'globalPrivacyControl', {
    configurable: true,
    value: true,
  })
  try {
    return fn()
  } finally {
    Reflect.deleteProperty(window.navigator, 'globalPrivacyControl')
  }
}

/** The payload of the single `consent` `update` call made by `gtag`. */
function updatePayload(gtag: jest.Mock): Record<string, string> {
  const calls = gtag.mock.calls as Array<[string, string, Record<string, string>]>
  const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update')
  expect(updates).toHaveLength(1)
  return updates[0][2]
}

describe('the sale/share opt-out may be tightened but never loosened', () => {
  beforeEach(() => {
    // The module holds an in-memory session flag on purpose, so a case that
    // sets it leaks into every later one unless it is cleared. Cleared through
    // the public API rather than by reaching into the module -- this is
    // precisely what a visitor opting back in does.
    setSaleShareOptOut(false)
    window.localStorage.clear()
  })

  afterEach(() => {
    setSaleShareOptOut(false)
    window.localStorage.clear()
    delete window.gtag
  })

  it('an explicit adsDenied:false cannot override a stored opt-out', () => {
    const gtag = jest.fn()
    window.gtag = gtag
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    updateGoogleConsent(ALL_ON, { adsDenied: false })

    const payload = updatePayload(gtag)
    expect(payload.ad_storage).toBe('denied')
    expect(payload.ad_user_data).toBe('denied')
    expect(payload.ad_personalization).toBe('denied')
  })

  it('an explicit adsDenied:false cannot override GPC', () => {
    // GPC is a universal opt-out signal that CA, CO and CT require the site
    // to honour. It is not a preference a caller may argue with.
    const gtag = jest.fn()
    window.gtag = gtag

    withGpc(() => updateGoogleConsent(ALL_ON, { adsDenied: false }))

    const payload = updatePayload(gtag)
    expect(payload.ad_storage).toBe('denied')
    expect(payload.ad_user_data).toBe('denied')
  })

  it('positive control: with no opt-out at all, the same call grants advertising', () => {
    // Without this the two cases above would also pass if the override had
    // simply been made inert, or if this build denied advertising outright.
    const gtag = jest.fn()
    window.gtag = gtag

    updateGoogleConsent(ALL_ON, { adsDenied: false })

    expect(updatePayload(gtag).ad_storage).toBe('granted')
  })

  it('the override can still ADD a denial storage cannot confirm', () => {
    // The override's actual job, kept under test: a caller that knows the
    // visitor opted out must be able to say so even when the read that would
    // have proved it throws.
    const gtag = jest.fn()
    window.gtag = gtag

    withStorageRefusing(() => updateGoogleConsent(ALL_ON, { adsDenied: true }))

    expect(updatePayload(gtag).ad_storage).toBe('denied')
  })

  it('an opt-out that storage refuses still holds for the rest of the session', () => {
    const gtag = jest.fn()
    window.gtag = gtag

    withStorageRefusing(() => setSaleShareOptOut(true))

    // Storage is working again and holds nothing: the write really was lost.
    expect(window.localStorage.getItem(SALE_SHARE_OPT_OUT_KEY)).toBeNull()
    // The opt-out is not.
    expect(hasSaleShareOptOut()).toBe(true)
  })

  it('and a later preference save in that session cannot re-grant advertising', () => {
    // This is the sequence that was reported: opt out in a private window,
    // then save preferences with marketing on. Before the session flag, the
    // second step granted ad_storage and reloaded the Meta Pixel.
    withStorageRefusing(() => setSaleShareOptOut(true))

    const gtag = jest.fn()
    window.gtag = gtag
    updateGoogleConsent(ALL_ON)

    const payload = updatePayload(gtag)
    expect(payload.ad_storage).toBe('denied')
    expect(payload.ad_user_data).toBe('denied')
    // Analytics is untouched. This is an opt-out of sale/sharing for
    // advertising, not a withdrawal of the analytics consent the visitor gave.
    expect(payload.analytics_storage).toBe('granted')
  })

  it('latches the opt-out the inline BOOTSTRAP observed, not only its own reads', () => {
    // The bootstrap reads storage and GPC itself, in the document <head>,
    // before this module exists -- so it was the one reader the latch could
    // not cover. Its read could succeed and deny advertising at default time,
    // storage could then start throwing, and this helper's catch answered
    // false: `applyConsent` passed `adsDenied: false`, `ad_storage` and
    // `ad_user_data` were re-granted, and the Meta loader ran, undoing a
    // denial already applied on the page. Reported by Copilot.
    //
    // Simulated the way it actually happens: the property is already on
    // `window` when this module's first read occurs, and storage is refusing.
    const w = window as Window & { __ffcSaleShareOptOut?: boolean }
    w[SALE_SHARE_OPT_OUT_GLOBAL as '__ffcSaleShareOptOut'] = true
    try {
      expect(withStorageRefusing(() => hasSaleShareOptOut())).toBe(true)

      const gtag = jest.fn()
      window.gtag = gtag
      withStorageRefusing(() => updateGoogleConsent(ALL_ON))
      expect(updatePayload(gtag).ad_storage).toBe('denied')
    } finally {
      Reflect.deleteProperty(w, SALE_SHARE_OPT_OUT_GLOBAL)
    }
  })

  it('a successful clear takes effect even when the bootstrap had published an opt-out', () => {
    // A defect in the fix that introduced the publication, and the reason it
    // slipped: in jsdom no bootstrap runs, so every other case here leaves the
    // property undefined and the stale-mirror path is never reached.
    //
    // The sequence is the ordinary one for a returning visitor who changes
    // their mind: the page loaded with a stored opt-out, so the bootstrap
    // published `true`; they then use the control to opt back in, the removal
    // succeeds, and the clear has to take effect on THIS page. Before this it
    // did not -- `sessionOptOut` went false and the next read re-latched
    // `true` from the stale publication, leaving the footer reading
    // "Advertising sharing is off".
    const w = window as Window & { __ffcSaleShareOptOut?: boolean }
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    w[SALE_SHARE_OPT_OUT_GLOBAL as '__ffcSaleShareOptOut'] = true
    try {
      expect(hasSaleShareOptOut()).toBe(true)

      const gtag = jest.fn()
      window.gtag = gtag
      setSaleShareOptOut(false, ALL_ON)

      expect(hasSaleShareOptOut()).toBe(false)
      expect(updatePayload(gtag).ad_storage).toBe('granted')
    } finally {
      Reflect.deleteProperty(w, SALE_SHARE_OPT_OUT_GLOBAL)
    }
  })

  it('but a clear cannot override GPC, whatever the mirror says', () => {
    // The guard on the case above. Clearing the mirror must not become a way
    // to defeat a universal opt-out signal the law requires honouring — GPC
    // is re-derived on every call, so it survives.
    const w = window as Window & { __ffcSaleShareOptOut?: boolean }
    w[SALE_SHARE_OPT_OUT_GLOBAL as '__ffcSaleShareOptOut'] = true
    try {
      withGpc(() => {
        setSaleShareOptOut(false, ALL_ON)
        expect(hasSaleShareOptOut()).toBe(true)
      })
    } finally {
      Reflect.deleteProperty(w, SALE_SHARE_OPT_OUT_GLOBAL)
    }
  })

  it('publishes false rather than nothing, so "saw no opt-out" differs from "never ran"', () => {
    // The positive control for the case above, and the reason the bootstrap
    // assigns unconditionally: a `false` must NOT be read as an opt-out, or
    // every visitor would be reported as opted out the moment the bootstrap
    // ran.
    const w = window as Window & { __ffcSaleShareOptOut?: boolean }
    w[SALE_SHARE_OPT_OUT_GLOBAL as '__ffcSaleShareOptOut'] = false
    try {
      expect(hasSaleShareOptOut()).toBe(false)
    } finally {
      Reflect.deleteProperty(w, SALE_SHARE_OPT_OUT_GLOBAL)
    }
  })

  it('emits the publication in the bootstrap it ships', () => {
    // The helper reading the property is half the fix; the bootstrap has to
    // write it. Asserted on the emitted script, which is what reaches the page.
    expect(CONSENT_MODE_BOOTSTRAP).toContain(`window.${SALE_SHARE_OPT_OUT_GLOBAL} = ffcAdsDenied`)
  })

  it('an opt-out once observed cannot be un-observed when storage starts failing', () => {
    // The reported divergence: separate call sites read this helper
    // independently -- the Consent Mode update, the dataLayer event, the
    // cookie deletion, the Meta loader -- and a read that began throwing
    // between two of them made them disagree in the direction that loses
    // protection. The latch makes every later read at least as restrictive as
    // every earlier one, which no amount of passing snapshots around would
    // guarantee for a call site nobody remembered.
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    expect(hasSaleShareOptOut()).toBe(true)
    expect(withStorageRefusing(() => hasSaleShareOptOut())).toBe(true)
  })

  it('positive control: a session that never saw an opt-out still reports false', () => {
    // Without this the latch would pass by reporting true for everyone the
    // moment storage misbehaved, which is a different wrong answer.
    expect(withStorageRefusing(() => hasSaleShareOptOut())).toBe(false)
  })

  it('a failed clear fails closed even when nothing had observed the opt-out yet', () => {
    // The case the first fix missed, and the one Copilot came back for. No
    // priming read here, so the latch is COLD: `sessionOptOut` is false, and
    // raising the denial only when opting OUT left a failed clear with nothing
    // to fall back on -- the helper's own read threw too, and advertising was
    // granted while the stored opt-out was still on the device.
    //
    // Deliberately asserts the payload rather than `hasSaleShareOptOut()`,
    // because the latter is true afterwards either way once storage recovers.
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    const gtag = jest.fn()
    window.gtag = gtag

    withStorageRefusing(() => setSaleShareOptOut(false, ALL_ON))

    const payload = updatePayload(gtag)
    expect(payload.ad_storage).toBe('denied')
    expect(payload.ad_user_data).toBe('denied')
    expect(payload.analytics_storage).toBe('granted')
  })

  it('a clear that storage refuses leaves the denial standing', () => {
    // The mirror of the case above, and the harder half to get right. The
    // visitor asks to opt back IN while `removeItem` throws: the stored
    // `ffc-sale-share-opt-out=true` is therefore still on their device, so the
    // honest reading of "I could not tell" is that they are still opted out.
    //
    // A single `sessionOptOut = optOut` before the write got this backwards.
    // It cleared the in-memory denial, the next read threw and answered false
    // from its catch, and `prefs.marketing` granted advertising to a visitor
    // whose opt-out was still recorded. Reported by Copilot, and the mirror
    // image of the bug the session flag was added to fix -- which is exactly
    // why one line looked like enough.
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    expect(hasSaleShareOptOut()).toBe(true)

    const gtag = jest.fn()
    window.gtag = gtag

    withStorageRefusing(() => setSaleShareOptOut(false, ALL_ON))

    const payload = updatePayload(gtag)
    expect(payload.ad_storage).toBe('denied')
    expect(payload.ad_user_data).toBe('denied')
    // The visitor's analytics choice is still honoured, as everywhere else.
    expect(payload.analytics_storage).toBe('granted')
  })

  it('positive control: a clear that SUCCEEDS does let advertising be granted', () => {
    // Without this the case above would also pass if clearing had simply been
    // made impossible, which would leave the control stuck for anyone who
    // changed their mind.
    window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    expect(hasSaleShareOptOut()).toBe(true)

    const gtag = jest.fn()
    window.gtag = gtag

    setSaleShareOptOut(false, ALL_ON)

    expect(updatePayload(gtag).ad_storage).toBe('granted')
  })

  it('opting back in clears the session flag when storage works', () => {
    // Otherwise the enforcement above would be a one-way door for the session,
    // and the control would be stuck reading "off" for a visitor who changed
    // their mind. A browser sending GPC is the one case that cannot be
    // cleared, and that is asserted above rather than here.
    withStorageRefusing(() => setSaleShareOptOut(true))
    expect(hasSaleShareOptOut()).toBe(true)

    setSaleShareOptOut(false)

    expect(hasSaleShareOptOut()).toBe(false)
  })
})
