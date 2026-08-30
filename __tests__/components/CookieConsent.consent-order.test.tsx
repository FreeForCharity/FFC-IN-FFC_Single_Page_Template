/**
 * Ordering contract: a stored consent choice must be applied (the gtag
 * consent update pushed) BEFORE the direct GA4 script is injected.
 *
 * Without this ordering, a returning visitor OUTSIDE the EEA/UK/CH who
 * previously DECLINED analytics would get the granted-by-default bootstrap
 * replayed ahead of their stored denial: GA's config lands in the queue
 * first and one cookie-based hit fires before the update applies
 * (wait_for_update only guards the region-scoped EEA call, not the
 * unscoped grant).
 *
 * This file mocks a REAL-looking measurement ID so the loader actually
 * injects; the placeholder-inertness behavior is asserted separately in
 * CookieConsent.test.tsx.
 */
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import CookieConsent from '../../src/components/cookie-consent'

jest.mock('../../src/lib/analytics.config', () => {
  const actual = jest.requireActual('../../src/lib/analytics.config')
  return {
    ...actual,
    analyticsConfig: {
      ...actual.analyticsConfig,
      gaMeasurementId: 'G-TEST1234567',
    },
  }
})

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

describe('CookieConsent consent-before-GA ordering', () => {
  const events: string[] = []
  let appendChildSpy: jest.SpyInstance

  beforeEach(() => {
    localStorageMock.clear()
    events.length = 0
    window.gtag = (...args: unknown[]) => {
      if (args[0] === 'consent' && args[1] === 'update') events.push('consent-update')
    }
    const realAppendChild = document.head.appendChild.bind(document.head)
    appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation(((node: Node) => {
      const src = (node as HTMLScriptElement).src || ''
      if (src.includes('googletagmanager.com/gtag')) events.push('ga-script-injected')
      return realAppendChild(node)
    }) as typeof document.head.appendChild)
  })

  afterEach(() => {
    appendChildSpy.mockRestore()
    // Assignment, not `delete`: jsdom's Window can refuse to delete a
    // property assigned in module scope, and a throw here would skip the
    // script cleanup below and leak state into the next test.
    window.gtag = undefined
    document.querySelectorAll('script[src*="googletagmanager.com/gtag"]').forEach((s) => s.remove())
  })

  it('pushes the stored denial as a consent update BEFORE injecting the GA4 script', async () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: false, marketing: false })
    )

    render(<CookieConsent />)

    await waitFor(() => {
      expect(events).toContain('consent-update')
      expect(events).toContain('ga-script-injected')
    })

    expect(events.indexOf('consent-update')).toBeLessThan(events.indexOf('ga-script-injected'))
  })

  it('still injects the GA4 script when there is no stored choice (banner showing)', async () => {
    render(<CookieConsent />)

    await waitFor(() => {
      expect(events).toContain('ga-script-injected')
    })
  })
})
