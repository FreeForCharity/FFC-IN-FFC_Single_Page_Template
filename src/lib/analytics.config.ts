// Analytics & tracking IDs — the single place to change them.
//
// These are NOT secrets. They are public, client-side identifiers that get
// baked into the static export and are visible in the page source anyway. They
// live here (rather than hardcoded inside components or read from environment
// variables) so a forking charity — or an automated assistant — can point the
// site at its own accounts by editing this one file.
//
// To use your own accounts, replace the placeholder values below with the IDs
// from each provider's dashboard. Leave a value as its placeholder to keep that
// integration effectively inert.
export const analyticsConfig = {
  // Google Tag Manager container ID, e.g. 'GTM-ABC1234'. GTM is the umbrella
  // that can load the others, so this is the main one most sites set.
  gtmId: 'GTM-TQ5H8HPR',

  // Google Analytics 4 measurement ID, e.g. 'G-ABC1234567'.
  gaMeasurementId: 'G-XXXXXXXXXX',

  // Meta (Facebook) Pixel ID.
  metaPixelId: 'XXXXXXXXXXXXXXX',

  // Microsoft Clarity project ID.
  clarityProjectId: 'XXXXXXXXXX',

  // --- Advertising policy. Not IDs: these change what this site is allowed
  // --- to do, and they carry legal consequences. Read before editing.

  // TRUE when this site's audience is children — a preschool, a youth
  // league, a children's programme. Denies every advertising signal for
  // every visitor, everywhere, regardless of region or consent. COPPA and
  // Google's own policies do not permit ad personalisation on child-directed
  // properties, and a child's "accept" is not a valid legal basis. Analytics
  // is unaffected. When in doubt set it TRUE: the cost is remarketing a
  // child-directed site cannot lawfully use anyway.
  childDirected: false as boolean,

  // TRUE only when this site deliberately runs PERSONALISED advertising —
  // remarketing, audience targeting, Display. Google Ad Grants accounts
  // CANNOT do any of that (Grants are search-only), so a Grant-funded site
  // should leave this FALSE: it buys nothing, and ad_personalization is the
  // signal that most squarely enables cross-context behavioural advertising
  // under California, Colorado and Connecticut law. Ad Grants conversion
  // tracking does NOT need it — that runs on ad_storage and ad_user_data,
  // which stay granted outside the EEA/UK/CH.
  adPersonalization: false as boolean,
} as const

/**
 * True when an ID has been replaced with a real value.
 *
 * The promise above — "leave a value as its placeholder to keep that
 * integration effectively inert" — is enforced by the loaders calling this
 * helper. A value is treated as unset when it is falsy, whitespace-only,
 * or still ends in a run of placeholder X's (`G-XXXXXXXXXX`,
 * `XXXXXXXXXXXXXXX`, `XXXXXXXXXX`). No real Google/Meta/Clarity ID ends
 * in six or more literal X's.
 */
export function isConfigured(id: string): boolean {
  const trimmed = id ? id.trim() : ''
  return Boolean(trimmed) && !/X{6,}$/.test(trimmed)
}
