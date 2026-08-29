import { tzOffsetMinutes, wallTimeToUtc } from '@/lib/events/timezone'

describe('tzOffsetMinutes', () => {
  it('returns 0 for UTC', () => {
    const ms = Date.UTC(2026, 5, 15, 12, 0, 0)
    expect(tzOffsetMinutes(ms, 'UTC')).toBe(0)
  })

  it('returns -240 (EDT) for New York in mid-June', () => {
    const ms = Date.UTC(2026, 5, 15, 16, 0, 0) // 2026-06-15T16:00:00Z = 12:00 EDT
    expect(tzOffsetMinutes(ms, 'America/New_York')).toBe(-240)
  })

  it('returns -300 (EST) for New York in January', () => {
    const ms = Date.UTC(2026, 0, 15, 17, 0, 0)
    expect(tzOffsetMinutes(ms, 'America/New_York')).toBe(-300)
  })

  it('returns +60 (CET) for Paris in winter', () => {
    const ms = Date.UTC(2026, 0, 15, 11, 0, 0)
    expect(tzOffsetMinutes(ms, 'Europe/Paris')).toBe(60)
  })
})

describe('wallTimeToUtc', () => {
  it('treats input as UTC when no timezone given', () => {
    const ms = wallTimeToUtc(2026, 6, 15, 14, 0, 0)
    expect(new Date(ms).toISOString()).toBe('2026-06-15T14:00:00.000Z')
  })

  it('converts NY wall time to true UTC (EDT case)', () => {
    // 2 PM in New York during EDT = 18:00 UTC
    const ms = wallTimeToUtc(2026, 6, 15, 14, 0, 0, 'America/New_York')
    expect(new Date(ms).toISOString()).toBe('2026-06-15T18:00:00.000Z')
  })

  it('converts NY wall time to true UTC (EST case)', () => {
    const ms = wallTimeToUtc(2026, 1, 15, 14, 0, 0, 'America/New_York')
    expect(new Date(ms).toISOString()).toBe('2026-01-15T19:00:00.000Z')
  })

  it('converts Tokyo wall time to true UTC', () => {
    // 9 AM in Tokyo = 00:00 UTC (JST is UTC+9 year-round)
    const ms = wallTimeToUtc(2026, 6, 15, 9, 0, 0, 'Asia/Tokyo')
    expect(new Date(ms).toISOString()).toBe('2026-06-15T00:00:00.000Z')
  })
})

describe('wallTimeToUtc with an untrusted TZID', () => {
  it('falls back to the floating (UTC wall-clock) instant instead of throwing', () => {
    const floating = Date.UTC(2026, 9, 1, 17, 0, 0)
    expect(() => wallTimeToUtc(2026, 10, 1, 17, 0, 0, 'Not/AZone')).not.toThrow()
    expect(wallTimeToUtc(2026, 10, 1, 17, 0, 0, 'Not/AZone')).toBe(floating)
  })
})
