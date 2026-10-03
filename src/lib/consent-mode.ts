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

/**
 * Window event dispatched when the visitor opts out of sale/sharing.
 *
 * Consent Mode only governs GOOGLE tags. The Meta Pixel does not speak it, so
 * denying `ad_storage` does nothing to a Pixel that is already running or to
 * the cookies it has already set — and the footer control would be claiming
 * "advertising sharing is off" while Meta kept receiving PageView data.
 *
 * This event is how the opt-out reaches the non-Google tags. The cookie-consent
 * component listens for it and expires the Pixel's cookies using the same
 * domain-candidate helper it uses everywhere else; duplicating that logic in
 * this module is exactly the divergence that the shared `scriptString` fix
 * existed to prevent.
 *
 * What it cannot do, stated plainly because the policy text depends on it: a
 * Pixel already executing in the current page cannot be unloaded. The opt-out
 * expires its cookies and stops it loading on any later page, which is the
 * most a client-side control can honestly offer.
 */
export const SALE_SHARE_OPT_OUT_EVENT = 'ffc:sale-share-opt-out'

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
export function updateGoogleConsent(
  prefs: ConsentPreferences,
  opts?: { adsDenied?: boolean }
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  // `adsDenied` lets a caller that ALREADY KNOWS the opt-out state say so,
  // instead of this function re-deriving it from storage.
  //
  // That re-read was a real hole. `setSaleShareOptOut(true, prefs)` wrote the
  // flag, and if the write threw — a private window — delegated here, where
  // `hasSaleShareOptOut()` read storage, threw, and its catch reported false.
  // A `prefs.marketing === true` then GRANTED advertising, silently discarding
  // the opt-out argument that was the whole point of the call.
  //
  // This is the same defect that was already fixed in the no-prefs branch of
  // setSaleShareOptOut, surviving in the prefs branch: the invariant was
  // stated in one layer and violated in the next, which is why the suite went
  // green over it. Reported by Copilot on Footer_Only_Template#140.
  //
  // `=== true || ` and NOT `??`: the override may only ever ADD a denial.
  // With `??`, an explicit `{ adsDenied: false }` replaced the enforced
  // state outright and GRANTED advertising on a child-directed site or to a
  // visitor sending GPC -- the two cases that are not the visitor's to waive
  // and not a caller's either. An override added to stop an opt-out being
  // lost could be used to lose one, which is the opposite of its purpose.
  const optedOut = opts?.adsDenied === true || hasSaleShareOptOut()
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
 * In-memory mirror of the opt-out, for this page's lifetime.
 *
 * `localStorage` is the record, but it is not always available: some privacy
 * modes throw on both read and write. Before this existed, an opt-out made in
 * such a session was applied to the live tags and then immediately forgotten,
 * because every later check re-read the storage that had refused the write --
 * so the next preference save re-granted advertising, the Meta loader ran
 * again, and the footer control rendered as though the visitor had never
 * clicked it.
 *
 * It is module state, so it resets on navigation. That is not a workaround for
 * storage: with storage unavailable the choice genuinely cannot survive a page
 * load, and the privacy and cookie policies say so rather than promising more.
 * What this guarantees is narrower and worth having on its own -- within the
 * session where the visitor exercised the right, nothing silently undoes it.
 */
let sessionOptOut = false

/**
 * Whether this visitor has exercised a statutory opt-out of sale/sharing —
 * by sending a universal opt-out signal (GPC), by using this site's own
 * control, or because the site is child-directed and can never share.
 *
 * Safe on the server and in a private window where storage throws.
 */
export function hasSaleShareOptOut(): boolean {
  if (CHILD_DIRECTED) return true
  // The in-memory flag is consulted BEFORE storage, and deliberately cannot be
  // cleared by a storage failure. Without it an opt-out made in a private
  // window held only until the next call: the write threw, nothing recorded
  // the choice, this read reported false, and the next preference save granted
  // advertising again while the footer control went back to reading "opt in".
  if (sessionOptOut) return true
  if (typeof window === 'undefined') return false
  try {
    const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean }
    // Not latched, deliberately. GPC is read from `navigator`, which cannot
    // throw and does not stop being set mid-session, so a latch here would be
    // state with no reachable effect -- a mutation removing it is detected by
    // nothing, because there is nothing to detect. The latch below exists for
    // storage, which really does start failing.
    if (nav.globalPrivacyControl === true) return true
    const stored = window.localStorage.getItem(SALE_SHARE_OPT_OUT_KEY) === 'true'
    // LATCH. An opt-out that has been observed once cannot be un-observed for
    // the rest of this session, even if the storage it came from starts
    // throwing. Callers read this helper independently -- the Consent Mode
    // update, the dataLayer event, the cookie deletion, the Meta loader -- and
    // without the latch a read that began failing between two of them made
    // them disagree in the direction that loses protection: advertising
    // correctly reported as denied, and the Pixel's cookies left in place
    // because the second read answered false from its catch.
    //
    // Monotone by construction, which is the point: it holds for call sites
    // nobody remembered to thread a snapshot through. Only an explicit
    // `setSaleShareOptOut(false)` clears it, because only the visitor may.
    if (stored) sessionOptOut = true
    return stored
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
  // BOTH DIRECTIONS FAIL CLOSED, and that is why these are not one
  // assignment.
  //
  // Opting OUT raises the in-memory denial BEFORE the write that can throw:
  // enforcement for the rest of this session must not depend on persistence
  // succeeding. A storage failure may cost the choice its survival across
  // navigation -- the honest limit of a client-side control, and what the
  // policy text states -- but it may not cost it effect here and now.
  //
  // Opting back IN lowers it only AFTER a removal that actually succeeded. A
  // single `sessionOptOut = optOut` before the write got this backwards: with
  // `ffc-sale-share-opt-out=true` still on the device and `removeItem`
  // throwing, it cleared the denial in memory while the stored opt-out
  // remained, and the next read threw, answered false from its catch, and
  // granted advertising to a visitor whose opt-out was still recorded. The
  // mirror image of the bug the flag was added to fix, which is exactly why
  // one line looked like enough. Reported by Copilot.
  if (optOut) sessionOptOut = true
  try {
    if (optOut) window.localStorage.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')
    else {
      window.localStorage.removeItem(SALE_SHARE_OPT_OUT_KEY)
      sessionOptOut = false
    }
  } catch {
    // A private window that refuses storage still gets the live update below;
    // the choice simply will not survive the session. And a clear that failed
    // leaves the denial standing, on purpose: the stored opt-out may still be
    // there, and the safe reading of "I could not tell" is that it is.
  }
  // Tell the non-Google tags, which cannot hear a Consent Mode update.
  if (optOut) {
    try {
      window.dispatchEvent(new Event(SALE_SHARE_OPT_OUT_EVENT))
    } catch {
      // An environment without Event/dispatchEvent still gets the Google-side
      // denial below; losing the notification must not lose the opt-out.
    }
  }

  if (prefs) {
    // Pass the opt-out through explicitly rather than letting
    // updateGoogleConsent re-read storage. A caller that opted out while
    // storage was unavailable would otherwise have its argument discarded and
    // advertising granted from prefs.marketing.
    updateGoogleConsent(prefs, { adsDenied: optOut || hasSaleShareOptOut() })
    return
  }

  // WITHOUT prefs this path may only ever TIGHTEN, never grant.
  //
  // With no preferences passed there is no record of what the visitor chose
  // in the banner, so granting here would loosen advertising consent on no
  // evidence at all — including for an EEA/UK/CH visitor who never accepted
  // anything. An earlier revision did exactly that: clearing the flag pushed
  // ad_storage and ad_user_data to 'granted' unconditionally, overriding the
  // banner's marketing toggle. Today's only caller passes optOut=true, but
  // this is an exported API and the next caller is the problem.
  //
  // Clearing the opt-out therefore removes the stored flag and stops. The
  // visitor's real state is re-derived from the banner on the next
  // updateGoogleConsent, and from the bootstrap on the next page load, both
  // of which have the preferences this path lacks.
  if (!optOut) return
  if (typeof window.gtag !== 'function') return

  // Keyed on the `optOut` ARGUMENT, never on a re-read of stored state.
  //
  // An earlier revision gated this on `hasSaleShareOptOut()`. That helper
  // reads localStorage, and in a private window the read THROWS and its catch
  // reports false — so the deny was skipped and clicking "Do Not Sell or
  // Share" did nothing at all, in exactly the browsers whose users are most
  // likely to click it. The storage write above is allowed to fail silently;
  // the live denial is not, because it is the part that actually stops the
  // tags for this session.
  window.gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
  })
}
