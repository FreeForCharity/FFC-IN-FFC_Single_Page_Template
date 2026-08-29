'use client'

import { RefObject, useEffect, useState } from 'react'

type Options = {
  /** Stop observing after the first intersection (the value stays true). */
  once?: boolean
  /** Margin around the root, e.g. '-100px' to trigger later. */
  rootMargin?: string
}

/**
 * Returns whether the observed element is intersecting the viewport. A small
 * native replacement for framer-motion's `useInView`.
 *
 * Starts `false` (matching the server render) and updates after mount. In
 * environments without IntersectionObserver (older browsers, some test
 * runners) it sets `true` on mount so content still becomes visible instead of
 * staying hidden.
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: Options = {}
): boolean {
  const { once = false, rootMargin } = options
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsIntersecting(false)
        }
      },
      { rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, once, rootMargin])

  return isIntersecting
}
