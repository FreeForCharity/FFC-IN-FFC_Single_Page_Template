import React from 'react'
import { siteConfig } from '@/lib/site.config'

export default function EmptyState() {
  // Per-charity config, never hardcoded; whitespace-only behaves like empty
  // (the follow button self-hides).
  const facebookPageUrl = siteConfig.integrations.eventsFacebookPageUrl.trim()
  return (
    <div
      data-testid="events-empty-state"
      className="mx-auto max-w-2xl rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
    >
      <h3 className="mb-3 text-2xl font-semibold text-gray-900 lato-font">
        No upcoming events right now
      </h3>
      <p className="mb-6 text-gray-600 lato-font">
        We&apos;re between sessions. Follow us on social to be the first to know when the next event
        drops.
      </p>
      {facebookPageUrl && (
        <a
          href={facebookPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook (opens in new tab)"
          className="inline-flex items-center justify-center rounded-md bg-[#2B627B] px-5 py-2.5 text-sm font-[500] text-white hover:bg-[#1f4a5d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2B627B] lato-font"
        >
          Follow us on Facebook
        </a>
      )}
    </div>
  )
}
