import React from 'react'
import Image from 'next/image'
import { Calendar, Clock, MapPin } from 'lucide-react'
import type { UnifiedEvent } from '@/lib/events/types'
import { SOURCE_LABELS } from '@/lib/events/types'
import {
  formatDayNumber,
  formatFullDate,
  formatMonthShort,
  formatTimeRange,
  truncate,
} from '@/lib/events/format'
import SourceBadge from './SourceBadge'
import AddToCalendarMenu from './AddToCalendarMenu'

interface Props {
  event: UnifiedEvent
}

export default function EventCard({ event }: Props) {
  const day = formatDayNumber(event.startUtc)
  const month = formatMonthShort(event.startUtc)
  const fullDate = formatFullDate(event.startUtc)
  const timeRange = formatTimeRange(event)
  const description = event.description ? truncate(event.description, 160) : undefined

  return (
    <article
      className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      aria-labelledby={`event-${event.id}-title`}
    >
      {event.imageUrl ? (
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div
          className="w-full h-24 bg-gradient-to-r from-[#2B627B] to-[#2A6682]"
          aria-hidden="true"
        />
      )}

      <div className="flex gap-4 p-5 flex-1">
        <div
          className="flex flex-col items-center justify-center min-w-[64px] rounded-lg bg-[#2B627B] text-white py-2 px-1 self-start"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold tracking-wide" id="lato-font">
            {month}
          </span>
          <span className="text-2xl font-bold leading-none" id="lato-font">
            {day}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <SourceBadge source={event.source} />
          </div>
          <h3
            id={`event-${event.id}-title`}
            className="text-lg font-semibold text-gray-900 mb-2 leading-snug"
          >
            {event.title}
          </h3>

          <ul className="space-y-1 text-sm text-gray-600 mb-3" id="lato-font">
            <li className="flex items-start gap-2">
              <Calendar
                className="w-4 h-4 mt-0.5 text-[#2B627B] flex-shrink-0"
                aria-hidden="true"
              />
              <span>
                <span className="sr-only">Date: </span>
                {fullDate}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 text-[#2B627B] flex-shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Time: </span>
                {timeRange}
                {event.timezone && <span className="text-gray-500"> ({event.timezone})</span>}
              </span>
            </li>
            {event.location && (
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 text-[#2B627B] flex-shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <span className="sr-only">Location: </span>
                  {event.location}
                </span>
              </li>
            )}
          </ul>

          {description && (
            <p className="text-sm text-gray-700 mb-4" id="lato-font">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-5 pt-0 mt-auto">
        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#2B627B] px-4 py-2 text-sm font-[500] text-white hover:bg-[#1f4a5d] transition-colors"
            id="lato-font"
          >
            View on {SOURCE_LABELS[event.source]}
          </a>
        ) : (
          <span />
        )}
        <AddToCalendarMenu event={event} />
      </div>
    </article>
  )
}
