/**
 * Central site configuration for Free For Charity template sites.
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

export type SiteTrustProfile = {
  /** Contract version for ffcadmin / generated-site automation. */
  schemaVersion: 'ffc.site-profile.v1'
  /** Stable machine ID for this generated site. */
  siteId: string
  /** Human-readable name for dashboards and audit logs. */
  siteName: string
  /** Canonical public origin with no trailing slash. */
  canonicalUrl: string
  /** Owning nonprofit or template organization. */
  organization: {
    name: string
    legalName: string
    ein: string
    nonprofitStatus: 'us-501c3' | 'unknown' | 'not-applicable'
    country: string
  }
  /** Source template identity used to compare generated sites for parity. */
  template: {
    family: 'ffc-single-page-template'
    repository: string
    branch: string
    issue: string
  }
  /** Public, non-secret contact channels that automation may display or verify. */
  contacts: {
    primaryEmail: string
    securityEmail: string
    vulnerabilityDisclosurePath: string
  }
  /** Public profile endpoints that generated sites should expose consistently. */
  profileEndpoints: {
    siteProfile: '/site-profile.json'
    securityTxt: '/.well-known/security.txt'
    sitemap: '/sitemap.xml'
    robots: '/robots.txt'
  }
  /** Expected platform controls; declarative only, not credentials or settings. */
  trust: {
    generatedBy: 'Free For Charity template factory'
    hosting: 'github-pages-static-export'
    requiresHttps: boolean
    managesSecrets: false
    productionDnsManagedHere: false
    requiredChecks: readonly string[]
  }
}

export type SiteConfig = {
  /** Display name of the charity (used in titles, OG/Twitter cards). */
  name: string
  /** Short tagline used in the default title template. */
  tagline: string
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
}

export const siteConfig: SiteConfig = {
  name: 'Free For Charity',
  tagline: 'Reduce Costs, Increase Impact',
  description:
    'Free For Charity connects students, professionals, and businesses with nonprofits to reduce costs and increase revenues—putting more resources back into their missions.',
  shortDescription:
    'Connecting students, professionals, and businesses with nonprofits to reduce costs and increase revenues.',
  url: 'https://ffcworkingsite1.org',
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
    { label: 'GitHub', href: 'https://github.com/FreeForCharity/FFC_Single_Page_Template' },
  ],
}

export const siteTrustProfile: SiteTrustProfile = {
  schemaVersion: 'ffc.site-profile.v1',
  siteId: 'ffc-working-site-1',
  siteName: siteConfig.name,
  canonicalUrl: siteConfig.url,
  organization: {
    name: siteConfig.name,
    legalName: 'Free For Charity',
    ein: '46-2471893',
    nonprofitStatus: 'us-501c3',
    country: 'US',
  },
  template: {
    family: 'ffc-single-page-template',
    repository: 'FreeForCharity/FFC-IN-FFC_Single_Page_Template',
    branch: 'agent/sammy/195-site-profile-contract',
    issue: 'https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template/issues/195',
  },
  contacts: {
    primaryEmail: siteConfig.contactEmail,
    securityEmail: siteConfig.contactEmail,
    vulnerabilityDisclosurePath: siteConfig.vulnerabilityDisclosurePath,
  },
  profileEndpoints: {
    siteProfile: '/site-profile.json',
    securityTxt: '/.well-known/security.txt',
    sitemap: '/sitemap.xml',
    robots: '/robots.txt',
  },
  trust: {
    generatedBy: 'Free For Charity template factory',
    hosting: 'github-pages-static-export',
    requiresHttps: true,
    managesSecrets: false,
    productionDnsManagedHere: false,
    requiredChecks: ['npm run lint', 'npm test', 'npm run build'],
  },
}

/** Returns a JSON-serializable profile contract for ffcadmin and generated-site tooling. */
export function getSiteTrustProfile(): SiteTrustProfile {
  return {
    ...siteTrustProfile,
    siteName: siteConfig.name,
    canonicalUrl: siteConfig.url,
    organization: {
      ...siteTrustProfile.organization,
      name: siteConfig.name,
    },
    contacts: {
      ...siteTrustProfile.contacts,
      primaryEmail: siteConfig.contactEmail,
      securityEmail: siteConfig.contactEmail,
      vulnerabilityDisclosurePath: siteConfig.vulnerabilityDisclosurePath,
    },
  }
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
  const base = siteConfig.url.replace(/\/$/, '')
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
