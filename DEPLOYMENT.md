# Deployment Guide

This document explains how the Free For Charity website is deployed to GitHub Pages and provides troubleshooting guidance for deployment issues.

## Table of Contents

1. [Overview](#overview)
2. [Deployment Architecture](#deployment-architecture)
3. [Automated Deployment](#automated-deployment)
4. [Manual Deployment](#manual-deployment)
5. [Domain Configuration](#domain-configuration)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

---

## Overview

The Free For Charity website is a static Next.js application deployed to GitHub Pages. The site is accessible at:

- **GitHub Pages URL**: https://freeforcharity.github.io/FFC_Single_Page_Template/
- **Custom Domain**: https://ffcworkingsite1.org

### Technology Stack

- **Framework**: Next.js 16.0.7 with static export
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Node.js**: Version 24.x

---

## Deployment Architecture

### Static Site Generation

The application uses Next.js static export mode configured in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

This generates a static site in the `./out` directory that can be served by any static file server, including GitHub Pages.

### Asset Path Handling

The site uses the `assetPath()` helper function (located in `src/lib/assetPath.ts`) to handle assets correctly for both:

1. **GitHub Pages subpath deployment**: `/FFC_Single_Page_Template/`
2. **Custom domain deployment**: Root path `/`

The helper uses the `NEXT_PUBLIC_BASE_PATH` environment variable to determine the correct asset path.

---

## Automated Deployment

### GitHub Actions Workflows

Deployment is fully automated through GitHub Actions with two sequential workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`) - Runs on all PRs and pushes to main
2. **Deploy Workflow** (`.github/workflows/deploy.yml`) - Runs after CI workflow completes successfully

#### Trigger Conditions

The deployment workflow runs automatically when:

1. **CI workflow completes successfully**: After the CI workflow finishes all tests on a push to `main` branch
2. **Manual trigger**: Can be triggered manually from the Actions tab (bypasses CI wait)

**Important**: The deployment workflow will only run if the CI workflow completed successfully. This ensures all tests pass before deploying to production.

#### CI Workflow Steps (`.github/workflows/ci.yml`)

Runs on all pull requests and pushes to main:

1. **Checkout code**: Retrieves the latest code from the repository
2. **Setup Node.js**: Installs Node.js 24.x
3. **Install dependencies**: Runs `pnpm install --frozen-lockfile` for a clean installation
4. **Check formatting**: Runs Prettier format check
5. **Run linting**: Executes ESLint to catch code issues
6. **Run unit tests**: Executes Jest tests to verify code quality
7. **Install Playwright**: Sets up E2E testing environment
8. **Build site**: Runs `next build` with appropriate environment variables
9. **Run E2E tests**: Validates the built site with Playwright tests

#### Deploy Workflow Steps (`.github/workflows/deploy.yml`)

Triggered automatically after the CI workflow completes successfully on push to the main branch:

**Note**: The deploy workflow only runs if the CI workflow completed successfully. This is enforced by the `workflow_run` trigger and job-level conditional.

The actual steps performed by the deploy workflow are:

1. **Checkout code**: Retrieves the tested code from the repository
2. **Setup Node.js**: Installs Node.js 24.x
3. **Setup Pages**: Configures GitHub Pages settings
4. **Restore Next.js cache**: Restores build cache for faster builds
5. **Install dependencies**: Runs `pnpm install --frozen-lockfile` for a clean installation
6. **Build site**: Runs `next build` with basePath for GitHub Pages
7. **Upload artifact**: Packages the `./out` directory
8. **Deploy to GitHub Pages**: Publishes the site to GitHub Pages (separate job)

#### Environment Variables in CI

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /FFC_Single_Page_Template
```

This ensures images and assets work correctly at the GitHub Pages subpath.

### Viewing Deployment Status

1. Go to the **Actions** tab in the GitHub repository
2. Click on the latest workflow run
3. Review the status of each step
4. Check logs if any step fails

---

## Manual Deployment

While automated deployment is recommended, you can also deploy manually if needed.

### Prerequisites

- Node.js 24.x installed
- GitHub CLI (`gh`) or GitHub Personal Access Token
- Write access to the repository

### Manual Deployment Steps

1. **Clone the repository** (if not already done):

   ```bash
   git clone https://github.com/FreeForCharity/FFC_Single_Page_Template.git
   cd FFC_Single_Page_Template
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run tests** to ensure everything works:

   ```bash
   pnpm run lint
   pnpm test
   pnpm run test:e2e
   ```

4. **Build the site** with the correct base path:

   ```bash
   NEXT_PUBLIC_BASE_PATH=/FFC_Single_Page_Template pnpm run build
   ```

5. **Verify the build**:

   ```bash
   pnpm run preview
   # Visit http://localhost:3000 to test
   ```

6. **Deploy to GitHub Pages** using the GitHub CLI:
   ```bash
   # This step requires appropriate permissions and setup
   # Typically done through the GitHub Actions workflow
   ```

### Building for Custom Domain

If deploying to a custom domain (no basePath needed):

```bash
pnpm run build
pnpm run preview
```

The site will be built without a base path, making all assets available at the root.

---

## Domain Configuration

### GitHub Pages Configuration

1. **Go to repository Settings** → **Pages**
2. **Source**: Select "Deploy from a branch"
3. **Branch**: Select `gh-pages` or the branch created by the workflow
4. **Folder**: Select `/ (root)`

### Custom Domain Setup

If using a custom domain:

1. **Add a CNAME file** to the `public` directory with your domain:

   ```
   ffcworkingsite1.org
   ```

2. **Configure DNS records** at your domain provider:
   - **Type**: CNAME
   - **Name**: www (or @)
   - **Value**: freeforcharity.github.io

3. **Enable HTTPS** in GitHub Pages settings (automatic with custom domain)

4. **Update environment variables** if needed:
   - Remove or leave empty `NEXT_PUBLIC_BASE_PATH` for custom domains
   - GitHub Actions should detect custom domain and adjust automatically

### DNS Propagation

After configuring DNS:

- Changes can take 24-48 hours to propagate
- Use `dig` or online DNS tools to verify propagation
- Clear browser cache when testing

---

## Environment Variables

### Build-Time Variables

These variables are embedded during the build process:

| Variable                         | Purpose                    | Default           | Required |
| -------------------------------- | -------------------------- | ----------------- | -------- |
| `NEXT_PUBLIC_BASE_PATH`          | Base path for GitHub Pages | (empty)           | No       |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | Google Analytics ID        | `G-XXXXXXXXXX`    | No       |
| `NEXT_PUBLIC_META_PIXEL_ID`      | Meta Pixel ID              | `XXXXXXXXXXXXXXX` | No       |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity ID       | `XXXXXXXXXX`      | No       |

### Setting Environment Variables in GitHub Actions

Environment variables are set in the workflow file:

```yaml
- name: Build with Next.js
  run: pnpm run build
  env:
    NEXT_PUBLIC_BASE_PATH: /FFC_Single_Page_Template
```

### Local Development

For local development, create a `.env.local` file:

```env
# Optional: Set basePath for testing GitHub Pages locally
NEXT_PUBLIC_BASE_PATH=

# Optional: Analytics IDs (only loaded with user consent)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

**Note**: Never commit `.env.local` or any file containing secrets to the repository.

---

## Troubleshooting

### Common Issues

#### Issue: Images Not Loading

**Symptoms**: Images return 404 errors or don't display

**Causes**:

- Incorrect `NEXT_PUBLIC_BASE_PATH` setting
- Not using the `assetPath()` helper function
- Missing images in the `public` directory

**Solutions**:

1. Verify `NEXT_PUBLIC_BASE_PATH` is set correctly in the build environment
2. Check that all image paths use `assetPath()`:
   ```tsx
   import { assetPath } from '@/lib/assetPath'
   ;<img src={assetPath('/images/logo.png')} alt="Logo" />
   ```
3. Ensure images exist in the `public` directory

#### Issue: Build Fails

**Symptoms**: GitHub Actions workflow fails during the build step

**Common Causes**:

- TypeScript errors
- Linting errors
- Missing dependencies
- Test failures

**Solutions**:

1. Run locally to reproduce:
   ```bash
   pnpm run lint
   pnpm test
   pnpm run build
   ```
2. Fix any errors reported
3. Commit and push fixes
4. Verify the new workflow run succeeds

#### Issue: 404 on Page Routes

**Symptoms**: Direct navigation to routes returns 404

**Cause**: GitHub Pages doesn't support client-side routing by default

**Solution**: Next.js static export handles this automatically. Ensure:

1. `output: 'export'` is set in `next.config.ts`
2. All pages are pre-rendered during build
3. No dynamic routes are used (or they're pre-generated with `generateStaticParams`)

#### Issue: Styles Not Applied

**Symptoms**: Site displays with no styling

**Causes**:

- CSS build errors
- Incorrect asset paths
- Tailwind CSS configuration issues

**Solutions**:

1. Check build logs for CSS compilation errors
2. Verify `postcss.config.mjs` and Tailwind config are correct
3. Clear browser cache and hard refresh
4. Check that CSS files are in the `./out` directory after build

### Deployment Logs

To view detailed deployment logs:

1. Go to **Actions** tab in GitHub
2. Click on the failed workflow run
3. Click on the job that failed (usually "build")
4. Expand the failed step to see detailed logs
5. Look for error messages and stack traces

### Testing Deployments Locally

To test the built site locally before deploying:

```bash
# Build with GitHub Pages configuration
NEXT_PUBLIC_BASE_PATH=/FFC_Single_Page_Template pnpm run build

# Serve the built site
pnpm run preview

# Open http://localhost:3000/FFC_Single_Page_Template in your browser
```

This simulates how the site will behave on GitHub Pages.

---

## Rollback Procedures

### Rolling Back to a Previous Deployment

If a deployment introduces issues, you can roll back:

#### Method 1: Revert the Commit

```bash
# Find the commit hash of the last good deployment
git log

# Revert to the previous commit
git revert <commit-hash>

# Push to trigger a new deployment
git push origin main
```

#### Method 2: Re-deploy a Previous Version

```bash
# Checkout the previous working commit
git checkout <previous-commit-hash>

# Create a new branch
git checkout -b rollback/fix-deployment

# Push and create a PR to main
git push origin rollback/fix-deployment
```

#### Method 3: Redeploy from Actions

1. Go to **Actions** tab
2. Find a previous successful workflow run
3. Click **"Re-run jobs"** → **"Re-run all jobs"**
4. This will re-deploy the previous version

### Emergency Rollback

For critical issues requiring immediate rollback:

1. **Disable GitHub Pages temporarily**:
   - Go to Settings → Pages
   - Set Source to "None"
   - This takes the site offline while you fix the issue

2. **Fix the issue** on a separate branch

3. **Test thoroughly** before re-deploying

4. **Re-enable GitHub Pages** once fixed

---

## Deployment Checklist

Before merging to main (which triggers deployment):

- [ ] All tests pass locally (`pnpm test` and `pnpm run test:e2e`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] Manual testing completed on localhost
- [ ] Screenshots taken for UI changes
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No sensitive data in code or commits

---

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Repository README](./README.md)
- [Testing Documentation](./TESTING.md)

---

**Questions?** Open an issue or contact the maintainers at hello@freeforcharity.org
