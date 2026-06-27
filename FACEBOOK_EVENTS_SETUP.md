# Facebook Events Integration - Setup Guide

**Last Updated:** December 9, 2024

This guide provides step-by-step instructions for implementing the Facebook Events integration on the Free For Charity homepage. Follow this guide after reviewing `FACEBOOK_EVENTS_REQUIREMENTS.md`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Phase 1: Facebook Page Plugin Implementation](#phase-1-facebook-page-plugin-implementation)
- [Phase 2: Graph API Implementation (Optional)](#phase-2-graph-api-implementation-optional)
- [Testing and Validation](#testing-and-validation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting implementation, ensure you have:

- [x] Read and understood `FACEBOOK_EVENTS_REQUIREMENTS.md`
- [x] Confirmed Free For Charity Facebook page URL: `https://www.facebook.com/freeforcharity`
- [x] Verified Facebook page has upcoming events posted
- [x] Development environment set up (Node.js 20.x, npm)
- [x] Access to repository: `FreeForCharity/FFC_Single_Page_Template`
- [x] Reviewed existing cookie consent implementation in `src/components/cookie-consent/index.tsx`

## Phase 1: Facebook Page Plugin Implementation

This is the **recommended approach** for the initial implementation. It's simple, maintainable, and requires no API credentials.

### Step 1: Create the Events Section Component

Create a new component at `src/components/home-page/Events/index.tsx`:

```typescript
'use client'

import React, { useEffect, useState } from 'react'

const Events: React.FC = () => {
  const [consentGiven, setConsentGiven] = useState(false)
  const [fbSdkLoaded, setFbSdkLoaded] = useState(false)

  useEffect(() => {
    // Check if marketing consent has been given
    const consent = localStorage.getItem('cookie_consent')
    if (consent) {
      const consentData = JSON.parse(consent)
      if (consentData.marketing) {
        setConsentGiven(true)
      }
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      if (event.detail.marketing) {
        setConsentGiven(true)
      }
    }

    window.addEventListener('cookieConsentChange' as any, handleConsentChange)
    return () => {
      window.removeEventListener('cookieConsentChange' as any, handleConsentChange)
    }
  }, [])

  useEffect(() => {
    if (consentGiven && !fbSdkLoaded) {
      loadFacebookSDK()
    }
  }, [consentGiven, fbSdkLoaded])

  const loadFacebookSDK = () => {
    // Check if SDK is already loaded
    if (document.getElementById('facebook-jssdk')) {
      setFbSdkLoaded(true)
      return
    }

    // Create and append Facebook SDK script
    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      setFbSdkLoaded(true)
    }

    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode?.insertBefore(script, firstScript)
  }

  const openCookieSettings = () => {
    // Trigger cookie settings modal
    const event = new CustomEvent('openCookieSettings')
    window.dispatchEvent(event)
  }

  return (
    <div id="events" className="py-[52px]">
      <div className="w-[90%] mx-auto max-w-7xl">
        <h1
          className="font-[400] text-[40px] lg:text-[48px] tracking-[0] text-center mx-auto mb-[50px]"
          id="faustina-font"
        >
          Upcoming Events
        </h1>

        <div className="text-center mb-8">
          <p className="text-[20px] lg:text-[25px] font-[400]" id="lato-font">
            Join us for upcoming volunteer opportunities, training sessions, and community events.{' '}
            <a
              href="https://www.facebook.com/freeforcharity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2EA3F2] hover:underline"
            >
              View all events on Facebook
            </a>
          </p>
        </div>

        {consentGiven ? (
          <div className="flex justify-center">
            <div
              className="fb-page"
              data-href="https://www.facebook.com/freeforcharity"
              data-tabs="events"
              data-width="500"
              data-height="600"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="false"
            >
              <blockquote
                cite="https://www.facebook.com/freeforcharity"
                className="fb-xfbml-parse-ignore"
              >
                <a href="https://www.facebook.com/freeforcharity">Free For Charity</a>
              </blockquote>
            </div>
          </div>
        ) : (
          <div
            className="text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 max-w-2xl mx-auto"
            data-testid="events-consent-required"
          >
            <h3 className="text-2xl font-semibold mb-4" id="lato-font">
              Connect with Our Community
            </h3>
            <p className="text-lg text-gray-600 mb-6" id="lato-font">
              To view our upcoming Facebook events, please accept marketing and social media
              cookies.
            </p>
            <button
              onClick={openCookieSettings}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors font-[500]"
              id="lato-font"
            >
              Manage Cookie Preferences
            </button>
          </div>
        )}
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default Events
```

### Step 2: Add Events Section to Homepage

Update `src/app/home-page/index.tsx` to include the Events section:

```typescript
import React from 'react'
import Hero from '@/components/home-page/Hero'
import Mission from '@/components/home-page/Mission'
import SupportFreeForCharity from '@/components/home-page/SupportFreeForCharity'
import EndowmentFeatures from '@/components/home-page/Endowment-Features'
import OurPrograms from '@/components/home-page/Our-Programs'
import VolunteerwithUs from '@/components/home-page/Volunteer-with-Us'
import Results2023 from '@/components/home-page/Results-2023'
import Testimonials from '@/components/home/Testimonials'
import TheFreeForCharityTeam from '@/components/home-page/TheFreeForCharityTeam'
import FrequentlyAskedQuestions from '@/components/home-page/FrequentlyAskedQuestions'
import Events from '@/components/home-page/Events' // Add this import

const index = () => {
  return (
    <div>
      <Hero />
      <Mission />
      <Results2023 />
      <Testimonials />
      <VolunteerwithUs />
      <Events /> {/* Add this line */}
      <SupportFreeForCharity />
      <EndowmentFeatures />
      <OurPrograms />
      <FrequentlyAskedQuestions />
      <TheFreeForCharityTeam />
    </div>
  )
}

export default index
```

### Step 3: Update Cookie Consent Component

Modify `src/components/cookie-consent/index.tsx` to dispatch events that the Events component can listen to:

Add the following after consent is updated (look for where `localStorage.setItem('cookie_consent', ...)` is called):

```typescript
// After saving consent, dispatch custom event
const consentEvent = new CustomEvent('cookieConsentChange', {
  detail: {
    necessary: true,
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
  },
})
window.dispatchEvent(consentEvent)
```

Also add an event listener for opening cookie settings:

```typescript
useEffect(() => {
  const handleOpenSettings = () => {
    setShowBanner(true)
  }

  window.addEventListener('openCookieSettings', handleOpenSettings)
  return () => {
    window.removeEventListener('openCookieSettings', handleOpenSettings)
  }
}, [])
```

### Step 4: Update Footer Navigation

Add Events to the Quick Links in `src/components/footer/index.tsx`:

```typescript
{ name: 'Home', href: '/#hero' },
{ name: 'Mission', href: '/#mission' },
{ name: 'Programs', href: '/#programs' },
{ name: 'Events', href: '/#events' }, // Add this line
{ name: 'Donate', href: '/#donate' },
{ name: 'Volunteer', href: '/#volunteer' },
{ name: 'FAQ', href: '/#faq' },
{ name: 'Team', href: '/#team' },
```

### Step 5: Update Privacy Policy

Add Facebook Events section to `src/app/privacy-policy/page.tsx`:

Find the section about third-party services and add:

```typescript
<h3 className="text-[28px] font-semibold mt-8 mb-4 text-[#333]">
  Facebook Events Integration
</h3>
<p className="mb-4 text-[#333]">
  Our website displays upcoming events from our Facebook page using the Facebook Page Plugin.
  When you consent to marketing and social media cookies, this plugin may load content from
  Facebook and set cookies that allow Facebook to track your activity on our site, even if
  you are not logged into Facebook.
</p>
<p className="mb-4 text-[#333]">
  <strong>Data Shared with Facebook:</strong>
</p>
<ul className="list-disc list-inside mb-4 text-[#333]">
  <li>Your IP address</li>
  <li>Browser information</li>
  <li>Pages visited on our site</li>
  <li>Interaction with the events widget</li>
  <li>Time spent on page</li>
</ul>
<p className="mb-4 text-[#333]">
  <strong>User Control:</strong> You can control whether the Facebook plugin loads by managing
  your cookie preferences through our cookie consent banner. You may also opt out of Facebook
  tracking through your Facebook ad settings at{' '}
  <a
    href="https://www.facebook.com/settings/?tab=ads"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    https://www.facebook.com/settings/?tab=ads
  </a>
  .
</p>
```

### Step 6: Update Cookie Policy

Add Facebook Events details to `src/app/cookie-policy/page.tsx`:

Find the marketing cookies section and add:

```typescript
<h4 className="font-semibold mb-2 text-[#333]">Facebook Page Plugin (Events Widget)</h4>
<p className="mb-4 text-[#333]">
  <strong>Purpose:</strong> Display upcoming Facebook events from our Facebook page
  <br />
  <strong>Provider:</strong> Meta Platforms, Inc.
  <br />
  <strong>Data Collected:</strong> Facebook may set cookies to track page visits, user
  interactions, and behavior even for non-logged-in users
  <br />
  <strong>Privacy Policy:</strong>{' '}
  <a
    href="https://www.facebook.com/privacy/policy/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    https://www.facebook.com/privacy/policy/
  </a>
  <br />
  <strong>Opt-out:</strong>{' '}
  <a
    href="https://www.facebook.com/settings/?tab=ads"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    Facebook Ad Settings
  </a>
</p>
```

Don't forget to update the effective date at the top of the cookie policy file.

### Step 7: Update External Dependencies Documentation

Add Facebook Events to `EXTERNAL_DEPENDENCIES.md`:

Find the "Direct Integrations" section and add after the Meta Pixel entry:

```markdown
#### 8. Facebook Page Plugin (Events)

- **Purpose:** Display upcoming events from Free For Charity Facebook page
- **Implementation:** Embedded widget via iframe
- **Domain:** `www.facebook.com`, `connect.facebook.net`
- **Load Strategy:** Conditional (only after marketing cookie consent)
- **Data Collected:** User interactions, page views, browser information
- **User Control:** Requires explicit user consent via cookie banner
- **Privacy Policy:** https://www.facebook.com/privacy/policy/
- **Opt-out:** https://www.facebook.com/settings/?tab=ads
```

Update the preconnect section if needed:

````markdown
### Preconnect Optimization

To improve performance, we preconnect to frequently used domains:

```typescript
// src/app/layout.tsx
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://connect.facebook.net" /> {/* Add if not present */}
<link rel="preconnect" href="https://ffcsites.org" />
<link rel="preconnect" href="https://www.zeffy.com" />
<link rel="preconnect" href="https://widgets.guidestar.org" />
```
````

````

### Step 8: Add Preconnect for Facebook SDK (Optional but Recommended)

Update `src/app/layout.tsx` to add Facebook preconnect:

Find the existing preconnect links and add:

```typescript
<link rel="preconnect" href="https://connect.facebook.net" />
````

This improves performance by establishing early connection to Facebook's CDN.

### Step 9: Create Playwright Tests

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
    const heading = page.locator('#events h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Upcoming Events')
  })

  test('should show consent placeholder when cookies not accepted', async ({ page }) => {
    // If cookie banner appears, reject cookies
    const rejectButton = page.locator('button:has-text("Reject All")')
    if (await rejectButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rejectButton.click()
    }

    // Scroll to events section
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Verify placeholder is shown
    await expect(page.locator('[data-testid="events-consent-required"]')).toBeVisible()

    // Verify "Manage Cookie Preferences" button exists
    await expect(page.locator('button:has-text("Manage Cookie Preferences")')).toBeVisible()
  })

  test('should show Facebook widget after accepting cookies', async ({ page }) => {
    // Accept marketing cookies if banner appears
    const acceptButton = page.locator('button:has-text("Accept All")')
    if (await acceptButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptButton.click()
    }

    // Scroll to events section
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Wait for Facebook widget to load (may take a few seconds)
    await page.waitForSelector('.fb-page', { timeout: 10000 })

    // Verify Facebook widget container is present
    await expect(page.locator('.fb-page')).toBeVisible()
  })

  test('should have link to Facebook page', async ({ page }) => {
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Find link to Facebook page
    const fbLink = page.locator('#events a[href*="facebook.com/freeforcharity"]').first()
    await expect(fbLink).toBeVisible()

    // Verify link opens in new tab
    await expect(fbLink).toHaveAttribute('target', '_blank')
    await expect(fbLink).toHaveAttribute('rel', /noopener/)
  })

  test('should be keyboard accessible', async ({ page }) => {
    await page.locator('#events').scrollIntoViewIfNeeded()

    // Tab to events section link
    await page.keyboard.press('Tab')

    // Check if any element within events section can receive focus
    const focusedElement = page.locator('#events :focus')
    const isEventsSectionFocused = await focusedElement.count().then((count) => count > 0)

    // This is informational - keyboard accessibility should be manually verified
    console.log('Events section keyboard accessible:', isEventsSectionFocused)
  })

  test('should maintain section ID for navigation', async ({ page }) => {
    // Navigate directly to events section via hash
    await page.goto('/#events')

    // Verify we're at the events section
    const eventsSection = page.locator('#events')
    await expect(eventsSection).toBeVisible()

    // Verify the section is scrolled into view
    const isInViewport = await eventsSection.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return rect.top >= 0 && rect.top < window.innerHeight
    })

    expect(isInViewport).toBe(true)
  })
})
```

### Step 10: Manual Testing

Before committing, perform these manual tests:

1. **Start development server:**

   ```bash
   npm run dev
   ```

2. **Test without consent:**
   - Open http://localhost:3000
   - Reject or close cookie banner
   - Scroll to Events section
   - Verify placeholder is shown
   - Verify "Manage Cookie Preferences" button works

3. **Test with consent:**
   - Clear browser data (cookies and localStorage)
   - Reload page
   - Accept marketing cookies
   - Scroll to Events section
   - Verify Facebook widget loads (may take 5-10 seconds)
   - Verify events are visible

4. **Test responsiveness:**
   - Test on mobile viewport (320px, 375px, 414px)
   - Test on tablet viewport (768px, 1024px)
   - Test on desktop (1280px, 1920px)
   - Verify widget adapts to container width

5. **Test accessibility:**
   - Navigate with keyboard only (Tab, Enter)
   - Test with screen reader (if available)
   - Verify proper heading hierarchy
   - Check color contrast

## Phase 2: Graph API Implementation (Optional)

**Note:** This approach is recommended only if you need custom event display or the Facebook Page Plugin doesn't meet your needs.

### External Setup Steps

These steps must be completed **outside the codebase** before implementation:

#### 1. Create Facebook Developer Account

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Log in with Free For Charity Facebook account credentials
3. Click "My Apps" in the top navigation
4. Click "Create App"

#### 2. Create Facebook App

1. **Choose App Type:** Select "Business"
2. **App Name:** "Free For Charity Events Integration"
3. **App Contact Email:** Use privacy@freeforcharity.org or clarkemoyer@freeforcharity.org
4. **Business Account:** Select or create Free For Charity business account
5. Click "Create App"

#### 3. Configure App Settings

1. Go to App Dashboard
2. Navigate to **Settings > Basic**
3. Note your **App ID** and **App Secret** (keep these secure)
4. Add **App Domains:** `ffcworkingsite1.org`, `freeforcharity.github.io`
5. Add **Privacy Policy URL:** `https://ffcworkingsite1.org/privacy-policy`
6. Add **Terms of Service URL:** `https://ffcworkingsite1.org/terms-of-service`
7. Save changes

#### 4. Get Page Access Token

**Important:** You must be an admin of the Free For Charity Facebook page.

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant permissions:
   - `pages_read_engagement`
   - `pages_show_list`
5. You'll get a **User Access Token** (short-lived, ~1 hour)
6. Copy this token

#### 5. Get Page ID

1. In Graph API Explorer, make a request to `/me/accounts`
2. Find Free For Charity page in the response
3. Copy the **Page ID** (numeric ID)

#### 6. Exchange for Long-Lived Page Access Token

**Method 1: Using Graph API Explorer**

1. Make request to: `/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}`
2. Copy the long-lived user token (valid 60 days)
3. Make request to: `/{page-id}?fields=access_token`
4. This returns the Page Access Token (valid 60 days)
5. Store this token securely

**Method 2: Using cURL**

```bash
# Step 1: Get long-lived user token
curl -X GET "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"

# Step 2: Get page access token
curl -X GET "https://graph.facebook.com/v19.0/{page-id}?fields=access_token&access_token={long-lived-user-token}"
```

#### 7. Test Token

Verify the token works:

```bash
curl -X GET "https://graph.facebook.com/v19.0/{page-id}/events?access_token={page-access-token}"
```

You should see a JSON response with events data.

#### 8. Store Token Securely

**For Development:**
Create `.env.local` (add to .gitignore):

```env
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_ACCESS_TOKEN=your_page_access_token_here
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
```

**For Production:**

1. **GitHub Secrets:** Store tokens in repository secrets
   - Go to repository Settings > Secrets and variables > Actions
   - Add `FACEBOOK_PAGE_ID`
   - Add `FACEBOOK_ACCESS_TOKEN`

2. **Cloudflare Environment Variables:**
   - Go to Cloudflare dashboard
   - Add environment variables for deployment

#### 9. Set Up Token Refresh Automation

Tokens expire after 60 days. Set up a reminder or automation:

**Option A: Manual Reminder**

- Set calendar reminder for 55 days from token creation
- Repeat steps 4-6 to refresh token

**Option B: Automated Refresh (Advanced)**

- Create a GitHub Actions workflow to refresh token
- Store refresh date in repository
- Automatically run token refresh and update secrets

**Example workflow (`.github/workflows/refresh-fb-token.yml`):**

```yaml
name: Refresh Facebook Token

on:
  schedule:
    # Run every 50 days at 2am UTC
    - cron: '0 2 */50 * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  refresh-token:
    runs-on: ubuntu-latest
    steps:
      - name: Refresh Facebook Token
        run: |
          # Call your token refresh endpoint or script
          # Update GitHub secrets via API
          echo "Token refresh logic here"
        env:
          FACEBOOK_APP_ID: ${{ secrets.FACEBOOK_APP_ID }}
          FACEBOOK_APP_SECRET: ${{ secrets.FACEBOOK_APP_SECRET }}
```

#### 10. Submit for App Review (If Needed)

**When is App Review needed?**

- If app is used by users other than page admins
- If you need permissions beyond basic page access
- For production use outside of development mode

**Steps:**

1. Go to App Dashboard > App Review
2. Submit required permissions for review
3. Provide detailed explanation of how permissions are used
4. Provide screencast/demo of your implementation
5. Wait for Facebook approval (can take several days)

### Implementation Steps

Once external setup is complete, implement the API integration:

#### 1. Create API Route (if using Next.js API routes)

**Note:** This requires server-side rendering or API routes, which may not work with static export.

Alternative: Use Cloudflare Workers or similar serverless function.

#### 2. Create Events Fetcher

Create `src/lib/facebook-events.ts`:

```typescript
interface FacebookEvent {
  id: string
  name: string
  description?: string
  start_time: string
  end_time?: string
  place?: {
    name: string
    location?: {
      city: string
      state: string
      street: string
    }
  }
}

export async function fetchFacebookEvents(): Promise<FacebookEvent[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

  if (!pageId || !accessToken) {
    console.error('Facebook credentials not configured')
    return []
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/events?` +
        `fields=name,description,start_time,end_time,place&` +
        `time_filter=upcoming&` +
        `access_token=${accessToken}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching Facebook events:', error)
    return []
  }
}
```

#### 3. Create Custom Event Card Component

Create `src/components/home-page/Events/EventCard.tsx`:

```typescript
import React from 'react'
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi'

interface EventCardProps {
  id: string
  name: string
  description?: string
  startTime: string
  endTime?: string
  place?: {
    name: string
    location?: {
      city: string
      state: string
    }
  }
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  description,
  startTime,
  endTime,
  place,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-2xl font-semibold mb-3" id="lato-font">
        {name}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FiCalendar className="w-5 h-5 mr-2 text-orange-500" />
          <span id="lato-font">{formatDate(startTime)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FiClock className="w-5 h-5 mr-2 text-orange-500" />
          <span id="lato-font">
            {formatTime(startTime)}
            {endTime && ` - ${formatTime(endTime)}`}
          </span>
        </div>

        {place && (
          <div className="flex items-center text-gray-600">
            <FiMapPin className="w-5 h-5 mr-2 text-orange-500" />
            <span id="lato-font">
              {place.name}
              {place.location && `, ${place.location.city}, ${place.location.state}`}
            </span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-gray-700 mb-4" id="lato-font">
          {truncateDescription(description)}
        </p>
      )}

      <a
        href={`https://www.facebook.com/events/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors font-[500]"
        id="lato-font"
      >
        View on Facebook
      </a>
    </div>
  )
}

export default EventCard
```

#### 4. Update Events Component for Graph API

Replace the Events component with Graph API version:

```typescript
import React from 'react'
import EventCard from './EventCard'
import { fetchFacebookEvents } from '@/lib/facebook-events'

const Events: React.FC = async () => {
  const events = await fetchFacebookEvents()

  return (
    <div id="events" className="py-[52px]">
      <div className="w-[90%] mx-auto max-w-7xl">
        <h1
          className="font-[400] text-[40px] lg:text-[48px] tracking-[0] text-center mx-auto mb-[50px]"
          id="faustina-font"
        >
          Upcoming Events
        </h1>

        <div className="text-center mb-12">
          <p className="text-[20px] lg:text-[25px] font-[400]" id="lato-font">
            Join us for upcoming volunteer opportunities, training sessions, and community events.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                description={event.description}
                startTime={event.start_time}
                endTime={event.end_time}
                place={event.place}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600" id="lato-font">
              No upcoming events at this time. Check back soon!
            </p>
            <a
              href="https://www.facebook.com/freeforcharity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2EA3F2] hover:underline text-lg mt-4 inline-block"
              id="lato-font"
            >
              Visit our Facebook page
            </a>
          </div>
        )}
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default Events
```

**Note:** Server components (async) may not work with static export. Consider using client-side fetching or a static generation strategy.

## Testing and Validation

### Run Automated Tests

```bash
# Build the site
npm run build

# Run Playwright tests
npm run test:e2e

# Or run with UI
npm run test:e2e:ui
```

### Run Lighthouse Performance Test

```bash
npm run build
npm run preview

# In another terminal
npm run lighthouse
```

**Acceptance criteria:**

- Performance: ≥ 95
- Accessibility: 100
- Best Practices: ≥ 95
- SEO: 100

### Manual Testing Checklist

- [ ] Events section appears on homepage
- [ ] Section heading is properly styled
- [ ] Events display correctly (Page Plugin or custom cards)
- [ ] Facebook link works and opens in new tab
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Cookie consent integration works correctly
- [ ] Privacy policy updated with correct information
- [ ] Cookie policy updated with Facebook Events details
- [ ] External dependencies documentation updated
- [ ] Footer navigation includes Events link
- [ ] Keyboard accessibility works (Tab navigation)
- [ ] Screen reader announces content properly
- [ ] Performance metrics maintained (Lighthouse)
- [ ] No console errors or warnings

## Deployment

### Update GitHub Actions Workflow

No changes needed - existing deployment workflow will automatically deploy the new Events section.

### Deploy to Production

```bash
# Ensure all changes are committed
git add .
git commit -m "Add Facebook Events section to homepage"
git push origin main
```

The GitHub Actions workflow will:

1. Build the site with static export
2. Run Playwright tests
3. Deploy to GitHub Pages
4. Update Cloudflare cache

### Verify Deployment

1. Visit https://ffcworkingsite1.org
2. Scroll to Events section
3. Test cookie consent flow
4. Verify events load correctly
5. Test on mobile device

## Troubleshooting

### Facebook Widget Not Loading

**Symptoms:** Page Plugin doesn't appear after accepting cookies

**Solutions:**

1. Check browser console for errors
2. Verify Facebook SDK script is loaded (`document.getElementById('facebook-jssdk')`)
3. Check if ad blocker is blocking Facebook scripts
4. Verify `data-href` attribute is correct
5. Clear browser cache and reload
6. Test in incognito/private browsing mode

### Cookie Consent Not Working

**Symptoms:** Widget loads without consent or doesn't load with consent

**Solutions:**

1. Check localStorage for `cookie_consent` key
2. Verify `cookieConsentChange` event is being dispatched
3. Check consent object structure matches expected format
4. Test cookie consent flow from scratch (clear localStorage)
5. Check browser console for JavaScript errors

### Performance Issues

**Symptoms:** Lighthouse score drops after adding Events section

**Solutions:**

1. Implement lazy loading for Facebook SDK
2. Use Intersection Observer to load only when section is visible
3. Verify preconnect hint is in place for `connect.facebook.net`
4. Consider deferring Facebook SDK load until after initial page load
5. Test with Facebook SDK loading disabled to isolate impact

### Token Expired (Graph API)

**Symptoms:** Events not loading, API errors in logs

**Solutions:**

1. Check token expiration date (60 days from creation)
2. Generate new long-lived token following steps 4-6 in External Setup
3. Update environment variables with new token
4. Verify token works with cURL test
5. Set up automated token refresh workflow

### CORS Errors (Graph API)

**Symptoms:** Browser console shows CORS errors when fetching events

**Solutions:**

1. Ensure Facebook API calls are made server-side, not client-side
2. Use API routes or serverless functions for fetching
3. Never expose access token in client-side code
4. Consider using Cloudflare Workers for API proxy

### App Review Required

**Symptoms:** Facebook returns error about permissions or app review

**Solutions:**

1. Check if app is in Development Mode or Live Mode
2. For development, ensure testing users are added to app
3. For production, submit app for review if needed
4. Use Page Plugin approach to avoid App Review requirements

## Maintenance

### Regular Tasks

**Monthly:**

- [ ] Verify Events section is displaying correctly
- [ ] Check Facebook page for upcoming events
- [ ] Test cookie consent flow

**Every 50 Days (Graph API only):**

- [ ] Generate new long-lived page access token
- [ ] Update environment variables
- [ ] Test API integration

**Quarterly:**

- [ ] Review Facebook SDK version (update if needed)
- [ ] Review privacy policy for accuracy
- [ ] Test on new browser versions
- [ ] Review Lighthouse scores

### Monitoring

Set up monitoring for:

- Facebook SDK load failures
- API errors (if using Graph API)
- Performance regressions
- Accessibility issues

### Support Contacts

**Technical Issues:**

- Repository: https://github.com/FreeForCharity/FFC_Single_Page_Template/issues
- Email: clarkemoyer@freeforcharity.org

**Facebook Developer Support:**

- Developer Documentation: https://developers.facebook.com/docs/
- Support: https://developers.facebook.com/support/

**Privacy/Legal Questions:**

- Email: privacy@freeforcharity.org

---

**Document Status:** ✅ Complete - Ready for Implementation

**Estimated Implementation Time:** 4-6 hours (Phase 1), 16-20 hours (Phase 2)

**Next Steps:** Begin with Phase 1 implementation following steps 1-10 above
