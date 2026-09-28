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

import { analyticsConfig } from '@/lib/analytics.config'

/**
 * localStorage key holding the visitor's "Do Not Sell or Share" choice.
 *
 * Read SYNCHRONOUSLY by the bootstrap, so a returning visitor who opted out
 * has advertising denied at `consent default` time — before any tag
 * evaluates consent — rather than a beat later via `consent update`.
 *
 * Deliberately SEPARATE from the cookie-banner preferences. This is a
 * statutory right under California, Colorado and Connecticut law, and it
 * must survive a visitor who otherwise accepts everything.
 */
export const SALE_SHARE_OPT_OUT_KEY = 'ffc-sale-share-opt-out'

/** True when this site must never grant advertising signals. */
const CHILD_DIRECTED = analyticsConfig.childDirected === true

/** True when this site deliberately runs personalised (non-Grant) ads. */
const AD_PERSONALIZATION = analyticsConfig.adPersonalization === true && !CHILD_DIRECTED

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
 * DELIBERATE DEVIATION from the freeforcharity reference: here the
 * UNSCOPED grant also carries `wait_for_update`. In this template GTM
 * loads unconditionally from the root layout (not behind the consent
 * component), so without the wait a returning NON-EEA visitor's stored
 * decline could lose the race — GTM initializing under the granted
 * default before React hydrates and the stored choice's consent update
 * lands. The wait gives the restore a window on both defaults.
 *
 * Declared as a function declaration so `gtag` lands on `window` and every
 * later caller (the GA4 loader, the consent banner) shares one queue.
 */
export const CONSENT_MODE_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var ffcAdsDenied = ${CHILD_DIRECTED ? 'true' : 'false'};
try {
  if (navigator.globalPrivacyControl === true) ffcAdsDenied = true;
  if (localStorage.getItem(${JSON.stringify(SALE_SHARE_OPT_OUT_KEY)}) === 'true') ffcAdsDenied = true;
} catch (e) {}
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
  'ad_storage': ffcAdsDenied ? 'denied' : 'granted',
  'ad_user_data': ffcAdsDenied ? 'denied' : 'granted',
  'ad_personalization': ${AD_PERSONALIZATION ? "ffcAdsDenied ? 'denied' : 'granted'" : "'denied'"},
  'analytics_storage': 'granted',
  'functionality_storage': 'granted',
  'personalization_storage': ${AD_PERSONALIZATION ? "ffcAdsDenied ? 'denied' : 'granted'" : "'denied'"},
  'security_storage': 'granted',
  'wait_for_update': ${CONSENT_WAIT_FOR_UPDATE_MS}
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

  const optedOut = hasSaleShareOptOut()
  const analytics = prefs.analytics ? 'granted' : 'denied'
  const marketing = prefs.marketing && !optedOut ? 'granted' : 'denied'
  const personalization = marketing === 'granted' && AD_PERSONALIZATION ? 'granted' : 'denied'

  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: personalization,
    personalization_storage: personalization,
    functionality_storage: prefs.functional ? 'granted' : 'denied',
    security_storage: 'granted',
  })
}

/**
 * Whether this visitor has exercised a statutory opt-out of sale/sharing —
 * by sending a universal opt-out signal (GPC), by using this site's own
 * control, or because the site is child-directed and can never share.
 *
 * Safe on the server and in a private window where storage throws.
 */
export function hasSaleShareOptOut(): boolean {
  if (CHILD_DIRECTED) return true
  if (typeof window === 'undefined') return false
  try {
    const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean }
    if (nav.globalPrivacyControl === true) return true
    return window.localStorage.getItem(SALE_SHARE_OPT_OUT_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Record (or clear) the visitor's "Do Not Sell or Share" choice and apply it
 * to the live tags immediately.
 *
 * Clearing removes only this site's stored flag. A browser sending GPC stays
 * opted out, because the site may not override a signal the law requires it
 * to honour — so `hasSaleShareOptOut()` can still report true after a call
 * with `false`. That is correct, not a bug, and the UI should reflect it
 * rather than showing the control as "off".
 */
export function setSaleShareOptOut(optOut: boolean, prefs?: ConsentPreferences): void {
  if (typeof window === 'undefined') return
  try {
    if (optOut) window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    else window.localStorage.removeItem(SALE_SHARE_OPT_OUT_KEY)
  } catch {
    // A private window that refuses storage still gets the live update below;
    // the choice simply will not survive the session.
  }
  if (prefs) {
    updateGoogleConsent(prefs)
    return
  }
  if (typeof window.gtag !== 'function') return
  const value = hasSaleShareOptOut() ? 'denied' : AD_PERSONALIZATION ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    ad_storage: hasSaleShareOptOut() ? 'denied' : 'granted',
    ad_user_data: hasSaleShareOptOut() ? 'denied' : 'granted',
    ad_personalization: value,
    personalization_storage: value,
  })
}
