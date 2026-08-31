/**
 * @jest-environment jsdom
 */

/**
 * Tracking IDs must be safe to embed in an inline `<script>` body.
 *
 * The three loaders build script text by interpolation. The IDs are
 * build-time values a maintainer sets, not visitor input, so this is defence
 * in depth — but `isConfigured()` only rejects placeholder values, it does
 * not validate shape, so nothing else stands between a malformed ID and the
 * script body.
 *
 * Two properties, and the second is the one that decides the implementation:
 *
 *  1. The emitted script still PARSES. A value that terminates the string it
 *     sits in turns the rest of the tag into stray code — and the failure is
 *     silent, because a broken inline script throws in the browser rather
 *     than anywhere a build or test would notice.
 *  2. No value may contribute a literal `</script>`. `JSON.stringify` alone
 *     satisfies (1) and NOT (2): it supplies quotes and escapes quotes and
 *     newlines, but leaves `<` untouched, so a stringify-only fix still lets
 *     an ID close the element early and have the remainder parsed as markup.
 *
 * Parsing is checked with `new Function(text)`, which compiles without
 * executing — so `window`/`document` references in the tag bodies are fine.
 */
import React from 'react'
import { render, waitFor } from '@testing-library/react'

jest.mock('@/lib/analytics.config', () => ({
  analyticsConfig: {
    // Each value tries to close its own string, then the script element.
    gaMeasurementId: `G-X'); alert('xss'); //</script><img src=x onerror=alert(1)>`,
    metaPixelId: `123'); alert('xss'); //</script>`,
    clarityProjectId: `abc"); alert("xss"); //</script>`,
  },
  // Deliberately permissive. The guard in front of these loaders does not
  // validate shape, so the escaping has to hold on its own.
  isConfigured: () => true,
}))

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true })

describe('CookieConsent inline script escaping', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.head.querySelectorAll('script').forEach((el) => el.remove())
  })

  const inlineScripts = () =>
    Array.from(document.head.querySelectorAll('script'))
      .map((el) => el.textContent || '')
      .filter((t) => t.trim().length > 0)

  const renderWithEverythingGranted = async () => {
    localStorageMock.setItem(
      'cookie-consent',
      JSON.stringify({ necessary: true, functional: true, analytics: true, marketing: true })
    )
    const CookieConsent = require('../../src/components/cookie-consent').default
    render(<CookieConsent />)
    await waitFor(() => {
      expect(inlineScripts().length).toBeGreaterThan(0)
    })
    return inlineScripts()
  }

  it('emits script bodies that still parse when the IDs are hostile', async () => {
    for (const [i, text] of (await renderWithEverythingGranted()).entries()) {
      // Compiles, does not run.
      expect(() => new Function(text)).not.toThrow()
      expect(i).toBeGreaterThanOrEqual(0)
    }
  })

  it('never lets an ID contribute a literal </script>', async () => {
    for (const text of await renderWithEverythingGranted()) {
      expect(text).not.toContain('</script>')
    }
  })

  it('round-trips the ID exactly, so escaping cannot silently mangle a real one', async () => {
    // The strongest single check: parse the emitted literal back and compare
    // it to the value that went in. Escaping that loses or alters characters
    // would misconfigure analytics on every site, which is a worse outcome
    // than the injection it guards against — and it would be silent.
    const all = (await renderWithEverythingGranted()).join('\n')
    const match = all.match(/gtag\('config', (".*?"), \{/s)
    expect(match).not.toBeNull()
    expect(JSON.parse(match![1])).toBe(
      `G-X'); alert('xss'); //</script><img src=x onerror=alert(1)>`
    )
  })
})
