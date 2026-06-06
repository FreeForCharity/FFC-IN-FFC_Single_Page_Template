import type { UnifiedEvent } from './types'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function toCompactUtc(iso: string): string {
  const date = new Date(iso)
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

function toCompactDate(iso: string): string {
  const date = new Date(iso)
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`
}

function addUtcDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * 86_400_000).toISOString()
}

function rangeParam(event: UnifiedEvent): string {
  if (event.allDay) {
    // RFC 5545 + Google's spec: all-day events use 8-digit dates and an
    // exclusive end (so a one-day event spans start..start+1).
    const start = toCompactDate(event.startUtc)
    const end = toCompactDate(event.endUtc ?? addUtcDays(event.startUtc, 1))
    return `${start}/${end}`
  }
  const start = toCompactUtc(event.startUtc)
  const fallbackEnd = addUtcDays(event.startUtc, 1 / 24) // +1 hour
  const end = toCompactUtc(event.endUtc ?? fallbackEnd)
  return `${start}/${end}`
}

export function googleCalendarUrl(event: UnifiedEvent): string {
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', event.title)
  url.searchParams.set('dates', rangeParam(event))
  if (event.description) url.searchParams.set('details', event.description)
  if (event.location) url.searchParams.set('location', event.location)
  return url.toString()
}

export function outlookLiveUrl(event: UnifiedEvent): string {
  return outlookComposeUrl(event, 'https://outlook.live.com/calendar/0/deeplink/compose')
}

export function office365Url(event: UnifiedEvent): string {
  return outlookComposeUrl(event, 'https://outlook.office.com/calendar/0/deeplink/compose')
}

function outlookComposeUrl(event: UnifiedEvent, base: string): string {
  const url = new URL(base)
  url.searchParams.set('path', '/calendar/action/compose')
  url.searchParams.set('rru', 'addevent')
  url.searchParams.set('subject', event.title)
  if (event.allDay) {
    // Outlook's deeplink accepts YYYY-MM-DD for all-day events.
    url.searchParams.set('allday', 'true')
    url.searchParams.set('startdt', event.startUtc.slice(0, 10))
    url.searchParams.set('enddt', (event.endUtc ?? addUtcDays(event.startUtc, 1)).slice(0, 10))
  } else {
    url.searchParams.set('startdt', event.startUtc)
    if (event.endUtc) url.searchParams.set('enddt', event.endUtc)
  }
  if (event.description) url.searchParams.set('body', event.description)
  if (event.location) url.searchParams.set('location', event.location)
  return url.toString()
}

export function icsDataUri(event: UnifiedEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Free For Charity//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}`,
    `DTSTAMP:${toCompactUtc(new Date().toISOString())}`,
  ]
  if (event.allDay) {
    // RFC 5545 §3.6.1: all-day events use VALUE=DATE form. DTEND is
    // exclusive — a one-day event runs start..start+1.
    const endIso = event.endUtc ?? addUtcDays(event.startUtc, 1)
    lines.push(
      `DTSTART;VALUE=DATE:${toCompactDate(event.startUtc)}`,
      `DTEND;VALUE=DATE:${toCompactDate(endIso)}`
    )
  } else {
    const endIso = event.endUtc ?? addUtcDays(event.startUtc, 1 / 24)
    lines.push(`DTSTART:${toCompactUtc(event.startUtc)}`, `DTEND:${toCompactUtc(endIso)}`)
  }
  lines.push(`SUMMARY:${escapeIcsText(event.title)}`)
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`)
  if (event.url) lines.push(`URL:${event.url}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}
