'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the user has requested reduced motion via the OS/browser
 * `prefers-reduced-motion: reduce` setting. Starts as `false` (matching the
 * server render) and updates after mount, so there is no hydration mismatch.
 *
 * A tiny native replacement for framer-motion's `useReducedMotion`.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(query.matches)
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches)
    // Safari < 14 only implements the deprecated addListener/removeListener.
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    }
    query.addListener(onChange)
    return () => query.removeListener(onChange)
  }, [])

  return prefersReducedMotion
}
