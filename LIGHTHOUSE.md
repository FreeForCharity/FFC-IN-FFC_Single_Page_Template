# Lighthouse CI - Performance Monitoring

This document explains how to use Lighthouse CI to monitor the performance, accessibility, SEO, and best practices of the Free For Charity website.

## Table of Contents

1. [Overview](#overview)
2. [What is Lighthouse?](#what-is-lighthouse)
3. [Automated Audits](#automated-audits)
4. [Running Lighthouse Locally](#running-lighthouse-locally)
5. [Understanding Lighthouse Reports](#understanding-lighthouse-reports)
6. [Performance Optimization Tips](#performance-optimization-tips)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Lighthouse CI is integrated into our CI/CD pipeline to automatically audit the website's quality after each deployment. It measures:

- **Performance**: Loading speed and runtime performance
- **Accessibility**: WCAG compliance and usability for all users
- **Best Practices**: Security, modern web standards, and code quality
- **SEO**: Search engine optimization and discoverability

### Current Thresholds

Our Lighthouse CI is configured with the following warning thresholds:

| Category           | Threshold | Priority |
| ------------------ | --------- | -------- |
| **Performance**    | 55%       | Medium   |
| **Accessibility**  | 90%       | High     |
| **Best Practices** | 65%       | Medium   |
| **SEO**            | 95%       | High     |

These are **warning** levels, not hard failures. They help identify areas for improvement without blocking deployments. Thresholds are set just below current performance levels to catch regressions while allowing for normal score variations.

---

## What is Lighthouse?

Lighthouse is an open-source, automated tool developed by Google for improving the quality of web pages. It audits:

### Performance Metrics

- **First Contentful Paint (FCP)**: When the first text or image appears
- **Largest Contentful Paint (LCP)**: When the largest element appears
- **Time to Interactive (TTI)**: When the page becomes fully interactive
- **Speed Index**: How quickly content is visually displayed
- **Total Blocking Time (TBT)**: Time between FCP and TTI
- **Cumulative Layout Shift (CLS)**: Visual stability during loading

### Accessibility Checks

- Color contrast ratios
- ARIA attributes
- Form labels
- Alt text for images
- Keyboard navigation
- Screen reader compatibility

### SEO Checks

- Meta descriptions
- Title tags
- Crawlability
- Mobile-friendliness
- Structured data

### Best Practices

- HTTPS usage
- Console errors
- Image optimization
- Security vulnerabilities
- Modern JavaScript practices

---

## Automated Audits

### When Audits Run

Lighthouse CI runs automatically:

1. **After successful deployment** to the main branch (via `workflow_run` trigger)
   - Triggers after the "Deploy to GitHub Pages" workflow completes successfully
   - Only runs on the main branch to avoid duplicate runs on PRs
2. **On pull requests** to the main branch (with results posted as PR comments)
   - Runs once per PR to provide feedback before merging
3. **On manual trigger** from the Actions tab
4. **Multiple runs per page** (3 runs) to calculate and report median scores

> **Note**: The workflow is configured to avoid duplicate runs. PRs trigger only via the `pull_request` event, while main branch deployments trigger only via the `workflow_run` event.

### Viewing CI Results

#### In Pull Request Comments

When Lighthouse runs on a pull request, it automatically posts a comprehensive comment showing:

- **Median scores** for each category (Performance, Accessibility, Best Practices, SEO)
- **Visual indicators** (🟢 Good, 🟡 Needs Improvement, 🔴 Poor)
- **Threshold comparison** showing if scores meet configured thresholds
- **Summary status** indicating if all thresholds are met

The comment includes a table for each audited page with:

- Current scores vs. thresholds
- Pass/warn indicators (✅/⚠️)
- Links to download detailed reports

#### In GitHub Actions Logs

1. Go to the **Actions** tab in the repository
2. Look for **"Lighthouse CI"** workflow runs
3. Click on a workflow run to see the detailed logs
4. Check the **"Display Lighthouse Results Summary"** step for scores
5. View all individual run scores in the console output

#### Downloading Reports

1. In the workflow run, scroll to the **Artifacts** section
2. Download **"lighthouse-reports"** artifact
3. Extract the ZIP file
4. Open HTML files in your browser to view detailed reports with:
   - Performance metrics breakdown
   - Opportunities for improvement
   - Diagnostics and recommendations
   - Accessibility issues (if any)
   - SEO checks

### Configuration File

The Lighthouse CI configuration is in `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./out",
      "url": [
        "http://localhost/index.html",
        "http://localhost/cookie-policy.html",
        "http://localhost/privacy-policy.html",
        "http://localhost/terms-of-service.html"
      ],
      "numberOfRuns": 3
    }
  }
}
```

**Important**: URLs should point to the actual `.html` files in the `out` directory. Next.js static export generates flat HTML files at the root level. This site has a single homepage with sections (About Us, Donate, Volunteer) rather than separate pages for those features. However, the policy pages are separate routes that generate individual HTML files.

You can add more pages to audit by adding URLs to the `url` array. To see which pages are generated, check the `out/` directory after running `npm run build`.

---

## Running Lighthouse Locally

### Prerequisites

- Node.js 24.x installed
- Site built and ready to serve

### Quick Start

```bash
# Build the site
npm run build

# Install Lighthouse CI globally (if not already installed)
npm install -g @lhci/cli

# Run Lighthouse CI
lhci autorun
```

### Running on Specific Pages

To audit specific pages only:

```bash
# Edit lighthouserc.json to include only the pages you want
# Then run
lhci autorun
```

### Using Chrome DevTools

For interactive audits with recommendations:

1. Open the site in Chrome/Edge
2. Open DevTools (F12)
3. Go to the **Lighthouse** tab
4. Select categories to audit
5. Click **"Analyze page load"**
6. Review the report and recommendations

### Viewing Local Reports

After running `lhci autorun`, reports are saved to `.lighthouseci/` directory:

```bash
# Open a report in your browser
open .lighthouseci/*.html  # macOS
xdg-open .lighthouseci/*.html  # Linux
start .lighthouseci/*.html  # Windows
```

---

## Understanding Lighthouse Reports

### Reading the Summary

Each report shows:

- **Overall Score**: 0-100 for each category
- **Metrics Table**: Detailed performance timings
- **Opportunities**: Suggestions to improve performance
- **Diagnostics**: Additional information about the page
- **Passed Audits**: Things you're doing well

### Score Ranges

| Score  | Rating            | Color  | Meaning                |
| ------ | ----------------- | ------ | ---------------------- |
| 90-100 | Good              | Green  | Excellent performance  |
| 50-89  | Needs Improvement | Orange | Some issues to address |
| 0-49   | Poor              | Red    | Significant problems   |

### Key Performance Metrics

#### First Contentful Paint (FCP)

- **Good**: < 1.8s
- **Needs Improvement**: 1.8s - 3.0s
- **Poor**: > 3.0s

#### Largest Contentful Paint (LCP)

- **Good**: < 2.5s
- **Needs Improvement**: 2.5s - 4.0s
- **Poor**: > 4.0s

#### Cumulative Layout Shift (CLS)

- **Good**: < 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

#### Time to Interactive (TTI)

- **Good**: < 3.8s
- **Needs Improvement**: 3.8s - 7.3s
- **Poor**: > 7.3s

---

## Performance Optimization Tips

### Image Optimization

#### Recent Optimizations (December 2025)

We recently completed a comprehensive image optimization effort that achieved:

- **~2.3 MB** of image data eliminated
- **95% average file size reduction** across converted images
- **79% improvement in LCP** (18.6s → 3.9s)
- **85% improvement in Speed Index** (6.1s → 0.9s)
- **81% improvement in Total Blocking Time** (850ms → 160ms)

#### Best Practices

1. **Use WebP format** - Modern image format with superior compression
   - Convert PNG/JPG to WebP using ImageMagick: `convert image.png -quality 85 image.webp`
   - Typical savings: 90-95% file size reduction
   - Example: mission-video-poster.png (646KB) → .webp (30KB)

2. **Properly size images** - Match image dimensions to display size
   - Don't load 2000px images for 200px display
   - Use 2x the display size for retina displays (e.g., 890px image for 445px display)
   - Example: Resized figma-hero-img from 1200x1200 to 890x890 (60% reduction)

3. **Preload LCP images** - Critical for fast Largest Contentful Paint

   ```tsx
   // In layout.tsx <head>
   <link rel="preload" as="image" href="/Images/hero.webp" fetchPriority="high" />
   ```

4. **Add sizes attribute** for responsive images

   ```tsx
   <Image
     src="/images/hero.webp"
     alt="Hero"
     fill
     priority
     sizes="(max-width: 1024px) 100vw, 445px"
   />
   ```

5. **Lazy load images** below the fold

   ```tsx
   <img src="/images/content.webp" alt="Content" loading="lazy" />
   ```

6. **Add width and height attributes** to prevent layout shift
   ```tsx
   <img src="/images/hero.webp" alt="Hero" width={1200} height={600} />
   ```

#### Image Conversion Commands

```bash
# Convert single PNG to WebP
convert image.png -quality 85 image.webp

# Batch convert all PNGs in a directory
for img in *.png; do convert "$img" -quality 85 "${img%.png}.webp"; done

# Resize image to specific dimensions
convert image.webp -resize 890x890 -quality 85 output.webp

# Check image dimensions
identify image.webp
```

#### Measuring Impact

Before making image optimizations, run Lighthouse to establish a baseline:

```bash
npm run build
lhci autorun
```

Check the "Opportunities" section in the report for:

- "Serve images in next-gen formats" - Suggests WebP conversion
- "Properly size images" - Suggests resizing oversized images
- "Efficiently encode images" - Suggests better compression

### JavaScript Optimization

1. **Code splitting**: Load only what's needed for each page
2. **Tree shaking**: Remove unused code
3. **Minimize third-party scripts**: Each script adds overhead
4. **Defer non-critical scripts**: Use `defer` or `async` attributes

### CSS Optimization

1. **Remove unused CSS**: Use PurgeCSS or Tailwind's purge feature
2. **Critical CSS**: Inline critical styles
3. **Minimize render-blocking CSS**: Load CSS efficiently

### Caching and Compression

1. **Enable caching** for static assets
2. **Use Brotli/Gzip compression** for text assets
3. **Set appropriate cache headers**

### Accessibility Improvements

1. **Add alt text** to all images
2. **Use semantic HTML** (`<header>`, `<nav>`, `<main>`, `<footer>`)
3. **Ensure sufficient color contrast** (4.5:1 for normal text)
4. **Make interactive elements keyboard accessible**
5. **Add ARIA labels** where needed

### SEO Improvements

1. **Add meta descriptions** to all pages
2. **Use descriptive title tags**
3. **Include structured data** (JSON-LD)
4. **Ensure mobile responsiveness**
5. **Fix broken links**

---

## Troubleshooting

### Lighthouse CI Fails to Run

**Issue**: Workflow fails with "Cannot connect to Chrome"

**Solution**:

- This usually resolves itself on retry
- Ensure the build step completed successfully
- Check that the `./out` directory exists

### Inconsistent Scores

**Issue**: Scores vary significantly between runs

**Causes**:

- Network conditions
- Server load
- Background processes

**Solution**:

- Lighthouse runs 3 times and takes the median score
- Focus on trends, not individual run variations
- Run locally on a quiet system for consistent results

### Low Performance Scores

**Common Causes**:

1. Large images not optimized
2. Too many third-party scripts
3. Render-blocking resources
4. No caching headers
5. Unminified JavaScript/CSS

**Actions**:

1. Review the **Opportunities** section in the report
2. Address the top 3 opportunities first
3. Re-run Lighthouse to measure improvement
4. Iterate until scores improve

### Low Accessibility Scores

**Common Issues**:

1. Missing alt text on images
2. Insufficient color contrast
3. Missing form labels
4. Non-semantic HTML
5. Missing ARIA attributes

**Actions**:

1. Review the **Accessibility** section in detail
2. Use browser extensions like axe DevTools
3. Test with screen readers
4. Fix issues one by one
5. Re-audit to verify fixes

### Reports Not Generated

**Issue**: No HTML reports in artifacts

**Solution**:

1. Check that `lhci autorun` completed without errors
2. Verify the `.lighthouseci` directory exists
3. Check workflow logs for error messages
4. Ensure the upload artifact step ran

---

## Best Practices

### Regular Monitoring

- **Review reports** after each deployment
- **Track trends** over time, not just individual scores
- **Set improvement goals** (e.g., "Improve performance from 70 to 80 over next sprint")
- **Prioritize** high-impact improvements

### Team Collaboration

- **Share reports** with the team
- **Discuss improvements** in code reviews
- **Set performance budgets** for new features
- **Celebrate wins** when scores improve

### Continuous Improvement

- **Start with critical issues** (red/orange scores)
- **Make incremental changes** to avoid regressions
- **Measure impact** of each optimization
- **Document learnings** for future reference

---

## Additional Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [WebPageTest](https://www.webpagetest.org/) - Alternative testing tool

---

## CI/CD Pipeline Integration

### Workflow Execution Order

The Lighthouse CI is integrated into the deployment pipeline with the following execution order:

1. **CI Workflow** (ci.yml)
   - Runs on pull requests and pushes to main
   - Format check with Prettier
   - Linting with ESLint
   - Unit tests run with Jest
   - Site is built with `npm run build`
   - E2E tests run with Playwright

2. **Deploy Workflow** (deploy.yml)
   - Runs only on pushes to main branch
   - Builds site for GitHub Pages
   - Deploys to GitHub Pages

3. **Lighthouse CI** (lighthouse.yml workflow)
   - Triggered automatically after successful deployment
   - Also runs on pull requests (before merge)
   - Builds the site locally
   - Runs Lighthouse audits on all configured pages
   - Posts results as PR comments (on PRs)
   - Uploads detailed reports as artifacts

### Why This Order?

- **After deployment**: Ensures Lighthouse audits the actual deployed site
- **On PRs**: Provides performance feedback before merging changes
- **Independent build**: Lighthouse uses its own build to ensure consistency

### Conditional Execution

The Lighthouse workflow only runs when:

- The deployment workflow succeeded (for main branch)
- A pull request is opened/updated (for PRs)
- Manually triggered (for on-demand audits)

This prevents unnecessary runs and saves CI/CD resources.

---

## Current Status

**Last Updated**: 2025-12-06

**Pages Monitored**: 4 key pages (Homepage, Cookie Policy, Privacy Policy, Terms of Service)

**Current Performance Scores**:

| Page             | Performance | Accessibility | Best Practices | SEO     |
| ---------------- | ----------- | ------------- | -------------- | ------- |
| Homepage         | 63-67% 🟡   | 91% 🟢        | 71% 🟡         | 100% 🟢 |
| Cookie Policy    | 84-86% 🟢   | 95% 🟢        | 71% 🟡         | 100% 🟢 |
| Privacy Policy   | 85-86% 🟢   | 96% 🟢        | 71% 🟡         | 100% 🟢 |
| Terms of Service | 84-86% 🟢   | 94% 🟢        | 71% 🟡         | 100% 🟢 |

**Recent Performance Improvements** (December 2025):

- Homepage LCP: 18.6s → 3.9s (79% improvement)
- Homepage Speed Index: 6.1s → 0.9s (85% improvement)
- Homepage TBT: 850ms → 160ms (81% improvement)
- Total image size reduced by ~2.3 MB (95% average reduction)

**Monitoring Frequency**:

- After each deployment to main branch
- On every pull request to main branch

**Report Retention**: 30 days in GitHub Actions artifacts

**Score Reporting**:

- Median scores from 3 runs per page
- Detailed scores in PR comments
- Console output in workflow logs
- Full HTML reports in artifacts

---

**Questions?** Open an issue or contact the maintainers at hello@freeforcharity.org
