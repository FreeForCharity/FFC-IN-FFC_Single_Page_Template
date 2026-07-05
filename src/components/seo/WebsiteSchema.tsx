import React from 'react'
import { siteConfig, siteUrl } from '@/lib/site.config'

/**
 * Builds the schema.org WebSite JSON-LD object for this site. Declaring the
 * site's name + URL helps search engines render the correct site name in
 * results and ties pages to a single site entity. Pulls values from
 * `siteConfig` so a fork only edits one file. Exported separately so it can be
 * asserted in unit tests without rendering.
 *
 * Note: no `potentialAction`/`SearchAction` is emitted because the template has
 * no site-search results endpoint — advertising one would be invalid markup.
 * Add a SearchAction here if/when a real `/search?q=` page exists.
 */
export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl('/'),
    description: siteConfig.description,
    publisher: {
      '@type': 'NonprofitOrganization',
      name: siteConfig.name,
    },
  }
}

/**
 * Emits a single <script type="application/ld+json"> block carrying a WebSite
 * schema. Render once on the homepage beside the Organization and FAQ schemas.
 *
 * Server component — no client runtime cost.
 */
export default function WebsiteSchema() {
  const schema = buildWebsiteSchema()
  // Escape '<' as its JSON unicode form so a value containing "</script>"
  // cannot break out of this inline script tag (JSON-LD injection guard).
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
