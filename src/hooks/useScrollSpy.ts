'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the id of the section that crosses a line `offset` pixels below the
 * top of the viewport, using one IntersectionObserver instead of measuring
 * every section on each scroll event (Modern Web Guidance:
 * ui-behaviors/scrollspy).
 *
 * `topId` is the section at the top of the page; while it is under the line
 * the hook returns ''. When the line is over something that is not watched
 * (a section with no menu entry) the last value is kept. Ids that are not on
 * the page are skipped, so a fork that hides a section needs no change here.
 */
export function useScrollSpy(ids: readonly string[], offset: number, topId?: string) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const watched = [...(topId ? [topId] : []), ...ids]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (watched.length === 0) return

    let observer: IntersectionObserver | undefined
    const start = () => {
      observer?.disconnect()
      // Shrink the viewport to a 1px line at `offset` from the top.
      const bottom = Math.max(0, window.innerHeight - offset - 1)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            setActive(entry.target.id === topId ? '' : entry.target.id)
          }
        },
        { rootMargin: `-${offset}px 0px -${bottom}px 0px` }
      )
      watched.forEach((el) => observer?.observe(el))
    }

    start()
    window.addEventListener('resize', start)
    return () => {
      window.removeEventListener('resize', start)
      observer?.disconnect()
    }
  }, [ids, offset, topId])

  return active
}
