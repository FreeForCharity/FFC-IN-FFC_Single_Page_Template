import React from 'react'
import snapshot from '@/data/events.generated.json'
import type { EventsSnapshot } from '@/lib/events/types'
import { groupByMonth } from '@/lib/events/grouping'
import EventCard from './EventCard'
import EmptyState from './EmptyState'

const Events = () => {
  const data = snapshot as EventsSnapshot
  const buckets = groupByMonth(data.events ?? [])
  const hasEvents = buckets.length > 0

  return (
    <section id="events" className="py-[52px]" aria-label="Upcoming Events">
      <div className="w-[90%] mx-auto max-w-[1280px]">
        <h1
          id="faustina-font"
          className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[20px]"
        >
          Upcoming Events
        </h1>

        <p
          className="text-center mx-auto mb-[50px] max-w-3xl text-[18px] lg:text-[20px] font-[400] text-gray-700"
          id="lato-font"
        >
          Join us for upcoming volunteer opportunities, training sessions, and community events
          aggregated from our Google Calendar, Microsoft 365 calendar, and Facebook page.
        </p>

        {hasEvents ? (
          <div className="space-y-12">
            {buckets.map((bucket) => (
              <div key={bucket.monthKey}>
                <h2
                  className="mb-6 border-b border-gray-200 pb-2 text-2xl font-semibold text-[#2B627B]"
                  id="lato-font"
                >
                  {bucket.monthLabel}
                </h2>
                <ul
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  role="list"
                  data-testid="events-grid"
                >
                  {bucket.events.map((event) => (
                    <li key={event.id} className="h-full">
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <p className="text-center mt-10 text-sm text-gray-500" id="lato-font">
          {data.updatedAt ? (
            <>
              Events last refreshed{' '}
              <time dateTime={new Date(data.updatedAt).toISOString()}>
                {new Date(data.updatedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC
              </time>
              .
            </>
          ) : (
            <>Events are aggregated automatically from our calendar sources.</>
          )}{' '}
          <a
            href="https://www.facebook.com/freeforcharity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2B627B] underline hover:no-underline"
          >
            View all events on Facebook
          </a>
        </p>
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </section>
  )
}

export default Events
