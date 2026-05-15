#!/usr/bin/env tsx
/**
 * Collect per-page SEO metrics from Google Analytics Data API + Search Console.
 * Output a JSON document keyed by page path.
 *
 * Env:
 *   GA_PROPERTY_ID
 *   GA_SERVICE_ACCOUNT_EMAIL
 *   GA_PRIVATE_KEY           (newlines OK; will be normalized)
 *   GSC_SITE_URL             (e.g. https://example.org/)
 *
 * Usage:
 *   tsx scripts/collect-page-seo-metrics.ts --days 28 --out data/seo-pages.json
 *
 * NOTE: This script ships as a skeleton — the GA / GSC SDK plumbing is intentionally
 * minimal so the template doesn't take a runtime dep on googleapis until a site
 * actually adopts it. Sites that want this should `npm install googleapis @google-analytics/data`.
 * Closes the page-metrics half of #231.
 */
import { writeFileSync } from 'node:fs'

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

const days = Number(arg('days', '28'))
const out = arg('out', 'data/seo-pages.json')!

const required = ['GA_PROPERTY_ID', 'GA_SERVICE_ACCOUNT_EMAIL', 'GA_PRIVATE_KEY', 'GSC_SITE_URL']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`Missing required env: ${missing.join(', ')}`)
  console.error(
    'Skeleton mode — emitting empty result. Install googleapis + @google-analytics/data and wire credentials to populate.'
  )
}

const result = {
  generatedAt: new Date().toISOString(),
  rangeDays: days,
  property: process.env.GA_PROPERTY_ID ?? null,
  site: process.env.GSC_SITE_URL ?? null,
  pages: [] as Array<{
    path: string
    pageviews: number
    sessions: number
    clicks: number
    impressions: number
    position: number
  }>,
  notes: missing.length
    ? `Skipped data collection — missing env: ${missing.join(', ')}`
    : 'Implement GA + GSC fetch in this file once the GA / GSC SDKs are installed.',
}

writeFileSync(out, JSON.stringify(result, null, 2))
console.error(`wrote ${out}`)
