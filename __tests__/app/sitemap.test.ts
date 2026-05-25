import fs from 'fs'
import path from 'path'
import sitemap, { routes } from '../../src/app/sitemap'
import { siteConfig } from '../../src/lib/site.config'

const APP_DIR = path.resolve(__dirname, '..', '..', 'src', 'app')

// Files under src/app/ that have a `page.tsx` but are NOT public web routes
// (error boundaries, manifest, etc.) — exclude these from the route audit.
const NOT_A_PUBLIC_ROUTE = new Set<string>(['error.tsx', 'not-found.tsx'])

/**
 * Walk src/app/ and return every directory that owns a page.tsx, expressed
 * as the URL path the route would render at ('/foo', '/foo/bar', '/').
 */
function discoverPublicRoutes(dir: string, prefix = ''): string[] {
  const out: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      out.push(prefix === '' ? '/' : prefix)
    }
    if (entry.isDirectory()) {
      // Skip Next.js conventions that aren't a separate URL segment.
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
      // Skip any directory whose name itself is in the not-a-route allowlist.
      if (NOT_A_PUBLIC_ROUTE.has(entry.name)) continue
      out.push(...discoverPublicRoutes(path.join(dir, entry.name), `${prefix}/${entry.name}`))
    }
  }

  return out
}

describe('sitemap.ts', () => {
  it('lists every page.tsx route exactly once', () => {
    const discovered = discoverPublicRoutes(APP_DIR).sort()
    const sitemapPaths = routes.map((r) => r.path).sort()

    expect(sitemapPaths).toEqual(discovered)
  })

  it('contains no duplicate path entries', () => {
    const paths = routes.map((r) => r.path)
    const unique = new Set(paths)
    expect(paths.length).toBe(unique.size)
  })

  it('emits absolute URLs prefixed with siteConfig.url', () => {
    const entries = sitemap()
    for (const e of entries) {
      expect(typeof e.url).toBe('string')
      expect(e.url.startsWith(siteConfig.url.replace(/\/$/, ''))).toBe(true)
    }
  })

  it('uses priority 1.0 for the root route only', () => {
    const root = routes.find((r) => r.path === '/')
    expect(root?.priority).toBe(1.0)
    const others = routes.filter((r) => r.path !== '/')
    for (const r of others) {
      expect(r.priority).toBeLessThan(1.0)
    }
  })

  it('keeps every priority within the [0, 1] range', () => {
    for (const r of routes) {
      expect(r.priority).toBeGreaterThanOrEqual(0)
      expect(r.priority).toBeLessThanOrEqual(1)
    }
  })
})
