import type { Metadata } from 'next'
import { siteConfig, siteUrl, twitterSite } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

// Page-level metadata builder. Next.js merges metadata shallowly per
// top-level key, so a page that sets only `title`/`description` inherits the
// ROOT openGraph/twitter objects — link previews then show the homepage title
// on every page. This helper emits matching og/twitter fields per page so
// shared links preview correctly. The root layout keeps the site-wide
// defaults for the homepage itself.

/**
 * The site's social-card image, shared by the root layout and every
 * pageMetadata() call so the OG image is defined exactly once.
 */
export const OG_IMAGE = {
  url: assetPath('/Images/og-image.png'),
  width: 1200,
  height: 630,
  alt: siteConfig.name,
}

export function pageMetadata(input: {
  title: string
  description: string
  /** Same-origin absolute path, e.g. '/privacy-policy'. */
  canonical: string
}): Metadata {
  const { title, description, canonical } = input
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      url: siteUrl(canonical),
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterSite(),
      title,
      description,
      images: [OG_IMAGE.url],
    },
  }
}
