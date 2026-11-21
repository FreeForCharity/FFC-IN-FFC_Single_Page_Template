'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Whether the page has scrolled more than `offset` pixels, without a scroll
 * listener (Modern Web Guidance: ui-behaviors/shrinking-header-on-scroll).
 *
 * Render the returned `sentinelRef` on an element placed at the very top of
 * the document flow (not inside a fixed or sticky parent). An
 * IntersectionObserver reports when that element leaves the viewport, so the
 * browser does the work off the main thread instead of running code on every
 * scroll event.
 */
export function useScrolledPast(offset: number) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [scrolledPast, setScrolledPast] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    if (typeof IntersectionObserver === 'undefined') {
      // Old browsers: fall back to a passive scroll listener.
      const onScroll = () => setScrolledPast(window.scrollY > offset)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
    const observer = new IntersectionObserver(([entry]) => setScrolledPast(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [offset])

  return { sentinelRef, scrolledPast }
}
