# Facebook Events Integration Requirements

**Last Updated:** December 9, 2024

This document outlines the technical and functional requirements for integrating Free For Charity's Facebook events into a new Events section on the homepage.

## Table of Contents

- [Overview](#overview)
- [Integration Options](#integration-options)
- [Recommended Approach](#recommended-approach)
- [Technical Requirements](#technical-requirements)
- [Privacy and Compliance Requirements](#privacy-and-compliance-requirements)
- [Design Requirements](#design-requirements)
- [Implementation Considerations](#implementation-considerations)
- [Testing Requirements](#testing-requirements)

## Overview

Free For Charity maintains an active Facebook page at [https://www.facebook.com/freeforcharity](https://www.facebook.com/freeforcharity) that hosts events to engage with the community, volunteers, and supported charities. This integration will display upcoming Facebook events directly on the homepage to increase visibility and engagement.

### Goals

- **Display Individual Events:** Show the **next 5 upcoming events** as individual cards, not a full Facebook page widget
- **Direct Links:** Each event card must link directly to the specific event on Facebook
- **Clean Design:** Custom event cards that match the existing site design
- **Increase Event Visibility:** Display upcoming events prominently on the homepage
- **Drive Engagement:** Make it easy for visitors to discover and attend events
- **Maintain Consistency:** Automatically sync with Facebook event updates
- **Ensure Privacy Compliance:** Respect GDPR, CCPA, and user privacy preferences
- **Preserve Performance:** Minimize impact on page load times and Lighthouse scores

### Specific Requirements

Based on stakeholder feedback:

1. **Only list events** - NOT the full Facebook page
2. **Show next 5 events** - Exactly 5 upcoming events
3. **Direct event links** - Link to each event's Facebook page (e.g., facebook.com/events/[event-id])
4. **Custom design** - Individual event cards, not embedded widget

## Integration Options

Given the requirement to show **only individual event cards (not the full Facebook page)**, the integration approach is determined:

### Required Approach: Facebook Graph API

**Description:** Use Facebook's Graph API to programmatically fetch event data and render exactly 5 upcoming events as individual custom cards with direct links to each event on Facebook.

**Why This is Required:**

The requirement explicitly states: _"list events not the full FB page"_ and _"show the next 5 events"_ with direct links to each event. The Facebook Page Plugin cannot meet this requirement because:

- ❌ Shows full Facebook page (cover photo, posts, etc.), not just events
- ❌ Cannot limit to exactly 5 events
- ❌ Cannot create individual event cards with custom styling
- ❌ Does not provide direct links to individual events

**Pros:**

- ✅ Complete control over design and layout
- ✅ Can display exactly 5 events as required
- ✅ Custom event cards with direct links to each event (e.g., facebook.com/events/[event-id])
- ✅ Matches existing site design perfectly
- ✅ Better performance (server-side fetching)
- ✅ No third-party iframe dependencies
- ✅ No tracking cookies needed (when implemented server-side)

**Cons:**

- ❌ Requires Facebook Developer account and app creation
- ❌ Needs access token management (tokens expire every 60 days)
- ❌ Requires API permissions (`pages_read_engagement`)
- ❌ Must handle token refresh logic (can be automated)
- ❌ More development time (16-20 hours vs 4-6 hours for Page Plugin)
- ❌ Potential API rate limits (typically 200 calls/hour per user)
- ❌ May need Facebook App Review for production use

**Technical Details:**

- API Endpoint: `GET /{page-id}/events?fields=id,name,description,start_time,end_time,place&limit=5&time_filter=upcoming&access_token={token}`
- Required Permissions: `pages_read_engagement`
- Token Type: Long-lived Page Access Token (60 days validity)
- Response Format: JSON with event objects

**Event URL Format:**

Facebook uses different URL formats for events:

- Modern format: `https://www.facebook.com/share/[share-id]/` (Example: https://www.facebook.com/share/17eDJE45WE/)
- Legacy format: `https://www.facebook.com/events/[event-id]`

**Important:** The Graph API response includes the event ID, but may need additional API calls or URL construction to get the shareable link. During implementation, verify which URL format is returned by the API or construct the appropriate URL based on the event ID.

**Example Response:**

```json
{
  "data": [
    {
      "id": "123456789",
      "name": "Volunteer Training Workshop",
      "start_time": "2024-12-15T18:00:00-0500",
      "end_time": "2024-12-15T20:00:00-0500",
      "description": "Join us for a hands-on training...",
      "place": {
        "name": "Free For Charity Office",
        "location": {
          "city": "State College",
          "state": "PA",
          "street": "301 Science Park Road"
        }
      }
    }
  ]
}
```

### Option 3: Third-Party Widget Services

**Description:** Use services like SociableKIT, Elfsight, or similar that provide event embedding widgets.

**Pros:**

- Easier setup than Graph API
- More customization than Page Plugin
- Handle token management for you
- Often provide enhanced features

**Cons:**

- Additional third-party dependency
- May have monthly costs
- Privacy policy updates required
- Less control than Graph API
- Another service to maintain

## Required Approach

**Facebook Graph API - REQUIRED**

Based on the specific requirements, the Graph API is the only viable approach:

**Requirements that mandate Graph API:**

1. **"List events not the full FB page"** - Must show only events as individual cards
2. **"Show the next 5 events"** - Must display exactly 5 upcoming events
3. **Direct event links** - Each card must link to the specific event (e.g., https://www.facebook.com/share/17eDJE45WE/)
4. **Custom design** - Event cards must match the existing site design

**Why Graph API is Required:**

- ✅ Can fetch and display only event data (not full page)
- ✅ Can limit results to exactly 5 events
- ✅ Provides event IDs/URLs for direct linking
- ✅ Allows complete control over card design
- ✅ No embedded Facebook widgets or iframes

**Implementation Considerations:**

1. **Token Management:** Tokens expire every 60 days - automated refresh recommended
2. **Static Site Compatibility:** Use build-time fetching, Cloudflare Workers, or scheduled builds
3. **Event URL Format:** Verify URL format from API (may be `/share/[id]` or `/events/[id]`)
4. **Development Time:** Estimated 16-20 hours including setup and testing

## Technical Requirements

### For Facebook Graph API Approach (REQUIRED)

#### Backend/API Requirements

1. **Facebook App Configuration**
   - Create Facebook Developer app
   - Configure app permissions
   - Generate Page Access Token
   - Store token securely (environment variable)

2. **Token Management**
   - Implement token refresh logic
   - Handle token expiration gracefully (60-day cycle)
   - Secure storage of access tokens
   - Monitoring for token validity

3. **API Integration**
   - Fetch events endpoint handler
   - Limit to 5 events with `?limit=5`
   - Filter for upcoming events only
   - Cache responses (reduce API calls, 1-hour TTL recommended)
   - Error handling for API failures
   - Rate limit management

#### Frontend Components

1. **Events Section Component** (`src/components/home-page/Events/index.tsx`)
   - Section container with consistent styling
   - Heading: "Upcoming Events"
   - Grid layout for event cards
   - Responsive design (mobile/tablet/desktop)
   - Loading states
   - Error states
   - Empty state (no upcoming events)

2. **Event Card Component** (`src/components/home-page/Events/EventCard.tsx`)
   - Event title, date, time
   - Location (if applicable)
   - Description (truncated with "read more")
   - **Direct link to Facebook event** (e.g., https://www.facebook.com/share/[id]/)
   - Share functionality (optional)
   - Responsive card design

#### Dependencies

- **No new npm packages required** for basic implementation
- Consider adding:
  - Date formatting library (e.g., `date-fns` or use built-in `Intl`)
  - HTTP client for API calls (if not using built-in `fetch`)

#### Configuration

```typescript
// Configuration for Facebook Graph API
interface FacebookEventsConfig {
  pageId: string // Facebook page ID
  accessToken: string // Long-lived page access token (from environment variable)
  limit: number // Number of events to fetch (5)
  fields: string[] // Event fields to retrieve
  cacheTimeout: number // Cache TTL in seconds (3600 = 1 hour)
}

// Example API call
const eventsUrl = `https://graph.facebook.com/v19.0/${pageId}/events?fields=id,name,description,start_time,end_time,place&limit=5&time_filter=upcoming&access_token=${accessToken}`
```

#### Event URL Construction

Based on the actual event URL format (https://www.facebook.com/share/17eDJE45WE/), the implementation needs to:

1. **Determine URL format** from Graph API response
2. **Construct event URLs** properly:
   - If API returns share ID: `https://www.facebook.com/share/${shareId}/`
   - If API returns event ID: `https://www.facebook.com/events/${eventId}`
3. **Test URL format** with actual event data during implementation
4. **Fallback** to Facebook page if event URL unavailable

## Privacy and Compliance Requirements

### GDPR and Cookie Consent

**Important:** When using the Graph API with server-side fetching, **NO tracking cookies are set** on user browsers, significantly simplifying privacy compliance.

#### Required Updates to Privacy Policy

Update `src/app/privacy-policy/page.tsx` to include:

```markdown
### Facebook Events Data

Our website displays upcoming events from our Facebook page using the Facebook Graph API. This integration fetches event information from Facebook's servers and displays it on our website. No tracking cookies are set on your browser, and no personal data is shared with Facebook when viewing events.

- **Purpose:** Display upcoming Facebook events from our Facebook page
- **Data Collected:** Facebook may set cookies to track page visits, user interactions,
  and behavior even for non-logged-in users
- **Cookie Category:** Marketing/Social Media
- **Provider:** Meta Platforms, Inc.
- **Privacy Policy:** [https://www.facebook.com/privacy/policy/](https://www.facebook.com/privacy/policy/)
- **User Control:** Requires explicit consent for marketing/social cookies
```

#### Required Updates to Privacy Policy

Update `src/app/privacy-policy/page.tsx` to include:

```markdown
### Facebook Events Integration

Our website displays upcoming events from our Facebook page using the Facebook Page Plugin.
When you consent to marketing and social media cookies, this plugin may load content from
Facebook and set cookies that allow Facebook to track your activity on our site, even if
you are not logged into Facebook.

**Data Shared with Facebook:**

- Your IP address
- Browser information
- Pages visited on our site
- Interaction with the events widget
- Time spent on page

**User Control:**
You can control whether the Facebook plugin loads by managing your cookie preferences
through our cookie consent banner. You may also opt out of Facebook tracking through
your Facebook ad settings at [https://www.facebook.com/settings/?tab=ads](https://www.facebook.com/settings/?tab=ads).
```

#### Implementation Requirements

1. **Conditional Loading**
   - Facebook SDK must NOT load until user explicitly consents to marketing/social cookies
   - Check consent state from existing cookie consent system
   - Only inject Facebook SDK script after consent

2. **Consent Banner Integration**
   - Update `src/components/cookie-consent/index.tsx` to handle Facebook Events
   - Add Facebook SDK loading logic similar to Meta Pixel implementation
   - Ensure banner displays before any Facebook content loads

3. **Placeholder State**
   - Show a placeholder or message when consent is not given
   - Example: "Accept marketing cookies to view our upcoming events"
   - Provide button to open consent settings

4. **Opt-Out Mechanism**
   - Users must be able to withdraw consent at any time
   - Removing consent should stop loading Facebook SDK on subsequent visits
   - Clear instructions in Privacy Policy on how to manage preferences

### External Dependencies Documentation

Update `EXTERNAL_DEPENDENCIES.md` to include:

```markdown
### Facebook Events Integration

#### Facebook Page Plugin

- **Purpose:** Display upcoming events from Free For Charity's Facebook page
- **Implementation:** Embedded widget via iframe
- **Domain:** `www.facebook.com`, `connect.facebook.net`
- **Preconnect:** `<link rel="preconnect" href="https://connect.facebook.net" />`
- **Load Strategy:** Conditional (only after marketing cookie consent)
- **Data Collected:** User interactions, page views, browser information
- **User Control:** Requires explicit consent via cookie banner
- **Privacy Policy:** https://www.facebook.com/privacy/policy/
- **Opt-out:** https://www.facebook.com/settings/?tab=ads

**Technical Details:**

- SDK Version: v19.0 or latest stable
- Plugin Type: Page Plugin with Events tab
- Integration: Client-side JavaScript SDK
- Sandbox: None (uses iframe from Facebook domain)
```

## Design Requirements

### Section Placement

The Events section should be placed on the homepage in a logical position:

**Recommended Placement:** After "Volunteer with Us" and before "Support Free For Charity"

Rationale:

- Events are related to volunteering and engagement
- Placing near volunteer section encourages participation
- Maintains flow from calls to action to informational content

**Homepage Section Order (with Events):**

```
1. Hero
2. Mission
3. Results 2023
4. Testimonials
5. Volunteer with Us
6. Events (NEW)
7. Support Free For Charity
8. Endowment Features
9. Our Programs
10. FAQ
11. Team
```

### Visual Design

#### Section Styling

- **Container:** Consistent with other homepage sections
- **Width:** `w-[90%] mx-auto` or `max-w-7xl mx-auto`
- **Padding:** `py-[52px]` (consistent with other sections)
- **Background:** White or light background to distinguish from other sections

#### Typography

- **Section Heading:**
  - Font: Faustina (consistent with "Our Programs", etc.)
  - Size: `text-[40px] lg:text-[48px]`
  - Weight: `font-[400]`
  - Alignment: `text-center`
  - Margin: `mb-[50px]`

- **Subheading/Description (optional):**
  - Font: Lato
  - Size: `text-[25px]`
  - Weight: `font-[500]`

#### Widget Styling

- **Width:** Responsive, full width on mobile, max 600px on desktop
- **Height:** 500-700px (enough to show 2-3 events)
- **Alignment:** Center-aligned
- **Border/Shadow:** Optional subtle shadow or border to distinguish widget
- **Mobile Responsiveness:** Adjust width and height for mobile screens

#### Consent Placeholder

When user has not consented to marketing cookies:

```tsx
<div className="text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
  <h3 className="text-2xl font-semibold mb-4">Upcoming Events</h3>
  <p className="text-lg text-gray-600 mb-6">
    To view our upcoming Facebook events, please accept marketing and social media cookies.
  </p>
  <button
    onClick={openCookieSettings}
    className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
  >
    Manage Cookie Preferences
  </button>
</div>
```

### Accessibility

- **Section ID:** `id="events"` for navigation anchor links
- **Semantic HTML:** Use proper heading hierarchy (h1 or h2 for section title)
- **ARIA Labels:** Add `aria-label` to Facebook widget for screen readers
- **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible
- **Focus Management:** Proper focus indicators for all clickable elements

## Implementation Considerations

### Performance

1. **Lazy Loading**
   - Consider loading Facebook SDK only when Events section is in viewport
   - Use Intersection Observer API for scroll-based loading
   - Initial page load should not be blocked by Facebook SDK

2. **Script Loading**
   - Load Facebook SDK `async` and `defer`
   - Don't block rendering or interactivity
   - Maintain Lighthouse performance scores (currently 95+)

3. **Caching**
   - Facebook plugin caches events automatically
   - No additional caching logic needed for Page Plugin approach
   - For Graph API approach, implement caching to reduce API calls

### Error Handling

1. **Facebook SDK Load Failure**
   - Detect when Facebook SDK fails to load (ad blockers, network issues)
   - Show fallback message with link to Facebook page
   - Example: "Unable to load events. [View events on Facebook](link)"

2. **No Upcoming Events**
   - Facebook plugin handles this automatically
   - Shows "No upcoming events" message
   - Consider showing past events or a message about checking back later

3. **Consent Not Given**
   - Show clear placeholder as described in Design Requirements
   - Provide easy way to give consent without page reload

### Build and Deployment

1. **Static Site Compatibility**
   - Facebook Page Plugin is fully compatible with static sites
   - No server-side rendering or API routes needed
   - Works with `output: "export"` in Next.js config

2. **Environment Variables** (if using Graph API)
   - `NEXT_PUBLIC_FACEBOOK_PAGE_ID` - Page ID
   - `FACEBOOK_ACCESS_TOKEN` - Server-side only, not exposed to client
   - Store securely in GitHub Secrets and Cloudflare environment

3. **Build Process**
   - No changes to existing build process
   - No impact on `pnpm run build` timing
   - Works with GitHub Pages deployment

### SEO Considerations

1. **Content Visibility**
   - Facebook plugin content may not be crawlable by search engines (iframe)
   - Consider adding schema.org Event markup for upcoming events
   - Add section description text that search engines can index

2. **Section Title and Description**
   - Include keyword-rich heading: "Upcoming Events and Volunteer Opportunities"
   - Add descriptive paragraph above widget for SEO value

3. **Link to Facebook Page**
   - Provide text link to Facebook page for crawlers: "View all events on our [Facebook page](link)"
   - Use `rel="noopener noreferrer"` for external link

## Testing Requirements

### Unit Tests

Not applicable for Facebook Page Plugin approach (external widget).

For Graph API approach:

- Test API response parsing
- Test error handling
- Test loading states
- Test empty states

### Integration Tests (Playwright)

Create `tests/facebook-events.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Facebook Events Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show events section with heading', async ({ page }) => {
    // Scroll to events section
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Verify section exists
    await expect(page.locator('#events')).toBeVisible()

    // Verify heading
    await expect(page.locator('#events h1, #events h2')).toBeVisible()
  })

  test('should show consent placeholder when cookies not accepted', async ({ page }) => {
    // Reject cookies first
    await page.locator('[data-testid="cookie-reject"]').click()

    // Scroll to events section
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Verify placeholder is shown
    await expect(page.locator('#events [data-testid="events-consent-required"]')).toBeVisible()
  })

  test('should load Facebook widget after accepting cookies', async ({ page }) => {
    // Accept marketing cookies
    await page.locator('[data-testid="cookie-accept"]').click()

    // Scroll to events section
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Wait for Facebook SDK to load
    await page.waitForSelector('.fb-page iframe', { timeout: 10000 })

    // Verify Facebook iframe is present
    await expect(page.locator('.fb-page iframe')).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Check for proper heading hierarchy
    const heading = page.locator('#events h1, #events h2')
    await expect(heading).toBeVisible()

    // Verify section has accessible name
    const section = page.locator('#events')
    await expect(section).toHaveAttribute('id', 'events')
  })

  test('should link to Facebook page', async ({ page }) => {
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Find link to Facebook page
    const fbLink = page.locator('#events a[href*="facebook.com/freeforcharity"]')
    await expect(fbLink).toBeVisible()

    // Verify link opens in new tab
    await expect(fbLink).toHaveAttribute('target', '_blank')
    await expect(fbLink).toHaveAttribute('rel', /noopener/)
  })
})
```

### Manual Testing Checklist

- [ ] Events section appears in correct position on homepage
- [ ] Section heading is properly styled and visible
- [ ] Placeholder shows when cookies not accepted
- [ ] Facebook widget loads after accepting marketing cookies
- [ ] Events are visible and properly formatted
- [ ] Widget is responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] RSVP links work correctly (open Facebook)
- [ ] Section is keyboard accessible (tab navigation works)
- [ ] Screen reader announces section and content properly
- [ ] Performance: Page load time is not significantly impacted
- [ ] Privacy: Facebook SDK only loads with consent
- [ ] Error handling: Graceful fallback if Facebook SDK fails
- [ ] Cross-browser: Works in Chrome, Firefox, Safari, Edge

### Performance Testing

Run Lighthouse before and after implementation:

```bash
pnpm run build
pnpm run preview
# In another terminal
pnpm run lighthouse
```

**Acceptance Criteria:**

- Performance score: Maintain 95+ (currently 97)
- Accessibility score: Maintain 100
- Best Practices score: Maintain 95+
- SEO score: Maintain 100

If scores drop significantly, investigate lazy loading or defer Facebook SDK loading.

## Implementation Timeline

### Phase 1: Basic Integration (Recommended for MVP)

**Estimated Time:** 4-6 hours

1. Create Events section component (1 hour)
2. Integrate with cookie consent system (1-2 hours)
3. Update privacy and cookie policies (1 hour)
4. Add Playwright tests (1 hour)
5. Manual testing and refinement (1-2 hours)

**Deliverables:**

- Events section on homepage with Facebook Page Plugin
- Cookie consent integration
- Updated privacy documentation
- Automated tests

### Phase 2: Enhanced Customization (Optional/Future)

**Estimated Time:** 16-20 hours

1. Set up Facebook Developer app and get credentials (2 hours)
2. Implement Graph API integration (4-6 hours)
3. Build custom event card components (3-4 hours)
4. Implement caching and token refresh (3-4 hours)
5. Comprehensive testing (2-3 hours)
6. Documentation updates (2 hours)

**Deliverables:**

- Custom-designed events display
- Full control over event presentation
- Optimized performance with caching
- Graph API integration documentation

## Next Steps

1. Review and approve this requirements document
2. See `FACEBOOK_EVENTS_SETUP.md` for step-by-step implementation guide
3. Decide on Phase 1 (Page Plugin) vs Phase 2 (Graph API) approach
4. Assign developer resources and timeline
5. Schedule review of privacy policy updates with legal/compliance team (if applicable)

## References

- [Facebook Page Plugin Documentation](https://developers.facebook.com/docs/plugins/page-plugin/)
- [Facebook Graph API - Events](https://developers.facebook.com/docs/graph-api/reference/event/)
- [GDPR and Social Media Widgets](https://gdpr.eu/cookies/)
- [Existing Cookie Consent Implementation](src/components/cookie-consent/index.tsx)
- [Meta Pixel Privacy Policy](https://www.facebook.com/privacy/policy/)

---

**Document Status:** ✅ Complete - Ready for Review

**Last Reviewed By:** GitHub Copilot Agent

**Next Review Date:** After implementation completion
