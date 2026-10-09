import { expandRRule, parseRRule } from '@/lib/events/rrule'

const futureMs = 100 * 365 * 24 * 60 * 60 * 1000 // far enough that COUNT/UNTIL bound things, not the window

describe('parseRRule', () => {
  it('parses FREQ + INTERVAL + COUNT', () => {
    const r = parseRRule('FREQ=WEEKLY;INTERVAL=2;COUNT=4')
    expect(r.freq).toBe('WEEKLY')
    expect(r.interval).toBe(2)
    expect(r.count).toBe(4)
  })

  it('parses UNTIL in date-only and date-time forms', () => {
    expect(parseRRule('FREQ=DAILY;UNTIL=20990315').untilMs).toBe(Date.UTC(2099, 2, 15, 23, 59, 59))
    expect(parseRRule('FREQ=DAILY;UNTIL=20990315T040000Z').untilMs).toBe(
      Date.UTC(2099, 2, 15, 4, 0, 0)
    )
  })

  it('parses BYDAY with prefixed positions', () => {
    expect(parseRRule('FREQ=WEEKLY;BYDAY=TU,TH').byDay).toEqual([2, 4])
    expect(parseRRule('FREQ=MONTHLY;BYDAY=1MO').byDay).toEqual([1])
  })

  it('defaults INTERVAL to 1 when omitted', () => {
    expect(parseRRule('FREQ=DAILY').interval).toBe(1)
  })

  it('ignores unrecognised tokens', () => {
    const r = parseRRule('FREQ=BOGUS;INTERVAL=hi;COUNT=-5')
    expect(r.freq).toBeUndefined()
    expect(r.interval).toBe(1)
    expect(r.count).toBeUndefined()
  })
})

describe('expandRRule', () => {
  const window = { untilMs: Date.UTC(2099, 11, 31), maxInstances: 500 }
  const noEx = new Set<string>()

  it('returns just the seed when no rule supplied', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', undefined, noEx, window)
    expect(r).toEqual(['2099-01-15T12:00:00.000Z'])
  })

  it('expands DAILY with COUNT', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=DAILY;COUNT=4', noEx, window)
    expect(r).toEqual([
      '2099-01-15T12:00:00.000Z',
      '2099-01-16T12:00:00.000Z',
      '2099-01-17T12:00:00.000Z',
      '2099-01-18T12:00:00.000Z',
    ])
  })

  it('expands WEEKLY with INTERVAL', () => {
    const r = expandRRule(
      '2099-01-15T12:00:00.000Z',
      'FREQ=WEEKLY;INTERVAL=2;COUNT=3',
      noEx,
      window
    )
    expect(r).toEqual([
      '2099-01-15T12:00:00.000Z',
      '2099-01-29T12:00:00.000Z',
      '2099-02-12T12:00:00.000Z',
    ])
  })

  it('expands MONTHLY', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=MONTHLY;COUNT=3', noEx, window)
    expect(r).toEqual([
      '2099-01-15T12:00:00.000Z',
      '2099-02-15T12:00:00.000Z',
      '2099-03-15T12:00:00.000Z',
    ])
  })

  it('respects EXDATE', () => {
    const ex = new Set(['2099-01-16T12:00:00.000Z'])
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=DAILY;COUNT=4', ex, window)
    expect(r).toEqual([
      '2099-01-15T12:00:00.000Z',
      '2099-01-17T12:00:00.000Z',
      '2099-01-18T12:00:00.000Z',
    ])
  })

  it('honours WEEKLY+BYDAY (every Tue and Thu)', () => {
    // 2099-01-13 is a Tuesday
    const r = expandRRule(
      '2099-01-13T12:00:00.000Z',
      'FREQ=WEEKLY;BYDAY=TU,TH;COUNT=4',
      noEx,
      window
    )
    expect(r).toEqual([
      '2099-01-13T12:00:00.000Z', // Tue
      '2099-01-15T12:00:00.000Z', // Thu
      '2099-01-20T12:00:00.000Z', // Tue
      '2099-01-22T12:00:00.000Z', // Thu
    ])
  })

  it('honours UNTIL as upper bound', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=DAILY;UNTIL=20990118', noEx, window)
    expect(r.length).toBe(4) // 15, 16, 17, 18
    expect(r[r.length - 1]).toBe('2099-01-18T12:00:00.000Z')
  })

  it('caps at the window untilMs even without UNTIL/COUNT', () => {
    // Window ends at Jan 17 23:59; seed is at noon, so Jan 15, 16, 17 fit.
    const tight = { untilMs: Date.UTC(2099, 0, 17, 23, 59, 59), maxInstances: 500 }
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=DAILY', noEx, tight)
    expect(r.length).toBe(3)
  })

  it('caps at maxInstances', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=DAILY', noEx, {
      untilMs: Date.now() + futureMs, // absolute UTC time well in the future
      maxInstances: 5,
    })
    expect(r.length).toBe(5)
  })

  it('falls back to seed when FREQ is unrecognised', () => {
    const r = expandRRule('2099-01-15T12:00:00.000Z', 'FREQ=BOGUS;COUNT=99', noEx, window)
    expect(r).toEqual(['2099-01-15T12:00:00.000Z'])
  })
})
