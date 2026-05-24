import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

export const dynamic = 'force-static'

// Every URL in the manifest needs to honor NEXT_PUBLIC_BASE_PATH or the
// installed PWA will launch at the wrong origin path on GitHub Pages
// subpath deploys and the icons will 404.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription || siteConfig.description,
    start_url: assetPath('/'),
    scope: assetPath('/'),
    display: 'standalone',
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: assetPath('/android-chrome-192x192.png'),
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: assetPath('/android-chrome-512x512.png'),
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
