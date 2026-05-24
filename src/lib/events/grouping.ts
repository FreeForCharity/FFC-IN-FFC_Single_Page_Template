import type { EventBucket, UnifiedEvent } from './types'

const MONTH_KEY_OPTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
}

const MONTH_LABEL_OPTS: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric',
}

function monthKey(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { ...MONTH_KEY_OPTS, timeZone }).formatToParts(
    new Date(iso)
  )
  const year = parts.find((p) => p.type === 'year')?.value ?? '0000'
  const month = parts.find((p) => p.type === 'month')?.value ?? '00'
  return `${year}-${month}`
}

function monthLabel(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', { ...MONTH_LABEL_OPTS, timeZone }).format(new Date(iso))
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
