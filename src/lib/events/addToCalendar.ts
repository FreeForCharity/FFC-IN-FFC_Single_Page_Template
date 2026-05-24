import type { UnifiedEvent } from './types'
import { safeHttpUrl } from './safeUrl'

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

function rangeParam(event: UnifiedEvent): string {
  const start = toCompactUtc(event.startUtc)
  const fallbackEnd = new Date(new Date(event.startUtc).getTime() + 60 * 60 * 1000).toISOString()
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
  url.searchParams.set('startdt', event.startUtc)
  if (event.endUtc) url.searchParams.set('enddt', event.endUtc)
  if (event.description) url.searchParams.set('body', event.description)
  if (event.location) url.searchParams.set('location', event.location)
  return url.toString()
}

export function icsDataUri(event: UnifiedEvent): string {
  const safeUrl = safeHttpUrl(event.url)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Free For Charity//Events//EN',
    'BEGIN:VEVENT',
    `UID:${escapeIcsId(event.id)}`,
    `DTSTAMP:${toCompactUtc(new Date().toISOString())}`,
    `DTSTART:${toCompactUtc(event.startUtc)}`,
    `DTEND:${toCompactUtc(event.endUtc ?? new Date(new Date(event.startUtc).getTime() + 60 * 60 * 1000).toISOString())}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ]
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`)
  if (safeUrl) lines.push(`URL:${safeUrl}`)
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

/**
 * UID is a single line of structured text (RFC 5545 § 3.8.4.7); CR/LF would
 * end the property and let an attacker inject sibling VEVENT properties.
 */
function escapeIcsId(value: string): string {
  return value.replace(/[\r\n]+/g, '_')
}
