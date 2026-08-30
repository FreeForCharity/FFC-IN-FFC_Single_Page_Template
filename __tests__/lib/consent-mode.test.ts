/**
 * Google Consent Mode v2 — regional defaults and consent updates.
 *
 * The layout half of this contract (the bootstrap must be emitted in
 * <head> BEFORE the GTM component) is asserted in
 * __tests__/app/layout-consent-bootstrap.test.ts.
 */
import {
  EU_CONSENT_REGIONS,
  CONSENT_WAIT_FOR_UPDATE_MS,
  CONSENT_MODE_BOOTSTRAP,
  updateGoogleConsent,
} from '../../src/lib/consent-mode'
import { isConfigured } from '../../src/lib/analytics.config'

describe('EU_CONSENT_REGIONS', () => {
  it('contains exactly the 32 codes Google’s EU User Consent Policy covers', () => {
    // 27 EU member states + IS/LI/NO (non-EU EEA) + GB + CH
    expect(EU_CONSENT_REGIONS).toHaveLength(32)
    const expected = [
      'AT',
      'BE',
      'BG',
      'HR',
      'CY',
      'CZ',
      'DK',
      'EE',
      'FI',
      'FR',
      'DE',
      'GR',
      'HU',
      'IE',
      'IT',
      'LV',
      'LT',
      'LU',
      'MT',
      'NL',
      'PL',
      'PT',
      'RO',
      'SK',
      'SI',
      'ES',
      'SE',
      'IS',
      'LI',
      'NO',
      'GB',
      'CH',
    ]
    expect([...EU_CONSENT_REGIONS]).toEqual(expected)
    // No duplicates
    expect(new Set(EU_CONSENT_REGIONS).size).toBe(32)
  })
})

describe('CONSENT_MODE_BOOTSTRAP', () => {
  it('emits the region-scoped denial BEFORE the unscoped grant', () => {
    const denialIndex = CONSENT_MODE_BOOTSTRAP.indexOf("'analytics_storage': 'denied'")
    const grantIndex = CONSENT_MODE_BOOTSTRAP.indexOf("'analytics_storage': 'granted'")
    expect(denialIndex).toBeGreaterThan(-1)
    expect(grantIndex).toBeGreaterThan(-1)
    expect(denialIndex).toBeLessThan(grantIndex)
  })

  it('scopes the denial to the full 32-code region array', () => {
    expect(CONSENT_MODE_BOOTSTRAP).toContain(`'region': ${JSON.stringify([...EU_CONSENT_REGIONS])}`)
    // The region parameter must be attached to the DENIAL call, i.e. appear
    // before the granted defaults begin.
    const regionIndex = CONSENT_MODE_BOOTSTRAP.indexOf("'region'")
    const grantIndex = CONSENT_MODE_BOOTSTRAP.indexOf("'analytics_storage': 'granted'")
    expect(regionIndex).toBeLessThan(grantIndex)
  })

  it('holds tags with wait_for_update so a stored EEA choice lands first', () => {
    expect(CONSENT_WAIT_FOR_UPDATE_MS).toBe(500)
    expect(CONSENT_MODE_BOOTSTRAP).toContain(`'wait_for_update': ${CONSENT_WAIT_FOR_UPDATE_MS}`)
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
  })

  it('accepts real-looking IDs', () => {
    expect(isConfigured('G-ABC1234567')).toBe(true)
    expect(isConfigured('GTM-TQ5H8HPR')).toBe(true)
    expect(isConfigured('123456789012345')).toBe(true)
    expect(isConfigured('abcdefghij')).toBe(true)
  })
})
