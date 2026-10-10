'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  hasSaleShareOptOut,
  setSaleShareOptOut,
  subscribeSaleShareOptOut,
} from '@/lib/consent-mode'

/**
 * The "Do Not Sell or Share My Personal Information" control.
 *
 * California, Colorado and Connecticut require a clear, conspicuous way to
 * opt out of sharing for advertising, reachable from every page — hence the
 * footer, beside Cookie Preferences. This is a statutory right, not a
 * preference, which is why it is separate from the cookie banner: a visitor
 * who accepted everything must still be able to exercise it.
 *
 * `useSyncExternalStore` rather than useEffect + setState. The opt-out lives
 * in localStorage and `navigator.globalPrivacyControl`, neither of which
 * exists during the static export, so the value has to be read after
 * hydration — but reading it in an effect and calling setState is the
 * cascading-render pattern the lint rule rejects, and it would also flash
 * the wrong label for a frame. The server snapshot is deliberately `false`
 * (show the button): rendering "sharing is off" on the server would be a
 * claim the page cannot yet substantiate.
 *
 * Opting out is one-way from this control. A visitor whose browser sends GPC
 * cannot switch sharing back on here, because the site may not override a
 * signal the law requires it to honour; the copy states the outcome rather
 * than offering a toggle that silently does nothing.
 */

export function SaleShareOptOut({ className }: { className?: string }) {
  const optedOut = useSyncExternalStore(
    subscribeSaleShareOptOut,
    () => hasSaleShareOptOut(),
    () => false
  )

  const optOut = useCallback(() => {
    setSaleShareOptOut(true)
  }, [])

  if (optedOut) {
    return (
      <span className={className} data-testid="sale-share-opted-out">
        Advertising sharing is off
      </span>
    )
  }

  return (
    <button type="button" data-testid="sale-share-opt-out" onClick={optOut} className={className}>
      Do Not Sell or Share My Personal Information
    </button>
  )
}
