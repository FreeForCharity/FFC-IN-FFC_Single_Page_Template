# External Dependencies and Third-Party Services

**Last Updated:** December 9, 2024

This document provides a comprehensive list of all external dependencies and third-party services used by the Free For Charity website. This includes both direct integrations (services we explicitly configure) and transitive dependencies (services loaded by our direct integrations).

## Table of Contents

- [Overview](#overview)
- [Direct Integrations](#direct-integrations)
- [Transitive Dependencies](#transitive-dependencies)
- [Development Dependencies](#development-dependencies)
- [Privacy and Data Handling](#privacy-and-data-handling)

## Overview

Free For Charity's website uses various third-party services to provide functionality, analytics, and enhanced user experience. All services are carefully selected to align with our mission while respecting user privacy.

**Privacy Notice:** Users can control analytics and marketing cookies through our cookie consent banner. See our [Privacy Policy](/privacy-policy) and [Cookie Policy](/cookie-policy) for details.

## Direct Integrations

These are services we directly integrate into our application code.

### Analytics & Tracking (Consent-Based)

#### 1. Google Tag Manager (GTM)

- **Purpose:** Tag management system for analytics and marketing pixels
- **GTM ID:** `GTM-TQ5H8HPR`
- **Implementation:** `src/components/google-tag-manager/index.tsx`
- **Load Strategy:** `lazyOnload` for better performance
- **Data Collected:** Page views, user interactions, custom events
- **User Control:** Respects cookie consent preferences
- **Privacy Policy:** https://policies.google.com/privacy

#### 2. Google Analytics

- **Purpose:** Website traffic and user behavior analytics
- **Implementation:** Loaded via cookie consent when user accepts analytics cookies
- **Location:** `src/components/cookie-consent/index.tsx`
- **Data Collected:** Page views, session duration, user demographics, device information
- **User Control:** Requires explicit user consent via cookie banner
- **Privacy Policy:** https://policies.google.com/privacy
- **Opt-out:** https://tools.google.com/dlpage/gaoptout

#### 3. Microsoft Clarity

- **Purpose:** User behavior analytics (session recordings, heatmaps)
- **Implementation:** Loaded via cookie consent when user accepts analytics cookies
- **Location:** `src/components/cookie-consent/index.tsx`
- **Data Collected:** Session recordings, heatmaps, user interactions
- **User Control:** Requires explicit user consent via cookie banner
- **Privacy Policy:** https://privacy.microsoft.com/privacystatement

#### 4. Meta Pixel (Facebook)

- **Purpose:** Advertising and conversion tracking
- **Implementation:** Loaded via cookie consent when user accepts marketing cookies
- **Location:** `src/components/cookie-consent/index.tsx`
- **Data Collected:** Page views, custom events, conversion data
- **User Control:** Requires explicit user consent via cookie banner
- **Privacy Policy:** https://www.facebook.com/privacy/policy/
- **Opt-out:** https://www.facebook.com/settings/?tab=ads

#### 5. SociableKit Facebook Events Widget

- **Purpose:** Display Facebook events via third-party widget
- **Implementation:** SociableKit iframe widget embedded in the site
- **Domain:** `widgets.sociablekit.com`
- **Load Strategy:** Lazy-loaded iframe (loaded only when the events section is visible)
- **Data Collected:** User interactions, page views, browser/device information (as determined by SociableKit)
- **User Control:** Requires explicit user consent via cookie banner before loading
- **Privacy Policy:** https://www.sociablekit.com/privacy-policy/
- **Opt-out:** See SociableKit privacy policy for data subject rights
- **Status:** Documented - Implementation complete

**Technical Details:**

- Integration: Embedded via iframe from SociableKit
- No Facebook SDK or direct Facebook domain requests are made; all event data is proxied through SociableKit
- Privacy Considerations: Loading the widget may send user data (IP address, browser info, etc.) to SociableKit. Users should review SociableKit's privacy policy for details. Widget is only loaded after user consents to marketing cookies.

### Forms & User Input

#### 6. Microsoft Forms

- **Purpose:** Charity application form
- **Form URL:** `https://forms.office.com/r/vePxGq6JqG`
- **Implementation:** Embedded via iframe in `src/components/ui/ApplicationFormButton.tsx`
- **Sandbox Attributes:** `allow-scripts allow-forms allow-popups`
- **Load Trigger:** On-demand when user clicks "Apply to Become a Supported Charity"
- **Data Collected:** User-submitted form data
- **User Control:** Modal can be closed without submitting
- **Privacy Policy:** https://privacy.microsoft.com/
- **Important:** Microsoft Forms may load additional third-party services (see Transitive Dependencies)

### Donation Platform

#### 7. Zeffy

- **Purpose:** Zero-fee donation processing platform
- **Implementation:** Embedded widget
- **Domain:** `www.zeffy.com`
- **Preconnect:** Configured in `src/app/layout.tsx`
- **Data Collected:** Donation transaction data
- **Privacy Policy:** https://www.zeffy.com/privacy

### Transparency & Validation

#### 8. GuideStar (Candid)

- **Purpose:** Display charity transparency seal
- **Implementation:** Widget embedded in footer
- **Domain:** `widgets.guidestar.org`
- **Preconnect:** Configured in `src/app/layout.tsx`
- **Data Collected:** Minimal (widget display only)
- **Privacy Policy:** https://www.guidestar.org/privacy

### External Volunteer Platforms

#### 9. Idealist.org

- **Purpose:** Volunteer opportunity listings
- **Implementation:** Link to external profile
- **URL:** `https://www.idealist.org/en/nonprofit/356bfc8e2ae64f83beea4a4e677e99d7-free-for-charity-state-college#opportunities`
- **Data Collected:** None (external link only)
- **Privacy Policy:** https://www.idealist.org/en/privacy

## Transitive Dependencies

These are third-party services loaded by our direct integrations. We do not directly control these, but they are important to disclose for transparency.

### 1. HubSpot (via Microsoft Forms)

- **Source:** Microsoft Forms integration
- **Service:** `feedback-web-fetcher`
- **Purpose:** Form analytics and feedback collection for Microsoft Forms
- **Implementation:** Automatically loaded by Microsoft Forms iframe
- **User Control:** Only loads when application form modal is opened
- **Privacy Policy:** https://legal.hubspot.com/privacy-policy
- **Note:** This is a Microsoft-controlled service, not directly integrated by Free For Charity

**Discovery:** Identified through page speed analysis. See the [Microsoft Forms (and the HubSpot investigation)](./LESSONS_LEARNED.md#microsoft-forms-and-the-hubspot-investigation) section of `LESSONS_LEARNED.md` for the full summary.

### Other Potential Transitive Dependencies

Third-party services we use may load additional services. While we cannot exhaustively list all transitive dependencies, major ones include:

- **Google Services:** Analytics, Fonts, APIs
- **Meta/Facebook:** Various tracking and analytics services
- **Microsoft Services:** Forms backend, authentication, cloud services
- **Content Delivery Networks (CDNs):** For serving third-party scripts and assets

## Development Dependencies

These dependencies are used during development and build processes but are not included in the production website:

### Build Tools

- **Next.js** (v16.0.7) - React framework
- **TypeScript** (v5) - Type safety
- **Tailwind CSS** (v4.1.12) - Styling framework
- **PostCSS** (v8.5.6) - CSS processing

### Testing & Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Playwright** - End-to-end testing
- **@axe-core/react** - Accessibility testing

### CI/CD

- **GitHub Actions** - Continuous integration and deployment
- **Lighthouse CI** - Performance monitoring
- **CodeQL** - Security scanning
- **Linkinator** - Link validation

See `package.json` for complete list of development dependencies.

## Privacy and Data Handling

### Data Collection Principles

1. **Minimal Collection:** We only collect data necessary for website functionality and improvement
2. **User Consent:** Analytics and marketing cookies require explicit user consent
3. **Transparency:** All third-party services are documented here
4. **Security:** Data transmission uses HTTPS encryption
5. **Compliance:** GDPR and CCPA compliant practices

### Cookie Categories

#### Necessary Cookies (Always Active)

- Cookie consent preferences
- Session management
- Security tokens

#### Functional Cookies (Always Active)

- Zeffy donation forms
- Microsoft Forms (when opened)
- Essential website features

#### Analytics Cookies (Requires Consent)

- Google Analytics
- Microsoft Clarity
- Google Tag Manager events

#### Marketing Cookies (Requires Consent)

- Meta Pixel (Facebook)
- Advertising tracking
- Conversion tracking

### Data Retention

- **Analytics Data:** Varies by service (typically 14-26 months)
- **Form Submissions:** Stored by Microsoft Forms per their retention policy
- **Cookie Preferences:** 12 months
- **Donation Data:** Managed by Zeffy per their privacy policy

### User Rights

Users have the right to:

- Access their personal data
- Correct inaccurate data
- Request data deletion
- Opt-out of analytics and marketing
- Withdraw consent at any time

Contact: privacy@freeforcharity.org or 520-222-8104

## Performance Optimization

### Preconnect Optimization

To improve performance, we preconnect to frequently used domains:

```typescript
// src/app/layout.tsx
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.zeffy.com" />
<link rel="preconnect" href="https://widgets.guidestar.org" />
```

### Lazy Loading

- Google Tag Manager: `lazyOnload` strategy
- Microsoft Forms: On-demand (only when modal opened)
- Zeffy Widget: Embedded but optimized
- Analytics: Conditional loading based on consent

## Security Measures

### Third-Party Script Security

1. **Iframe Sandboxing:** Microsoft Forms iframe restricted with `allow-scripts allow-forms allow-popups`
2. **Content Security Policy:** Configured to allow only necessary domains
3. **HTTPS Only:** All external resources loaded via HTTPS
4. **Regular Audits:** Dependencies monitored for security vulnerabilities
5. **CodeQL Scanning:** Automated security analysis via GitHub Actions

### Dependency Management

- **Dependabot:** Automated dependency updates
- **Security Advisories:** GitHub Advanced Security enabled
- **Vulnerability Scanning:** Regular npm audit runs
- **Version Pinning:** Exact versions in package-lock.json

## Monitoring and Compliance

### Regular Reviews

- **Quarterly:** Review all third-party services for continued necessity
- **As Needed:** Evaluate new services before integration
- **Continuous:** Monitor for security vulnerabilities and updates

### Compliance Status

- ✅ GDPR Compliant - Cookie consent, data rights, privacy policy
- ✅ CCPA Compliant - Data disclosure, opt-out options
- ✅ Accessibility - WCAG 2.1 AA standards
- ✅ Security - Regular scanning and updates

## Contact Information

For questions about our external dependencies or privacy practices:

- **Email:** clarkemoyer@freeforcharity.org
- **Phone:** 520-222-8104
- **Privacy Contact:** privacy@freeforcharity.org

## Related Documentation

- [Privacy Policy](/privacy-policy) - How we handle user data
- [Cookie Policy](/cookie-policy) - Detailed cookie information
- [Security Policy](./SECURITY.md) - Security practices and reporting
- [HubSpot Investigation summary](./LESSONS_LEARNED.md#microsoft-forms-and-the-hubspot-investigation) - Why HubSpot cookies appear (Microsoft Forms transitive dependency)

## Updates to This Document

| Date       | Changes                                                             |
| ---------- | ------------------------------------------------------------------- |
| 2024-12-11 | Added SociableKit Facebook Events Widget - implementation complete  |
| 2024-12-09 | Added Facebook Events integration documentation                     |
| 2024-12-07 | Initial documentation of all external dependencies and integrations |

---

**Note:** This document is maintained as part of our commitment to transparency. If you notice any missing dependencies or have questions, please contact us.
