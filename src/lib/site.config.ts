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

export type SiteConfig = {
  /** Display name of the charity (used in titles, OG/Twitter cards). */
  name: string
  /** Short tagline used in the default title template. */
  tagline: string
  /** Plain-language description used for meta description and OG/Twitter. */
  description: string
  /**
   * Canonical production URL with no trailing slash.
   * Used by metadataBase, sitemap, robots, OG/Twitter and security.txt.
   */
  url: string
  /** Twitter / X handle including the leading @. Empty string disables the meta tag. */
  twitterHandle: string
  /** Primary contact email for security disclosure and general inquiries. */
  contactEmail: string
  /** SEO keywords used in the root layout metadata. */
  keywords: readonly string[]
  /** Default theme color (used by manifest and meta tag). */
  themeColor: string
  /** GitHub Pages base path used when deploying to a github.io subpath. */
  githubPagesBasePath: string
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
  githubPagesBasePath: '/FFC_Single_Page_Template',
  vulnerabilityDisclosurePath: '/vulnerability-disclosure-policy',
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/freeforcharity' },
    { label: 'X (Twitter)', href: 'https://x.com/freeforcharity1' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/freeforcharity/' },
    { label: 'GitHub', href: 'https://github.com/FreeForCharity/FFC_Single_Page_Template' },
  ],
}

/** Convenience getter for `${siteConfig.url}${path}` with safe slash handling. */
export function siteUrl(path = '/'): string {
  const base = siteConfig.url.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
