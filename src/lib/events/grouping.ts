import type { EventBucket, UnifiedEvent } from './types'

// Pinned to UTC so the rendered "May 2026" label matches the UTC-based
// monthKey ("2026-05") used to bucket events. Without timeZone:'UTC' the
// formatter uses the host machine's local timezone and can produce a label
// for the wrong month near UTC midnight (e.g. an event at 2026-05-31T23:00Z
// buckets into May but a non-UTC host could label that bucket "June 2026").
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function groupByMonth(events: UnifiedEvent[]): EventBucket[] {
  const byMonth = new Map<string, EventBucket>()
  const sorted = [...events].sort((a, b) => a.startUtc.localeCompare(b.startUtc))
  for (const event of sorted) {
    const date = new Date(event.startUtc)
    const monthKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}`
    const monthLabel = MONTH_FORMATTER.format(date)
    const bucket = byMonth.get(monthKey) ?? { monthKey, monthLabel, events: [] }
    bucket.events.push(event)
    byMonth.set(monthKey, bucket)
  }
  return [...byMonth.values()]
}
