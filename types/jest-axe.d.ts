// Local type declarations for jest-axe.
//
// jest-axe ships no TypeScript declarations of its own (checked at v10 and
// v11 — no `types` field, no bundled .d.ts), and DefinitelyTyped's
// @types/jest-axe is abandoned at 3.5.9. This file declares exactly the
// surface this repo uses: `axe`, the `toHaveNoViolations` matcher, and the
// `jest-axe/extend-expect` side-effect registration in jest.setup.ts.
// If a test starts using more of the jest-axe API, extend these declarations.

declare module 'jest-axe' {
  import type { AxeResults, RunOptions, Spec } from 'axe-core'

  export interface JestAxeConfigureOptions extends RunOptions {
    globalOptions?: Spec
  }

  /** Run axe against a rendered container (or an HTML string). */
  export function axe(html: Element | string, options?: RunOptions): Promise<AxeResults>

  /** Build a pre-configured `axe` with shared defaults. */
  export function configureAxe(options?: JestAxeConfigureOptions): typeof axe

  /**
   * The matcher bundle for manual registration. At runtime this export is an
   * object of shape `{ toHaveNoViolations }`, so it is passed straight to
   * `expect.extend(toHaveNoViolations)` (jest-axe's documented usage).
   */
  export const toHaveNoViolations: jest.ExpectExtendMap
}

// Side-effect import that registers the matcher on the global `expect`
// (used by jest.setup.ts). The matcher's type surface is declared below.
declare module 'jest-axe/extend-expect'

// Make the matcher visible on every `expect()` under @types/jest.
declare namespace jest {
  // Matching @types/jest's declared type parameters; both are required for
  // the augmentation to merge, though the matcher itself uses neither.
  interface Matchers<R, T> {
    toHaveNoViolations(): R
  }
}
