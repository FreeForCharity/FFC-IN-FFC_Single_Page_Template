import type { NextConfig } from 'next'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// The Events section (and the footer's Events nav link, a client component)
// must know at render time whether any calendar source is configured. The raw
// EVENTS_* variables can carry secret ICS URLs / tokens and must never reach
// the client bundle, so expose only this derived non-secret boolean — it is
// inlined into both server and client bundles, keeping prerender and
// hydration in agreement. See src/lib/events/visibility.ts.
const eventsSourcesConfigured = Boolean(
  process.env.EVENTS_GOOGLE_ICS_URL ||
  process.env.EVENTS_MICROSOFT_ICS_URL ||
  (process.env.EVENTS_FACEBOOK_PAGE_ID && process.env.EVENTS_FACEBOOK_ACCESS_TOKEN)
)

// Whether the committed snapshot actually holds events, derived here (not in
// client code) so the Events visibility predicate never has to import the
// snapshot JSON into the client bundle. Missing/unreadable snapshot reads as
// "no events" - the build must not fail over a data file.
let eventsSnapshotHasEvents = false
try {
  const snap = JSON.parse(
    readFileSync(join(process.cwd(), 'src/data/events.generated.json'), 'utf8')
  )
  eventsSnapshotHasEvents = Array.isArray(snap.events) && snap.events.length > 0
} catch {
  /* no snapshot - self-hide unless a source is configured */
}

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    EVENTS_SOURCES_CONFIGURED: eventsSourcesConfigured ? 'true' : '',
    EVENTS_SNAPSHOT_HAS_EVENTS: eventsSnapshotHasEvents ? 'true' : '',
  },
  // Images configuration
  images: {
    // This allows all images, local or external, to load without optimization
    unoptimized: true,
    // Use remotePatterns instead of deprecated domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging.freeforcharity.org',
      },
      {
        protocol: 'https',
        hostname: 'freeforcharity.org',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
    ],
  },
  // Optional: base path and asset prefix if using a subdirectory deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

// Wrap with @next/bundle-analyzer when ANALYZE=true (`npm run analyze`).
// The dynamic import means @next/bundle-analyzer is only resolved when
// actually requested — a production install that omits devDependencies
// (`npm ci --omit=dev` etc.) still loads this config file without
// ERR_MODULE_NOT_FOUND because the import only runs when ANALYZE is set,
// and ANALYZE is never set during a production build.
export default (async () => {
  if (process.env.ANALYZE !== 'true') return nextConfig
  const { default: bundleAnalyzer } = await import('@next/bundle-analyzer')
  return bundleAnalyzer({ enabled: true })(nextConfig)
})()
