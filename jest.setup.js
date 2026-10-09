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
