'use client'

import { useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
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
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md border border-[#2B627B] px-3 py-2 text-sm font-[500] text-[#2B627B] hover:bg-[#2B627B] hover:text-white transition-colors"
        id="lato-font"
      >
        Add to calendar
        <span aria-hidden="true" className="ml-1">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute z-10 mt-2 right-0 w-56 rounded-md border border-gray-200 bg-white shadow-lg py-1 text-sm"
          id="lato-font"
        >
          <li role="none">
            <a
              role="menuitem"
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50"
            >
              Google Calendar
            </a>
          </li>
          <li role="none">
            <a
              role="menuitem"
              href={office365Url(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50"
            >
              Outlook 365
            </a>
          </li>
          <li role="none">
            <a
              role="menuitem"
              href={outlookLiveUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-50"
            >
              Outlook.com
            </a>
          </li>
          <li role="none">
            <a
              role="menuitem"
              href={icsHref}
              download={`${safeSlug}.ics`}
              className="block px-4 py-2 hover:bg-gray-50"
            >
              Apple Calendar (.ics)
            </a>
          </li>
        </ul>
      )}
    </div>
  )
}
