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
