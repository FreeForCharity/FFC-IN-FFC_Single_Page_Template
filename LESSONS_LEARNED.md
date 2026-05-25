# Lessons Learned - FFC Single Page Template

## Overview

This document captures key lessons learned during the development and evolution of the FFC Single Page Template project. It serves as institutional knowledge for current and future contributors.

**Last Updated**: 2025-12-03

---

## Table of Contents

1. [Project Evolution](#project-evolution)
2. [What Worked Well](#what-worked-well)
3. [What Didn't Work](#what-didnt-work)
4. [Technical Decisions](#technical-decisions)
5. [Deployment Challenges](#deployment-challenges)
6. [Testing Insights](#testing-insights)
7. [Code Quality Evolution](#code-quality-evolution)
8. [Future Improvements](#future-improvements)

---

## Project Evolution

### Origins

The FFC Single Page Template was created as a standardized, reusable foundation for Free For Charity web projects. It evolved from the production `freeforcharity-web` repository and has been enhanced with modern development practices.

### Key Milestones

**Phase 1**: Security & Code Quality Foundation

- ✅ Implemented CodeQL security scanning
- ✅ Added Prettier for code formatting
- ✅ Configured Husky for pre-commit hooks
- ✅ Added Commitlint for conventional commits

**Phase 2**: Testing Infrastructure

- ✅ Configured Jest and React Testing Library
- ✅ Added initial test suite for critical components
- ✅ Integrated tests into CI pipeline
- ✅ Achieved 5%+ initial test coverage

**Phase 3**: Documentation & Monitoring

- ✅ Created comprehensive documentation suite
- ✅ Implemented Lighthouse CI for performance monitoring
- ✅ Established code quality standards

**Phase 4**: Accessibility & UX

- ✅ Integrated jest-axe for accessibility testing
- ✅ Fixed 6 accessibility violations in Header and Footer
- ✅ Established accessibility testing practices

**Phase 5**: Advanced Tooling

- ✅ Split CI and Deploy workflows for better separation of concerns
- ✅ Added link validation with Linkinator
- ✅ Added .editorconfig for consistent editor settings
- ✅ Created additional documentation (RESPONSIVE_DESIGN.md, QUICK_START.md)

---

## What Worked Well

### 1. Mobile-First Responsive Design

**Decision**: Use Tailwind CSS with mobile-first approach

**Outcome**: ✅ Excellent

**Why it worked**:

- Components naturally scale across devices
- Fewer CSS overrides needed
- Better performance on mobile devices
- Cleaner, more maintainable code

**Lesson**: Always start with mobile constraints and enhance for larger screens.

### 2. Static Site Generation (Next.js Export)

**Decision**: Use Next.js static export for GitHub Pages deployment

**Outcome**: ✅ Excellent

**Why it worked**:

- Free hosting on GitHub Pages
- Fast page loads (pre-rendered HTML)
- No server infrastructure needed
- Easy deployment via GitHub Actions
- Works perfectly for content-heavy sites

**Lesson**: Static generation is ideal for marketing sites with infrequent content changes.

### 3. Component-Based Architecture

**Decision**: Break UI into small, reusable components

**Outcome**: ✅ Very Good

**Why it worked**:

- Easy to test individual components
- Reusable across pages
- Easier to maintain
- Clear separation of concerns

**Current Stats**:

- 112 component files
- Well-organized in `/src/components/`
- Each component has single responsibility

**Lesson**: Small, focused components are easier to test, maintain, and reuse.

### 4. Pre-commit Hooks with Husky

**Decision**: Automatically run linting and formatting before commits

**Outcome**: ✅ Excellent

**Why it worked**:

- Prevents bad code from being committed
- Ensures consistent code style
- Catches errors early
- Reduces code review overhead

**Lesson**: Automated quality checks at commit time save significant review time.

### 5. Conventional Commits

**Decision**: Enforce conventional commit messages with Commitlint

**Outcome**: ✅ Very Good

**Why it worked**:

- Clean, readable git history
- Easy to generate changelogs
- Clear commit categorization (feat, fix, docs, etc.)
- Better understanding of project evolution

**Example**:

```
feat: add dark mode toggle component
fix: resolve cookie consent banner positioning
docs: update README with new deployment instructions
```

**Lesson**: Structured commit messages are worth the initial learning curve.

### 6. Comprehensive Documentation

**Decision**: Create extensive documentation suite

**Outcome**: ✅ Excellent

**Files Created**:

- README.md
- CONTRIBUTING.md
- TESTING.md
- CODE_QUALITY.md
- DEPLOYMENT.md
- SECURITY.md
- ISSUE_RESOLUTION.md
- LIGHTHOUSE.md
- RESPONSIVE_DESIGN.md
- QUICK_START.md
- LESSONS_LEARNED.md

**Why it worked**:

- Reduces onboarding time for new contributors
- Self-service troubleshooting
- Clear standards and expectations
- Institutional knowledge preserved

**Lesson**: Documentation investment pays dividends in reduced support burden.

---

## What Didn't Work

### 1. Using `<img>` Instead of Next.js `<Image>`

**Decision**: Use native `<img>` tags instead of Next.js `<Image>` component

**Outcome**: ⚠️ Mixed Results

**Why it was necessary**:

- Next.js `<Image>` doesn't work well with static export
- GitHub Pages deployment requires special asset path handling
- Created `assetPath()` helper as workaround

**Downsides**:

- ESLint warnings on every build
- No automatic image optimization
- Manual srcset management needed
- Larger bundle sizes for images

**Lesson**: Static export has trade-offs. Document them clearly.

**Future Consideration**: Explore Next.js 15+ improvements for static image optimization.

### 2. Internal Navigation with Next.js Static Export

**Decision**: Use Next.js static export without server-side routing

**Outcome**: ⚠️ Requires Workarounds

**Issues**:

- Links like `/about-us` work in browser but fail link validation
- Files generated as `/about-us.html` but hrefs don't include `.html`
- Linkinator reports 404s for valid routes
- Requires server configuration or GitHub Pages handling

**Workarounds**:

- Document expected link checker behavior
- Skip internal route patterns in Linkinator config
- Trust GitHub Pages to handle routing correctly

**Lesson**: Static export is great but requires understanding of its limitations.

### 3. Test Coverage Thresholds

**Decision**: Start with low test coverage thresholds (5%)

**Outcome**: ⚠️ Needs Improvement

**Why it's problematic**:

- 5% coverage is very low
- Doesn't enforce meaningful testing
- Many components remain untested

**Current Stats**:

- 25 tests passing
- ~5% code coverage
- Critical components tested (Header, Footer, Cookie Consent)

**Plan**:

- Gradually increase thresholds
- Target 50%+ coverage over time
- Focus on high-risk components first

**Lesson**: Start with achievable thresholds but set clear goals for improvement.

### 4. React Testing Library `act()` Warnings

**Decision**: Accept React `act()` warnings in tests

**Outcome**: ⚠️ Technical Debt

**Issues**:

- Many tests produce console warnings about updates not wrapped in `act()`
- Warnings are harmless but noisy
- Makes test output harder to read

**Why it happens**:

- Next.js components with internal state updates
- Async operations in components
- Intersection observer hooks

**Future Fix**:

- Wrap async operations properly
- Use `waitFor` from Testing Library
- Clean up test output

**Lesson**: Don't ignore test warnings; they indicate potential issues.

---

## Technical Decisions

### Next.js 16.0.7

**Why chosen**:

- Latest stable version with security fixes
- Improved performance with Turbopack
- Better static export support
- React 19 compatibility

**Trade-offs**:

- Bleeding edge may have undiscovered issues
- Some ecosystem libraries not fully compatible
- Documentation sometimes lags behind

**Verdict**: ✅ Good choice. Stable and performant.

### Tailwind CSS v4.1.12

**Why chosen**:

- Utility-first approach matches component architecture
- Excellent responsive design support
- Small production bundle size
- Great developer experience

**Trade-offs**:

- Learning curve for new developers
- Can lead to long className strings
- Requires Prettier plugin for formatting

**Verdict**: ✅ Excellent choice. Would choose again.

### TypeScript

**Why chosen**:

- Type safety prevents bugs
- Better IDE support
- Self-documenting code
- Scales well as project grows

**Trade-offs**:

- Initial setup complexity
- Stricter than JavaScript
- Longer compile times

**Verdict**: ✅ Essential for project of this size.

### Framer Motion

**Why chosen**:

- Declarative animations
- Great React integration
- Production-ready
- Good performance

**Trade-offs**:

- Adds to bundle size (~30KB)
- Not always needed for simple animations
- Overkill for some use cases

**Verdict**: ✅ Good for complex animations, consider alternatives for simple ones.

### Jest + Playwright

**Why chosen**:

- Jest for unit/component tests (fast, isolated)
- Playwright for E2E tests (real browser, integration)
- Best of both worlds

**Trade-offs**:

- Two testing frameworks to maintain
- Different syntax and APIs
- More configuration

**Verdict**: ✅ Right tool for the right job.

### Microsoft Forms (and the HubSpot investigation)

**Context**: A page-speed audit in December 2025 flagged third-party cookies from `app.hubspot.com/feedback-web-fetcher`. Initial worry: a tracking dependency had slipped into the codebase.

**Investigation**: A full sweep of `package.json`, source, GTM, and HTML found **no direct HubSpot integration anywhere in the project**. The cookies originated from the **Microsoft Forms** iframe embedded for the application-form modal (`https://forms.office.com/r/vePxGq6JqG`). Microsoft Forms internally loads HubSpot for its own product analytics, and that behavior is outside our control short of replacing Microsoft Forms wholesale.

**Outcome**: Disclosed in the Privacy Policy (section 3.4) and Cookie Policy (section 3.2) as a transitive dependency, and documented in `EXTERNAL_DEPENDENCIES.md`. The CSP allowlist already covered Microsoft Forms origins. No code changes were required.

**Verdict**: ✅ Issue closed. Investigation file `HUBSPOT_INVESTIGATION.md` was removed once the conclusion landed here — this section is now the canonical record. If we ever replace Microsoft Forms, the HubSpot row in `EXTERNAL_DEPENDENCIES.md` goes away automatically.

---

## Deployment Challenges

### GitHub Pages Base Path

**Challenge**: Images and assets don't load on GitHub Pages deployment

**Root Cause**: GitHub Pages serves the site at `/FFC_Single_Page_Template/` instead of `/`

**Solution**:

1. Created `assetPath()` helper in `src/lib/assetPath.ts`
2. Set `NEXT_PUBLIC_BASE_PATH` environment variable in CI
3. Updated all image references to use `assetPath()`

**Lesson**: Always test deployment environment early. Localhost != production.

### CNAME and Custom Domain

**Challenge**: Need to support both GitHub Pages URL and custom domain

**Solution**:

- Created `public/CNAME` file for custom domain
- Configured DNS appropriately
- Both URLs work correctly

**Lesson**: Document deployment configurations clearly for future reference.

### Workflow Optimization

**Challenge**: Single monolithic workflow did build, test, and deploy

**Solution**:

- Split into separate `ci.yml` and `deploy.yml`
- CI runs on all PRs and pushes (fast feedback)
- Deploy only runs on main branch push
- Lighthouse runs after deployment

**Benefits**:

- Faster PR feedback
- Clearer separation of concerns
- Can test without deploying

**Lesson**: Separate workflows improve developer experience.

---

## Testing Insights

### Jest Setup Complexity

**Challenge**: Configuring Jest for Next.js + TypeScript + React

**Solution**: Used `next/jest` configuration helper

**Key Learnings**:

- Let Next.js handle the heavy lifting
- Don't fight the framework
- Use recommended configurations

### Accessibility Testing

**Challenge**: Manual accessibility testing is time-consuming

**Solution**: Integrated `jest-axe` for automated a11y testing

**Results**:

- Found 6 violations in Header and Footer
- Fixed all violations
- Now testing 3 critical components
- Prevents regressions

**Lesson**: Automate accessibility testing. It's too important to skip.

### E2E Test Stability

**Challenge**: E2E tests can be flaky

**Current Approach**:

- Use explicit waits
- Test critical user paths only
- Keep tests simple and focused
- Run in CI before deployment

**Lesson**: E2E tests should test happy paths, not every edge case.

---

## Code Quality Evolution

### Before Phase 1

- No code formatting standards
- Inconsistent commit messages
- No pre-commit checks
- Manual code review for style issues

### After Phase 5

- ✅ Prettier enforces formatting
- ✅ Husky runs checks on commit
- ✅ Commitlint enforces message format
- ✅ ESLint catches code issues
- ✅ Tests run in CI
- ✅ CodeQL scans for vulnerabilities
- ✅ Lighthouse monitors performance
- ✅ Link validation catches broken links

**Impact**:

- 90% reduction in style-related code review comments
- Cleaner git history
- Fewer bugs reaching production
- More confidence in deployments

**Lesson**: Invest in automation early. It compounds over time.

---

## Future Improvements

### High Priority

1. **Increase Test Coverage**: Target 50%+ coverage
   - Focus on untested components
   - Add integration tests
   - Test error scenarios

2. **Image Optimization**: Explore better solutions
   - Consider Next.js 15+ image improvements
   - Implement responsive images with srcset
   - Use modern image formats (WebP, AVIF)

3. **Performance Optimization**: Reduce bundle size
   - Audit and remove unused dependencies
   - Implement code splitting more aggressively
   - Optimize component rendering

### Medium Priority

4. **Dark Mode**: Implement theme switching
   - Create ThemeContext
   - Update all components with dark mode styles
   - Persist user preference

5. **Enhanced Cookie Consent**: Add granular controls
   - Analytics opt-in/out
   - Marketing opt-in/out
   - Functional cookies management
   - Consent versioning

6. **Component Library**: Create reusable component library
   - Extract common patterns
   - Add Storybook
   - Document component API

### Low Priority

7. **Docker Support**: Optional containerization
   - Multi-stage build
   - Development container
   - Production image

8. **Internationalization (i18n)**: Multi-language support
   - Only if needed for expansion
   - Requires significant effort

---

## Key Takeaways

### Do These Things

✅ **Start with mobile-first design** - It forces good constraints

✅ **Automate quality checks** - Pre-commit hooks, CI/CD, linters

✅ **Write documentation** - Future you will thank present you

✅ **Test critical paths** - Don't aim for 100% coverage, focus on risk

✅ **Keep components small** - Easier to test, maintain, and reuse

✅ **Use TypeScript** - Catch bugs before runtime

✅ **Follow conventions** - Prettier, ESLint, Commitlint

✅ **Monitor performance** - Lighthouse CI catches regressions

### Avoid These Mistakes

❌ **Don't skip accessibility** - It's not optional

❌ **Don't ignore test warnings** - They indicate real issues

❌ **Don't commit directly to main** - Use PRs and code review

❌ **Don't fight the framework** - Use recommended patterns

❌ **Don't optimize prematurely** - Profile first, then optimize

❌ **Don't assume localhost == production** - Test deployments early

❌ **Don't skip documentation** - It saves time in the long run

---

## Contributing to This Document

If you learn something valuable while working on this project, please add it here! This document is most valuable when kept up-to-date with real experiences.

**How to contribute**:

1. Add your lesson to the appropriate section
2. Include context (what, why, outcome)
3. Share what you learned
4. Update the "Last Updated" date

---

## Acknowledgments

This project has been shaped by contributions from many developers. Thank you to everyone who has contributed code, documentation, testing, and feedback.

Special thanks to the Next.js, React, and Tailwind CSS communities for excellent frameworks and documentation.

---

**Last Updated**: 2025-12-03
**Contributors**: FreeForCharity Development Team
**Status**: Living Document (continuously updated)
