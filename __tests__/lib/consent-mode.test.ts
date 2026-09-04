/**
 * Google Consent Mode v2 — a single global denial, and consent updates.
 *
 * The layout half of this contract (the bootstrap must be emitted in
 * <head> BEFORE the GTM component) is asserted in
 * __tests__/app/layout-consent-bootstrap.test.ts.
 */
import {
  CONSENT_WAIT_FOR_UPDATE_MS,
  CONSENT_MODE_BOOTSTRAP,
  updateGoogleConsent,
} from '../../src/lib/consent-mode'
import { isConfigured } from '../../src/lib/analytics.config'

describe('CONSENT_MODE_BOOTSTRAP', () => {
  it('denies storage in a SINGLE unscoped default call', () => {
    // The whole point of the change: one default, applying to everyone.
    // A second call, or a region parameter, would reintroduce a class of
    // visitor who is measured before consenting.
    const defaultCalls = CONSENT_MODE_BOOTSTRAP.split("gtag('consent', 'default'").length - 1
    expect(defaultCalls).toBe(1)
    expect(CONSENT_MODE_BOOTSTRAP).toContain("'analytics_storage': 'denied'")
  })

  it('grants storage to nobody by default, in any region', () => {
    // Asserted as an absence because that is exactly the regression risk:
    // reinstating a permissive default is a one-line edit, and every other
    // case here would still pass.
    expect(CONSENT_MODE_BOOTSTRAP).not.toContain("'analytics_storage': 'granted'")
    expect(CONSENT_MODE_BOOTSTRAP).not.toContain("'ad_storage': 'granted'")
    expect(CONSENT_MODE_BOOTSTRAP).not.toContain("'region'")
  })

  it('denies every ad signal, not just analytics', () => {
    for (const signal of ['ad_storage', 'ad_user_data', 'ad_personalization']) {
      expect(CONSENT_MODE_BOOTSTRAP).toContain(`'${signal}': 'denied'`)
    }
    // functionality/security stay granted — they carry no tracking and the
    // banner itself depends on functionality storage.
    expect(CONSENT_MODE_BOOTSTRAP).toContain("'functionality_storage': 'granted'")
    expect(CONSENT_MODE_BOOTSTRAP).toContain("'security_storage': 'granted'")
  })

  it('holds tags with wait_for_update on the one default call', () => {
    expect(CONSENT_WAIT_FOR_UPDATE_MS).toBe(500)
    const occurrences =
      CONSENT_MODE_BOOTSTRAP.split(`'wait_for_update': ${CONSENT_WAIT_FOR_UPDATE_MS}`).length - 1
    expect(occurrences).toBe(1)
  })

  it('sets url_passthrough and ads_data_redaction', () => {
    expect(CONSENT_MODE_BOOTSTRAP).toContain("gtag('set', 'url_passthrough', true);")
    expect(CONSENT_MODE_BOOTSTRAP).toContain("gtag('set', 'ads_data_redaction', true);")
  })

  it('installs gtag as a function declaration so later callers share the queue', () => {
    expect(CONSENT_MODE_BOOTSTRAP).toContain('function gtag(){dataLayer.push(arguments);}')
    expect(CONSENT_MODE_BOOTSTRAP).toContain('window.dataLayer = window.dataLayer || [];')
  })
})

describe('updateGoogleConsent', () => {
  afterEach(() => {
    delete window.gtag
  })

  it('is a no-op when gtag is not installed', () => {
    delete window.gtag
    expect(() =>
      updateGoogleConsent({ necessary: true, functional: true, analytics: true, marketing: true })
    ).not.toThrow()
  })

  it('maps analytics → analytics_storage and marketing → ad/personalization storage', () => {
    const gtag = jest.fn()
    window.gtag = gtag
    updateGoogleConsent({ necessary: true, functional: true, analytics: true, marketing: false })
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    })
  })

  it('denies analytics_storage on decline while keeping security_storage granted', () => {
    const gtag = jest.fn()
    window.gtag = gtag
    updateGoogleConsent({ necessary: true, functional: true, analytics: false, marketing: false })
    const payload = gtag.mock.calls[0][2]
    expect(payload.analytics_storage).toBe('denied')
    expect(payload.security_storage).toBe('granted')
  })
})

describe('isConfigured (placeholder guard)', () => {
  it('treats the shipped placeholders as unset', () => {
    expect(isConfigured('G-XXXXXXXXXX')).toBe(false) // GA4 placeholder
    expect(isConfigured('XXXXXXXXXXXXXXX')).toBe(false) // Meta Pixel placeholder
    expect(isConfigured('XXXXXXXXXX')).toBe(false) // Clarity placeholder
    expect(isConfigured('')).toBe(false)
    expect(isConfigured('   ')).toBe(false) // whitespace-only is unset
    expect(isConfigured(' G-XXXXXXXXXX ')).toBe(false) // placeholder with stray spaces
  })

  it('accepts real-looking IDs', () => {
    expect(isConfigured('G-ABC1234567')).toBe(true)
    expect(isConfigured('GTM-TQ5H8HPR')).toBe(true)
    expect(isConfigured('123456789012345')).toBe(true)
    expect(isConfigured('abcdefghij')).toBe(true)
  })
})
