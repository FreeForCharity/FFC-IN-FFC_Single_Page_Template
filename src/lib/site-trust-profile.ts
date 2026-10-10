import { siteConfig, siteUrl, isPending } from './site.config.ts'

/** Public identity for tooling; never borrows the supporting organization's identity. */
export function getSiteTrustProfile() {
  const canonicalUrl = siteUrl('/').replace(/\/$/, '')
  return {
    schemaVersion: 'ffc.site-profile.v1' as const,
    siteId: canonicalUrl,
    siteName: siteConfig.name,
    canonicalUrl,
    organization: {
      name: siteConfig.name,
      ein: isPending('ein') ? null : siteConfig.ein.trim() || null,
      nonprofitStatus: siteConfig.nonprofitStatus?.trim() || null,
    },
    supportedBy: { name: siteConfig.supportedBy.name, url: siteConfig.supportedBy.url },
    template: {
      family: 'ffc-single-page-template',
      repository: 'FreeForCharity/FFC-IN-FFC_Single_Page_Template',
      branch: 'main',
    },
    contacts: {
      primaryEmail: isPending('email') ? null : siteConfig.contactEmail.trim() || null,
      vulnerabilityDisclosureUrl: siteUrl(siteConfig.vulnerabilityDisclosurePath),
    },
    profileEndpoints: {
      siteProfile: siteUrl('/site-profile.json'),
      securityTxt: siteUrl('/security.txt'),
      sitemap: siteUrl('/sitemap.xml'),
      robots: siteUrl('/robots.txt'),
    },
    trust: {
      generatedBy: 'Free For Charity template factory',
      hosting: 'github-pages-static-export',
      requiresHttps: true,
      managesSecrets: false,
      productionDnsManagedHere: false,
      requiredChecks: [
        'pnpm run format:check',
        'pnpm run lint',
        'pnpm run check:drift',
        'pnpm run check:site-config',
        'pnpm run test:coverage',
        'pnpm run build',
        'pnpm run verify:build',
        'pnpm run check:bundle',
        'pnpm run test:e2e',
        'pnpm run audit:high',
      ],
    },
  }
}

export type SiteTrustProfile = ReturnType<typeof getSiteTrustProfile>
