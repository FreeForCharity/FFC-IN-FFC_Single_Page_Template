# E2E Test Configuration Guide

## Overview

This directory contains end-to-end (E2E) tests that validate the website functionality using Playwright. The tests are designed to be **template-friendly**, meaning they can be easily customized when you fork this template for a new organization.

## Quick Start

### Running Tests

```bash
# Build the site first
npm run build

# Run tests
npm run test:e2e

# Run tests with UI (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
```

## Customizing Tests for Your Organization

When you customize this template for a new organization, you **only need to update one file** to make all tests work with your content:

### 1. Update Test Configuration

Edit `tests/test.config.ts` with your organization's information:

```typescript
export const testConfig = {
  organization: {
    name: 'Your Organization Name',
    type: 'Your Organization Type',
    website: 'https://yourwebsite.org',
  },

  // Update each section with your content
  missionVideo: {
    ariaLabel: 'Your organization mission video',
    title: 'Your mission video title',
  },

  // ... and so on for other sections
}
```

**That's it!** All test files will automatically use your updated configuration.

### What to Update

The configuration file is organized by sections. Here's what each section controls:

#### Mission Video (mission-video.spec.ts)

- `missionVideo.ariaLabel`: Accessibility label for mission video
- `missionVideo.title`: Video title attribute

#### Application Form (application-form.spec.ts)

- `applicationForm.buttonText`: Text on the application button
- `applicationForm.modalTitle`: Title of the modal dialog
- `applicationForm.loadingText`: Loading message text
- `applicationForm.closeButtonAriaLabel`: Close button accessibility label

#### Events Section (events.spec.ts)

- `events.sectionId`: HTML ID for events section (default: 'events')
- `events.heading`: Section heading text
- `events.footerLinkText`: Text for footer navigation link (e.g., 'Events')
- `events.iframeTitle`: Events iframe title
- `events.facebookLinkText`: Facebook link text
- `events.facebookUrl`: Your Facebook page URL
- `events.descriptionText`: Text to find in event descriptions

#### Social Media Links (social-links.spec.ts)

- `socialLinks.facebook.url`: Your Facebook URL
- `socialLinks.twitter.url`: Your Twitter/X URL
- `socialLinks.linkedin.url`: Your LinkedIn URL
- `socialLinks.github.url`: Your GitHub URL
- Each has an `ariaLabel` for accessibility

#### Copyright Notice (copyright.spec.ts)

- `copyright.text`: Full copyright text
- `copyright.searchText`: Text to search for when locating copyright element (e.g., 'All Rights Are Reserved')
- `copyright.linkUrl`: Organization website URL
- `copyright.linkText`: Displayed link text

#### Animated Numbers (animated-numbers.spec.ts)

- `animatedNumbers.sectionHeading`: Results section heading
- `animatedNumbers.statistics`: Array of statistics with:
  - `description`: Statistic description
  - `value`: Expected value after animation

#### Google Tag Manager (google-tag-manager.spec.ts)

- `googleTagManager.id`: Your GTM container ID (e.g., 'GTM-XXXXXX')

#### Logo and Images (logo.spec.ts, image-loading.spec.ts)

- `logo.headerAlt`: Alt text for header logo
- `logo.heroAlt`: Alt text for hero section image
- `logo.navBarAriaLabel`: Aria label for navbar home link

#### Cookie Consent (cookie-consent.spec.ts)

- `cookieConsent.bannerHeading`: Cookie banner heading
- `cookieConsent.modalHeading`: Preferences modal heading
- `cookieConsent.buttons.*`: Button text for all cookie consent buttons

## Test Files

### Content-Specific Tests (Use Configuration)

These tests use values from `test.config.ts`:

- **`mission-video.spec.ts`** - Mission video presence and configuration
- **`application-form.spec.ts`** - Application form modal functionality
- **`events.spec.ts`** - Events section rendering and links
- **`social-links.spec.ts`** - Social media link validation
- **`copyright.spec.ts`** - Copyright notice with current year
- **`animated-numbers.spec.ts`** - Results section number animations
- **`google-tag-manager.spec.ts`** - GTM integration
- **`cookie-consent.spec.ts`** - Cookie consent banner and preferences
- **`logo.spec.ts`** - Logo visibility in header and hero
- **`image-loading.spec.ts`** - Image loading validation

### Guardrail Tests

- **`axe.spec.ts`** - Runs `@axe-core/playwright` against the homepage and fails on NEW serious/critical WCAG 2.x A/AA violations. Pre-existing baseline violations are explicitly allowlisted at the top of the spec (currently: `color-contrast`); the allowlist is intended to shrink over time as accessibility issues are fixed in dedicated PRs. The spec exists to catch regressions, not to score a11y comprehensively.
- **`head-meta.spec.ts`** - Pins the head metadata contract (CSP, OG, manifest link, robots, sitemap, security.txt).

## Test Performance

### Current Performance

- **Total tests**: 62 tests
- **Execution time**: ~5 minutes (varies by environment)
- **Parallel execution**: Enabled locally (4 workers), disabled in CI (1 worker)

### Performance Optimization Tips

1. **Local Development**: Tests run in parallel with 4 workers for faster feedback
2. **CI Environment**: Tests run sequentially for stability
3. **Targeted Testing**: Run specific test files during development:
   ```bash
   npx playwright test mission-video.spec.ts
   ```

## Benefits of This Approach

### For Template Users

✅ **Simple Customization**: Update one config file instead of editing multiple test files  
✅ **Reduced Errors**: No need to search/replace strings across many files  
✅ **Clear Documentation**: Configuration file shows exactly what needs to change  
✅ **Type Safety**: TypeScript configuration provides autocomplete and validation

### For Maintainers

✅ **Single Source of Truth**: All test expectations in one place  
✅ **Easy Updates**: Change test expectations without touching test logic  
✅ **Better Maintainability**: Separate concerns (configuration vs. test logic)  
✅ **Consistent Testing**: Same test structure works across all forks

## Troubleshooting

### Tests Fail After Customization

1. **Check Configuration**: Verify all values in `test.config.ts` match your content exactly
2. **Special Characters**: Make sure special characters in strings are properly escaped
3. **Case Sensitivity**: Text matching is case-sensitive
4. **Whitespace**: Extra spaces can cause failures

### Common Issues

**Issue**: Tests can't find elements  
**Solution**: Check that the configured text exactly matches what's on the page

**Issue**: Social link tests fail  
**Solution**: Verify URLs in `test.config.ts` match your actual social media URLs

**Issue**: Animated numbers test fails  
**Solution**: Update the `statistics` array with your actual statistics and values

**Issue**: GTM tests fail  
**Solution**: Update `googleTagManager.id` with your actual GTM container ID

### Getting Help

If tests continue to fail after updating the configuration:

1. Run tests with UI to see what's happening: `npm run test:e2e:ui`
2. Check the Playwright HTML report: `npx playwright show-report`
3. Review the test file to understand what it's checking
4. Verify your page content matches the test expectations

## Example: Customizing for "Acme Charity"

Here's a complete example of customizing the tests for a new organization:

```typescript
// tests/test.config.ts
export const testConfig = {
  missionVideo: {
    ariaLabel: 'Acme Charity mission video',
    title: "Learn about Acme Charity's mission to help communities",
  },

  applicationForm: {
    buttonText: 'Apply for Assistance',
    modalTitle: 'Assistance Application Form',
    loadingText: 'Loading form...',
    closeButtonAriaLabel: 'Close form',
  },

  events: {
    sectionId: 'events',
    heading: 'Community Events',
    footerLinkText: 'Events',
    iframeTitle: 'Event Calendar',
    facebookLinkText: 'View all events on Facebook',
    facebookUrl: 'https://www.facebook.com/acmecharity',
    descriptionText: 'community',
  },

  socialLinks: {
    facebook: {
      url: 'facebook.com/acmecharity',
      ariaLabel: 'Facebook',
    },
    twitter: {
      url: 'x.com/acmecharity',
      ariaLabel: 'X (Twitter)',
    },
    linkedin: {
      url: 'linkedin.com/company/acmecharity',
      ariaLabel: 'LinkedIn',
    },
    github: {
      url: 'github.com/acmecharity',
      ariaLabel: 'GitHub',
    },
  },

  copyright: {
    text: 'All Rights Reserved by Acme Charity a 501c3 Non Profit',
    searchText: 'All Rights Reserved',
    linkUrl: 'https://acmecharity.org',
    linkText: 'https://acmecharity.org',
  },

  animatedNumbers: {
    sectionHeading: 'Our Impact - 2024',
    statistics: [
      { description: 'Families helped', value: '500' },
      { description: 'Volunteers', value: '50' },
      { description: 'Community partners', value: '25' },
      { description: 'Volunteer hours', value: '1000' },
    ],
  },

  googleTagManager: {
    id: 'GTM-XXXXXXX', // Your GTM ID
  },

  logo: {
    headerAlt: 'Acme Charity',
    heroAlt: 'Hero image',
    navBarAriaLabel: 'Acme Charity home',
  },

  cookieConsent: {
    bannerHeading: 'We Value Your Privacy',
    modalHeading: 'Cookie Preferences',
    buttons: {
      acceptAll: 'Accept All',
      declineAll: 'Decline All',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      cancel: 'Cancel',
    },
  },
}
```

After updating the configuration file, run the tests:

```bash
npm run build
npm run test:e2e
```

All 62 tests should pass with your customized content!

## Advanced Customization

### Adding New Tests

If you need to add tests for new features:

1. Create a new test file: `tests/your-feature.spec.ts`
2. Import the test config: `import { testConfig } from './test.config'`
3. Add configuration for your feature to `test.config.ts`
4. Write tests using the configuration values

Example:

```typescript
// tests/test.config.ts
export const testConfig = {
  // ... existing config

  yourFeature: {
    heading: 'Your Feature Heading',
    buttonText: 'Click Here',
  },
}

// tests/your-feature.spec.ts
import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

test.describe('Your Feature', () => {
  test('should display feature heading', async ({ page }) => {
    await page.goto('/')
    const heading = page.locator(`h1:has-text("${testConfig.yourFeature.heading}")`)
    await expect(heading).toBeVisible()
  })
})
```

### Modifying Test Behavior

If you need to change how tests work (not just what they check):

1. Edit the relevant test file in `tests/`
2. Keep the configuration-based approach for content checks
3. Test your changes locally before committing

## Best Practices

1. **Always update test.config.ts first** before modifying test files
2. **Run tests after customization** to ensure everything works
3. **Keep configuration values exact** - they must match page content exactly
4. **Use descriptive values** in configuration for clarity
5. **Test locally before pushing** to catch issues early

## Further Reading

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Best Practices](https://playwright.dev/docs/best-practices)
