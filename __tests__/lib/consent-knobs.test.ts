/**
 * @jest-environment jsdom
 */

/**
 * The `childDirected` and `adPersonalization` knobs, with each one ENABLED.
 *
 * Reported by Copilot as a coverage gap, and it was right: the shipped config
 * sets both `false`, so every other assertion in this repo covers only the
 * default-off branch. A regression deleting the COPPA lock, or granting
 * `ad_personalization` unconditionally, would have stayed green -- and
 * `childDirected` is the knob whose own documentation makes a legal promise,
 * which is the worst possible place to have an untested branch.
 *
 * The knobs are read at MODULE SCOPE, so each case re-imports the consent
 * library inside `jest.isolateModules` with the config mocked. `resetModules`
 * is safe here in a way it is not in the component suites: nothing in this
 * file touches React, so resetting the registry cannot strip its hooks.
 */

type ConsentModule = typeof import('../../src/lib/consent-mode')

/** The config module as this repo shapes it: one `analyticsConfig` object. */
function mockConfig(childDirected: boolean, adPersonalization: boolean) {
  jest.doMock('../../src/lib/analytics.config', () => {
    const actual = jest.requireActual('../../src/lib/analytics.config')
    return {
      ...actual,
      analyticsConfig: { ...actual.analyticsConfig, childDirected, adPersonalization },
    }
  })
}

/** Load the consent library fresh with the knobs set as given. */
function withKnobs(
  childDirected: boolean,
  adPersonalization: boolean,
  fn: (mod: ConsentModule) => void
): void {
  jest.resetModules()
  mockConfig(childDirected, adPersonalization)
  jest.isolateModules(() => {
    fn(require('../../src/lib/consent-mode') as ConsentModule)
  })
  jest.dontMock('../../src/lib/analytics.config')
  jest.resetModules()
}

const ALL_ON = { necessary: true, functional: true, analytics: true, marketing: true }

/** The payload of the single `consent` `update` call the module pushes. */
function updatePayload(mod: ConsentModule): Record<string, string> {
  const gtag = jest.fn()
  window.gtag = gtag
  try {
    mod.updateGoogleConsent(ALL_ON)
    const calls = gtag.mock.calls as Array<[string, string, Record<string, string>]>
    const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update')
    expect(updates).toHaveLength(1)
    return updates[0][2]
  } finally {
    window.gtag = undefined
  }
}

describe('childDirected: true -- the COPPA lock', () => {
  it('reports every visitor as opted out of sale/sharing, with nothing stored', () => {
    // No stored flag, no GPC. The lock does not depend on the visitor doing
    // anything, which is the point: a child's "accept" is not a valid basis,
    // so there is no consent to collect.
    withKnobs(true, false, (mod) => {
      window.localStorage.clear()
      expect(mod.hasSaleShareOptOut()).toBe(true)
    })
  })

  it('denies every advertising signal even for a visitor who accepted marketing', () => {
    withKnobs(true, false, (mod) => {
      const payload = updatePayload(mod)
      expect(payload.ad_storage).toBe('denied')
      expect(payload.ad_user_data).toBe('denied')
      expect(payload.ad_personalization).toBe('denied')
      expect(payload.personalization_storage).toBe('denied')
      // Analytics is untouched. COPPA is about advertising to children, not
      // about whether the charity may count its own pageviews.
      expect(payload.analytics_storage).toBe('granted')
    })
  })

  it('starts the inline bootstrap with advertising already denied', () => {
    // The bootstrap runs before any tag, so the lock has to be in the emitted
    // script and not only in the later update.
    withKnobs(true, false, (mod) => {
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain('var ffcAdsDenied = true')
    })
  })

  it('OVERRIDES adPersonalization even when that knob is also true', () => {
    // Both knobs on. The lock wins, because this is not the site's choice to
    // make. `AD_PERSONALIZATION && !CHILD_DIRECTED` is that rule, and without
    // this case the `&& !CHILD_DIRECTED` half has no test at all.
    withKnobs(true, true, (mod) => {
      expect(updatePayload(mod).ad_personalization).toBe('denied')
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain('var ffcAdsDenied = true')

      // And the bootstrap denies it UNCONDITIONALLY, in the emitted text,
      // rather than conditionally on `ffcAdsDenied` happening to be true.
      //
      // This assertion is what makes `&& !CHILD_DIRECTED` load-bearing. A
      // mutation removing that clause was detected by nothing at first,
      // because the knob denies advertising by three other routes
      // (`ffcAdsDenied`, the opt-out report, and `marketing` in the update),
      // so every behavioural assertion still passed. The difference it does
      // make is this one: with the lock a child-directed site emits a literal
      // denial that nothing downstream can flip, and without it the signal
      // rides on one variable staying true. For a COPPA guarantee the
      // unconditional form is the one worth holding.
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain("'ad_personalization': 'denied'")
      expect(mod.CONSENT_MODE_BOOTSTRAP).not.toContain("'ad_personalization': ffcAdsDenied")
    })
  })
})

describe('adPersonalization: true -- personalised advertising deliberately enabled', () => {
  it('grants ad_personalization for a visitor who accepted marketing', () => {
    withKnobs(false, true, (mod) => {
      const payload = updatePayload(mod)
      expect(payload.ad_personalization).toBe('granted')
      expect(payload.personalization_storage).toBe('granted')
    })
  })

  it('still denies it for a visitor who did NOT accept marketing', () => {
    // The knob enables the signal; it does not grant it without consent.
    withKnobs(false, true, (mod) => {
      const gtag = jest.fn()
      window.gtag = gtag
      try {
        mod.updateGoogleConsent({
          necessary: true,
          functional: true,
          analytics: true,
          marketing: false,
        })
        const calls = gtag.mock.calls as Array<[string, string, Record<string, string>]>
        expect(calls[0][2].ad_personalization).toBe('denied')
      } finally {
        window.gtag = undefined
      }
    })
  })

  it('makes the bootstrap default conditional rather than flatly denied', () => {
    withKnobs(false, true, (mod) => {
      // Conditional on the opt-out read the bootstrap performs, not hardcoded.
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain(
        "'ad_personalization': ffcAdsDenied ? 'denied' : 'granted'"
      )
    })
  })
})

describe('both knobs off -- the shipped default, as a positive control', () => {
  it('denies ad_personalization and does NOT report an opt-out', () => {
    // Without this the cases above could pass on a build that denied
    // everything always, or reported every visitor as opted out.
    withKnobs(false, false, (mod) => {
      window.localStorage.clear()
      expect(mod.hasSaleShareOptOut()).toBe(false)

      const payload = updatePayload(mod)
      expect(payload.ad_storage).toBe('granted')
      expect(payload.ad_user_data).toBe('granted')
      expect(payload.ad_personalization).toBe('denied')
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain('var ffcAdsDenied = false')
      expect(mod.CONSENT_MODE_BOOTSTRAP).toContain("'ad_personalization': 'denied'")
    })
  })
})
