# Responsive Design Guide

## Overview

This document outlines the responsive design principles, breakpoints, and testing strategies used in the FFC Single Page Template. The site is built with a mobile-first approach using Tailwind CSS v4.1.12.

## Design Philosophy

### Mobile-First Approach

All components are designed to work beautifully on mobile devices first, then progressively enhanced for larger screens. This ensures:

- Optimal performance on mobile devices
- Better user experience for mobile users
- Cleaner, more maintainable code
- Faster page loads on slower connections

### Progressive Enhancement

Features and layouts are enhanced as screen size increases:

1. **Mobile (default)**: Single column, touch-optimized, essential content
2. **Tablet**: Two columns where appropriate, enhanced navigation
3. **Desktop**: Multi-column layouts, expanded content, hover states
4. **Large Desktop**: Maximum width constraints, enhanced spacing

## Tailwind CSS Breakpoints

The project uses Tailwind CSS's default breakpoint system:

| Breakpoint | Min Width | Device Target       | Tailwind Prefix |
| ---------- | --------- | ------------------- | --------------- |
| `xs`       | 0px       | Mobile phones       | (default)       |
| `sm`       | 640px     | Large phones        | `sm:`           |
| `md`       | 768px     | Tablets             | `md:`           |
| `lg`       | 1024px    | Laptops/Desktops    | `lg:`           |
| `xl`       | 1280px    | Large Desktops      | `xl:`           |
| `2xl`      | 1536px    | Extra Large Screens | `2xl:`          |

### Usage Example

```tsx
<div
  className="
  w-full          /* Mobile: Full width */
  sm:w-1/2        /* Small screens: Half width */
  md:w-1/3        /* Medium screens: Third width */
  lg:w-1/4        /* Large screens: Quarter width */
  p-4             /* Mobile: 1rem padding */
  md:p-6          /* Medium+: 1.5rem padding */
  lg:p-8          /* Large+: 2rem padding */
"
>
  Content here
</div>
```

## Component Responsiveness

### Navigation (Header)

**Mobile (< 768px)**:

- Hamburger menu button
- Slide-out mobile navigation panel
- Stacked logo and menu button
- Full-screen overlay when open
- Touch-optimized tap targets (min 44x44px)

**Tablet/Desktop (>= 768px)**:

- Horizontal navigation bar
- Inline navigation links
- Hover states enabled
- Logo and nav items in single row
- Expanded spacing

**Implementation**: `src/components/Header/index.tsx`

### Footer

**Mobile**:

- Single column layout
- Stacked sections
- Condensed spacing

**Tablet+**:

- Multi-column grid
- Horizontal sections
- Expanded spacing

**Implementation**: `src/components/Footer/index.tsx`

### Hero Section

**Mobile**:

- Single column
- Full-width images
- Stacked CTA buttons
- Reduced font sizes

**Desktop**:

- Two-column layout
- Side-by-side content and image
- Horizontal CTA buttons
- Enhanced typography

### Cards and Content Grids

**Mobile**: 1 column
**Tablet (md)**: 2 columns
**Desktop (lg)**: 3 columns
**Large Desktop (xl)**: 4 columns (where appropriate)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

## Testing Strategy

### Manual Testing Checklist

Test the following on each major component change:

**Mobile Devices**:

- [ ] iPhone SE (375px width)
- [ ] iPhone 14 Pro (393px width)
- [ ] Samsung Galaxy S20 (360px width)

**Tablets**:

- [ ] iPad Mini (768px width)
- [ ] iPad Pro (1024px width)

**Desktop**:

- [ ] Laptop (1280px width)
- [ ] Desktop (1920px width)
- [ ] Ultra-wide (2560px width)

### Browser DevTools Testing

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test responsive breakpoints:
   - 320px (small phone)
   - 640px (large phone / small tablet)
   - 768px (tablet)
   - 1024px (laptop)
   - 1280px (desktop)
   - 1920px (large desktop)

4. Test orientation changes (portrait ↔ landscape)
5. Verify touch targets are >= 44x44px on mobile

### Automated Testing

**Playwright E2E Tests**: `tests/`

Run responsive tests:

```bash
pnpm run test:e2e
```

Tests include:

- Mobile viewport rendering
- Tablet viewport rendering
- Desktop viewport rendering
- Navigation functionality across viewports
- Touch target sizes

### Lighthouse CI

Lighthouse CI automatically tests mobile and desktop performance:

```bash
pnpm run build
npx lhci autorun
```

**Key Metrics**:

- Performance score
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

## Common Responsive Patterns

### Container Padding

```tsx
<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
  {/* Content with responsive horizontal padding */}
</div>
```

### Maximum Width Containers

```tsx
<div className="container mx-auto max-w-7xl px-4">{/* Centered content with max width */}</div>
```

### Typography Scaling

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Responsive paragraph text
</p>
```

### Flexbox Direction Changes

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Showing/Hiding Elements

```tsx
{
  /* Show only on mobile */
}
;<div className="block md:hidden">Mobile only content</div>

{
  /* Hide on mobile, show on tablet+ */
}
;<div className="hidden md:block">Tablet and desktop content</div>
```

## Accessibility Considerations

### Touch Targets

**Minimum Size**: 44x44px for all interactive elements on mobile

```tsx
<button
  className="
  min-w-[44px] min-h-[44px]  /* Ensure minimum touch target */
  p-3                          /* Add padding for comfort */
  rounded-lg
"
>
  Button
</button>
```

### Focus States

All interactive elements must have visible focus states:

```tsx
<a
  className="
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
"
>
  Link
</a>
```

### Font Size

- Minimum body text: 16px (1rem) on mobile
- Avoid text smaller than 14px
- Ensure sufficient line height (1.5-1.6 for body text)

### Color Contrast

Maintain WCAG AA compliance:

- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

Test with browser DevTools or use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

## Performance Optimization

### Image Optimization

**Current Implementation**: Using `<img>` tags with `assetPath()` helper for GitHub Pages compatibility. This is acceptable for the static export use case.

**When to Implement Responsive Images:**

- Images larger than 500KB
- Hero images and featured graphics
- Images that appear at different sizes across breakpoints
- High-traffic pages where performance is critical

**Priority**: LOW - Current implementation is acceptable. Only implement if:

1. Lighthouse scores drop below 90 for performance
2. Specific images are identified as performance bottlenecks
3. Users report slow loading on mobile devices

**Implementation Example** (for future reference):

```tsx
<img
  src={assetPath('/images/hero-mobile.jpg')}
  srcSet={`
    ${assetPath('/images/hero-mobile.jpg')} 640w,
    ${assetPath('/images/hero-tablet.jpg')} 768w,
    ${assetPath('/images/hero-desktop.jpg')} 1280w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
  alt="Hero image"
/>
```

**Steps to Implement:**

1. Identify problematic images with Lighthouse audit
2. Generate multiple sizes of each image (640px, 768px, 1280px widths)
3. Add srcset and sizes attributes
4. Test on various devices
5. Measure improvement with Lighthouse

### Lazy Loading

Enable lazy loading for images below the fold:

```tsx
<img src={assetPath('/image.jpg')} loading="lazy" alt="Description" />
```

### Code Splitting

Next.js automatically code splits by page. For heavy components, use dynamic imports:

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

## Known Issues

### Image Elements

Current implementation uses `<img>` tags instead of Next.js `<Image>` component due to static export requirements and GitHub Pages deployment needs. ESLint warnings about `@next/next/no-img-element` are expected.

**Workaround**: Using `assetPath()` helper to ensure images work on GitHub Pages.

## Testing Tools

### Recommended Browser Extensions

- **Chrome DevTools**: Built-in responsive design mode
- **Responsive Viewer**: Test multiple devices simultaneously
- **Lighthouse**: Performance and accessibility audits

### Online Testing Tools

- [BrowserStack](https://www.browserstack.com/): Real device testing
- [Responsive Design Checker](https://responsivedesignchecker.com/): Quick viewport testing
- [Am I Responsive?](http://ami.responsivedesign.is/): Visual preview across devices

## Best Practices

### DO ✅

- Start with mobile design first
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Test on real devices when possible
- Ensure touch targets are minimum 44x44px
- Use semantic HTML
- Maintain accessibility standards
- Optimize images for different viewports
- Use system fonts when possible for performance

### DON'T ❌

- Assume desktop-first design will work on mobile
- Use fixed pixel widths without responsive alternatives
- Ignore touch target sizes on mobile
- Use hover-only interactions (provide alternatives for touch)
- Forget to test on real devices or browser DevTools
- Use text smaller than 14px
- Ignore performance on slower connections
- Create layouts that require horizontal scrolling

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Contributing

When adding new components or modifying existing ones:

1. Follow mobile-first approach
2. Test across all breakpoints
3. Ensure accessibility standards
4. Document any responsive behavior changes
5. Update this guide if introducing new patterns
6. Run Lighthouse CI to verify performance

---

**Last Updated**: 2026-07-18  
**Repository**: FreeForCharity/FFC_Single_Page_Template  
**Node.js**: 24.x (validated with v24.18.0)  
**Maintainer**: FreeForCharity Development Team
