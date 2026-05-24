import type { EventBucket, UnifiedEvent } from './types'

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
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
