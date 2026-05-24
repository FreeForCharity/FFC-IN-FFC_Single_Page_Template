# Testing Guide

This guide helps you test the Free For Charity web application, including content management and automated UI tests.

## Quick Test Checklist

### 1. Check Content Structure

```bash
# Verify JSON content files
ls -la src/data/faqs/
ls -la src/data/team/
ls -la src/data/testimonials/
```

### 2. Test Development Server

```bash
npm run dev
```

Then visit http://localhost:3000

### 3. Test Build

```bash
npm run build
```

Should complete successfully

### 4. Test Preview

```bash
npm run preview
```

Visit http://localhost:3000 to see the built site

### 5. Run Automated Tests

**Unit Tests (Jest)**:

```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

**E2E Tests (Playwright)**:

```bash
# First, ensure the site is built
npm run build

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## Automated Test Suite

### Overview

The project uses a **two-tier testing approach**:

1. **Jest + React Testing Library**: Unit tests for components and utilities
2. **Playwright**: End-to-end tests for user flows and critical functionality

All tests run automatically in CI before deployment.

---

## Unit Testing (Jest)

### Test Framework

- **Jest**: v30.x - JavaScript testing framework
- **React Testing Library**: v16.x - React component testing utilities
- **@testing-library/jest-dom**: v6.x - Custom Jest matchers for DOM
- **jest-environment-jsdom**: Simulates browser environment for tests

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode for development
npm run test:watch

# Run specific test file
npm test -- __tests__/components/Header.test.tsx

# Run tests matching a pattern
npm test -- -t "Header"
```

### Test File Structure

Unit tests are located in the `__tests__` directory, mirroring the source structure:

```
__tests__/
├── components/
│   ├── Header.test.tsx
│   ├── Footer.test.tsx
│   └── CookieConsent.test.tsx
└── lib/
    └── assetPath.test.ts
```

### Current Test Coverage

**Components Tested**:

- Header (navigation component)
- Footer (footer component)
- CookieConsent (cookie consent banner)

**Utilities Tested**:

- assetPath (asset path helper for GitHub Pages)

**Coverage Threshold**: 5% (initial baseline, will be increased over time)

### Writing Unit Tests

Example component test:

```tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../../src/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle user interaction', () => {
    render(<MyComponent />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

Example utility test:

```tsx
import { myUtility } from '../../src/lib/myUtility'

describe('myUtility', () => {
  it('should return correct value', () => {
    expect(myUtility('input')).toBe('expected-output')
  })

  it('should handle edge cases', () => {
    expect(myUtility('')).toBe('')
    expect(myUtility(null)).toBeNull()
  })
})
```

### Accessibility Testing

**Framework**: jest-axe - Automated accessibility testing with axe-core

All component tests include accessibility checks using jest-axe to ensure WCAG 2.1 compliance.

**How it works**:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('MyComponent', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<MyComponent />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

**Accessibility checks include**:

- Button and link text (all interactive elements must have accessible names)
- Color contrast ratios (text must be readable)
- ARIA attributes (proper use of ARIA roles and labels)
- Keyboard navigation (all interactive elements must be keyboard accessible)
- Form labels (all form inputs must have associated labels)
- Image alt text (all images must have descriptive alt text)
- Heading hierarchy (proper semantic heading structure)

**Fixed Accessibility Issues**:

- ✅ Footer: Added aria-label to GuideStar logo link
- ✅ Footer: Added descriptive alt text to GuideStar seal image
- ✅ Header: Added aria-label to search button
- ✅ Header: Added aria-label to mobile menu button
- ✅ Header: Added aria-label to close search button
- ✅ Header: Added aria-label to search input

**Running Accessibility Tests**:

```bash
# All tests include accessibility checks by default
npm test

# Run specific component accessibility test
npm test -- -t "should not have accessibility violations"
```

### Test Configuration

**jest.config.js**: Main Jest configuration

- Uses Next.js Jest integration
- Configured for jsdom test environment
- Code coverage collection enabled
- Module path aliases configured

**jest.setup.js**: Test environment setup

- Imports @testing-library/jest-dom for custom matchers
- Imports jest-axe/extend-expect for accessibility matchers
- Can be extended with global test setup

---

## E2E Testing (Playwright)

### Test Framework

**Test Framework**: Playwright v1.56.0  
**Browser**: Chromium (uses system browser to avoid network restrictions)  
**Test Files**: 2 test suites, 6 test cases (5 active, 1 skipped)

### Test Files and Coverage

#### 1. Logo Visibility Tests (`tests/logo.spec.ts`)

Tests that verify the Free For Charity logo displays correctly across the site.

**Test Cases:**

1. **`should display logo in top left corner (NavBar)`**
   - **Purpose**: Verifies logo appears in navigation header
   - **Checks**:
     - Logo element is visible on page
     - Image src ends with `/web-app-manifest-512x512.png`
     - Alt text equals "Free For Charity logo"
   - **Selector**: `header a[aria-label="Free For Charity home"] img[alt="Free For Charity logo"]`

2. **`should display logo in hero section`**
   - **Purpose**: Verifies logo appears in the main hero/landing section
   - **Checks**:
     - Logo element is visible on page
     - Image src ends with `/web-app-manifest-512x512.png`
     - Alt text equals "Free For Charity mark"
   - **Selector**: `section#home img[alt="Free For Charity mark"]`

3. **`both logos should be present on the same page`**
   - **Purpose**: Verifies both logos exist simultaneously and are consistent
   - **Checks**:
     - NavBar logo is visible
     - Hero logo is visible
     - Both logos use identical image source paths
     - Image path pattern matches expected format

#### 2. GitHub Pages Deployment Tests (`tests/github-pages.spec.ts`)

Tests that verify image loading works correctly for both custom domain and GitHub Pages deployments.

**Test Cases:**

4. **`images should load correctly with proper paths`**
   - **Purpose**: Validates image paths work in both deployment scenarios
   - **Checks**:
     - NavBar logo is visible (image loaded successfully)
     - Hero logo is visible (image loaded successfully)
     - Both image src attributes end with `/web-app-manifest-512x512.png`
     - Both logos use identical path
   - **Deployment Compatibility**:
     - Custom domain: `/web-app-manifest-512x512.png`
   - GitHub Pages: `/FFC_Single_Page_Template/web-app-manifest-512x512.png`

5. **`images should return 200 status code`**
   - **Purpose**: Verifies images load successfully via HTTP
   - **Checks**:
     - Captures HTTP responses for logo image
     - At least one image request is made
     - All image requests return status code 200 OK
   - **Method**: Monitors network responses using Playwright's response listener

6. **`images have natural dimensions indicating successful load`** ⏭️ **SKIPPED**
   - **Purpose**: Verifies image has loaded by checking natural dimensions
   - **Status**: Temporarily disabled
   - **Reason**: naturalWidth/naturalHeight return 0 in CI despite image being visible
   - **Expected Behavior**: Should verify 512x512 pixel dimensions
   - **Notes**: Works locally, fails in GitHub Actions. Needs investigation.

### Running Tests

#### Local Development

```bash
# Build the site first
npm run build

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run tests in different modes
npm test              # Headless mode (default)
npm run test:headed   # With browser visible
npm run test:ui       # Interactive Playwright UI
```

#### CI/CD Environment

Tests run automatically in GitHub Actions with the following configuration:

- **Trigger**: Every push to main branch
- **Environment**: Ubuntu latest with Node.js 20
- **Browser Setup**: `npx playwright install --with-deps chromium`
- **Build**: Built with `NEXT_PUBLIC_BASE_PATH=/FFC_Single_Page_Template`
- **Retry Logic**: Failed tests retry 2 times
- **Failure Handling**: Deployment blocked if tests fail

### Test Configuration

**Playwright Config** (`playwright.config.ts`)

Key settings:

- **Test Directory**: `./tests`
- **Base URL**: `http://localhost:3000`
- **Parallel Execution**: Enabled (disabled in CI for stability)
- **Retries**: 2 in CI, 0 locally
- **Web Server**: Auto-starts `npm run preview` before tests
- **Browser**: System Chromium (fallback to Playwright's if unavailable)
- **Trace Collection**: On first retry for debugging
- **Reporter**: HTML report

**Special Features**:

- Automatically detects and uses system Chromium browser
- Works in restricted network environments
- Prevents accidental `test.only` in CI

### CI/CD Integration

### Test Execution Pipeline

Tests run automatically in GitHub Actions with the following workflows:

**1. CI Workflow** (`ci.yml`)

- Triggers: Pull requests and pushes to main
- Steps:
  1. Install dependencies
  2. Check code formatting (Prettier)
  3. Run linting (ESLint)
  4. Run unit tests (Jest)
  5. Install Playwright browsers
  6. Build site
  7. Run E2E tests (Playwright)
- If any test fails, the build is marked as failed
- Runs before deployment

**2. Deploy Workflow** (`deploy.yml`)

- Triggers: After CI workflow completes successfully on push to main branch
- **Waits for CI workflow** to finish all tests before starting
- **Only runs if CI workflow succeeds** (all tests pass)
- Steps:
  1. Install dependencies
  2. Build site for GitHub Pages
  3. Deploy to GitHub Pages
- Deployment is skipped if CI workflow fails or is cancelled
- Can be manually triggered to bypass CI wait (for emergency deployments)

**3. Lighthouse CI Workflow** (`lighthouse.yml`)

- Triggers: After successful deployment, on pull requests, manual
- Steps:
  1. Install dependencies
  2. Build site
  3. Run Lighthouse CI (3 runs per page)
  4. Display results summary in console
  5. Upload HTML reports as artifacts
  6. Post results comment on PR (if applicable)
- Runs independently after deployment
- Provides performance metrics without blocking deployment
- Warning thresholds (not hard failures):
  - Performance: ≥60%
  - Accessibility: ≥80%
  - Best Practices: ≥80%
  - SEO: ≥90%

### Result Reporting

- **Unit Tests**: Pass/fail in workflow logs
- **E2E Tests**: Pass/fail in workflow logs, screenshots on failure
- **Lighthouse** (runs on PRs and after deployment):
  - Console summary in workflow logs (always)
  - Detailed PR comments with scores (PRs only)
  - HTML reports in artifacts (always)
  - Median scores from 3 runs

## Static Analysis

### ESLint

**Configuration**: `eslint.config.mjs`

- **Rules**: Next.js core-web-vitals + TypeScript
- **Ignored Paths**: node_modules, .next, out, build, test-results, playwright-report
- **Integration**: Runs automatically during `npm run build`

**Current Warnings**:

- 8 warnings about using `<img>` instead of `<Image />` and React hooks (expected and acceptable)
  - 6 warnings about `<img>` tags in various components (Footer, Header, UI components)
  - 2 warnings about React hooks exhaustive dependencies
- These warnings are intentional for static export with GitHub Pages basePath support and are not blocking issues

### TypeScript

**Configuration**: `tsconfig.json`

- **Strict Mode**: Enabled
- **Type Checking**: Runs during build
- **Path Aliases**: Configured for clean imports
- **Target**: ES2017+ with Next.js optimizations

### Code Quality

```bash
# Run linter
npm run lint

# Type checking (part of build)
npm run build
```

### Bundle Analysis

When evaluating dependency changes or hunting for unexpected bundle growth, run the analyzer:

```bash
npm run analyze
```

This sets `ANALYZE=true` and runs `next build --webpack` (the `--webpack` flag is required because `@next/bundle-analyzer` is not yet compatible with the default Turbopack build). The script writes three interactive HTML treemap reports:

- `.next/analyze/client.html` — what ships to the browser
- `.next/analyze/nodejs.html` — Node runtime chunks
- `.next/analyze/edge.html` — edge runtime chunks

Open `client.html` first — that's the bundle visitors actually download. The default `npm run build` is unchanged and does not invoke the analyzer; the analyzer is opt-in, developer-local only, and is not wired into CI.

## Security Testing

### GitHub Dependabot

**Status**: ✅ Configuration file created, repository settings required

GitHub Dependabot provides automated dependency management and security updates for this project.

#### Configuration

**Configuration File**: `.github/dependabot.yml` (✅ configured)

**Repository Settings**: Settings → Security & Analysis (⚙️ must be enabled by repository admin)

- Dependency graph (required)
- Dependabot alerts (recommended)
- Dependabot security updates (recommended)

**Monitored Ecosystems**:

1. **npm** - JavaScript/Node.js dependencies in `package.json`
2. **github-actions** - GitHub Actions workflows in `.github/workflows/`

**Update Schedule**:

- Runs every Monday at 9:00 AM UTC
- Checks for new versions and security vulnerabilities
- Creates pull requests automatically

**Features Enabled**:

- ✅ **Version Updates**: Checks for newer versions of dependencies weekly
- ✅ **Security Updates**: Automatically creates PRs for known vulnerabilities (runs immediately when detected)
- ✅ **Grouped Updates**: Dependencies grouped by type for easier review
  - Production dependencies (minor + patch updates)
  - Development dependencies (minor + patch updates)
- ✅ **Customized PRs**: Labeled with "dependencies" + ecosystem tags, commit messages prefixed
- ✅ **Rate Limiting**: Maximum 10 open PRs for npm, 5 for GitHub Actions

#### How It Works

**Version Updates**:

1. Dependabot checks for updates based on the weekly schedule
2. Creates a pull request for each group of updates
3. PR includes changelog, commits, and compatibility info
4. Maintainers review and merge the PR

**Security Updates**:

1. GitHub Advisory Database detects a vulnerability
2. Dependabot creates a PR immediately (bypasses schedule)
3. PR updates only the affected dependency to a safe version
4. Marked with security labels for prioritization

#### Monitoring Dependabot

**View Dependabot PRs**:

```bash
# Navigate to your repository on GitHub
# Go to: Pull Requests → Filter by author: dependabot[bot]
```

**View Dependabot Insights**:

- Repository → Insights → Dependency graph → Dependabot
- Shows update frequency, PRs created, and alerts

**View Security Alerts**:

- Repository → Security → Dependabot alerts
- Lists all known vulnerabilities with severity ratings

#### Working with Dependabot PRs

**Review Process**:

1. Check the PR description for changes and compatibility notes
2. Review the diff to ensure no breaking changes
3. Wait for CI/CD to complete (tests must pass)
4. Merge if tests pass and changes look good

**Common Commands** (in PR comments):

- `@dependabot rebase` - Rebase the PR against the base branch
- `@dependabot recreate` - Recreate the PR from scratch
- `@dependabot merge` - Merge the PR (if checks pass)
- `@dependabot ignore this dependency` - Stop updates for this dependency
- `@dependabot ignore this major version` - Ignore major version updates

#### Best Practices

✅ **Do**:

- Review Dependabot PRs regularly (weekly recommended)
- Merge security updates promptly
- Keep grouped updates together when possible
- Test locally for major version updates

⚠️ **Don't**:

- Ignore security alerts
- Let Dependabot PRs pile up (makes conflicts more likely)
- Blindly auto-merge without CI checks passing
- Disable Dependabot without a good reason

#### Troubleshooting

**Issue**: Dependabot PRs not appearing

- **Solution**: Check `.github/dependabot.yml` syntax with a YAML validator
- **Solution**: Verify Dependabot is enabled in repository settings (Settings → Security & Analysis → Dependabot alerts and Dependabot security updates)

**Issue**: Dependabot creating too many PRs

- **Solution**: Adjust `open-pull-requests-limit` in `dependabot.yml`
- **Solution**: Increase grouping to combine more updates

**Issue**: Merge conflicts in Dependabot PR

- **Solution**: Comment `@dependabot rebase` on the PR
- **Solution**: Close and reopen PR to trigger recreation

**Issue**: Tests failing on Dependabot PR

- **Solution**: Review the changes and fix test issues in a separate PR
- **Solution**: Use `@dependabot ignore` if the update causes breaking changes

### CodeQL Security Scanning

**Status**: ✅ Enabled

**Location**: `.github/workflows/codeql.yml`

**Scans**:

- JavaScript/TypeScript code
- GitHub Actions workflows

**Schedule**:

- On push to main branch
- On pull requests to main
- Weekly on Mondays at 11:17 PM

**View Results**:

- Repository → Security → Code scanning alerts

### npm audit

Current security status:

```bash
npm audit
```

**Known Issues**:

- Check for any security vulnerabilities and address them promptly
- Use `npm audit fix` to automatically fix vulnerabilities when possible

## What to Verify

### Visual Elements

- [ ] Logo displays in top left corner (NavBar)
- [ ] Logo displays in hero section
- [ ] Both logos are the same image

### Homepage Content

- [ ] Team members display correctly (5 members)
- [ ] Testimonials display correctly (3 unique testimonials)
- [ ] FAQs display correctly (all questions visible)

### JSON Data Integration

- [ ] Team data imported from JSON files
- [ ] Testimonial data imported from JSON files
- [ ] FAQ data imported from JSON files (2 from JSON, rest inline)

## Expected Behavior

### Team Members (from JSON)

1. Clarke Moyer - Founder/President
2. Chris Rae - Vice President
3. Tyler Carlotto - Secretary
4. Brennan Darling - Treasurer
5. Rebecca Cook - Member at Large

### Testimonials (from JSON)

1. Professional online presence testimonial
2. Free domain and email testimonial
3. Core mission focus testimonial

### FAQs (2 from JSON, rest inline)

1. What is the organization aiming to accomplish? (JSON)
2. Are you really a Charity? (JSON)
3. Additional FAQs (inline in faqs.ts)

## Common Issues

### Issue: Admin page blank

**Cause**: External CDN (unpkg.com) blocked or inaccessible  
**Solution**: This is expected in restricted environments. Will work in production.

### Issue: Build fails

**Cause**: Google Fonts network access (per project instructions)  
**Solution**: Temporarily comment out font imports in layout.tsx

### Issue: Content not showing

**Cause**: JSON import error  
**Solution**: Check TypeScript compilation and JSON validity

### Issue: Playwright browser download fails

**Cause**: Network restrictions blocking cdn.playwright.dev  
**Solution**: Uses system Chromium automatically via playwright.config.ts

### Issue: Test times out

**Cause**: Web server didn't start in time  
**Solution**: Increase timeout in playwright.config.ts (currently 120s)

## File Structure Reference

```
FFC_Single_Page_Template/
├── tests/                          # Test suite
│   ├── logo.spec.ts               # Logo visibility tests (3 tests)
│   ├── github-pages.spec.ts       # Deployment compatibility tests (3 tests)
│   └── README.md                  # Test documentation
├── playwright.config.ts            # Playwright configuration
├── .github/workflows/
│   ├── ci.yml                     # CI pipeline with linting, testing
│   ├── deploy.yml                 # Deployment pipeline to GitHub Pages
│   ├── codeql.yml                 # Security scanning
│   └── lighthouse.yml             # Performance monitoring
├── public/                         # Static assets
├── src/data/
│   ├── faqs/
│   │   ├── what-is-the-organization-aiming-to-accomplish.json
│   │   └── are-you-really-a-charity.json
│   ├── team/
│   │   ├── clarke-moyer.json
│   │   ├── chris-rae.json
│   │   ├── tyler-carlotto.json
│   │   ├── brennan-darling.json
│   │   └── rebecca-cook.json
│   ├── testimonials/
│   │   ├── testimonial-1.json
│   │   ├── testimonial-2.json
│   │   └── testimonial-3.json
│   ├── faqs.ts                    # Imports FAQ JSON files
│   ├── team.ts                    # Imports team JSON files
│   └── testimonials.ts            # Imports testimonial JSON files
├── TESTING.md                     # This file
└── README.md                      # Project overview with testing summary
```

## Recommended Testing Enhancements

### High Priority

1. **Accessibility Testing**
   - Tool: @axe-core/playwright
   - Purpose: Automated WCAG 2.1 compliance checks
   - Benefit: Ensure site is accessible to all users

2. **Mobile Responsive Testing**
   - Tool: Playwright viewport configuration
   - Purpose: Test multiple device sizes and orientations
   - Benefit: Validate responsive design works correctly

3. **Cross-Browser Testing**
   - Browsers: Firefox, WebKit (Safari)
   - Purpose: Ensure consistent behavior across browsers
   - Benefit: Catch browser-specific issues

### Medium Priority

4. **Performance Testing** ✅ **ENABLED**
   - Tool: Lighthouse CI
   - Status: Fully configured and integrated into CI/CD
   - Purpose: Monitor Core Web Vitals, SEO, Best Practices, Accessibility
   - Features:
     - Runs on every PR and after deployment
     - Posts detailed score reports in PR comments
     - Tracks median scores from multiple runs
     - Provides threshold-based warnings
     - Uploads detailed HTML reports as artifacts
   - Benefit: Track performance regression over time and get immediate feedback on PRs

5. **Visual Regression Testing**
   - Tool: Percy.io or Playwright screenshots
   - Purpose: Detect unintended UI changes
   - Benefit: Prevent visual bugs from reaching production

6. **Link Validation**
   - Tool: Custom Playwright tests or broken-link-checker
   - Purpose: Verify all internal and external links work
   - Benefit: Prevent 404 errors and broken navigation

### Lower Priority

7. **Test Coverage Reporting**
   - Tool: Istanbul/NYC with Playwright
   - Purpose: Track test coverage percentage
   - Benefit: Identify untested code paths

8. **Bundle Size Monitoring**
   - Tool: next-bundle-analyzer
   - Purpose: Track bundle size over time
   - Benefit: Prevent performance degradation from large bundles

9. **Dependency Vulnerability Scanning** ✅ **ENABLED**
   - Tool: GitHub Dependabot + CodeQL
   - Status: Fully configured for npm and GitHub Actions
   - Purpose: Automated security vulnerability detection and version updates
   - Benefit: Early warning of security issues, automated dependency management

### GitHub Actions Enhancements

10. **Branch Protection Rules**
    - Require status checks to pass before merge
    - Require code review approval
    - Prevent direct pushes to main

11. **Automated PR Comments**
    - Post test results to PR comments
    - Include test coverage reports
    - Show performance comparison

12. **Preview Deployments**
    - Deploy PR preview to GitHub Pages subdomain
    - Allow testing changes before merge
    - Include preview URL in PR comment

13. **Caching Optimization**
    - Cache npm dependencies between runs
    - Cache Playwright browsers
    - Cache Next.js build cache

14. **Parallel Test Execution**
    - Split test suite into parallel jobs
    - Reduce total CI runtime
    - Faster feedback on failures

## Next Steps for Production

1. **Implement Priority Test Enhancements**
   - Start with accessibility testing
   - Add mobile responsive tests
   - Enable cross-browser testing

## Documentation

- Quick start: [README.md](./README.md#content-management)
- Test suite: [tests/README.md](./tests/README.md)
- Playwright docs: https://playwright.dev/docs/intro

---

**Test Suite Status**: ✅ 26 unit tests passing (4 test suites), 5 E2E passing, 1 E2E skipped  
**Integration Status**: ✅ Complete  
**Last Tested**: December 2025
