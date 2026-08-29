import React from 'react'
import snapshot from '@/data/events.generated.json'
import { siteConfig } from '@/lib/site.config'
import type { EventsSnapshot, UnifiedEvent } from '@/lib/events/types'
import { groupByMonth } from '@/lib/events/grouping'
import { safeHttpUrl, safeHttpsImageUrl } from '@/lib/events/safeUrl'
import { safeJsonLdSerialize } from '@/lib/events/jsonLd'
import { eventsSectionVisible } from '@/lib/events/visibility'
import EventCard from './EventCard'
import EmptyState from './EmptyState'

function eventJsonLd(event: UnifiedEvent) {
  const url = safeHttpUrl(event.url)
  const image = safeHttpsImageUrl(event.imageUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startUtc,
    endDate: event.endUtc,
    eventAttendanceMode:
      event.location === 'Online event'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(event.location && { location: { '@type': 'Place', name: event.location } }),
    ...(url && { url }),
    ...(image && { image }),
  }
}

const Events = () => {
  // Self-hide (FFC section-visibility convention): render nothing when the
  // section is flagged off, or when no calendar source is configured and the
  // committed snapshot is empty. See src/lib/events/visibility.ts.
  if (!eventsSectionVisible()) return null

  const data = snapshot as EventsSnapshot
  const buckets = groupByMonth(data.events ?? [])
  const hasEvents = buckets.length > 0
  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null
  // Public page link is per-charity config, never hardcoded; whitespace-only
  // behaves like empty (link self-hides), matching the other sections.
  const facebookPageUrl = siteConfig.integrations.eventsFacebookPageUrl.trim()

  return (
    <section id="events" className="py-[52px]" aria-label="Upcoming Events">
      <div className="w-[90%] mx-auto max-w-[1280px]">
        <h2
          id="faustina-font"
          className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[20px]"
        >
          Upcoming Events
        </h2>

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
                <h3
                  className="mb-6 border-b border-gray-200 pb-2 text-2xl font-semibold text-[#2B627B]"
                  id="lato-font"
                >
                  {bucket.monthLabel}
                </h3>
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

        {hasEvents && (
          <script
            type="application/ld+json"
            // Event JSON-LD for Google rich results. Static at build time,
            // but titles/descriptions/locations come from upstream calendars
            // and Facebook — safeJsonLdSerialize escapes `<` so a value
            // containing </script> cannot break out of this element.
            dangerouslySetInnerHTML={{
              __html: safeJsonLdSerialize((data.events ?? []).map(eventJsonLd).filter(Boolean)),
            }}
          />
        )}

        <p className="text-center mt-10 text-sm text-gray-500" id="lato-font">
          {updatedAt ? (
            <>
              Events last refreshed{' '}
              <time dateTime={updatedAt.toISOString()}>
                {updatedAt.toLocaleString('en-US', { timeZone: 'UTC' })} UTC
              </time>
              .
            </>
          ) : (
            <>Events are aggregated automatically from our calendar sources.</>
          )}
          {facebookPageUrl && (
            <>
              {' '}
              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View all events on Facebook (opens in new tab)"
                className="text-[#2B627B] underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2B627B]"
              >
                View all events on Facebook
              </a>
            </>
          )}
        </p>
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </section>
  )
}

export default Events
