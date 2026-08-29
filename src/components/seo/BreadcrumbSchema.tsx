import React from 'react'
import { siteUrl } from '@/lib/site.config'

type BreadcrumbProps = {
  /** Title of the current page, shown as the last crumb (e.g. "Privacy Policy"). */
  name: string
  /** Same-origin absolute path of the current page (e.g. "/privacy-policy"). */
  path: string
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object for a sub-page: a simple
 * two-level trail of Home → <this page>. Helps search engines render a
 * breadcrumb trail in results and understand the site hierarchy. Absolute URLs
 * come from `siteUrl()` so a fork only edits `site.config.ts`. Exported
 * separately so it can be asserted in unit tests without rendering.
 */
export function buildBreadcrumbSchema(name: string, path: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: siteUrl(path),
      },
    ],
  }
}

/**
 * Emits a single <script type="application/ld+json"> block carrying a
 * BreadcrumbList schema. Render once near the top of a sub-page (the legal
 * pages). Not used on the single-page home, which has no parent to point back
 * to.
 *
 * Server component — no client runtime cost.
 */
export default function BreadcrumbSchema({ name, path }: BreadcrumbProps) {
  const schema = buildBreadcrumbSchema(name, path)
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
