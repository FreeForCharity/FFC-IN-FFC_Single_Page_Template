import React from 'react'
import { isPending, publishedPhone, siteConfig, siteUrl } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

/**
 * Builds the schema.org NonprofitOrganization JSON-LD object for this site.
 * Pulls every value from `siteConfig` so a fork only edits one file.
 * Exported separately so it can be asserted in unit tests without rendering.
 */
export function buildOrganizationSchema(): Record<string, unknown> {
  const sameAs = siteConfig.social.map((s) => s.href.trim()).filter((href) => href.length > 0)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl('/'),
    logo: siteUrl(assetPath('/web-app-manifest-512x512.png')),
  }

  if (siteConfig.alternateNames && siteConfig.alternateNames.length > 0) {
    schema.alternateName = [...siteConfig.alternateNames]
  }

  if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  if (siteConfig.nonprofitStatus) {
    // e.g. https://schema.org/Nonprofit501c3 — tells search engines the exact
    // IRS classification instead of leaving it to be inferred.
    schema.nonprofitStatus = siteConfig.nonprofitStatus
  }

  if (siteConfig.foundingDate) {
    schema.foundingDate = siteConfig.foundingDate
  }

  // A pending field (siteConfig.pending) has an empty value and shows a
  // placeholder on the page; it must never reach structured data, where a
  // blank or placeholder value would read as a real (bogus) fact.
  const email = siteConfig.contactEmail.trim()
  if (email && !isPending('email')) {
    schema.email = email
  }

  const ein = siteConfig.ein.trim()
  if (/^\d{2}-\d{7}$/.test(ein) && !isPending('ein')) {
    // schema.org/Organization taxID — surfaces the EIN to search/knowledge panels.
    // Only a well-formed IRS EIN (12-3456789) is emitted.
    schema.taxID = ein
  }

  // Both halves or nothing, the footer's rule (publishedPhone).
  const phone = isPending('phone') ? null : publishedPhone()
  if (phone) {
    // Use the normalized tel value (digits) rather than the display form so
    // search-engine parsers reliably recognize the number.
    schema.telephone = phone.tel
  }

  const primaryLines = isPending('address')
    ? []
    : (siteConfig.addresses?.[0]?.lines ?? []).map((line) => line.trim()).filter(Boolean)
  if (primaryLines.length > 0) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: primaryLines.join(', '),
    }
  }

  if (siteConfig.parentOrg) {
    // When this site is "a project of" an umbrella org, link the two so search
    // engines can relate them in the knowledge graph.
    schema.parentOrganization = {
      '@type': 'NonprofitOrganization',
      name: siteConfig.parentOrg.name,
      url: siteConfig.parentOrg.url,
    }
  }

  return schema
}

/**
 * Emits a single <script type="application/ld+json"> block carrying a
 * NonprofitOrganization schema for the site. Render once on the homepage so search
 * engines, knowledge-panel matchers, and assistant integrations have a
 * canonical machine-readable identity for the org.
 *
 * Server component — no client runtime cost.
 */
export default function OrganizationSchema() {
  const schema = buildOrganizationSchema()
  // Escape '<' as its JSON unicode form so any value that ever contains the
  // literal substring "</script>" cannot break out of this inline script tag
  // (a known JSON-LD injection vector). The output stays valid JSON/JSON-LD.
  const json = JSON.stringify(schema).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the standard pattern for inline JSON-LD per
      // the Next.js docs.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
