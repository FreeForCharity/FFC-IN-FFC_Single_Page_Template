/**
 * Central site configuration for FFC template sites.
 *
 * EDIT THIS FILE to customize a new FFC-supported nonprofit site.
 * Most values that vary between sites flow from here so individual
 * pages, metadata, sitemap, robots, and security headers stay in sync.
 *
 * After editing, run `npm run check:drift` to verify nothing here drifts
 * away from FFC best practices (placeholder URLs left in, etc.).
 */

export type SiteSocialLink = {
  /** Display label, also used for aria-label. */
  label: string
  /** Absolute https URL. Empty string disables the link. */
  href: string
}

export type SiteAddress = {
  /** Heading shown above the address (e.g. "Main Address"). */
  label: string
  /** Address text, one entry per visual line. */
  lines: readonly string[]
  /** Google Maps (or other) link opened when the address is clicked. */
  mapUrl: string
}

/**
 * A footer-standard field the charity has not supplied yet. Listing a field in
 * `siteConfig.pending` renders a visible "awaiting information" placeholder in
 * its place (plain text, never a link), so a gap in the FFC footer standard is
 * a call to action on the page rather than a silent omission. The field's own
 * value must stay EMPTY while it is pending, so no placeholder or borrowed
 * value (e.g. the template's Free For Charity details) can ship behind it.
 *
 * An empty value that is NOT listed here keeps its plain meaning: the charity
 * has none (e.g. no public phone). `taxStatusLabel` is deliberately not a
 * pending field: it is a legal claim, and '' means "make no claim".
 *
 * What "empty" means per field: `email` → `contactEmail`; `phone` → both
 * `phone.display` and `phone.tel`; `address` → `addresses: []`; `ein` → `ein`;
 * `guidestar` → both `guidestar` URLs; `social` → every `social[].href`;
 * `team` → no member in src/data/team/*.json has a name; `donationUrl` /
 * `volunteerUrl` → that URL.
 */
export type PendingField =
  | 'email'
  | 'phone'
  | 'address'
  | 'ein'
  | 'guidestar'
  | 'social'
  | 'team'
  | 'donationUrl'
  | 'volunteerUrl'

/** Visible text shown in place of a pending field. */
export const PENDING_TEXT = 'Awaiting information from the charity'

export type SiteConfig = {
  /** Display name of the charity (used in titles, OG/Twitter cards). */
  name: string
  /** Short tagline used in the default title template. */
  tagline: string
  /** One-sentence mission statement (same key and meaning as the Footer-Only template). */
  mission: string
  /**
   * Absolute https URL of the charity's donation page (Zeffy, PayPal, a page
   * on this site, ...). The Donate section links to it; empty falls back to a
   * `mailto:` to `contactEmail`. See `donateHref()`. The supporting
   * organization's own site embeds `integrations.zeffyDonationUrl` instead.
   */
  donationUrl: string
  /**
   * Absolute https URL of the charity's volunteer sign-up page. Empty falls
   * back to a `mailto:` to `contactEmail`. See `volunteerHref()`.
   */
  volunteerUrl: string
  /** Plain-language description used for the <meta description> tag. */
  description: string
  /**
   * Shorter description tuned for OG/Twitter social card previews.
   * Falls back to `description` if empty. Aim for <= 200 chars and avoid
   * em-dashes — some card renderers break on them.
   */
  shortDescription: string
  /**
   * Canonical production URL with no trailing slash.
   * Used by metadataBase, sitemap, and robots. The drift check verifies that
   * this is updated whenever public/CNAME points to a custom domain, and
   * that public/.well-known/security.txt no longer carries the placeholder.
   */
  url: string
  /**
   * Twitter / X handle including the leading @ — e.g. `@freeforcharity`.
   * Empty string omits the twitter:site meta entirely. Handles without `@`
   * are auto-prefixed so a typo doesn't silently break attribution.
   */
  twitterHandle: string
  /**
   * Primary contact email. Used by your own pages; security.txt carries
   * its own `Contact:` line and is not auto-derived from this value.
   * Keep them in sync manually when you change either.
   */
  contactEmail: string
  /** SEO keywords used in the root layout metadata. */
  keywords: readonly string[]
  /** Default theme color (used by manifest and meta tag). */
  themeColor: string
  /** Where the vulnerability disclosure policy lives on this site. */
  vulnerabilityDisclosurePath: string
  /** Social links displayed in the footer. */
  social: readonly SiteSocialLink[]
  /** IRS Employer Identification Number (tax ID), in the form '12-3456789'. */
  ein: string
  /**
   * Year (or ISO date) the organization was founded, e.g. '2014'.
   * Emitted as schema.org `foundingDate`. Omit to skip it.
   */
  foundingDate?: string
  /**
   * schema.org nonprofit status URL, e.g. 'https://schema.org/Nonprofit501c3'.
   * FFC-supported sites are 501(c)(3) organizations; omit to skip it.
   */
  nonprofitStatus?: string
  /**
   * Other names the organization is known by (brands, abbreviations).
   * Emitted as schema.org `alternateName`. Omit to skip it.
   */
  alternateNames?: readonly string[]
  /**
   * Primary phone number. `display` is the human-readable form shown to users;
   * `tel` is the value used in the `tel:` link (digits, optionally E.164).
   */
  phone: { display: string; tel: string }
  /** Physical office addresses shown in the footer contact column. */
  addresses: readonly SiteAddress[]
  /** GuideStar / Candid transparency profile links shown in the footer. */
  guidestar: { profileUrl: string; directProfileUrl: string }
  /**
   * Permanent attribution to the supporting organization (FFC). Drives the
   * always-rendered "Supported by" clause in the footer bottom bar and the
   * "Supported Charity Login" quick link (`hubUrl`). This is part of the FFC
   * footer standard for every supported charity site: it is REQUIRED, always
   * rendered, and NOT to be removed or repointed when customizing a fork.
   * Distinct from `parentOrg` below, which covers genuine fiscal-sponsorship
   * ("a project of") relationships.
   */
  supportedBy: {
    name: string
    url: string
    hubUrl: string
    /**
     * The supporting organization's own legal contacts, published by its
     * policy pages on ITS OWN site only (see `legalContact()`): the named
     * Data Protection Officer and the address that policies route privacy
     * requests to. A charity site never renders these, so provisioning leaves
     * them untouched.
     */
    legalContactName?: string
    legalContactEmail?: string
    cookieContactEmail?: string
  }
  /**
   * Parent / umbrella organization, when this site is "a project of" another
   * nonprofit. Omit for a standalone charity (the footer clause is hidden).
   */
  parentOrg?: { name: string; url: string; hubUrl: string }
  /**
   * Footer-standard fields still awaiting the charity. Each listed field keeps
   * an EMPTY value and renders a visible plain-text placeholder
   * (`PENDING_TEXT`) in its slot, never a link. An empty value NOT listed here
   * means "the charity has none". `taxStatusLabel` is deliberately not
   * pending-able: it is a legal claim, so '' means "make no claim". See
   * `PendingField`. Omit (or leave empty) when nothing is pending.
   */
  pending?: readonly PendingField[]
  /**
   * Label appended after the org name in the footer copyright line to describe
   * tax status, e.g. 'a US 501c3 Non Profit' or 'a pre-501(c)(3) nonprofit'.
   * Empty string renders just the org name with no trailing status clause.
   */
  taxStatusLabel: string
  /**
   * Visibility flags for home-page sections whose default content is
   * FFC-specific marketing rather than per-charity data. A rebranded fork sets
   * these false so the section self-hides instead of showing FFC placeholders.
   * Data-driven sections (Team, Testimonials, Results) self-hide on their own
   * when their data files are emptied and need no flag here.
   *
   * Endowment and Programs (and the FAQ, which has no flag) additionally
   * render only on the supporting organization's own site — see
   * src/lib/section-visibility.ts — so a charity site never shows them even
   * with these left at true.
   */
  sections: {
    /** FFC Endowment feature cards. */
    showEndowment: boolean
    /** FFC's own three-program (Domains/Hosting/Consulting) marketing block. */
    showPrograms: boolean
    /**
     * Unified events section (Google Calendar / Microsoft 365 / Facebook).
     * Also self-hides when no event sources are configured and the committed
     * snapshot (src/data/events.generated.json) is empty — see
     * src/lib/events/visibility.ts.
     */
    showEvents: boolean
  }
  /**
   * Third-party integration endpoints. Each fork points these at its own
   * accounts — the domains are already allow-listed in the CSP, so only the
   * path/ID changes here.
   */
  /**
   * The supporting organization's OWN third-party targets (its endowment's
   * Zeffy form, its Idealist listing, its Facebook page, its charity
   * application form). They render only on the supporting organization's own
   * site: a charity's site uses `donationUrl`, `volunteerUrl` and its own
   * `social` links instead (see `donationEmbedUrl()`, `donateHref()`,
   * `volunteerHref()`, `eventsFacebookPageUrl()`), so provisioning never has
   * to find and replace them.
   */
  integrations: {
    /** Zeffy donation-form embed URL (the iframe `src`). */
    zeffyDonationUrl: string
    /** Idealist volunteer-opportunities profile URL. */
    idealistUrl: string
    /**
     * Public Facebook page URL used by the Events section ("View all events
     * on Facebook" link and the empty-state follow button). This is public
     * identity, not a secret — the calendar-source endpoints/tokens stay in
     * EVENTS_* environment variables (see EVENTS_SETUP.md). Empty string
     * hides those links.
     */
    eventsFacebookPageUrl: string
    /** Microsoft Forms application-form URL (https://forms.office.com/r/<id>). */
    microsoftFormUrl: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'Free For Charity',
  tagline: 'Reduce Costs, Increase Impact',
  mission:
    'Free For Charity connects students, professionals, and businesses with nonprofits to reduce costs and increase revenues.',
  // Empty = a charity's Donate / Volunteer sections email contactEmail instead.
  donationUrl: '',
  volunteerUrl: '',
  description:
    'Free For Charity connects students, professionals, and businesses with nonprofits to reduce costs and increase revenues—putting more resources back into their missions.',
  shortDescription:
    'Connecting students, professionals, and businesses with nonprofits to reduce costs and increase revenues.',
  // Bare origin only (drift-check enforced). The template deploys to the
  // GitHub Pages default URL; the /FFC-IN-FFC_Single_Page_Template subpath
  // comes from NEXT_PUBLIC_BASE_PATH, which siteUrl() folds in at build time.
  // A fork with a custom domain sets its own origin here (and no basePath).
  url: 'https://freeforcharity.github.io',
  twitterHandle: '@freeforcharity',
  contactEmail: 'security@freeforcharity.org',
  keywords: [
    'nonprofit',
    'charity',
    'volunteer',
    'donate',
    'free hosting',
    'domains',
    'Microsoft 365',
  ],
  themeColor: '#ffffff',
  vulnerabilityDisclosurePath: '/vulnerability-disclosure-policy',
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/freeforcharity' },
    { label: 'X (Twitter)', href: 'https://x.com/freeforcharity1' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/freeforcharity/' },
    { label: 'GitHub', href: 'https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template' },
  ],
  ein: '46-2471893',
  foundingDate: '2014',
  nonprofitStatus: 'https://schema.org/Nonprofit501c3',
  phone: { display: '(520) 222-8104', tel: '5202228104' },
  addresses: [
    {
      label: 'Main Address',
      lines: ['4030 Wake Forrest Road', 'Suite 349', 'Raleigh, NC 27609'],
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=4030+Wake+Forrest+Road+Suite+349+Raleigh+NC+27609',
    },
    {
      label: 'PA Office Address',
      lines: ['301 Science Park Road, Suite 119', 'State College, PA 16803'],
      mapUrl:
        'https://www.google.com/maps/place/Free+For+Charity/@40.7768455,-77.8963305,17z/data=!3m1!4b1!4m6!3m5!1s0x89cea944b44a2e01:0x6fc2d6bf09e00a0f!8m2!3d40.7768415!4d-77.8937556!16s%2Fg%2F11vzvbl2d7?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
  ],
  guidestar: {
    profileUrl: 'https://www.guidestar.org/profile/46-2471893',
    directProfileUrl:
      'https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742',
  },
  supportedBy: {
    name: 'Free For Charity',
    url: 'https://freeforcharity.org',
    hubUrl: 'https://freeforcharity.org/hub/',
    legalContactName: 'Clarke Moyer',
    legalContactEmail: 'clarkemoyer@freeforcharity.org',
    cookieContactEmail: 'privacy@freeforcharity.org',
  },
  parentOrg: {
    name: 'Free For Charity',
    url: 'https://freeforcharity.org',
    hubUrl: 'https://freeforcharity.org/hub/',
  },
  taxStatusLabel: 'a US 501c3 Non Profit',
  sections: {
    showEndowment: true,
    showPrograms: true,
    showEvents: true,
  },
  integrations: {
    zeffyDonationUrl: 'https://www.zeffy.com/embed/donation-form/free-for-charity-endowment-fund',
    idealistUrl:
      'https://www.idealist.org/en/nonprofit/356bfc8e2ae64f83beea4a4e677e99d7-free-for-charity-state-college#opportunities',
    eventsFacebookPageUrl: 'https://www.facebook.com/freeforcharity',
    microsoftFormUrl: 'https://forms.office.com/r/vePxGq6JqG',
  },
}

/**
 * Compose a fully-qualified URL on this site.
 *
 * The path is required to be a same-origin absolute path (starting with `/`).
 * This rules out protocol-relative inputs like `//evil.com` that could leak
 * into a future redirect or canonical link.
 */
export function siteUrl(path = '/'): string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    throw new TypeError(
      `siteUrl: path must be a same-origin absolute path starting with a single "/" (got: ${JSON.stringify(path)})`
    )
  }
  // Fold in the GitHub Pages subpath (empty on custom-domain deploys) so
  // canonical/OG/sitemap URLs stay correct on the default *.github.io URL.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const base = siteConfig.url.replace(/\/$/, '') + basePath
  return `${base}${path}`
}

/**
 * Returns the Twitter handle with a guaranteed leading `@`.
 * Returns `undefined` (so the meta tag is omitted) if the handle is empty
 * or is just an `@` with no body — emitting a bare `@` would advertise a
 * malformed handle to Twitter's scraper.
 */
export function twitterSite(): string | undefined {
  const raw = siteConfig.twitterHandle.trim().replace(/^@+/, '')
  if (!raw) return undefined
  return `@${raw}`
}

/** Returns the OG/Twitter card description, falling back to the longer page description. */
export function cardDescription(): string {
  return siteConfig.shortDescription.trim() || siteConfig.description
}

/**
 * True only on the supporting organization's OWN site — i.e. the template as
 * shipped, where `name` still equals `supportedBy.name`.
 *
 * The template carries copy that is about the supporting organization itself
 * (its endowment, its FAQ, its mission statement and video). On any other
 * site that copy would make the supporter's claims in the charity's name, so
 * the components that carry it render only when this returns true. A charity
 * site never needs to change anything for that to happen: setting `name` is
 * enough, which is exactly what provisioning does.
 */
export function isSupportingOrgSite(): boolean {
  return siteConfig.name.trim() === siteConfig.supportedBy.name.trim()
}

/**
 * `mailto:` link to `contactEmail`. The characters that would end or corrupt
 * the address part of a mailto: URI (RFC 6068) are percent-encoded -- `?` and
 * `#` end it, `&` and `%` corrupt it, and `,` separates recipients -- so a
 * malformed contactEmail can never add a recipient or inject a header.
 * Whitespace is never part of an address, so it is removed rather than encoded.
 */
export function mailtoHref(subject?: string, email: string = siteConfig.contactEmail): string {
  const address = email.replace(/\s+/g, '').replace(/[%?#&,]/g, encodeURIComponent)
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`
}

/**
 * Who the policy pages name as the organization's legal contact.
 *
 * On the supporting organization's own site this is its named Data Protection
 * Officer and their address, exactly as its policies have always published
 * them. On every other site it is the site's own `contactEmail` with no named
 * person: a charity's policies must never route privacy requests to, or name
 * a DPO from, the organization that supports it.
 */
export function legalContact(kind: 'default' | 'cookie' = 'default'): {
  name: string | null
  email: string
} {
  const s = siteConfig.supportedBy
  if (isSupportingOrgSite()) {
    const email = kind === 'cookie' ? s.cookieContactEmail : s.legalContactEmail
    if (email?.trim()) return { name: s.legalContactName?.trim() || null, email: email.trim() }
  }
  return { name: null, email: siteConfig.contactEmail.trim() }
}

/** True when `field` is listed in `siteConfig.pending`. */
export function isPending(field: PendingField): boolean {
  return siteConfig.pending?.includes(field) ?? false
}

/**
 * A configured https URL, or a `mailto:` to `contactEmail` with `subject`.
 * Anything that is not an https URL (including a `javascript:` value) falls
 * back to the email, so a bad config can never ship a dangerous or dead link.
 */
function linkOrEmail(url: string, subject: string): string {
  const trimmed = url.trim()
  if (/^https:\/\/\S+$/i.test(trimmed)) return trimmed
  return mailtoHref(subject)
}

/**
 * The donation form the Donate section embeds, or null to render a Donate
 * link (`donateHref()`) instead. Only the supporting organization's own site
 * embeds, because `integrations.zeffyDonationUrl` is ITS endowment fund: on a
 * charity's site it would collect donations to another organization under the
 * charity's name.
 */
export function donationEmbedUrl(): string | null {
  if (!isSupportingOrgSite()) return null
  return siteConfig.integrations.zeffyDonationUrl.trim() || null
}

/** Donate link: `donationUrl`, else an email to the site's own contact address. */
export function donateHref(): string {
  return linkOrEmail(siteConfig.donationUrl, `Donating to ${siteConfig.name}`)
}

/**
 * Volunteer link. The supporting organization's own site keeps its Idealist
 * listing; every other site uses `volunteerUrl`, else an email.
 */
export function volunteerHref(): string {
  if (isSupportingOrgSite() && siteConfig.integrations.idealistUrl.trim()) {
    return siteConfig.integrations.idealistUrl.trim()
  }
  return linkOrEmail(siteConfig.volunteerUrl, `Volunteering with ${siteConfig.name}`)
}

/**
 * The Facebook page the Events section links to, or '' to hide the link. The
 * supporting organization's own site uses `integrations.eventsFacebookPageUrl`;
 * a charity's site uses its own Facebook entry in `social`, if it has one.
 */
export function eventsFacebookPageUrl(): string {
  if (isSupportingOrgSite()) return siteConfig.integrations.eventsFacebookPageUrl.trim()
  const own = siteConfig.social.find((l) =>
    /^https:\/\/([a-z0-9-]+\.)*facebook\.com\//i.test(l.href.trim())
  )
  return own ? own.href.trim() : ''
}

/**
 * The phone number to publish, or null when either half is unset. A charity
 * that publishes no number shows no number, rather than a link that dials
 * nothing — the same rule the footer applies.
 */
export function publishedPhone(): { display: string; tel: string } | null {
  const display = siteConfig.phone.display.trim()
  const tel = siteConfig.phone.tel.trim()
  return display && tel ? { display, tel } : null
}
