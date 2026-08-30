/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://app.charity.example.org/"}
 *
 * Cookie deletion must try every scope a tracking cookie could plausibly
 * hold on a subdomain-hosted deployment: host-only, plus every suffix of
 * the hostname with 2+ labels, with and without a leading dot. A
 * www-strip alone would miss `charity.example.org` / `example.org` here,
 * leaving `_ga` behind after a decline. Single-label suffixes (`org`)
 * must not be attempted at all; multi-label public suffixes that do slip
 * in (e.g. `co.uk` hosts) are harmless no-ops browsers reject.
 */
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CookieConsent from '../../src/components/cookie-consent'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('cookie deletion domain candidates on a multi-label hostname', () => {
  const cookieWrites: string[] = []
  const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!

  beforeEach(() => {
    localStorageMock.clear()
    cookieWrites.length = 0
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => originalDescriptor.get!.call(document),
      set: (value: string) => {
        cookieWrites.push(value)
        originalDescriptor.set!.call(document, value)
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(document, 'cookie', originalDescriptor)
  })

  it('walks every 2+-label suffix of app.charity.example.org, dotted and undotted', async () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: false, marketing: false })
    )

    render(<CookieConsent />)

    const gaDeletions = () =>
      cookieWrites.filter((w) => w.startsWith('_ga=') && w.includes('expires=Thu, 01 Jan 1970'))

    await waitFor(() => {
      expect(gaDeletions().length).toBeGreaterThan(0)
    })

    const writes = gaDeletions()
    // Host-only attempt (no domain attribute).
    expect(writes.some((w) => !w.includes('domain='))).toBe(true)
    // Every suffix with 2+ labels, with and without a leading dot.
    for (const domain of [
      'app.charity.example.org',
      '.app.charity.example.org',
      'charity.example.org',
      '.charity.example.org',
      'example.org',
      '.example.org',
    ]) {
      expect(writes.some((w) => w.includes(`domain=${domain};`))).toBe(true)
    }
    // The single-label public suffix is never attempted.
    expect(writes.some((w) => / domain=\.?org;/.test(w))).toBe(false)
  })
})
