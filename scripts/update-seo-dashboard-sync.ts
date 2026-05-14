#!/usr/bin/env tsx
/**
 * Read the JSON artifacts produced by collect-page-seo-metrics + collect-seo-keywords
 * and render a markdown dashboard for the SEO tracker issue.
 *
 * Usage:
 *   tsx scripts/update-seo-dashboard-sync.ts --pages data/seo-pages.json --keywords data/seo-keywords.json --out data/seo-dashboard.md
 *
 * Closes the dashboard half of #231.
 */
import { readFileSync, writeFileSync } from 'node:fs'

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

const pagesPath = arg('pages', 'data/seo-pages.json')!
const keywordsPath = arg('keywords', 'data/seo-keywords.json')!
const out = arg('out', 'data/seo-dashboard.md')!

function readJson<T>(p: string): T | null {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

type Pages = { generatedAt: string; pages: Array<{ path: string; pageviews: number; clicks: number; impressions: number; position: number }> }
type Keywords = { generatedAt: string; keywords: Array<{ query: string; clicks: number; impressions: number; position: number }> }

const pages = readJson<Pages>(pagesPath)
const keywords = readJson<Keywords>(keywordsPath)

const lines: string[] = []
lines.push(`# SEO dashboard`, '', `_Generated: ${new Date().toISOString()}_`, '')

if (pages?.pages?.length) {
  lines.push('## Top pages (last period)', '')
  lines.push('| Path | Pageviews | Clicks | Impressions | Avg position |')
  lines.push('|---|--:|--:|--:|--:|')
  for (const p of pages.pages.slice(0, 20)) {
    lines.push(`| ${p.path} | ${p.pageviews} | ${p.clicks} | ${p.impressions} | ${p.position.toFixed(1)} |`)
  }
  lines.push('')
} else {
  lines.push('_No page metrics available._', '')
}

if (keywords?.keywords?.length) {
  lines.push('## Top keywords', '')
  lines.push('| Query | Clicks | Impressions | Avg position |')
  lines.push('|---|--:|--:|--:|')
  for (const k of keywords.keywords.slice(0, 50)) {
    lines.push(`| ${k.query} | ${k.clicks} | ${k.impressions} | ${k.position.toFixed(1)} |`)
  }
  lines.push('')
} else {
  lines.push('_No keyword data available._', '')
}

writeFileSync(out, lines.join('\n'))
console.error(`wrote ${out}`)
