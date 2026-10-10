# Google Tag Manager (GTM) Component

This component implements Google Tag Manager integration for the Free For Charity website.

## Overview

Google Tag Manager (GTM) is a tag management system that allows you to manage and deploy marketing tags (snippets of code or tracking pixels) on your website without having to modify the code directly.

## Implementation Details

### Components

1. **GoogleTagManager** - Main component that injects the GTM script into the page
2. **GoogleTagManagerNoScript** - Fallback iframe for users with JavaScript disabled

### Features

- ✅ Standard GTM implementation following Google's guidelines
- ✅ Consent Mode v2 defaults are set BEFORE GTM loads (inline bootstrap in the root layout — see `src/lib/consent-mode.ts`)
- ✅ Initializes `dataLayer` before GTM loads
- ✅ Uses Next.js Script component with `lazyOnload` strategy
- ✅ Includes noscript fallback for accessibility
- ✅ Integrates with existing cookie consent system
- ✅ GTM ID read from `src/lib/analytics.config.ts` (one place for all analytics IDs)

## Configuration

### Setting Your GTM ID

The GTM container ID lives in `src/lib/analytics.config.ts` alongside the other
analytics IDs. To update it:

1. Open `src/lib/analytics.config.ts`
2. Set the `gtmId` field to your actual GTM container ID:

```ts
export const analyticsConfig = {
  gtmId: 'GTM-ABC1234', // your GTM container ID
  // ...
}
```

Replace the value with your actual GTM container ID from Google Tag Manager (e.g., `GTM-ABC1234`).

## Usage

The component is automatically integrated into the root layout (`src/app/layout.tsx`):

```tsx
import GoogleTagManager, { GoogleTagManagerNoScript } from './../components/GoogleTagManager'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        {/* ... rest of body content */}
      </body>
    </html>
  )
}
```

## How It Works

### 1. Script Injection

The GTM script is loaded using Next.js's `Script` component with the `lazyOnload` strategy, which means:

- The script loads during browser idle time, after the page becomes interactive
- It doesn't block the initial page load
- It's optimal for analytics and marketing tags

The root layout emits the Google Consent Mode v2 bootstrap (`CONSENT_MODE_BOOTSTRAP` from `src/lib/consent-mode.ts`) as an inline `<head>` script placed **before** `<GoogleTagManager />`, so the consent defaults are already in the `dataLayer` by the time GTM initializes.

### 2. DataLayer Initialization

The GTM script automatically initializes the `window.dataLayer` array with:

- A timestamp (`gtm.start`)
- The initial event (`gtm.js`)

This ensures the dataLayer is ready to receive events as soon as the page loads.

### 3. Cookie Consent Integration (Google Consent Mode v2)

GTM loads on **every pageview**. Consent gates what its Google tags may **store**, not whether they load:

- The inline bootstrap in the root layout sets two `gtag('consent', 'default', ...)` calls before GTM loads: a region-scoped **denial** for the EEA, the UK, and Switzerland (with `wait_for_update: 500`), then an unscoped **grant** for everyone else. Google determines which default applies from the visitor's IP address.
- In denied regions, GA4 (whether delivered by GTM or by the direct loader) sends cookieless pings until the visitor accepts; everywhere else it uses cookies from the first pageview.
- Every banner interaction AND every stored-choice restore pushes `gtag('consent', 'update', ...)` (via `updateGoogleConsent` in `src/lib/consent-mode.ts`) plus a `consent_update` dataLayer event that GTM triggers can use.

Non-Google scripts do **not** speak Consent Mode, so the `CookieConsent` component keeps them strictly opt-in everywhere: Microsoft Clarity loads only on an explicit analytics grant, and the Meta Pixel only on an explicit marketing grant. Withdrawing consent deletes the third-party cookies those services set.

### 4. Noscript Fallback

For users with JavaScript disabled, the component includes an iframe fallback that allows GTM to track basic page views.

## Testing

Comprehensive tests are available in `tests/google-tag-manager.spec.ts`:

```bash
# Run GTM tests
pnpm run test:e2e tests/google-tag-manager.spec.ts
```

Test coverage includes:

- ✅ DataLayer initialization
- ✅ GTM script loading
- ✅ Noscript fallback presence
- ✅ Event pushing to dataLayer
- ✅ Cookie consent integration

## Deployment

### GitHub Pages Deployment

The site automatically deploys to GitHub Pages via `.github/workflows/nextjs.yml`. The GTM implementation works on both:

1. **GitHub Pages (default)**: https://freeforcharity.github.io/FFC-IN-FFC_Single_Page_Template/
2. **Custom domain** (only if a fork configures one via `public/CNAME`)

The GTM ID is hardcoded in the component, so no additional configuration is needed for deployment.

### Local Development

To test GTM locally:

```bash
# Start development server
pnpm run dev
```

The GTM script will load automatically with the configured GTM ID.

## Debugging

### Verify GTM is Loading

Open your browser's developer console and check:

```javascript
// Check if dataLayer exists
console.log(window.dataLayer)

// Check if GTM script is loaded
console.log(document.querySelector('script[id="gtm-script"]'))
```

### Google Tag Assistant

Use the [Tag Assistant Chrome Extension](https://tagassistant.google.com/) to verify:

- GTM container is loading
- Tags are firing correctly
- Data is being sent to Google Analytics, Ads, etc.

### Preview Mode

In GTM, use Preview mode to:

1. See which tags fire on your pages
2. Debug tag configurations
3. Test before publishing changes

## Security Considerations

- ✅ GTM ID is hardcoded in the component (visible in source code)
- ✅ Script uses official Google CDN
- ✅ No sensitive data is sent to GTM by default
- ✅ Integrates with cookie consent for privacy compliance

**Note**: Since the GTM ID is hardcoded and visible in the source code, ensure you're using proper GTM security features like allowlists and container permissions to prevent unauthorized modifications.

## Performance

The GTM implementation is optimized for performance:

- Uses Next.js Script component for optimal loading
- Loads after page becomes interactive (doesn't block rendering)
- DataLayer is initialized early to capture events
- Minimal overhead (~7-10KB for GTM container)

## Troubleshooting

### GTM Not Loading

1. Verify the GTM ID in `src/components/GoogleTagManager/index.tsx` is correct

2. Check GTM ID format (should be `GTM-XXXXXXX`)

3. Check browser console for errors

### DataLayer Events Not Firing

1. Verify dataLayer is initialized:

   ```javascript
   console.log(window.dataLayer)
   ```

2. Check cookie consent status

3. Use GTM Preview mode to debug

### Ad Blockers

Note: Ad blockers may prevent GTM from loading. This is expected behavior and affects all analytics implementations.

## Updating the GTM ID

To change the GTM container ID:

1. Open `src/lib/analytics.config.ts`
2. Update the `gtmId` field:
   ```ts
   gtmId: 'GTM-NEW1234', // Your new GTM ID
   ```
3. Commit and push the changes
4. The changes will be deployed automatically via GitHub Actions

## Additional Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [GTM Implementation Guide](https://support.google.com/tagmanager/answer/6103696)
