import { siteConfig, type SiteConfig } from '@/lib/site.config'

/**
 * Put `siteConfig` into a known identity for one test, independent of what the
 * checked-in config says.
 *
 * These tests run in two very different repos: the template itself (where
 * `siteConfig` is Free For Charity's own) and every charity site provisioned
 * from it (where provisioning has rewritten `name`, `ein`, `contactEmail`,
 * `phone` and `taxStatusLabel`). A test that reads its expectation from the
 * checked-in config only ever exercises ONE of those states, so each test says
 * which state it is about and sets it here instead.
 *
 * Mutates the shared config object — the established pattern in this suite
 * (see section-visibility.test.tsx) — so call `restoreSiteConfig()` in
 * `afterEach`.
 */

const ORIGINAL: SiteConfig = JSON.parse(JSON.stringify(siteConfig))

export function restoreSiteConfig(): void {
  // Drop keys a test added that the checked-in config does not have (e.g. an
  // optional `pending` list), then restore every original value.
  for (const key of Object.keys(siteConfig) as (keyof SiteConfig)[]) {
    if (!(key in ORIGINAL)) delete (siteConfig as Partial<SiteConfig>)[key]
  }
  Object.assign(siteConfig, JSON.parse(JSON.stringify(ORIGINAL)))
}

/**
 * Every footer `PendingField` pending at once (all but `team`, which lives in
 * src/data/team and is exercised with a mocked data module), each with the
 * EMPTY value the pending contract requires. The template itself sets no
 * `pending`, so tests that exercise the placeholders put the config into this
 * state and `restoreSiteConfig()` afterwards.
 */
export function withFooterFieldsPending(): void {
  Object.assign(siteConfig, {
    contactEmail: '',
    phone: { display: '', tel: '' },
    addresses: [],
    ein: '',
    guidestar: { profileUrl: '', directProfileUrl: '' },
    social: siteConfig.social.map((s) => ({ ...s, href: '' })),
    donationUrl: '',
    volunteerUrl: '',
    pending: [
      'email',
      'phone',
      'address',
      'ein',
      'guidestar',
      'social',
      'donationUrl',
      'volunteerUrl',
    ],
  } satisfies Partial<SiteConfig>)
}

/** The supporting organization's own site: the template as shipped. */
export function asSupporterSite(): void {
  siteConfig.name = siteConfig.supportedBy.name
}

/** A provisioned charity's identity. Every value is deliberately not FFC's. */
export const CHARITY: Partial<SiteConfig> = {
  name: 'Riverbend Test Pantry',
  description:
    'Riverbend Test Pantry distributes fresh groceries to families across the county every week.',
  shortDescription: 'Fresh groceries for families across the county.',
  url: 'https://riverbend-pantry.example',
  contactEmail: 'hello@riverbend-pantry.example',
  ein: '12-3456789',
  phone: { display: '(555) 010-0101', tel: '15550100101' },
  taxStatusLabel: 'a US 501c3 Non Profit',
}

/** A charity site; `overrides` layer on top of `CHARITY`. */
export function asCharitySite(overrides: Partial<SiteConfig> = {}): void {
  Object.assign(siteConfig, JSON.parse(JSON.stringify(CHARITY)), overrides)
}

/**
 * Free For Charity's identity, as scripts/check-drift.mjs defines it. A charity
 * site must render none of these in its own pages.
 */
export const FFC_IDENTITY: RegExp[] = [
  /Free For Charity|Free for Charity/,
  /freeforcharity\.org/i,
  /46-?2471893/,
  /520[\s.-]?222[\s.-]?8104/,
]
