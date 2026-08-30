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
