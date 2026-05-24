import { parseIcs } from '@/lib/events/parsers/ics'

function buildIcs(events: string[]): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

function farFutureDate(daysFromNow: number): {
  raw: string
  iso: string
} {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  date.setUTCSeconds(0, 0)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mi = String(date.getUTCMinutes()).padStart(2, '0')
  return {
    raw: `${yyyy}${mm}${dd}T${hh}${mi}00Z`,
    iso: `${yyyy}-${mm}-${dd}T${hh}:${mi}:00.000Z`,
  }
}

describe('parseIcs', () => {
  it('parses a simple Google-style VEVENT block', () => {
    const start = farFutureDate(7)
    const end = farFutureDate(7.05)
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:abc-123@google.com',
      `DTSTART:${start.raw}`,
      `DTEND:${end.raw}`,
      'SUMMARY:Monthly Volunteer Orientation',
      'LOCATION:State College\\, PA',
      'DESCRIPTION:Welcome new volunteers\\nBring an ID',
      'URL:https://example.org/orientation',
      'END:VEVENT',
    ])

    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    const [event] = events
    expect(event.id).toBe('google:abc-123@google.com')
    expect(event.source).toBe('google')
    expect(event.title).toBe('Monthly Volunteer Orientation')
    expect(event.location).toBe('State College, PA')
    expect(event.description).toContain('Welcome new volunteers')
    expect(event.description).toContain('Bring an ID')
    expect(event.url).toBe('https://example.org/orientation')
    expect(event.startUtc).toBe(start.iso)
    expect(event.endUtc).toBe(end.iso)
    expect(event.allDay).toBe(false)
  })

  it('handles all-day events using DTSTART;VALUE=DATE', () => {
    const future = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    const dateRaw =
      future.getUTCFullYear().toString() +
      String(future.getUTCMonth() + 1).padStart(2, '0') +
      String(future.getUTCDate()).padStart(2, '0')

    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:allday@microsoft.com',
      `DTSTART;VALUE=DATE:${dateRaw}`,
      'SUMMARY:Volunteer Appreciation Day',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'microsoft')
    expect(events).toHaveLength(1)
    expect(events[0].allDay).toBe(true)
    expect(events[0].source).toBe('microsoft')
  })

  it('captures TZID parameter for zoned start times', () => {
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:zoned@example.com',
      'DTSTART;TZID=America/New_York:20990315T140000',
      'SUMMARY:Zoned event',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    expect(events[0].timezone).toBe('America/New_York')
  })

  it('unfolds long lines per RFC 5545', () => {
    const start = farFutureDate(5)
    const end = farFutureDate(5.1)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'UID:long@example.com',
      `DTSTART:${start.raw}`,
      `DTEND:${end.raw}`,
      'SUMMARY:This summary is split across ',
      ' two lines using folding',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    // RFC 5545 unfolding strips the leading whitespace of the continuation line.
    expect(events[0].title).toBe('This summary is split across two lines using folding')
  })

  it('filters out events that ended more than 24h ago', () => {
    const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    const pastRaw =
      past.getUTCFullYear().toString() +
      String(past.getUTCMonth() + 1).padStart(2, '0') +
      String(past.getUTCDate()).padStart(2, '0') +
      'T120000Z'
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:past@example.com',
      `DTSTART:${pastRaw}`,
      `DTEND:${pastRaw}`,
      'SUMMARY:Last month event',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(0)
  })

  it('ignores nested VALARM components', () => {
    const start = farFutureDate(3)
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:alarm@example.com',
      `DTSTART:${start.raw}`,
      'SUMMARY:Event with alarm',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'TRIGGER:-PT15M',
      'SUMMARY:Reminder',
      'END:VALARM',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    expect(events[0].title).toBe('Event with alarm')
  })
})
