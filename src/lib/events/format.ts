import type { UnifiedEvent } from './types'

interface FormatOptions {
  /** IANA zone the time should be rendered in. */
  timeZone?: string
}

function dayFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone })
}

function monthShortFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', { month: 'short', timeZone })
}

function weekdayFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone })
}

function dateFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  })
}

function timeFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  })
}

function shortTimezoneLabel(timeZone: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    })
    const part = fmt.formatToParts(new Date()).find((p) => p.type === 'timeZoneName')
    return part?.value ?? timeZone
  } catch {
    return timeZone
  }
}

function effectiveZone(event: UnifiedEvent, opts?: FormatOptions): string {
  return opts?.timeZone || event.timezone || 'UTC'
}

export function formatDayNumber(iso: string, opts?: FormatOptions): string {
  return dayFormatter(opts?.timeZone || 'UTC').format(new Date(iso))
}

export function formatMonthShort(iso: string, opts?: FormatOptions): string {
  return monthShortFormatter(opts?.timeZone || 'UTC')
    .format(new Date(iso))
    .toUpperCase()
}

export function formatWeekday(iso: string, opts?: FormatOptions): string {
  return weekdayFormatter(opts?.timeZone || 'UTC').format(new Date(iso))
}

export function formatFullDate(iso: string, opts?: FormatOptions): string {
  return dateFormatter(opts?.timeZone || 'UTC').format(new Date(iso))
}

export function formatEventDay(event: UnifiedEvent): string {
  return formatDayNumber(event.startUtc, { timeZone: effectiveZone(event) })
}

export function formatEventMonthShort(event: UnifiedEvent): string {
  return formatMonthShort(event.startUtc, { timeZone: effectiveZone(event) })
}

export function formatEventFullDate(event: UnifiedEvent): string {
  return formatFullDate(event.startUtc, { timeZone: effectiveZone(event) })
}

export function formatEventTimeRange(event: UnifiedEvent): string {
  if (event.allDay) return 'All day'
  const zone = effectiveZone(event)
  const tf = timeFormatter(zone)
  const start = tf.format(new Date(event.startUtc))
  if (!event.endUtc) return appendZoneLabel(start, event)
  const sameDay =
    formatFullDate(event.startUtc, { timeZone: zone }) ===
    formatFullDate(event.endUtc, { timeZone: zone })
  const end = tf.format(new Date(event.endUtc))
  const range = sameDay
    ? `${start} – ${end}`
    : `${start} – ${formatFullDate(event.endUtc, { timeZone: zone })} ${end}`
  return appendZoneLabel(range, event)
}

function appendZoneLabel(value: string, event: UnifiedEvent): string {
  if (!event.timezone) return value
  return `${value} ${shortTimezoneLabel(event.timezone)}`
}

export function truncate(value: string, max = 160): string {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  let cut = trimmed.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace)
  return `${cut.replace(/[\s,;:—.]+$/, '')}…`
}
