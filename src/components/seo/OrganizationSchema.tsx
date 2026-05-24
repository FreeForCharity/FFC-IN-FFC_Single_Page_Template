import React from 'react'
import { siteConfig, siteUrl } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

/**
 * Builds the schema.org NGO JSON-LD object for this site. Pulls every value
 * from `siteConfig` so a fork only edits one file. Exported separately so
 * it can be asserted in unit tests without rendering.
 */
export function buildOrganizationSchema(): Record<string, unknown> {
  const sameAs = siteConfig.social.map((s) => s.href.trim()).filter((href) => href.length > 0)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl('/'),
    logo: siteUrl(assetPath('/web-app-manifest-512x512.png')),
  }

  if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  if (siteConfig.contactEmail) {
    schema.email = siteConfig.contactEmail
  }

  return schema
}

/**
 * Emits a single <script type="application/ld+json"> block carrying an NGO
 * Organization schema for the site. Render once on the homepage so search
 * engines, knowledge-panel matchers, and assistant integrations have a
 * canonical machine-readable identity for the org.
 *
 * Server component — no client runtime cost.
 */
export default function OrganizationSchema() {
  const schema = buildOrganizationSchema()
  return (
    <script
      type="application/ld+json"
      // Stable JSON output: stringify with no whitespace to avoid layout
      // shift and keep the payload small. dangerouslySetInnerHTML is the
      // standard pattern for inline JSON-LD per the Next.js docs.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
