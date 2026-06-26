# Microsoft Form Setup

## Overview

The application button now opens a Microsoft Form in a popup modal instead of redirecting to the old cart.php URLs.

## Updating the Microsoft Form URL

The application button is currently configured to use the Microsoft Form at `https://forms.office.com/r/vePxGq6JqG`.

If you need to change the form URL, you can configure it in two ways:

### Option 1: Update Default in Component

Edit `src/components/ui/ApplicationFormButton.tsx` and update the form URL on line 23:

```typescript
const microsoftFormUrl = formUrl || 'https://forms.office.com/r/vePxGq6JqG'
```

### Option 2: Pass as Component Prop (Optional - for testing or multiple forms)

```tsx
<ApplicationFormButton formUrl="https://forms.office.com/r/YOUR_FORM_ID" />
```

### Microsoft Form URL Formats

Microsoft Forms supports two URL formats:

1. **Modern short format** (recommended): `https://forms.office.com/r/{formId}`
   - Example: `https://forms.office.com/r/vePxGq6JqG`
   - This is the format used by default

2. **Legacy format**: `https://forms.office.com/pages/responsepage.aspx?id={formId}`
   - Example: `https://forms.office.com/pages/responsepage.aspx?id=dHQyc2FwbGUtaWQtZXhhbXBsZQ`
   - Still supported but longer

### How to Get Your Microsoft Form URL

1. Create your Microsoft Form at https://forms.office.com
2. Click "Share" or "Send" to get the form link
3. Copy the full form URL
4. Update the component using one of the methods above

## Components Updated

The following components now use the new `ApplicationFormButton`:

1. **Home Page - Our Programs Section**
   - File: `src/components/home-page/Our-Programs/index.tsx`
   - Location: After the program descriptions, in the "Ready to Get Started Now?" section

## Features

- **Modal Popup**: Opens in a centered modal overlay
- **Close Button**: X button in top-right corner
- **Click Outside to Close**: Click on the dark background to close
- **Body Scroll Lock**: Page scroll is disabled when popup is open
- **Responsive**: Works on mobile and desktop
- **Hover Effect**: Button has hover animation

## Testing

After updating the URL, test the popup by:

1. Running `npm run dev`
2. Navigate to the Programs section on the homepage
3. Click "Apply to Become a Supported Charity"
4. Verify the Microsoft Form loads in the popup
5. Test closing the popup with the X button and by clicking outside

## Old URLs Replaced

The following old application URLs have been removed:

- `https://freeforcharity.org/hub/cart.php?a=confproduct&i=0` (501c3)
- `https://freeforcharity.org/hub/cart.php?a=confproduct&i=1` (Pre-501c3)
- `https://freeforcharity.org/hub/cart.php?a=confproduct&i=8` (Hosting)

All now use a single unified application form.
