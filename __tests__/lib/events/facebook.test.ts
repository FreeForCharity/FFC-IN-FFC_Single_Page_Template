import { fetchFacebookEvents, normalizeFacebookEvents } from '@/lib/events/parsers/facebook'

function future(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return d.toISOString().replace('.000Z', '+0000')
}

describe('normalizeFacebookEvents', () => {
  it('maps Graph API response into UnifiedEvent shape', () => {
    const events = normalizeFacebookEvents({
      data: [
        {
          id: '1001',
          name: 'Spring Fundraiser',
          description: 'Annual fundraiser',
          start_time: future(7),
          end_time: future(7.1),
          place: {
            name: 'Community Center',
            location: { city: 'State College', state: 'PA' },
          },
          cover: { source: 'https://example.org/cover.jpg' },
        },
      ],
    })
    expect(events).toHaveLength(1)
    expect(events[0].source).toBe('facebook')
    expect(events[0].id).toBe('facebook:1001')
    expect(events[0].url).toBe('https://www.facebook.com/events/1001')
    expect(events[0].location).toContain('Community Center')
    expect(events[0].location).toContain('State College')
    expect(events[0].imageUrl).toBe('https://example.org/cover.jpg')
  })

  it('marks online events accordingly', () => {
    const events = normalizeFacebookEvents({
      data: [
        {
          id: '1002',
          name: 'Online Training',
          start_time: future(3),
          is_online: true,
        },
      ],
    })
    expect(events[0].location).toBe('Online event')
  })

  it('drops events with no start time', () => {
    const events = normalizeFacebookEvents({
      data: [{ id: '1003', name: 'Missing time' }],
    })
    expect(events).toHaveLength(0)
  })

  it('ignores Graph API error payloads', () => {
    const events = normalizeFacebookEvents({
      error: { message: 'Invalid OAuth access token', code: 190 },
    })
    expect(events).toHaveLength(0)
  })
})

describe('fetchFacebookEvents', () => {
  it('returns [] when API responds with non-2xx', async () => {
    const fakeFetch = jest.fn(async () => new Response('nope', { status: 401 }))
    const result = await fetchFacebookEvents(
      'pageid',
      'token',
      fakeFetch as unknown as typeof fetch
    )
    expect(result).toEqual([])
    expect(fakeFetch).toHaveBeenCalledTimes(1)
  })

  it('returns [] when the request throws', async () => {
    const fakeFetch = jest.fn(async () => {
      throw new Error('network down')
    })
    const result = await fetchFacebookEvents(
      'pageid',
      'token',
      fakeFetch as unknown as typeof fetch
    )
    expect(result).toEqual([])
  })

  it('builds a Graph URL with required params', async () => {
    let capturedUrl = ''
    const fakeFetch = jest.fn(async (input: string | URL | Request) => {
      capturedUrl = typeof input === 'string' ? input : input.toString()
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    await fetchFacebookEvents('PAGE_ID', 'TOKEN_VAL', fakeFetch as unknown as typeof fetch)
    expect(capturedUrl).toContain('/PAGE_ID/events')
    expect(capturedUrl).toContain('time_filter=upcoming')
    expect(capturedUrl).toContain('access_token=TOKEN_VAL')
  })
})
