'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

// useLayoutEffect runs before paint (so reduced-motion users never see a motion
// flash) but warns when run on the server, where it's a no-op. Fall back to
// useEffect during SSR to keep the server render quiet and stable.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Returns true when the user has requested reduced motion via the OS/browser
 * `prefers-reduced-motion: reduce` setting. Starts as `false` (matching the
 * server render) and updates before paint, so there is no hydration mismatch
 * and reduced-motion users never see a flash of motion.
 *
 * A tiny native replacement for framer-motion's `useReducedMotion`.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
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
