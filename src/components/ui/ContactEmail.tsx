import React from 'react'
import { PENDING_TEXT, isPending, mailtoHref } from '@/lib/site.config'

/**
 * A contact email as a `mailto:` link, for prose on the policy pages. `email`
 * is the address the page names (usually `legalContact().email`).
 *
 * While the site's email is still awaiting the charity (listed in
 * `siteConfig.pending`) that address is empty, and a bare link would render as
 * an empty `mailto:` with no text: nothing to read, nothing to send to, and an
 * unnamed link to a screen reader. The visible "awaiting information" text is
 * shown instead, as plain text and never a link, matching the footer. An empty
 * address that is not pending renders nothing rather than an empty link.
 */
export default function ContactEmail({ email, className }: { email: string; className: string }) {
  const address = email.trim()
  if (address) {
    return (
      <a href={mailtoHref(undefined, address)} className={className}>
        {address}
      </a>
    )
  }
  return isPending('email') ? <em>{PENDING_TEXT}</em> : null
}
