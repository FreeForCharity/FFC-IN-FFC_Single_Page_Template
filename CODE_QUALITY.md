# Code Quality Standards

This document outlines the code quality standards, tools, and best practices for the Free For Charity project.

## Table of Contents

1. [Overview](#overview)
2. [Code Quality Tools](#code-quality-tools)
3. [Linting Standards](#linting-standards)
4. [TypeScript Standards](#typescript-standards)
5. [Testing Standards](#testing-standards)
6. [Code Review Guidelines](#code-review-guidelines)
7. [Performance Standards](#performance-standards)
8. [Security Standards](#security-standards)

---

## Overview

Code quality is essential for maintainability, collaboration, and long-term success of the project. We enforce quality through:

- **Automated tools**: ESLint, TypeScript, Jest
- **CI/CD checks**: Automated testing and validation
- **Code reviews**: Human review of all changes
- **Documentation**: Clear, up-to-date documentation

### Quality Goals

- **Maintainability**: Code should be easy to understand and modify
- **Reliability**: Code should work correctly and consistently
- **Performance**: Code should be efficient and fast
- **Security**: Code should be secure and free of vulnerabilities
- **Testability**: Code should be easy to test

---

## Code Quality Tools

### ESLint

**Purpose**: Catch common errors and enforce coding standards

**Configuration**: `eslint.config.mjs`

**Running ESLint**:

```bash
# Check for errors
npm run lint

# Auto-fix issues where possible
npm run lint -- --fix
```

**Key Rules**:

- No unused variables
- No console.log in production code
- Consistent import order
- Proper React hooks usage
- Next.js specific best practices

### TypeScript

**Purpose**: Type safety and better IDE support

**Configuration**: `tsconfig.json`

**Type Checking**:

```bash
# Type checking is automatic during build
npm run build

# Or use tsc directly
npx tsc --noEmit
```

**Best Practices**:

- Use explicit types for function parameters
- Avoid `any` type where possible
- Use interfaces for object shapes
- Use type guards for type narrowing
- Leverage TypeScript's strict mode

### Jest + React Testing Library

**Purpose**: Automated testing for components and utilities

**Configuration**: `jest.config.js`

**Running Tests**:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

**Coverage Requirements**:

- **Current Minimum**: 5% (initial baseline)
- **Target**: 15-20% for Phase 2
- **Long-term Goal**: 50%+

### Playwright

**Purpose**: End-to-end testing for critical user flows

**Configuration**: `playwright.config.ts`

**Running E2E Tests**:

```bash
# Build first
npm run build

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### CodeQL

**Purpose**: Security vulnerability scanning

**Configuration**: GitHub code scanning **default setup** (Settings → Security & Analysis). This template intentionally ships **without** a `codeql.yml` advanced workflow, because an advanced workflow and default setup cannot both be enabled.

**Automatic Scanning**:

- Runs on every push to main
- Runs on every pull request
- Weekly scheduled scans
- Results appear in Security tab

---

## Linting Standards

### File Organization

```
src/
├── app/           # Next.js app directory
├── components/    # React components
├── data/          # Static data files
└── lib/           # Utility functions
```

### Import Order

Organize imports in this order:

1. React and Next.js imports
2. Third-party library imports
3. Internal component imports
4. Internal utility imports
5. Type imports
6. Style imports

```tsx
// Good
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { assetPath } from '@/lib/assetPath'
import type { MenuItem } from '@/types'
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Files**: kebab-case for pages (`about-us/page.tsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Interfaces**: PascalCase with 'I' prefix or descriptive name (`IUser` or `UserData`)
- **Types**: PascalCase (`MenuItem`)

### Code Formatting

- **Indentation**: 2 spaces
- **Line length**: Aim for 100 characters
- **Semicolons**: Optional (let ESLint decide)
- **Quotes**: Single quotes for strings
- **Trailing commas**: Yes (ES5)

---

## TypeScript Standards

### Type Annotations

**Always annotate**:

- Function parameters
- Function return types (for exported functions)
- Component props
- Complex objects

**Example**:

```tsx
// Good
interface Props {
  title: string
  count: number
  onClose: () => void
}

export function Modal({ title, count, onClose }: Props): JSX.Element {
  return <div>{title}</div>
}

// Avoid
export function Modal(props) {
  // ❌ No types
  return <div>{props.title}</div>
}
```

### Avoid `any`

Use specific types or `unknown` when the type is genuinely unknown:

```tsx
// Bad
function process(data: any) {
  // ❌
  return data.value
}

// Good
function process(data: unknown) {
  // ✅
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value
  }
  return null
}

// Better
interface Data {
  value: string
}

function process(data: Data) {
  // ✅✅
  return data.value
}
```

### Use Type Guards

```tsx
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(input: unknown) {
  if (isString(input)) {
    // TypeScript knows input is string here
    return input.toUpperCase()
  }
}
```

### Interfaces vs Types

- Use **interfaces** for object shapes that may be extended
- Use **types** for unions, intersections, and primitives

```tsx
// Interface for extendable objects
interface User {
  id: string
  name: string
}

interface Admin extends User {
  permissions: string[]
}

// Type for unions and complex types
type Status = 'pending' | 'active' | 'inactive'
type Result<T> = { success: true; data: T } | { success: false; error: string }
```

---

## Testing Standards

### Unit Test Structure

```tsx
describe('ComponentName or functionName', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Reset state, mocks, etc.
  })

  // Cleanup (if needed)
  afterEach(() => {
    // Clean up
  })

  describe('when condition', () => {
    it('should do expected behavior', () => {
      // Arrange
      const props = { title: 'Test' }

      // Act
      render(<Component {...props} />)

      // Assert
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
```

### What to Test

**Do test**:

- Component rendering
- User interactions (clicks, typing, etc.)
- State changes
- API calls (mocked)
- Utility functions
- Edge cases and error conditions

**Don't test**:

- Implementation details
- Third-party libraries
- Styling (use visual regression tests instead)
- Next.js framework internals

### Testing Best Practices

1. **Write descriptive test names**: Use "should" statements
2. **Test behavior, not implementation**: Don't test how it works, test what it does
3. **Keep tests simple**: One assertion per test when possible
4. **Use data-testid sparingly**: Prefer semantic queries (getByRole, getByLabelText)
5. **Mock external dependencies**: API calls, timers, etc.
6. **Test accessibility**: Use getByRole, ensure proper ARIA attributes

### Mock Best Practices

```tsx
// Good mocking
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}))

// Mock modules at the top of the file
// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

---

## Code Review Guidelines

### What Reviewers Look For

#### Correctness

- Does the code solve the problem?
- Are there any bugs or edge cases not handled?
- Does it work as intended?

#### Design

- Is the solution well-designed?
- Is it the simplest solution?
- Does it follow existing patterns?
- Is it maintainable?

#### Complexity

- Is the code easy to understand?
- Are there overly complex sections?
- Can it be simplified?

#### Tests

- Are there sufficient tests?
- Do tests cover edge cases?
- Are tests clear and maintainable?

#### Style

- Does it follow our coding standards?
- Is it consistent with the rest of the codebase?
- Is it well-documented?

### PR Checklist

Before requesting review:

- [ ] Code is self-documented or has comments for complex logic
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Manual testing completed
- [ ] Screenshots added for UI changes
- [ ] Documentation updated if needed
- [ ] No console.log or debug code left in

### Giving Good Feedback

**Do**:

- Be respectful and constructive
- Explain _why_ something should change
- Suggest alternatives or improvements
- Ask questions to understand the approach
- Praise good solutions

**Don't**:

- Be dismissive or rude
- Just say "this is wrong" without explanation
- Make it personal
- Nitpick trivial issues
- Block on minor style preferences

### Example Feedback

```
# Good
"This function is doing too many things. Consider extracting
the validation logic into a separate function for better testability."

# Not helpful
"This is bad."
```

---

## Performance Standards

### Performance Budget

| Metric                           | Target  | Maximum |
| -------------------------------- | ------- | ------- |
| **First Contentful Paint**       | < 1.8s  | < 3.0s  |
| **Largest Contentful Paint**     | < 2.5s  | < 4.0s  |
| **Time to Interactive**          | < 3.8s  | < 7.3s  |
| **Total Bundle Size**            | < 500KB | < 1MB   |
| **Lighthouse Performance Score** | > 80    | > 60    |

### Performance Best Practices

1. **Optimize images**: Use WebP, proper sizing, lazy loading
2. **Code splitting**: Load only what's needed
3. **Minimize JavaScript**: Remove unused code
4. **Use CDN**: For static assets
5. **Enable caching**: Proper cache headers
6. **Lazy load components**: Use dynamic imports for heavy components

### Measuring Performance

```bash
# Build and analyze
npm run build

# Run Lighthouse
lhci autorun

# Check bundle size
npm run build
# Look for "First Load JS" in the output
```

---

## Security Standards

### Security Best Practices

1. **Never commit secrets**: API keys, tokens, passwords
2. **Validate user input**: All inputs should be validated
3. **Sanitize output**: Prevent XSS attacks
4. **Use HTTPS**: Always
5. **Keep dependencies updated**: Regular `npm audit`
6. **Follow OWASP guidelines**: Common vulnerabilities

### Environment Variables

**Never commit**:

- API keys
- Passwords
- Tokens
- Private keys

**Use environment variables**:

```env
# .env.local (never committed)
NEXT_PUBLIC_API_KEY=your-key-here
```

**Public variables** (safe to commit):

```env
# .env (can be committed)
NEXT_PUBLIC_APP_NAME=Free For Charity
```

### Content Security Policy

Be cautious with:

- `dangerouslySetInnerHTML`
- Dynamic script loading
- External iframe embedding

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

---

## Continuous Improvement

### Regular Reviews

- **Weekly**: Review test coverage trends
- **Monthly**: Review performance metrics
- **Quarterly**: Review and update coding standards
- **Annually**: Major refactoring or architecture review

### Learning and Growth

- Share knowledge through code reviews
- Document learnings in LESSONS_LEARNED.md
- Conduct retrospectives after major features
- Stay updated with Next.js and React best practices

---

## Tools and Resources

### Recommended VS Code Extensions

- **ESLint**: Real-time linting
- **TypeScript**: Enhanced TypeScript support
- **Tailwind CSS IntelliSense**: Tailwind autocomplete
- **Prettier**: Code formatting (if enabled)
- **Error Lens**: Inline error display
- **GitLens**: Git history and blame

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Run ESLint
npm test                # Run unit tests
npm run test:e2e        # Run E2E tests
npm run build           # Build for production

# Analysis
npm run test:coverage   # Test coverage report
npm audit               # Security vulnerabilities
npm outdated            # Check outdated packages
```

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Web.dev Best Practices](https://web.dev)

---

## Questions?

If you have questions about code quality standards:

1. Check this document first
2. Review existing code for examples
3. Ask in pull request reviews
4. Open a discussion on GitHub
5. Contact maintainers at hello@freeforcharity.org

---

**Last Updated**: 2025-12-03  
**Repository**: FreeForCharity/FFC_Single_Page_Template  
**Node.js**: 20.x (validated with v20.19.6)
