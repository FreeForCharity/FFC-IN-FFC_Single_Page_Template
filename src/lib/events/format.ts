import type { UnifiedEvent } from './types'

const DAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  timeZone: 'UTC',
})

const MONTH_SHORT_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
})

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  timeZone: 'UTC',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

export function formatDayNumber(iso: string): string {
  return DAY_FORMATTER.format(new Date(iso))
}

export function formatMonthShort(iso: string): string {
  return MONTH_SHORT_FORMATTER.format(new Date(iso)).toUpperCase()
}

export function formatWeekday(iso: string): string {
  return WEEKDAY_FORMATTER.format(new Date(iso))
}

export function formatFullDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso))
}

export function formatTimeRange(event: UnifiedEvent): string {
  if (event.allDay) return 'All day'
  const start = TIME_FORMATTER.format(new Date(event.startUtc))
  if (!event.endUtc) return start
  const sameDay = event.startUtc.slice(0, 10) === event.endUtc.slice(0, 10)
  const end = TIME_FORMATTER.format(new Date(event.endUtc))
  if (sameDay) return `${start} – ${end}`
  return `${start} – ${formatFullDate(event.endUtc)} ${end}`
}

export function truncate(value: string, max = 160): string {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trimEnd()}…`
}
