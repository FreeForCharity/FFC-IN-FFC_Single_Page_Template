# Technical Debt

**Document Purpose:** This document tracks backend and React application technical debt - code quality issues, security vulnerabilities, component fixes, and internal application improvements that are hidden from users but important for maintainability.

**Scope:** This document covers technical items that affect the **internal workings** of the React application, not user-facing features. For UI/UX enhancements and user-visible improvements, see [SITE_IMPROVEMENTS.md](./SITE_IMPROVEMENTS.md).

**Last Updated:** December 2025  
**Status:** Active Tracking  
**Repository:** FreeForCharity/FFC_Single_Page_Template

---

## Table of Contents

1. [Overview](#overview)
2. [ESLint Warnings (React Hooks)](#eslint-warnings-react-hooks)
3. [Security Vulnerabilities](#security-vulnerabilities)
4. [Dependency Management (Dependabot)](#dependency-management-dependabot)
5. [Backend & Application Improvements](#backend--application-improvements)
6. [Architecture Decisions](#architecture-decisions)
7. [Tracking and Prioritization](#tracking-and-prioritization)

---

## Overview

This document tracks technical debt items that:

- Don't currently block functionality
- Should be addressed in future refactoring
- Require monitoring and eventual resolution
- Are acceptable tradeoffs for now but not ideal long-term

**Current Technical Debt Count:** 1 React Hooks warning + 6 Next.js Image warnings + 4 security vulnerabilities (low severity)

**Recent Progress (December 2025):** Reduced React Hooks warnings from 10 to 1 (90% reduction) by fixing exhaustive-deps and set-state-in-effect issues.

---

## ESLint Warnings (React Hooks)

### Summary

The project has **1 React Hooks ESLint warning** remaining after recent refactoring (December 2025). This warning is low priority and doesn't affect functionality.

### Category 1: ~~`react-hooks/set-state-in-effect` (6 occurrences)~~ ✅ **RESOLVED**

**Status:** Fixed in December 2025

**Solution Applied:**

- Replaced `useEffect` with `useLayoutEffect` for all DOM measurements in accordion components
- Added inline ESLint suppressions with explanatory comments since `useLayoutEffect` is the correct React pattern for synchronous DOM measurements before paint
- This prevents visual flicker and follows React best practices

**Fixed Files:**

- `src/components/ui/Accordion.tsx`
- `src/components/ui/AccordionBold.tsx`
- `src/components/ui/Frequently-Asked-Questions.tsx`
- `src/components/ui/OrangeFaqItem.tsx`
- `src/components/free-charity-web-hosting/FAQs/index.tsx`
- `src/components/cookie-consent/index.tsx`

---

### Category 2: ~~`react-hooks/exhaustive-deps` (2 occurrences)~~ ✅ **RESOLVED**

**Status:** Fixed in December 2025

**Solution Applied:**

- `CallToActionCard.tsx`: Captured `cardRef.current` in a local variable inside the effect to prevent stale closures
- `ClientTestimonials/index.tsx`: Wrapped `handleNext` and related functions with `useCallback` to stabilize function references and added to dependency array

**Fixed Files:**

- `src/components/free-charity-web-hosting/ClientTestimonials/index.tsx`
- `src/components/ui/CallToActionCard.tsx`

---

### Category 3: `react-hooks/immutability` (1 occurrence)

**Issue:** Direct mutation of state values in Swiper carousel setup.

**Affected Files:**

- `src/components/home/Testimonials/index.tsx` (1 remaining - ClientTestimonials was refactored to not use Swiper)

**Why it's acceptable now:**

- Swiper library requires direct manipulation of navigation parameters
- Carousels function correctly
- This is a known pattern with Swiper.js integration

**Recommended fix:**

- Use Swiper's React-specific API instead of direct DOM manipulation
- OR create a custom carousel component that follows React patterns
- OR use a more React-friendly carousel library

**Priority:** Low - Works correctly, only a code style issue

---

### Category 4: `@next/next/no-img-element` (2 occurrences)

**Issue:** Using `<img>` tags instead of Next.js `<Image />` component.

**Affected Files:**

- `src/components/header/index.tsx`
- `src/components/footer/index.tsx`

**Why it's acceptable:**

- Project uses `output: "export"` for static site generation
- Next.js Image Optimization is **incompatible** with static export
- Images use the `assetPath()` helper for GitHub Pages compatibility
- This is an intentional architectural decision documented in README.md

**Why we can't fix this:**

- Next.js `<Image />` component requires Node.js server for optimization
- Static export doesn't support server-side image optimization
- Using `<Image />` would break GitHub Pages deployment

**Priority:** N/A - This is expected behavior, not technical debt

---

## Security Vulnerabilities

### Current Status (December 2025)

The project has **4 low severity vulnerabilities** identified by npm audit:

#### 1. tmp Package Vulnerabilities (4 low severity)

**CVE:** GHSA-52f5-9888-hmc6  
**Severity:** Low  
**Affected Package:** tmp (via @lhci/cli - Lighthouse CI)  
**Vulnerability:** Arbitrary temporary file/directory write via symbolic link

**Impact:**

- **Development only** - affects Lighthouse CI dev dependency
- **No production impact** - tmp package not used in production build
- **Limited risk** - requires local file system access

**Available Fixes:**

- `npm audit fix --force` - May introduce breaking changes to Lighthouse CI
- Wait for Lighthouse CI to update their dependencies

**Current Decision:** Monitor via Dependabot, low priority to fix manually

**Dependabot Status:** Will automatically create PR when fix becomes available

---

### Previously Resolved Vulnerabilities

#### ✅ Next.js RCE Vulnerability (RESOLVED)

**CVE:** GHSA-9qr9-h5gf-34mp  
**Severity:** Critical  
**Status:** Fixed in next@16.0.7  
**Resolution Date:** December 2025

This critical vulnerability in Next.js has been resolved by upgrading to version 16.0.7.

---

### Monitoring Process

**Automated Monitoring:**

- Dependabot checks for vulnerabilities weekly (Mondays at 9:00 AM UTC)
- GitHub Security Advisories trigger immediate alerts
- CodeQL scanning runs on every PR and push to main

**Manual Checks:**

```bash
# Check for vulnerabilities
npm audit

# View details
npm audit --json

# Attempt automatic fix (use with caution)
npm audit fix

# Fix including breaking changes (test thoroughly first!)
npm audit fix --force
```

**Response Protocol:**

1. **Critical/High:** Address immediately, create emergency PR
2. **Moderate:** Address within 1 week, include in next sprint
3. **Low (production):** Address within 1 month
4. **Low (dev only):** Monitor via Dependabot, low priority

---

## Dependency Management (Dependabot)

### Automated Dependency Updates

**Configuration:** `.github/dependabot.yml`

**Update Schedule:**

- **Frequency:** Weekly (Mondays at 9:00 AM UTC)
- **Scope:** npm packages (production and development)
- **Scope:** GitHub Actions workflow dependencies
- **Strategy:** Grouped updates for easier review

**Current Dependabot PRs:** Check [Pull Requests tab](https://github.com/FreeForCharity/FFC_Single_Page_Template/pulls)

### Pending Dependency Updates

Monitor active Dependabot PRs for:

- Security patches
- Minor version updates
- Major version updates (require manual testing)

**Review Process:**

1. Dependabot creates PR with changes
2. CI runs automated tests
3. Review changelog for breaking changes
4. Test locally if needed
5. Merge when safe

**Documentation:** See [DEPENDABOT.md](./DEPENDABOT.md) for full setup guide

---

## Backend & Application Improvements

### Code Quality Enhancements

These are internal code quality improvements that don't affect user experience:

#### TypeScript & Linting

- **TypeScript Strict Mode**: Enable additional strict flags for better type safety
- **Import Organization**: Add eslint-plugin-import for consistent import sorting
- **npm audit CI Integration**: Add automated npm audit checks with failure threshold

**Priority:** Low  
**Impact:** Improves code maintainability and catches bugs earlier

---

#### Build Quality Gates

- **Bundle Size Analysis**: Add next-bundle-analyzer to track bundle size
- **Test Coverage Reports**: Add coverage collection and reporting to CI
- **Performance Budgets**: Set and enforce performance budgets in CI

**Priority:** Low  
**Impact:** Prevents performance regressions and monitors build health

---

#### CI/CD Improvements

- **Branch Protection**: Require status checks to pass before merging
- **Cache Optimization**: Improve caching strategy for faster builds
- **Parallel Testing**: Run test suites in parallel for faster feedback

**Priority:** Low-Medium  
**Impact:** Faster development feedback loops and better code quality gates

---

#### Testing Infrastructure

- **Increased Test Coverage**: Target 25-50% coverage for critical components
- **Component Unit Tests**: Add more Jest tests for complex components

**Current Status:** 5% test coverage baseline established  
**Priority:** Medium  
**Impact:** Catches bugs earlier in development cycle

---

## Architecture Decisions

### Intentionally Not Implemented

These architectural patterns are not needed for this static site:

#### 1. Advanced Context Management

**Status:** Not needed  
**Reason:** Single-page architecture doesn't require complex state management  
**Impact:** Simpler codebase, easier maintenance

---

#### 2. Server-Side API Routes

**Status:** Not applicable  
**Reason:** Static export architecture doesn't support API routes  
**Alternative:** External API integration if needed

---

#### 3. Database Integration

**Status:** Not needed  
**Reason:** Static site, no database required for current scope

---

#### 4. Authentication System

**Status:** Not needed  
**Reason:** Public website, no login functionality required

---

#### 5. Advanced Form Handling

**Status:** Simplified  
**Reason:** Current form submissions are simulated (backend integration pending)

---

## Tracking and Prioritization

### Priority Levels

**🔴 High Priority (Address within 1 month):**

- Critical security vulnerabilities
- Blocking bugs
- Performance issues affecting users

**🟡 Medium Priority (Address within 3 months):**

- React Hooks ESLint warnings
- Moderate security vulnerabilities
- Code quality improvements that reduce maintenance burden

**🟢 Low Priority (Address when convenient):**

- Low severity vulnerabilities in dev dependencies
- Code style issues that don't affect functionality
- Nice-to-have enhancements

---

### Current Action Items

**Recently Completed (December 2025):**

- [x] Refactor accordion components to use `useLayoutEffect` - **COMPLETED**
- [x] Review and fix `exhaustive-deps` warnings in carousel components - **COMPLETED**
- [x] Reduced React Hooks warnings from 10 to 1 (90% improvement)

**Immediate (Next Sprint):**

- [ ] Monitor tmp package vulnerability for updates from Dependabot

**Short Term (Next Quarter):**

- [ ] Evaluate Swiper.js alternative or React-specific API usage for Testimonials component (1 remaining immutability warning)

**Long Term (Next 6 Months):**

- [ ] Increase test coverage to 25%
- [ ] Implement visual regression testing
- [ ] Add bundle size monitoring

---

### Review Schedule

**Monthly Review:**

- Review new security vulnerabilities
- Assess Dependabot PRs
- Update priority levels

**Quarterly Review:**

- Re-evaluate technical debt priorities
- Plan refactoring sprints
- Update this document

**Annual Review:**

- Comprehensive code quality audit
- Major refactoring planning
- Technology stack updates

---

## Related Documentation

- [README.md](./README.md) - Main project documentation
- [SECURITY.md](./SECURITY.md) - Security policies and vulnerability reporting
- [DEPENDABOT.md](./DEPENDABOT.md) - Dependency management guide
- [SITE_IMPROVEMENTS.md](./SITE_IMPROVEMENTS.md) - Capability gap analysis
- [TESTING.md](./TESTING.md) - Testing strategy and guides
- [CODE_QUALITY.md](./CODE_QUALITY.md) - Code quality standards

---

**Questions or Concerns?**

If you have questions about technical debt items or want to propose prioritization changes:

- Open a GitHub Discussion
- Create an issue with label `technical-debt`
- Contact repository maintainers

---

**Document Maintenance:**

- Update this document when technical debt items are added or resolved
- Review and update priorities quarterly
- Keep the action items section current
