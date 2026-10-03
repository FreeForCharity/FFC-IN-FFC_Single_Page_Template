'use client'

import { scriptString } from '@/lib/script-string'

import Script from 'next/script'
import { analyticsConfig } from '@/lib/analytics.config'

// Google Tag Manager container ID. Edit it in src/lib/analytics.config.ts —
// the single, easy-to-find place for all analytics IDs.
const GTM_ID = analyticsConfig.gtmId

export default function GoogleTagManager() {
  return (
    <>
      {/* Google Tag Manager Script - loaded with lazyOnload for better performance */}
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${scriptString(GTM_ID)});
          `,
        }}
      />
    </>
  )
}

// The <noscript> GTM iframe used to live here and has been REMOVED, not
// merely unmounted.
//
// It is the one tracking path consent cannot reach: with JavaScript disabled
// the consent bootstrap never executes, the cookie banner never renders, and
// the footer opt-out control does not exist — yet the iframe would still
// request the GTM container with no consent signal, and a visitor sending GPC
// would have no way to stop it. GA4 cannot run without JavaScript either, so
// it measured essentially nothing in exchange.
//
// Deleted rather than commented out because an unmounted export is one line
// away from returning, and its return would silently falsify the privacy
// policy's claim that the consent check runs before any Google tag loads.
