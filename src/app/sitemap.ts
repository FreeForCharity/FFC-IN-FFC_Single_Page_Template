import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site.config'

export const dynamic = 'force-static'

type SitemapEntry = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

// Routes that have a `src/app/<slug>/page.tsx`. Add new top-level routes here
// so they appear in the sitemap. Sub-routes can be added with their full path.
const routes: readonly SitemapEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookie-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/donation-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/free-for-charity-donation-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/vulnerability-disclosure-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/security-acknowledgements', changeFrequency: 'monthly', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map((entry) => ({
    url: siteUrl(entry.path),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))
}
