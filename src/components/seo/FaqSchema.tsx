import React from 'react'
import { faqs } from '@/data/faqs'

/**
 * Builds the schema.org FAQPage JSON-LD object from the site's FAQ data. Pulls
 * every question/answer from `src/data/faqs.ts` so a fork only edits one file.
 * Exported separately so it can be asserted in unit tests without rendering.
 *
 * A FAQPage makes the Q&A eligible for Google's FAQ rich result, surfacing the
 * charity's answers directly in search — valuable, free visibility.
 */
export function buildFaqSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Emits a single <script type="application/ld+json"> block carrying a FAQPage
 * schema for the site. Render once on the homepage alongside the Organization
 * schema so search engines can extract the FAQ as structured data.
 *
 * Server component — no client runtime cost.
 */
export default function FaqSchema() {
  const schema = buildFaqSchema()
  // Escape '<' as its JSON unicode form so a FAQ answer that ever contains the
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
