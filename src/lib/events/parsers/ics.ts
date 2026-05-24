import type { EventSource, UnifiedEvent } from '../types'
import { safeHttpUrl } from '../safeUrl'
import { wallTimeToUtc } from '../timezone'

interface RawProperty {
  name: string
  params: Record<string, string>
  value: string
}

interface RawEvent {
  props: Map<string, RawProperty[]>
}

const TEXT_UNESCAPE: Array<[RegExp, string]> = [
  [/\\n/gi, '\n'],
  [/\\,/g, ','],
  [/\\;/g, ';'],
  [/\\\\/g, '\\'],
]

function unfoldLines(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n')
  const lines: string[] = []
  for (const line of normalized.split('\n')) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1)
    } else {
      lines.push(line)
    }
  }
  return lines
}

function parseProperty(line: string): RawProperty | null {
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return null
  const head = line.slice(0, colonIndex)
  const value = line.slice(colonIndex + 1)
  const segments = head.split(';')
  const name = (segments.shift() ?? '').toUpperCase()
  if (!name) return null
  const params: Record<string, string> = {}
  for (const segment of segments) {
    const equalsIndex = segment.indexOf('=')
    if (equalsIndex === -1) continue
    const paramName = segment.slice(0, equalsIndex).toUpperCase()
    const paramValue = segment.slice(equalsIndex + 1).replace(/^"|"$/g, '')
    params[paramName] = paramValue
  }
  return { name, params, value }
}

function decodeText(value: string): string {
  let out = value
  for (const [pattern, replacement] of TEXT_UNESCAPE) {
    out = out.replace(pattern, replacement)
  }
  return out
}

function parseIcsDate(prop: RawProperty): { iso: string; allDay: boolean; tzid?: string } | null {
  const value = prop.value.trim()
  if (!value) return null
  const tzid = prop.params.TZID
  const isDateOnly = prop.params.VALUE === 'DATE' || /^\d{8}$/.test(value)
  if (isDateOnly) {
    const match = value.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (!match) return null
    const [, y, m, d] = match
    return { iso: `${y}-${m}-${d}T00:00:00.000Z`, allDay: true }
  }
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/)
  if (!match) return null
  const [, y, mo, d, h, mi, s, z] = match
  if (z === 'Z') {
    return { iso: `${y}-${mo}-${d}T${h}:${mi}:${s}.000Z`, allDay: false }
  }
  // Zoned local time per RFC 5545 §3.3.5: convert the wall-clock time
  // into true UTC using the TZID offset. Without a TZID we keep the
  // floating instant as-is.
  const utcMs = wallTimeToUtc(+y, +mo, +d, +h, +mi, +s, tzid)
  return {
    iso: new Date(utcMs).toISOString(),
    allDay: false,
    tzid: tzid || undefined,
  }
}

function extractEvents(lines: string[]): RawEvent[] {
  const events: RawEvent[] = []
  let current: RawEvent | null = null
  let depth = 0
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = { props: new Map() }
      depth = 1
      continue
    }
    if (line === 'END:VEVENT' && current) {
      if (depth === 1) events.push(current)
      current = null
      depth = 0
      continue
    }
    if (!current) continue
    // Skip nested components like VALARM
    if (line.startsWith('BEGIN:')) {
      depth++
      continue
    }
    if (line.startsWith('END:')) {
      depth--
      continue
    }
    if (depth !== 1) continue
    const prop = parseProperty(line)
    if (!prop) continue
    const bucket = current.props.get(prop.name) ?? []
    bucket.push(prop)
    current.props.set(prop.name, bucket)
  }
  return events
}

function firstProp(raw: RawEvent, name: string): RawProperty | undefined {
  return raw.props.get(name)?.[0]
}

function toUnifiedEvent(raw: RawEvent, source: EventSource): UnifiedEvent | null {
  const summary = firstProp(raw, 'SUMMARY')
  const dtstart = firstProp(raw, 'DTSTART')
  const uid = firstProp(raw, 'UID')
  if (!summary || !dtstart || !uid) return null
  const start = parseIcsDate(dtstart)
  if (!start) return null
  const dtend = firstProp(raw, 'DTEND')
  const end = dtend ? parseIcsDate(dtend) : null
  const rawUrl = firstProp(raw, 'URL')?.value
  const location = firstProp(raw, 'LOCATION')
  const description = firstProp(raw, 'DESCRIPTION')
  const safeUid = uid.value.trim().replace(/[\r\n]+/g, ' ')
  return {
    id: `${source}:${safeUid}`,
    source,
    title: decodeText(summary.value).trim(),
    description: description ? decodeText(description.value).trim() : undefined,
    startUtc: start.iso,
    endUtc: end?.iso,
    timezone: start.tzid,
    allDay: start.allDay,
    location: location ? decodeText(location.value).trim() : undefined,
    url: safeHttpUrl(rawUrl) ?? '',
    imageUrl: undefined,
  }
}

export function parseIcs(raw: string, source: EventSource): UnifiedEvent[] {
  const lines = unfoldLines(raw)
  const rawEvents = extractEvents(lines)
  const now = Date.now()
  const cutoff = now - 24 * 60 * 60 * 1000
  return rawEvents
    .map((event) => toUnifiedEvent(event, source))
    .filter((event): event is UnifiedEvent => event !== null)
    .filter((event) => {
      const end = event.endUtc ? Date.parse(event.endUtc) : Date.parse(event.startUtc)
      return Number.isFinite(end) && end >= cutoff
    })
}
