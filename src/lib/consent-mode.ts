// Google Consent Mode v2 defaults.
//
// Policy: every storage type that carries measurement or personalisation is
// DENIED by default for every visitor, worldwide, until they opt in. There is
// no regional carve-out and no permissive default.
//
// Precisely, because the precision is the whole point of this block:
// analytics_storage, ad_storage, ad_user_data, ad_personalization and
// personalization_storage all start denied. security_storage is granted and
// stays granted. functionality_storage is granted BY DEFAULT — a site that
// cannot remember a consent choice cannot honour one — and thereafter follows
// the visitor's own functional toggle through updateGoogleConsent, so it is
// not something that "stays" granted.
//
// This summary has been wrong twice, in opposite directions. It first read
// "storage is DENIED" flat, which over-claimed by ignoring the two granted
// types; correcting that to "analytics and advertising" under-claimed by
// dropping personalization_storage, and kept a "stays granted" the update
// call contradicts. Summarising a list is a claim about every item in it.
//
// Google's EU User Consent Policy only *requires* opt-in for the EEA, the
// UK and Switzerland, but applying that treatment selectively would mean
// FFC deciding, on a charity's behalf, that its other visitors get weaker
// protection. Each charity is the controller for its own site, so the
// stricter setting is the one FFC applies everywhere; a charity that wants
// something else can choose it deliberately.
//
// What this means at runtime. The Google tags still LOAD on every visit —
// what is withheld is permission to use storage:
//
//   - Before consent, anywhere → analytics_storage and every ad signal are
//                                denied. GA4 sends COOKIELESS pings, so
//                                pageviews are modeled in aggregate rather
//                                than lost, and no identifier is set or
//                                read.
//   - After an explicit accept → `consent update` flips storage to
//                                granted and normal cookie-based
//                                measurement begins.
//
// Note what this is NOT: it is not "no requests to Google until consent".
// The tags load and ping cookielessly in the denied state. That is Google's
// documented denied-state behaviour and the reason Consent Mode preserves
// aggregate measurement at all. A site that wants zero contact with Google
// before consent has to not load the tag, which is a different design.
//
// NON-Google scripts do not speak Consent Mode, so they are gated the only
// way they can be: Microsoft Clarity loads only on an explicit analytics
// grant and the Meta Pixel only on an explicit marketing grant.
// See src/components/cookie-consent/index.tsx.
//
// `wait_for_update` holds tags briefly so a returning visitor's stored
// choice is applied before the first hit fires, instead of the hit going
// out as denied and the consent arriving a beat too late.

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
 * Emitted into <head> in the root layout, ahead of <GoogleTagManager />.
 *
 * ONE `consent default` call, unscoped, denying storage. Earlier revisions
 * emitted a second unscoped call granting storage, with the denial scoped
 * to a `region` array — that is the shape Google documents for a
 * permissive-outside-the-EEA policy. Both the region array and the grant
 * are gone: a single unscoped denial applies to everyone, and there is no
 * longer any region for Google to resolve from the visitor's IP.
 *
 * `url_passthrough` keeps click ids (gclid/wbraid) flowing through
 * navigation while cookies are denied, and `ads_data_redaction` strips ad
 * identifiers from tag requests while `ad_storage` is denied. Under a
 * global denial both now matter on every visit rather than only in the
 * EEA.
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
 * choice exists. Since the default is now denied for everyone, this call
 * is the ONLY thing that ever grants storage — there is no region where
 * measurement starts without it. Declining is a no-op against the default
 * and simply keeps GA4 on cookieless pings.
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
