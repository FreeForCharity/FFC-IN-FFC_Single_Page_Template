# Facebook Events Integration - Executive Summary

**Date:** December 9, 2024  
**Status:** Requirements Complete - Ready for Implementation

## Overview

This document provides a high-level summary of the Facebook Events integration requirements and recommendations for the Free For Charity homepage. For detailed technical specifications, see the companion documents.

## Quick Reference

| Document                            | Purpose                                        | Audience                   |
| ----------------------------------- | ---------------------------------------------- | -------------------------- |
| **FACEBOOK_EVENTS_SUMMARY.md**      | Executive summary and decision guide           | Project stakeholders       |
| **FACEBOOK_EVENTS_REQUIREMENTS.md** | Complete technical and functional requirements | Developers, architects     |
| **FACEBOOK_EVENTS_SETUP.md**        | Step-by-step implementation guide              | Developers, implementers   |
| **EXTERNAL_DEPENDENCIES.md**        | Third-party service documentation              | Privacy, compliance, legal |

## The Problem

Free For Charity maintains an active Facebook page ([facebook.com/freeforcharity](https://www.facebook.com/freeforcharity)) with events for volunteers, training sessions, and community engagement. Currently, these events are only visible to users who visit Facebook directly, limiting visibility and engagement.

## The Solution

Add a new "Events" section to the homepage that displays the **next 5 upcoming Facebook events** as individual cards with direct links to each event on Facebook, increasing visibility and making it easier for visitors to discover and attend events.

## Integration Options

We've identified **three primary approaches**, each with different trade-offs:

### Option 1: Facebook Graph API ⭐ REQUIRED

**What it is:** Programmatic access to Facebook events data via REST API, with custom UI components showing individual event cards.

**Why required:** The requirement is to show **only the next 5 events as individual cards** with direct links to each event. The Facebook Page Plugin shows the full Facebook page widget, not individual event cards, so it cannot meet this requirement.

**Pros:**

- ✅ Complete control over design and layout
- ✅ Can display exactly 5 events as specified
- ✅ Custom event cards with direct links
- ✅ Matches existing site design perfectly
- ✅ Better performance optimization
- ✅ No third-party iframe dependencies

**Cons:**

- ❌ Requires Facebook Developer account
- ❌ Complex token management (expires every 60 days)
- ❌ Need API permissions and app review
- ❌ More development time (16-20 hours)
- ❌ Requires server-side or edge functions for token security

**Best for:** Meeting the specific requirement to show individual event cards

### Option 2: Facebook Page Plugin (NOT SUITABLE)

**What it is:** Facebook's official widget that embeds an iframe showing the full Facebook page with events tab.

**Why not suitable:** This approach shows the **entire Facebook page** (cover photo, posts, etc.) with an events tab, not just a clean list of event cards. It cannot be configured to show only events as individual cards with direct links.

**Pros:**

- ✅ Easiest to implement (4-6 hours)
- ✅ No API credentials or token management
- ✅ Automatic updates when events change

**Cons:**

- ❌ Shows full Facebook page, not just events
- ❌ Cannot display exactly 5 events
- ❌ Cannot create individual event cards
- ❌ Limited design customization
- ❌ Does not meet the stated requirements

**Best for:** Displaying the full Facebook page feed (not applicable here)

### Option 3: Third-Party Widget Services

**What it is:** Services like SociableKIT or Elfsight that handle Facebook integration for you.

**Pros:**

- ✅ Easier than Graph API
- ✅ More customizable than Page Plugin
- ✅ Token management handled for you

**Cons:**

- ❌ Monthly subscription costs
- ❌ Another third-party dependency
- ❌ Privacy policy updates required
- ❌ Less control than Graph API

**Best for:** If Page Plugin is insufficient but Graph API is too complex

## Required Approach

**Facebook Graph API** ⭐ REQUIRED

Based on the requirement to show **"the next 5 events"** as individual cards with direct links to each event on Facebook, the Graph API is the only viable approach. The Facebook Page Plugin cannot meet this requirement as it shows the full Facebook page, not individual event cards.

**Key Requirements:**

1. Display exactly the **next 5 upcoming events**
2. Show each event as an **individual card** (not embedded Facebook page)
3. Include **direct link to each event** on Facebook
4. Custom design that matches the existing site

**Implementation Approach:**

1. **Facebook Developer Setup** (External - Required)
   - Create Facebook Developer account and app
   - Generate long-lived page access token
   - Set up token refresh automation (60-day cycle)

2. **API Integration** (16-20 hours development)
   - Fetch events from Graph API
   - Display as custom event cards
   - Limit to 5 most recent upcoming events
   - Link each card to Facebook event page

3. **Alternative for Static Sites:**
   - Use build-time data fetching
   - Or implement Cloudflare Workers/Edge Functions
   - Avoid exposing API tokens in client-side code

**Why Graph API is Required:**

- Page Plugin shows **full Facebook page**, not individual events
- Page Plugin cannot limit to exactly 5 events
- Page Plugin cannot create custom event card designs
- Requirements explicitly state "list events not the full FB page"

> **Current Implementation Note (December 2024):**
>
> Although the requirements above specify the Facebook Graph API as the _required_ approach, the current homepage implementation uses the [SociableKit Facebook Events widget](https://www.sociablekit.com/facebook-page-events-widget/) (see Option 3 above) to display upcoming events. This was chosen for rapid deployment and to avoid the complexity of Facebook API tokens and server-side integration. The SociableKit widget allows embedding individual event cards with direct links, closely matching the design requirements, but relies on a third-party service and may have different privacy/compliance implications. If/when a native Graph API integration is implemented, this document will be updated accordingly.

## Privacy and Compliance

### Required Updates

The Facebook Events integration requires updates to these key documents:

1. **Privacy Policy** (`src/app/privacy-policy/page.tsx`)
   - Disclose API usage to fetch event data
   - Note: No tracking cookies needed for Graph API (server-side only)
   - Document data retention and usage

2. **Cookie Policy** (`src/app/cookie-policy/page.tsx`)
   - Note: Graph API approach does NOT require cookies if implemented server-side
   - Only update if using client-side fetching (not recommended)

3. **External Dependencies** (`EXTERNAL_DEPENDENCIES.md`)
   - Document Facebook Graph API integration
   - List API endpoints and domains
   - Update effective dates

### Privacy Benefits of Graph API

Unlike the Facebook Page Plugin, the Graph API approach (when implemented server-side) offers better privacy:

- ✅ No tracking cookies set on user browsers
- ✅ No Facebook SDK loaded on client
- ✅ Server-side data fetching only
- ✅ No user data shared with Facebook
- ✅ Simpler privacy compliance

**Note:** If cookie consent is needed, it should only be for analytics/tracking, not for displaying events.

## Design and Placement

### Section Placement

The Events section will be placed between "Volunteer with Us" and "Support Free For Charity" sections, creating a natural flow from volunteer engagement to event participation.

**Homepage Order:**

1. Hero
2. Mission
3. Results 2023
4. Testimonials
5. Volunteer with Us
6. **Events** ← NEW
7. Support Free For Charity
8. Endowment Features
9. Our Programs
10. FAQ
11. Team

### Visual Design

- **Consistent styling** with other homepage sections
- **Responsive design** for mobile, tablet, and desktop
- **Accessibility compliant** (WCAG 2.1 AA)
- **Clear heading:** "Upcoming Events"
- **Descriptive text** above widget
- **Direct link** to Facebook page for non-consented users

## Implementation Timeline

### Graph API Implementation (REQUIRED)

**Estimated Time:** 16-20 hours

**Breakdown:**

- External setup (Facebook app, token): 2 hours
- API integration and data fetching: 4-6 hours
- Custom event card components: 3-4 hours
- Token management automation: 3-4 hours
- Testing (automated + manual): 2-3 hours
- Documentation updates: 2 hours

**Deliverables:**

- [ ] Facebook Developer app configured
- [ ] Page access token generated
- [ ] Token refresh automation
- [ ] Events API integration
- [ ] Custom event card component (shows 5 events)
- [ ] Direct links to Facebook events
- [ ] Privacy documentation updates
- [ ] External dependencies documentation
- [ ] Playwright E2E tests
- [ ] Manual testing complete

## External Dependencies (REQUIRED)

### Facebook Developer Setup

**External setup required:**

1. **Create Facebook Developer Account**
   - Register at developers.facebook.com
   - Create new app for "Free For Charity Events"

2. **Configure App Settings**
   - Set app domains
   - Add privacy policy URL
   - Configure permissions

3. **Generate Page Access Token**
   - Get page ID for facebook.com/freeforcharity
   - Generate long-lived token (60 days)
   - Store securely as environment variable

4. **Set Up Token Refresh**
   - Create automated workflow
   - Schedule refresh every 50 days
   - Update environment variables

5. **(Optional) App Review**
   - Submit if deploying beyond test users
   - Justify permissions needed

See `FACEBOOK_EVENTS_SETUP.md` Section "Phase 2: External Setup Steps" for detailed instructions.

## Risks and Mitigations

| Risk                                  | Impact | Mitigation                                                  |
| ------------------------------------- | ------ | ----------------------------------------------------------- |
| Facebook SDK increases page load time | Medium | Lazy load SDK, preconnect hint, async/defer attributes      |
| Ad blockers block Facebook SDK        | Medium | Graceful fallback with link to Facebook page                |
| Privacy compliance concerns           | High   | Cookie consent integration, comprehensive policy updates    |
| Widget doesn't match site design      | Low    | Acceptable for Phase 1, can enhance in Phase 2 if needed    |
| Performance score degradation         | Medium | Monitor Lighthouse, optimize loading strategy               |
| Token expiration (Graph API)          | High   | Automated refresh workflow, monitoring alerts               |
| Facebook API changes                  | Low    | Use stable API version (v19.0), monitor deprecation notices |
| GDPR/CCPA violations                  | High   | Comprehensive consent management, clear disclosures         |

## Success Metrics

After implementation, track these metrics to measure success:

### Engagement Metrics

- Event page views
- Event click-throughs to Facebook
- RSVP conversions
- Time spent on Events section

### Technical Metrics

- Page load time (maintain < 2s)
- Lighthouse performance score (maintain ≥ 95)
- Widget load success rate
- Cookie consent rate

### User Experience Metrics

- Mobile vs desktop engagement
- Bounce rate from Events section
- User feedback/questions about events

## Next Steps

1. **Review & Approve**
   - Review this summary and detailed requirements documents
   - Confirm Phase 1 (Facebook Page Plugin) approach
   - Approve privacy policy updates

2. **Assign Resources**
   - Assign developer for 4-6 hour implementation
   - Schedule implementation window
   - Identify reviewer for code review

3. **Complete External Setup** (Developer/Admin)
   - Follow `FACEBOOK_EVENTS_SETUP.md` Phase 2 External Setup
   - Create Facebook Developer account and app
   - Generate page access token
   - Set up token refresh automation

4. **Begin Implementation** (Developer)
   - Follow `FACEBOOK_EVENTS_SETUP.md` Phase 2 Implementation
   - Create API integration to fetch events
   - Build custom event card components
   - Limit display to 5 events
   - Add direct links to each event on Facebook
   - Update privacy documentation

5. **Testing & Validation** (QA/Developer)
   - Run automated Playwright tests
   - Verify exactly 5 events displayed
   - Test direct links to Facebook events
   - Perform manual testing on multiple devices
   - Run Lighthouse performance tests
   - Validate data fetching and error handling

6. **Deploy to Production** (DevOps)
   - Store API tokens as environment variables
   - Merge PR after approval
   - Monitor deployment via GitHub Actions
   - Verify on live site
   - Monitor performance and engagement

7. **Post-Launch Maintenance**
   - Monitor token expiration (refresh before 60 days)
   - Gather user feedback
   - Monitor analytics
   - Track API usage and rate limits

## Questions and Answers

### Q: Why is Graph API required instead of the simpler Page Plugin?

**A:** The requirement specifies showing "the next 5 events" as individual cards with direct links, not the full Facebook page. The Page Plugin shows the entire Facebook page (cover, posts, etc.) with an events tab, which doesn't meet the requirement.

### Q: Will this slow down our website?

**A:** When implemented server-side (recommended), there's minimal impact. The API calls happen on the server/edge, and only the event data is sent to the client. No Facebook SDK or tracking scripts are loaded. Performance should be better than the Page Plugin approach.

### Q: What if users have ad blockers?

**A:** Ad blockers won't affect the Graph API approach since it's server-side. The events are fetched and rendered as regular HTML/React components, not third-party widgets.

### Q: What happens if Free For Charity has no upcoming events?

**A:** We'll implement a custom "No upcoming events" message with a link to the Facebook page. The developer has full control over the empty state.

### Q: Is token management really that complex for Graph API?

**A:** Tokens expire every 60 days. We'll set up automated refresh via GitHub Actions workflow that runs every 50 days to prevent expiration. The developer needs to configure this once during setup.

### Q: Can we use static site generation (GitHub Pages)?

**A:** Yes! Options include:

1. **Build-time fetching**: Fetch events during `pnpm run build` (events update when site rebuilds)
2. **Cloudflare Workers**: Proxy API requests to hide tokens
3. **GitHub Actions scheduled builds**: Rebuild site daily to refresh events

See implementation guide for specific approaches.

### Q: What about limiting to exactly 5 events?

**A:** The API query will include `?limit=5` parameter, and we'll add client-side filtering to ensure only upcoming events are shown. This gives precise control over the number of events displayed.

## Conclusion

The Facebook Events integration will significantly increase visibility of Free For Charity events and drive engagement from website visitors. The Graph API approach is **required** to meet the specific requirement of showing individual event cards with direct links.

**Recommendation:** ✅ Proceed with Graph API implementation

**Timeline:** 16-20 hours development + external setup + testing + deployment

**Next Step:** Assign developer and begin external setup following `FACEBOOK_EVENTS_SETUP.md`

---

## Document References

- **Full Requirements:** [FACEBOOK_EVENTS_REQUIREMENTS.md](./FACEBOOK_EVENTS_REQUIREMENTS.md)
- **Implementation Guide:** [FACEBOOK_EVENTS_SETUP.md](./FACEBOOK_EVENTS_SETUP.md)
- **External Dependencies:** [EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md)
- **Privacy Policy:** [src/app/privacy-policy/page.tsx](./src/app/privacy-policy/page.tsx)
- **Cookie Policy:** [src/app/cookie-policy/page.tsx](./src/app/cookie-policy/page.tsx)

## Contact

**Questions about this integration:**

- Technical: Repository issues or clarkemoyer@freeforcharity.org
- Privacy/Legal: privacy@freeforcharity.org
- General: clarkemoyer@freeforcharity.org | (520) 222-8104

---

**Document Status:** ✅ Complete and Ready for Review

**Prepared By:** GitHub Copilot Agent

**Review Requested From:** Project stakeholders, development team
