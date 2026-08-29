import { formatEventTimeRange } from '@/lib/events/format'
import type { UnifiedEvent } from '@/lib/events/types'

function nyEvent(startUtc: string): UnifiedEvent {
  return {
    id: `google:dst-${startUtc}`,
    source: 'google',
    title: 'DST label check',
    startUtc,
    timezone: 'America/New_York',
    allDay: false,
    url: 'https://example.org/e',
  }
}

describe('formatEventTimeRange timezone label', () => {
  // The zone abbreviation must come from the EVENT's instant, not from when
  // the build runs: a January event in New York is EST even if the site is
  // built in July under EDT (and vice versa). Both assertions can never be
  // satisfied simultaneously by a now-based label, whatever the build date.
  it('labels a January New York event EST', () => {
    expect(formatEventTimeRange(nyEvent('2026-01-15T18:00:00Z'))).toMatch(/\bEST$/)
  })

  it('labels a July New York event EDT', () => {
    expect(formatEventTimeRange(nyEvent('2026-07-15T18:00:00Z'))).toMatch(/\bEDT$/)
  })
})
