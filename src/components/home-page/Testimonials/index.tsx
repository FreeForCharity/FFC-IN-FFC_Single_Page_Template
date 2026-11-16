'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
  MdPause,
  MdPlayArrow,
} from 'react-icons/md'
import Image from 'next/image'
import QuoteLeft from '../../../../public/Svgs/quote-left.svg'
import QuoteRight from '../../../../public/Svgs/quote-right.svg'
import { configuredTestimonials } from '@/data/testimonials'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Testimonials are sourced from src/data/testimonials/*.json (aggregated in
// src/data/testimonials.ts). To change them, edit those JSON files — no need to
// touch this component.

// How long each testimonial shows before the next one, while rotating.
const ROTATE_EVERY_MS = 5000

/**
 * A CSS scroll-snap carousel (Modern Web Guidance: ui-components/carousel).
 * The browser does the swiping and snapping; this component only adds the
 * arrows, dots and optional rotation, so it works with touch, trackpad and
 * keyboard without a carousel library.
 *
 * Rotation follows the ARIA APG carousel pattern and WCAG 2.2.2: a pause
 * button comes first in the tab order; rotation waits while the mouse is
 * over the carousel; it stops for good once keyboard focus moves in or a
 * touch moves the slides, until the visitor presses Play; and it never
 * starts for visitors who ask for reduced motion.
 */
const TestimonialSlider: React.FC = () => {
  const count = configuredTestimonials.length
  const scrollerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  // What a screen reader hears after a move the visitor made themselves.
  const [announcement, setAnnouncement] = useState('')
  // The slide a programmatic scroll is heading to, while it is under way.
  const targetRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | undefined>(undefined)
  const reducedMotion = useReducedMotion()
  const rotating = count > 1 && !paused && !hovered && !reducedMotion

  // Track which slide is in view, whichever way it got there (arrow, dot,
  // swipe, trackpad or keyboard scroll).
  /** The slide whose left edge is nearest the row's scroll position. */
  const readIndex = () => {
    const scroller = scrollerRef.current
    if (!scroller || scroller.clientWidth === 0) return null
    return Math.min(
      Math.max(Math.round(Math.abs(scroller.scrollLeft) / scroller.clientWidth), 0),
      count - 1
    )
  }

  /** Stop waiting for goTo's scroll and trust the scroll position again. */
  const settle = () => {
    targetRef.current = null
    window.clearTimeout(settleTimerRef.current)
    const index = readIndex()
    if (index !== null) setActiveIndex(index)
  }

  useEffect(() => () => window.clearTimeout(settleTimerRef.current), [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || typeof IntersectionObserver === 'undefined') return
    // The observer only says "a slide crossed the line"; the slide in view is
    // read from the scroll position, because one batch of entries can name
    // several slides during a fast scroll (for example the jump from the last
    // slide back to the first).
    //
    // While goTo's smooth scroll is under way, slides it passes are ignored,
    // so the dots do not flicker back and a quick second press of Next
    // counts from the right slide.
    const observer = new IntersectionObserver(
      () => {
        const index = readIndex()
        if (index === null) return
        if (targetRef.current !== null) {
          if (index !== targetRef.current) return
          settle()
          return
        }
        setActiveIndex(index)
      },
      { root: scroller, threshold: 0.6 }
    )
    slideRefs.current.forEach((slide) => slide && observer.observe(slide))
    return () => observer.disconnect()
    // readIndex and settle only read refs and count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const goTo = (index: number, byVisitor = false) => {
    const scroller = scrollerRef.current
    const slide = slideRefs.current[index]
    if (!scroller || !slide) return
    setActiveIndex(index)
    if (byVisitor) setAnnouncement(`Testimonial ${index + 1} of ${count}`)
    window.clearTimeout(settleTimerRef.current)
    // Already there: nothing will scroll, so there is nothing to wait for.
    if (Math.abs(Math.abs(scroller.scrollLeft) - slide.offsetLeft) < 2) {
      targetRef.current = null
      return
    }
    targetRef.current = index
    // If the scroll never arrives (interrupted, say), read where it stopped.
    settleTimerRef.current = window.setTimeout(settle, 1500)
    // Scroll only the row of slides: scrollIntoView would also move the page
    // whenever the carousel is partly off screen, even during rotation.
    scroller.scrollTo?.({
      left: slide.offsetLeft,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }

  // Rotation: one timer per slide, so a manual move restarts the countdown.
  useEffect(() => {
    if (!rotating) return
    const timer = window.setTimeout(() => goTo((activeIndex + 1) % count), ROTATE_EVERY_MS)
    return () => window.clearTimeout(timer)
    // goTo only reads refs and reducedMotion, which `rotating` already covers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotating, activeIndex, count])

  if (count === 0) return null

  return (
    <section id="testimonials" className="py-16 pb-25 bg-[#FCFCFC]">
      <div className="container mx-auto px-4 max-w-[1150px] text-center">
        <h2 className="font-bold text-[#E16820] text-[40px] leading-[44px] mb-7">Testimonials</h2>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={(event) => event.pointerType === 'mouse' && setHovered(false)}
          // Focus moving in stops rotation until Play is pressed. Not when it
          // lands on the Pause/Play button: browsers that focus a button on
          // mousedown would otherwise pause first and the click would then
          // undo it.
          onFocus={(event) => {
            if (!(event.target as HTMLElement).closest('[data-rotation-control]')) {
              setPaused(true)
            }
          }}
        >
          {count > 1 && !reducedMotion && (
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                data-rotation-control
                onClick={() => setPaused((p) => !p)}
                className="flex h-6 w-6 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-800"
                aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
              >
                {/* The icon swaps on every press. Without pointer-events-none
                    the pointer sits on an icon that is then removed, and the
                    browser never tells React the pointer left the carousel,
                    so rotation would stay held after Play. */}
                {paused ? (
                  <MdPlayArrow aria-hidden="true" className="pointer-events-none h-5 w-5" />
                ) : (
                  <MdPause aria-hidden="true" className="pointer-events-none h-5 w-5" />
                )}
              </button>
            </div>
          )}
          {/* Announces moves the visitor makes (arrows and dots), never the
              automatic rotation. */}
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
          <div className="relative">
            <div
              ref={scrollerRef}
              tabIndex={0}
              role="group"
              aria-label="Testimonial slides"
              // A touch on the slides is the visitor taking over, and any press
              // or wheel on them overrides a scroll goTo started.
              onPointerDown={(event) => {
                if (targetRef.current !== null) settle()
                if (event.pointerType !== 'mouse') setPaused(true)
              }}
              onWheel={() => targetRef.current !== null && settle()}
              className="relative flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E16820]"
            >
              {configuredTestimonials.map((t, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    slideRefs.current[idx] = el
                  }}
                  data-index={idx}
                  data-active={idx === activeIndex ? 'true' : undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${count}`}
                  className="w-full shrink-0 snap-center"
                >
                  <div className="px-12 md:px-20 relative">
                    {/* Left Quote */}
                    <div className="absolute left-[10px] md:left-[50px] top-0 opacity-20 w-6 md:w-9 h-6 md:h-9">
                      <Image src={QuoteLeft} alt="Opening quote" width={36} height={36} />
                    </div>

                    <h3 className="text-[22px] font-bold mb-[10px] text-[#333] leading-6 italic aria-font">
                      {t.heading}
                    </h3>
                    <p className="text-[17px] font-medium text-black italic px-0 sm:px-4 md:px-8 aria-font">
                      {t.text}
                    </p>

                    {t.name && (
                      <p className="text-[14px] font-medium my-2 text-[#666666] aria-font">
                        {t.name}
                      </p>
                    )}

                    {t.location &&
                      (t.locationUrl ? (
                        <a href={t.locationUrl}>
                          <p className="text-[14px] font-medium text-[#227AB5] aria-font">
                            {t.location}
                          </p>
                        </a>
                      ) : (
                        <p className="text-[14px] font-medium text-[#227AB5] aria-font">
                          {t.location}
                        </p>
                      ))}

                    {/* Right Quote */}
                    <div className="absolute right-[10px] md:right-[50px] bottom-0 opacity-20 w-6 md:w-9 h-6 md:h-9">
                      <Image src={QuoteRight} alt="Closing quote" width={36} height={36} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* The arrows wrap around rather than disabling at the ends: a
                button that turns disabled under the keyboard drops focus to
                the page. */}
            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => goTo((activeIndex - 1 + count) % count, true)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <MdOutlineArrowBackIos className="w-6 h-6" />
            </button>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => goTo((activeIndex + 1) % count, true)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <MdOutlineArrowForwardIos className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center mt-10 space-x-2">
            {configuredTestimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, true)}
                className="group flex h-6 min-w-[24px] cursor-pointer items-center justify-center"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={activeIndex === i ? 'true' : undefined}
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    activeIndex === i
                      ? 'w-8 bg-orange-600'
                      : 'w-2 bg-gray-300 group-hover:bg-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
