'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

/**
 * Props for the AnimatedNumber component.
 *
 * @property value - The target number to animate to.
 * @property className - Optional CSS classes to apply.
 * @property id - Optional element ID.
 */
interface AnimatedNumberProps {
  value: number
  className?: string
  id?: string
}

const COUNT_UP_DURATION_MS = 1000

/**
 * AnimatedNumber displays a number that counts up from 0 to the target value
 * when scrolled into view, with a brief fade/slide-in. If the user prefers
 * reduced motion it renders the value statically. Implemented with native
 * IntersectionObserver + requestAnimationFrame and CSS (no animation library).
 *
 * Accessibility:
 * - Respects the user's prefers-reduced-motion setting (renders a plain span).
 *
 * SSR: initializes to 0 so the server and first client render match.
 */
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className = '', id }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useIntersectionObserver(ref, { once: true, rootMargin: '-100px' })

  // Initialize with 0 unconditionally to avoid hydration mismatch.
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Reduced-motion users get the static value rendered directly (below), so
    // the count-up effect is a no-op for them.
    if (prefersReducedMotion || !isInView) return

    let frame = 0
    let startTime: number | null = null
    const tick = (now: number) => {
      if (startTime === null) startTime = now
      const progress = Math.min((now - startTime) / COUNT_UP_DURATION_MS, 1)
      setDisplayValue(Math.round(value * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value, prefersReducedMotion])

  // When reduced motion is preferred, render a plain span without animation.
  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className} id={id}>
        {value}
      </span>
    )
  }

  // Hidden until in view, then fade/slide in. The count-up runs in parallel.
  const motionClass = isInView ? 'animate-slideInFromBottom' : 'opacity-0'

  return (
    <span ref={ref} className={`${className} ${motionClass}`.trim()} id={id}>
      {displayValue}
    </span>
  )
}

export default AnimatedNumber
