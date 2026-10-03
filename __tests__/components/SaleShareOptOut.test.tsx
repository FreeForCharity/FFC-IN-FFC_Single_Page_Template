/**
 * @jest-environment jsdom
 */

/**
 * The control itself, rendered and clicked.
 *
 * Every other opt-out suite drives `setSaleShareOptOut` or its window event
 * directly, which means all of them would still pass if this button were
 * omitted from the footer, never wired to the handler, or never updated its
 * label after hydration. Reported by Copilot on
 * FFC-IN-Footer_Only_Template#140, and it is the right criticism: California,
 * Colorado and Connecticut require a clear and conspicuous control, so the
 * control existing and working IS the compliance claim. The library behind it
 * is the easy half.
 *
 * Also covers the one thing the component deliberately does NOT offer: a
 * visitor whose browser sends GPC cannot switch sharing back on here, because
 * the site may not override a signal the law requires it to honour.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'

import Footer from '../../src/components/footer'
import { SaleShareOptOut } from '../../src/components/sale-share-opt-out'
import { SALE_SHARE_OPT_OUT_KEY, setSaleShareOptOut } from '../../src/lib/consent-mode'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
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

/** Run `fn` with the browser sending Global Privacy Control. */
function withGpc<T>(fn: () => T): T {
  Object.defineProperty(window.navigator, 'globalPrivacyControl', {
    configurable: true,
    value: true,
  })
  try {
    return fn()
  } finally {
    Reflect.deleteProperty(window.navigator, 'globalPrivacyControl')
  }
}

beforeEach(() => {
  // The opt-out keeps an in-memory session flag, which is module state and
  // would otherwise leak from one case into the next.
  setSaleShareOptOut(false)
  localStorageMock.clear()
})

describe('the Do Not Sell or Share control', () => {
  it('renders as a button for a visitor who has not opted out', () => {
    render(<SaleShareOptOut />)

    expect(screen.getByTestId('sale-share-opt-out')).toBeInTheDocument()
    expect(screen.getByText('Do Not Sell or Share My Personal Information')).toBeInTheDocument()
    expect(screen.queryByTestId('sale-share-opted-out')).not.toBeInTheDocument()
  })

  it('records the opt-out and changes its own label when clicked', () => {
    render(<SaleShareOptOut />)

    fireEvent.click(screen.getByTestId('sale-share-opt-out'))

    // The stored choice, so it survives a page load.
    expect(localStorageMock.getItem(SALE_SHARE_OPT_OUT_KEY)).toBe('true')
    // And the control re-renders rather than leaving a button that now lies.
    expect(screen.getByTestId('sale-share-opted-out')).toBeInTheDocument()
    expect(screen.getByText('Advertising sharing is off')).toBeInTheDocument()
    expect(screen.queryByTestId('sale-share-opt-out')).not.toBeInTheDocument()
  })

  it('renders as opted out for a returning visitor with the stored flag', () => {
    localStorageMock.setItem(SALE_SHARE_OPT_OUT_KEY, 'true')

    render(<SaleShareOptOut />)

    expect(screen.getByTestId('sale-share-opted-out')).toBeInTheDocument()
    expect(screen.queryByTestId('sale-share-opt-out')).not.toBeInTheDocument()
  })

  it('renders as opted out for a browser sending GPC, with no way to switch back on', () => {
    // Deliberate: the site may not override a universal opt-out signal, so the
    // copy states the outcome instead of offering a toggle that would do
    // nothing. A button here would be the misleading option.
    withGpc(() => {
      render(<SaleShareOptOut />)

      expect(screen.getByTestId('sale-share-opted-out')).toBeInTheDocument()
      expect(screen.queryByTestId('sale-share-opt-out')).not.toBeInTheDocument()
    })
  })

  it('renders the BUTTON on the server, never the "sharing is off" claim', () => {
    // `getServerSnapshot` is `() => false` on purpose, and jsdom never calls
    // it -- a client render uses `getSnapshot`, so no amount of
    // render/fireEvent reaches this. A mutation flipping it to `() => true`
    // was therefore detected by nothing until this case existed, and the
    // property is real: these sites are STATICALLY EXPORTED, so the server
    // snapshot is what every visitor's first paint shows. "Advertising
    // sharing is off" in exported HTML is a claim the page cannot
    // substantiate, because the opt-out lives in localStorage and
    // navigator.globalPrivacyControl, neither of which exists at export time.
    const html = renderToString(<SaleShareOptOut />)

    expect(html).toContain('Do Not Sell or Share My Personal Information')
    expect(html).not.toContain('Advertising sharing is off')
  })

  it('is mounted in the footer, which is what makes it reachable from every page', () => {
    // The statute asks for a clear and conspicuous control on every page. A
    // component that works in isolation and is not mounted satisfies nothing,
    // and nothing else in the suite would notice.
    render(<Footer />)

    expect(screen.getByTestId('sale-share-opt-out')).toBeInTheDocument()
  })
})
