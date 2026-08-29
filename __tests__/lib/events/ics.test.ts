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

  it('captures TZID and offsets zoned wall-time into true UTC', () => {
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
    // 2 PM in NY on March 15 (after DST starts) is EDT = 18:00 UTC.
    expect(events[0].startUtc).toBe('2099-03-15T18:00:00.000Z')
  })

  it('sanitises a CR/LF-injecting UID', () => {
    const start = farFutureDate(3)
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:abc\\r\\nDTSTART:19700101T000000Z',
      `DTSTART:${start.raw}`,
      'SUMMARY:Injection attempt',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    // The UID is line-folded by us when the raw line contains CR/LF. In this
    // synthetic test we use escaped \r\n in the property value; the parser
    // accepts that string and our escapeId helper replaces any literal CR/LF
    // it produces. The important assertion: the id has no newline characters.
    expect(events[0].id).not.toMatch(/[\r\n]/)
  })

  it('expands an RRULE seed into multiple occurrences', () => {
    const start = farFutureDate(7)
    // Build a DAILY RRULE with 5 occurrences starting at `start`. The seed
    // event lasts 1 hour; each expanded instance should keep that duration.
    const oneHourLater = new Date(Date.parse(start.iso) + 60 * 60 * 1000).toISOString()
    const formatRaw = (iso: string): string => {
      const d = new Date(iso)
      const yy = d.getUTCFullYear()
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
      const dd = String(d.getUTCDate()).padStart(2, '0')
      const hh = String(d.getUTCHours()).padStart(2, '0')
      const mi = String(d.getUTCMinutes()).padStart(2, '0')
      return `${yy}${mm}${dd}T${hh}${mi}00Z`
    }
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:weekly-standup@example.com',
      `DTSTART:${start.raw}`,
      `DTEND:${formatRaw(oneHourLater)}`,
      'SUMMARY:Weekly Standup',
      'RRULE:FREQ=DAILY;COUNT=5',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(5)
    // First occurrence uses the seed UID; subsequent ones get derived ids.
    expect(events[0].id).toBe('google:weekly-standup@example.com')
    expect(events[1].id).toMatch(/^google:weekly-standup@example\.com::/)
    // Spacing is 24h.
    const day0 = Date.parse(events[0].startUtc)
    const day1 = Date.parse(events[1].startUtc)
    expect(day1 - day0).toBe(24 * 60 * 60 * 1000)
  })

  it('honours EXDATE inside a recurring event', () => {
    const start = farFutureDate(3)
    const secondDayIso = new Date(Date.parse(start.iso) + 24 * 60 * 60 * 1000).toISOString()
    const formatRaw = (iso: string): string => {
      const d = new Date(iso)
      return (
        d.getUTCFullYear().toString() +
        String(d.getUTCMonth() + 1).padStart(2, '0') +
        String(d.getUTCDate()).padStart(2, '0') +
        'T' +
        String(d.getUTCHours()).padStart(2, '0') +
        String(d.getUTCMinutes()).padStart(2, '0') +
        '00Z'
      )
    }
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:exdate@example.com',
      `DTSTART:${start.raw}`,
      'SUMMARY:Daily with one skip',
      'RRULE:FREQ=DAILY;COUNT=4',
      `EXDATE:${formatRaw(secondDayIso)}`,
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(3)
    expect(events.some((e) => e.startUtc === secondDayIso)).toBe(false)
  })

  it('rejects unsafe URL schemes', () => {
    const start = farFutureDate(4)
    const ics = buildIcs([
      'BEGIN:VEVENT',
      'UID:hostile-url@example.com',
      `DTSTART:${start.raw}`,
      'URL:javascript:alert(1)',
      'SUMMARY:Hostile URL',
      'END:VEVENT',
    ])
    const events = parseIcs(ics, 'google')
    expect(events).toHaveLength(1)
    expect(events[0].url).toBe('')
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
