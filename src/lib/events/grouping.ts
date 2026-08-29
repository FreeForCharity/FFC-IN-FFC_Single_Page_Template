import type { EventBucket, UnifiedEvent } from './types'

// Bucket and label each event in its own timezone so users see the month
// they'd expect (e.g. a Saturday-11pm-NY event belongs to May locally, not
// June UTC). When no timezone is set we fall back to UTC, in which case
// monthKey and monthLabel necessarily agree because both come from the
// same Intl.DateTimeFormat call.
const MONTH_KEY_OPTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
}

const MONTH_LABEL_OPTS: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric',
}

// Formatter construction is expensive and groupByMonth calls both helpers
// once per event, so cache instances per timezone at module level.
const keyFormatters = new Map<string, Intl.DateTimeFormat>()
const labelFormatters = new Map<string, Intl.DateTimeFormat>()

function cached(
  cache: Map<string, Intl.DateTimeFormat>,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  let fmt = cache.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', { ...options, timeZone })
    cache.set(timeZone, fmt)
  }
  return fmt
}

function monthKey(iso: string, timeZone: string): string {
  const parts = cached(keyFormatters, timeZone, MONTH_KEY_OPTS).formatToParts(new Date(iso))
  const year = parts.find((p) => p.type === 'year')?.value ?? '0000'
  const month = parts.find((p) => p.type === 'month')?.value ?? '00'
  return `${year}-${month}`
}

function monthLabel(iso: string, timeZone: string): string {
  return cached(labelFormatters, timeZone, MONTH_LABEL_OPTS).format(new Date(iso))
}

export function groupByMonth(events: UnifiedEvent[]): EventBucket[] {
  const byMonth = new Map<string, EventBucket>()
  const sorted = [...events].sort((a, b) => a.startUtc.localeCompare(b.startUtc))
  for (const event of sorted) {
    const zone = event.timezone || 'UTC'
    const key = monthKey(event.startUtc, zone)
    const label = monthLabel(event.startUtc, zone)
    const bucket = byMonth.get(key) ?? { monthKey: key, monthLabel: label, events: [] }
    bucket.events.push(event)
    byMonth.set(key, bucket)
  }
  return [...byMonth.values()]
}
