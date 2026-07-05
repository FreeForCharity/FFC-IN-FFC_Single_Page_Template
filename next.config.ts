import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // Images configuration
  images: {
    // This allows all images, local or external, to load without optimization
    unoptimized: true,
    // Use remotePatterns instead of deprecated domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ffcworkingsite1.org',
      },
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
