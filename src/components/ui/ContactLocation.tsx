import React from 'react'
import { PENDING_TEXT, isPending, publishedCityState } from '@/lib/site.config'

/**
 * True when a policy page's contact block should carry a "Location:" entry:
 * the organization has a published city and state, or its address is still
 * awaiting the charity (the entry then shows the placeholder).
 */
export function hasContactLocation(): boolean {
  return publishedCityState() !== null || isPending('address')
}

/**
 * The organization's public city and state, for prose on the policy pages.
 *
 * While the address is pending (listed in `siteConfig.pending`) the visible
 * "awaiting information" text is shown instead, matching the footer and
 * `ContactEmail`. With no address and nothing pending it renders nothing, so
 * callers guard the surrounding label with `hasContactLocation()`.
 */
export default function ContactLocation() {
  const cityState = publishedCityState()
  if (cityState) return <>{cityState}</>
  return isPending('address') ? <em>{PENDING_TEXT}</em> : null
}
