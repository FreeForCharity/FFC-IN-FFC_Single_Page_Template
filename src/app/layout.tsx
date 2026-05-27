import type { Metadata } from 'next'
import './globals.css'
import Header from './../components/header'
import Footer from './../components/footer'
import CookieConsent from './../components/cookie-consent'
import GoogleTagManager, { GoogleTagManagerNoScript } from './../components/google-tag-manager'
import { siteConfig, siteUrl, twitterSite, cardDescription } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'
import {
  openSans,
  lato,
  raleway,
  faustina,
  cantataOne,
  faunaOne,
  montserrat,
  cinzel,
} from '@/lib/fonts'

const defaultTitle = `${siteConfig.name} | ${siteConfig.tagline}`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl('/'),
    siteName: siteConfig.name,
    title: defaultTitle,
    description: cardDescription(),
    images: [
      {
        url: assetPath('/web-app-manifest-512x512.png'),
        width: 512,
        height: 512,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: twitterSite(),
    title: defaultTitle,
    description: cardDescription(),
    images: [assetPath('/web-app-manifest-512x512.png')],
  },
  icons: {
    icon: [
      { url: assetPath('/favicon.ico'), sizes: '32x32' },
      { url: assetPath('/icon.png'), type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: assetPath('/apple-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
  // Manifest is generated dynamically from siteConfig via src/app/manifest.ts;
  // Next.js auto-wires the <link rel="manifest"> tag, so we don't set it here.
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Baseline CSP for hosts that cannot serve _headers (GitHub Pages).
            Note: frame-ancestors, sandbox, and report-uri are IGNORED by the
            browser when delivered via <meta http-equiv> per the CSP spec.
            GitHub Pages also does NOT set X-Frame-Options by default, so
            clickjacking defense is not available on a Pages-only deploy.
            Production sites should sit behind Cloudflare/Netlify so the
            frame-ancestors directive in public/_headers takes effect.
            Keep the rest of this list aligned with public/_headers —
            third-party origins must be added to BOTH. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://widgets.guidestar.org https://connect.facebook.net https://www.zeffy.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms; frame-src https://www.googletagmanager.com https://www.zeffy.com https://widgets.guidestar.org https://www.facebook.com https://forms.office.com https://forms.microsoft.com https://www.youtube.com https://www.youtube-nocookie.com https://widgets.sociablekit.com; media-src 'self' blob: https:; object-src 'none'; base-uri 'self'; form-action 'self' https://www.zeffy.com https://forms.office.com; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content={siteConfig.themeColor} />

        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.zeffy.com" />
        <link rel="preconnect" href="https://widgets.guidestar.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.zeffy.com" />
        <link rel="dns-prefetch" href="https://www.idealist.org" />

        {/* Preload critical LCP image */}
        <link
          rel="preload"
          as="image"
          href={assetPath('/Images/figma-hero-img.webp')}
          fetchPriority="high"
        />

        <GoogleTagManager />
      </head>
      <body
        className={[
          'antialiased',
          openSans.variable,
          lato.variable,
          raleway.variable,
          faustina.variable,
          cantataOne.variable,
          faunaOne.variable,
          montserrat.variable,
          cinzel.variable,
        ].join(' ')}
        suppressHydrationWarning={true}
      >
        <GoogleTagManagerNoScript />
        {/* Skip-to-content link (WCAG 2.4.1). First focusable element in the
            body so keyboard users tabbing in can jump past the header
            navigation. Visually hidden until focused — see .skip-to-content
            styles in src/app/globals.css. */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {/* <PopupProvider> */}
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieConsent />
        {/* <PopupsRootClient /> */}
        {/* </PopupProvider> */}
      </body>
    </html>
  )
}
