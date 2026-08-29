'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  googleCalendarUrl,
  icsDataUri,
  office365Url,
  outlookLiveUrl,
} from '@/lib/events/addToCalendar'
import type { UnifiedEvent } from '@/lib/events/types'

interface Props {
  event: UnifiedEvent
}

export default function AddToCalendarMenu({ event }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const icsHref = icsDataUri(event)
  const safeSlug =
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'event'

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md border border-[#2B627B] px-3 py-2 text-sm font-[500] text-[#2B627B] hover:bg-[#2B627B] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2B627B] lato-font"
      >
        Add to calendar
        <span aria-hidden="true" className="ml-1">
          ▾
        </span>
      </button>
      {open && (
        // Disclosure pattern, not an ARIA menu: these are plain links, and
        // role="menu" promises arrow-key/roving-focus behavior this list
        // does not implement. Tab order + Escape (with focus restore) is the
        // correct contract for a list of links behind a toggle button.
        <ul
          id={menuId}
          aria-label={`Add "${event.title}" to your calendar`}
          className="absolute z-10 mt-2 left-0 sm:left-auto sm:right-0 w-56 max-w-[calc(100vw-2rem)] rounded-md border border-gray-200 bg-white shadow-lg py-1 text-sm"
        >
          <li>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
            >
              Google Calendar
            </a>
          </li>
          <li>
            <a
              href={office365Url(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
            >
              Outlook 365
            </a>
          </li>
          <li>
            <a
              href={outlookLiveUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
            >
              Outlook.com
            </a>
          </li>
          <li>
            <a
              href={icsHref}
              download={`${safeSlug}.ics`}
              className="block px-4 py-2 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-100"
            >
              Apple Calendar (.ics)
            </a>
          </li>
        </ul>
      )}
    </div>
  )
}
