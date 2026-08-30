// Google Consent Mode v2 defaults.
//
// Policy: the most permissive configuration Google's own rules allow.
//
// Google's EU User Consent Policy binds us as a Google Analytics / Ads
// customer, and it requires opt-IN consent before setting cookies or
// reading identifiers for visitors in the EEA, the UK, and Switzerland.
// Everywhere else, no such Google-imposed requirement exists, so storage
// defaults to GRANTED and measurement is complete from the first pageview.
//
// This is strictly MORE data than the previous model, where the GA4
// script did not load at all until a visitor clicked "Accept All" —
// every visitor who ignored the banner (the large majority) was invisible,
// worldwide. Under Consent Mode the Google tags always load; what changes
// by region is whether they may use cookies:
//
//   - Outside EEA/UK/CH  → granted immediately; full cookie-based
//                          measurement, no banner interaction needed.
//   - Inside EEA/UK/CH   → denied until the visitor accepts, but GA4 still
//                          sends COOKIELESS pings, so pageviews and events
//                          are modeled rather than lost. Accepting flips
//                          storage to granted via a `consent update`.
//
// Which default applies is determined by Google from the visitor's IP
// address — that is documented Consent Mode behavior for the `region`
// parameter, and the policy pages state it.
//
// NON-Google scripts do not speak Consent Mode, so they do NOT get the
// permissive default: Microsoft Clarity loads only on an explicit
// analytics grant and the Meta Pixel only on an explicit marketing grant,
// everywhere in the world. See src/components/cookie-consent/index.tsx.
//
// `wait_for_update` holds tags briefly so a returning EEA visitor's stored
// choice is applied before the first hit fires, instead of the hit going
// out as denied and the consent arriving a beat too late.

/**
 * ISO 3166 region codes where Google's EU User Consent Policy applies:
 * the 27 EU member states + the 3 non-EU EEA states (IS, LI, NO), plus
 * the UK (GB) and Switzerland (CH).
 */
export const EU_CONSENT_REGIONS = [
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
  // Non-EU EEA
  'IS',
  'LI',
  'NO',
  // UK + Switzerland
  'GB',
  'CH',
] as const

/**
 * Milliseconds tags wait for a `consent update` before firing with the
 * default state. 500ms is Google's documented starting point: long enough
 * for this site's synchronous localStorage read, short enough not to
 * meaningfully delay the first hit.
 */
export const CONSENT_WAIT_FOR_UPDATE_MS = 500

/**
 * The inline bootstrap that must execute BEFORE any Google tag loads.
 *
 * Emitted into <head> in the root layout, above <GoogleTagManager />. Two
 * `consent default` calls, in Google's documented order: the region-scoped
 * denial first, then the global grant. Region-specific settings always
 * take precedence over the unscoped one, so EEA/UK/CH visitors get
 * denied-by-default and everyone else gets granted-by-default.
 *
 * `url_passthrough` keeps click ids (gclid/wbraid) flowing through
 * navigation when cookies are denied, and `ads_data_redaction` strips ad
 * identifiers from tag requests while `ad_storage` is denied — both are
 * no-ops once consent is granted, so they cost nothing outside the EEA.
 *
 * Declared as a function declaration so `gtag` lands on `window` and every
 * later caller (the GA4 loader, the consent banner) shares one queue.
 */
export const CONSENT_MODE_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': ${CONSENT_WAIT_FOR_UPDATE_MS},
  'region': ${JSON.stringify([...EU_CONSENT_REGIONS])}
});
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted',
  'functionality_storage': 'granted',
  'personalization_storage': 'granted',
  'security_storage': 'granted'
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
`.trim()

/** The consent categories the cookie banner exposes. */
export interface ConsentPreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

declare global {
  interface Window {
    /** Installed by CONSENT_MODE_BOOTSTRAP (and re-declared harmlessly by
     *  the GA4 config snippet); every caller shares the one dataLayer. */
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Push a Consent Mode `update` reflecting the visitor's actual choice.
 *
 * This runs on every banner interaction AND on page load when a stored
 * choice exists. For an EEA/UK/CH visitor it is what lifts the regional
 * default from denied to granted; for everyone else it mostly re-affirms
 * the granted default, and only matters when they actively DECLINE — at
 * which point storage flips to denied and GA4 falls back to cookieless
 * pings rather than disappearing entirely.
 *
 * That last part is the substantive difference from the previous model:
 * declining used to mean zero measurement. Now a declining visitor is
 * still counted, just not identified across sessions — which is both more
 * data for the charity and unchanged in what it reveals about the
 * individual.
 */
export function updateGoogleConsent(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  const analytics = prefs.analytics ? 'granted' : 'denied'
  const marketing = prefs.marketing ? 'granted' : 'denied'

  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    personalization_storage: marketing,
    functionality_storage: prefs.functional ? 'granted' : 'denied',
    security_storage: 'granted',
  })
}
