#!/usr/bin/env tsx
/**
 * Collect top keywords / queries from Search Console.
 * Skeleton — wire up `googleapis` once the site adopts SEO tracking.
 *
 * Env: GSC_SITE_URL, GA_SERVICE_ACCOUNT_EMAIL, GA_PRIVATE_KEY
 *
 * Closes the keyword half of #231.
 */
import { writeFileSync } from 'node:fs'

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

const days = Number(arg('days', '28'))
const out = arg('out', 'data/seo-keywords.json')!
const limit = Number(arg('limit', '100'))

const missing = ['GSC_SITE_URL', 'GA_SERVICE_ACCOUNT_EMAIL', 'GA_PRIVATE_KEY'].filter(
  (k) => !process.env[k]
)

writeFileSync(
  out,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      rangeDays: days,
      limit,
      site: process.env.GSC_SITE_URL ?? null,
      keywords: [] as Array<{
        query: string
        clicks: number
        impressions: number
        position: number
      }>,
      notes: missing.length
        ? `Skipped fetch — missing env: ${missing.join(', ')}`
        : 'Implement Search Console fetch once googleapis is installed.',
    },
    null,
    2
  )
)
console.error(`wrote ${out}`)
