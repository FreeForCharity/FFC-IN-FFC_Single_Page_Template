// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Configure jest-axe for accessibility testing
import 'jest-axe/extend-expect'

// jsdom doesn't implement matchMedia. Default to prefers-reduced-motion: reduce
// so motion components (AnimatedNumber) render their static path in unit tests,
// matching the deterministic behavior we want under test. E2E covers the real
// animation in a browser.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

// jsdom doesn't implement IntersectionObserver. Provide a no-op stub so hooks
// that observe elements don't throw during unit tests.
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback
      this.options = options
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

// Suppress Next.js Link component act() warnings
// These warnings occur because Next.js Link uses internal intersection observer
// that triggers state updates after render. This is expected behavior and not a test issue.
// See: https://github.com/vercel/next.js/issues/47738
const originalError = console.error.bind(console)
console.error = (...args) => {
  // Check if the error message contains the Next.js Link component act() warning
  // The message could be the first argument or could be part of a format string
  const messageStr = args.map((arg) => String(arg)).join(' ')
  if (messageStr.includes('ForwardRef(LinkComponent)') && messageStr.includes('act(')) {
    return
  }
  originalError(...args)
}

// jsdom does not implement the native <dialog> methods. Provide a minimal
// stand-in so components that open dialogs with showModal() (see
// ApplicationFormButton and CookieConsent) can be unit tested. It toggles the
// `open` attribute, keeps returnValue, and fires `close` like a browser does.
// Focus, inertness and Escape handling are covered by the Playwright suite.
if (typeof window !== 'undefined' && window.HTMLDialogElement) {
  const proto = window.HTMLDialogElement.prototype
  if (typeof proto.showModal !== 'function') {
    proto.show = function show() {
      this.setAttribute('open', '')
    }
    proto.showModal = function showModal() {
      this.setAttribute('open', '')
    }
    proto.close = function close(returnValue) {
      if (!this.hasAttribute('open')) return
      if (returnValue !== undefined) this.returnValue = String(returnValue)
      this.removeAttribute('open')
      this.dispatchEvent(new window.Event('close'))
    }
  }
  if (!('returnValue' in proto)) {
    Object.defineProperty(proto, 'returnValue', {
      configurable: true,
      get() {
        return this._returnValue ?? ''
      },
      set(value) {
        this._returnValue = String(value)
      },
    })
  }
  if (!('open' in proto)) {
    Object.defineProperty(proto, 'open', {
      configurable: true,
      get() {
        return this.hasAttribute('open')
      },
    })
  }
}
