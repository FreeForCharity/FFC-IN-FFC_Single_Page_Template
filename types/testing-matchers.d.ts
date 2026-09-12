// Type-level registration for the matchers jest.setup.js installs at runtime.
//
// jest.setup.js is a .js file and tsconfig `include` only covers **/*.ts and
// **/*.tsx, so importing '@testing-library/jest-dom' there registers the
// matchers for jest but leaves tsc unaware of them. Next 16.2 did not
// type-check the test files during `next build`; Next 16.3 does, which
// surfaced 108 pre-existing "Property 'toBeInTheDocument' does not exist"
// errors. Importing jest-dom from a .d.ts inside the program applies its
// `declare global` augmentation everywhere.
import '@testing-library/jest-dom'

// jest-axe's extend-expect entry point adds this one; the module's own types
// are declared in jest-axe.d.ts (which must stay a script file — see there).
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}
