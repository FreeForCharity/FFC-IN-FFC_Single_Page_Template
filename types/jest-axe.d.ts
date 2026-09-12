// Ambient declarations for jest-axe@10, which ships no types of its own — so
// `import { axe } from 'jest-axe'` in a test is an implicit-any error under
// `strict` once Next 16.3 started type-checking the test files.
//
// This file must contain NO top-level import/export: that would make it a
// module, and `declare module 'jest-axe'` inside a module is an *augmentation*
// of an existing module rather than an ambient declaration. jest-axe has no
// types to augment, so the declaration would silently do nothing.
declare module 'jest-axe' {
  export function axe(
    html: Element | Document | string,
    options?: Record<string, unknown>
  ): Promise<unknown>
  // Shaped for `expect.extend(toHaveNoViolations)`, which is how the tests use it.
  export const toHaveNoViolations: Record<string, jest.CustomMatcher>
}

declare module 'jest-axe/extend-expect'
