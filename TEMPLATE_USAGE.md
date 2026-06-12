# Using This Repository as a Template

This guide helps you create a new repository from this template and configure all required GitHub settings and features. Follow these steps to ensure your new repository has all the functionality of the original template.

## Table of Contents

1. [Quick Start Checklist](#quick-start-checklist)
2. [Creating Your Repository from the Template](#creating-your-repository-from-the-template)
3. [Essential GitHub Repository Settings](#essential-github-repository-settings)
4. [GitHub Actions Configuration](#github-actions-configuration)
5. [Security and Quality Settings](#security-and-quality-settings)
6. [Optional Features](#optional-features)
7. [Customizing for Your Organization](#customizing-for-your-organization)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start Checklist

Use this checklist to track your progress when setting up a new repository from this template:

> **Quick Reference**: For a printable checklist version of this guide, see [TEMPLATE_SETUP_CHECKLIST.md](./TEMPLATE_SETUP_CHECKLIST.md).

### Immediate Setup (Required)

- [ ] Create repository from template on GitHub
- [ ] Clone repository locally
- [ ] Run `npm install` to verify dependencies install correctly
- [ ] Run `npm run build` to verify the site builds successfully
- [ ] Enable GitHub Pages in repository settings
- [ ] Configure custom domain (if applicable)
- [ ] Enable Dependabot alerts and security updates
- [ ] Configure branch protection rules for `main` branch
- [ ] Set up commit signing requirement
- [ ] Update CODEOWNERS file with your maintainers

### Recommended Setup

- [ ] Configure repository description and topics
- [ ] Set up GitHub Actions permissions
- [ ] Configure Lighthouse CI secret (optional)
- [ ] Review and customize workflows for your needs
- [ ] Update README.md with your organization details
- [ ] Update all documentation files with your information
- [ ] Configure GitHub Sponsors (if applicable)
- [ ] Set up issue and PR templates for your workflow

### Content Customization

> **📋 For a comprehensive guide to replacing all content**, see **[CONTENT_REPLACEMENT_GUIDE.md](./CONTENT_REPLACEMENT_GUIDE.md)**
>
> This detailed guide provides a 4-column table identifying every piece of content to replace, including:
>
> - All website sections from Navigation to Footer
> - Current Free For Charity example content
> - Blank fields for your charity's information
> - Recommended image sizes and file formats
> - Step-by-step instructions for non-technical users

Quick checklist of major content areas:

- [ ] Review [CONTENT_REPLACEMENT_GUIDE.md](./CONTENT_REPLACEMENT_GUIDE.md) and gather all required content
- [ ] Update organization name and EIN in all files
- [ ] Update social media links in footer
- [ ] Update contact information
- [ ] Update team member information
- [ ] Replace logo files in `/public` directory
- [ ] Customize color scheme and branding
- [ ] Update FAQs with your content
- [ ] Update testimonials with your content
- [ ] Update metadata and SEO information

---

## Creating Your Repository from the Template

### Step 1: Use GitHub Template Feature

1. Navigate to https://github.com/FreeForCharity/FFC_Single_Page_Template
2. Click the green **"Use this template"** button at the top right
3. Select **"Create a new repository"**
4. Choose your organization or personal account as the owner
5. Enter a repository name (use kebab-case: `my-nonprofit-website`)
6. Add a description for your repository
7. Choose **Public** or **Private** visibility
8. Click **"Create repository"**

### Step 2: Clone Your New Repository

```bash
# Clone your new repository
git clone https://github.com/YOUR-ORG/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# Verify Node.js version (requires 20.x)
node --version

# Install dependencies
npm install

# Verify the site builds
npm run build
```

### Step 3: Initial Verification

Run these commands to ensure everything works:

```bash
# Run linting (expect 16 warnings - see README.md for details)
npm run lint

# Run unit tests
npm test

# Build the site
npm run build

# Preview the built site
npm run preview
# Visit http://localhost:3000
```

---

## Essential GitHub Repository Settings

These settings must be configured for your repository to function properly with all features enabled.

### 1. General Repository Settings

**Location**: Settings → General

1. **Repository name**: Use kebab-case for SEO (e.g., `nonprofit-website-template`)
2. **Description**: Add a clear description of your website
3. **Topics**: Add relevant topics (e.g., `nextjs`, `nonprofit`, `website`, `static-site`)
4. **Features**:
   - ✅ Enable **Issues**
   - ✅ Enable **Discussions** (optional, for community engagement)
   - ✅ Enable **Projects** (optional, for project management)
   - ✅ Enable **Wiki** (optional, for additional documentation)

### 2. GitHub Pages Configuration

**Location**: Settings → Pages

**Required for deployment to work:**

1. **Source**: Select **"Deploy from a branch"**
2. **Branch**: Select **`gh-pages`** branch and **`/ (root)`** folder
   - The deploy workflow automatically creates and manages the `gh-pages` branch
   - Do NOT use the `main` branch directly for Pages
3. **Custom domain** (optional):
   - Enter your custom domain (e.g., `www.yournonprofit.org`)
   - Wait for DNS check to complete
   - Enable **Enforce HTTPS** after DNS is configured

**DNS Configuration for Custom Domain:**

If using a custom domain, configure these DNS records with your domain provider:

For root domain (`yournonprofit.org`):

```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

For www subdomain (`www.yournonprofit.org`):

```
Type: CNAME
Name: www
Value: YOUR-ORG.github.io
```

**IMPORTANT**: After configuring GitHub Pages, verify the deployment:

1. Wait 2-5 minutes for first deployment to complete
2. Visit your GitHub Pages URL: `https://YOUR-ORG.github.io/YOUR-REPO-NAME/`
3. Verify the site loads correctly
4. Check the Actions tab to see the deployment status

### 3. Actions Permissions

**Location**: Settings → Actions → General

**Required for workflows to run:**

1. **Actions permissions**:
   - Select **"Allow all actions and reusable workflows"**
   - OR select **"Allow [YOUR-ORG] actions and reusable workflows"** for more security
2. **Workflow permissions**:
   - Select **"Read and write permissions"**
   - ✅ Enable **"Allow GitHub Actions to create and approve pull requests"**
     - Required for Dependabot to work properly
     - Allows workflows to comment on PRs (Lighthouse CI results)

**Why these permissions are needed:**

- **Read and write permissions**: Allows deploy workflow to push to `gh-pages` branch
- **Create and approve PRs**: Allows Dependabot to create PRs and workflows to post comments
- Without these permissions, deployments will fail and Dependabot won't function

### 4. Environments

**Location**: Settings → Environments

The deploy workflow creates a `github-pages` environment automatically. You can optionally add protection rules:

1. Click on **`github-pages`** environment (created after first deployment)
2. **Deployment protection rules** (optional):
   - Add required reviewers for production deployments
   - Set deployment branches to `main` only
   - Add custom deployment protection rules

---

## GitHub Actions Configuration

### Workflows Overview

The primary GitHub Actions workflows are described below (CI, Deploy, Lighthouse). The repo also ships additional maintenance/security workflows — e.g. `drift-check`, `scorecard`, `security-audit`, `security-txt-expiry`, `phantom-revert-guard`, and `uptime`. CodeQL security scanning is **not** a committed workflow — it runs via GitHub code scanning default setup — but is listed below alongside the workflows for completeness:

1. **CI - Build and Test** (`.github/workflows/ci.yml`)
   - Runs on: All pull requests and pushes to main
   - Purpose: Validates code quality before deployment
   - What it does: Format check, linting, unit tests, build, E2E tests

2. **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`)
   - Runs on: After CI workflow succeeds on main branch
   - Purpose: Deploys built site to GitHub Pages
   - What it does: Builds site with basePath, deploys to `gh-pages` branch

3. **CodeQL Security Scanning** (GitHub code scanning **default setup** — no workflow file)
   - Runs on: Push to main, PRs to main, weekly schedule (managed by GitHub)
   - Purpose: Scans code for security vulnerabilities
   - What it does: Analyzes JavaScript/TypeScript and GitHub Actions
   - Note: This template ships **without** a `codeql.yml` advanced workflow on
     purpose, so clones can use default setup without a standard/advanced conflict

4. **Lighthouse CI** (`.github/workflows/lighthouse.yml`)
   - Runs on: After deployment, PRs to main
   - Purpose: Monitors performance and quality metrics
   - What it does: Runs Lighthouse audits, posts results to PRs

### Workflow Dependencies

The workflows are designed to run in sequence:

```
Push to main → CI Workflow → Deploy Workflow → Lighthouse Workflow
                    ↓
                  (must pass)
```

**Important**: The deploy workflow only runs if CI workflow succeeds. This ensures:

- All tests pass before deployment
- Code is formatted and linted
- No broken functionality reaches production

### Secrets Configuration

Most workflows don't require secrets, but some optional features do:

#### Optional: Lighthouse CI Token

**Location**: Settings → Secrets and variables → Actions

To enable Lighthouse CI GitHub integration features:

1. Click **"New repository secret"**
2. **Name**: `LHCI_GITHUB_APP_TOKEN`
3. **Value**: Create a **fine-grained** GitHub personal access token, limited to this repository and with only the minimal permissions required for Lighthouse CI (avoid using a classic token with broad `repo` scope).
4. Click **"Add secret"**

**Note**: With the current filesystem storage configuration in `lighthouserc.json`, Lighthouse CI still runs and stores results locally without this secret. The `LHCI_GITHUB_APP_TOKEN` is only required to enable GitHub integration features such as status checks, annotations, and PR comments for Lighthouse reports.

### Customizing basePath for Your Repository

The deploy workflow sets `NEXT_PUBLIC_BASE_PATH` for GitHub Pages routing:

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /FFC_Single_Page_Template
```

**This needs to be updated** in `.github/workflows/deploy.yml` and `.github/workflows/lighthouse.yml`:

**Option A: Using AI/Copilot (Recommended)**

- Ask Copilot: "Update `NEXT_PUBLIC_BASE_PATH` in both `.github/workflows/deploy.yml` and `.github/workflows/lighthouse.yml` from `/FFC_Single_Page_Template` to `/YOUR-REPO-NAME`"
- Copilot will automatically find and replace the values in both files

**Option B: Manual Update**

1. Open `.github/workflows/deploy.yml`
2. Search for `NEXT_PUBLIC_BASE_PATH: /FFC_Single_Page_Template`
3. Replace with your repository name, for example: `NEXT_PUBLIC_BASE_PATH: /YOUR-REPO-NAME`
4. Repeat steps 1–3 for `.github/workflows/lighthouse.yml`
5. Commit the changes

**If using a custom domain**: You can ask Copilot to remove the `NEXT_PUBLIC_BASE_PATH` line from both workflow files, as custom domains don't need a basePath.

---

## Security and Quality Settings

### 1. Branch Protection Rules

**Location**: Settings → Rules → Rulesets

Create a ruleset named **"Protect Main"** with these settings:

#### Basic Settings

1. **Ruleset name**: `Protect Main`
2. **Enforcement status**: Active
3. **Target branches**: Include default branch (`main`)

#### Required Rules

1. ✅ **Restrict deletions**
   - Prevents accidental deletion of main branch
   - Only admins can delete

2. ✅ **Require a pull request before merging**
   - Prevents direct pushes to main
   - Forces all changes through PR review process
   - Recommended: Require 1 approval

3. ✅ **Require status checks to pass**
   - Select these status checks as required:
     - `Test and Build` (from CI workflow)
     - `CodeQL` (from code scanning default setup — appears after the first scan runs)
   - ✅ Enable **"Require branches to be up to date before merging"**
   - This ensures tests run on latest code before merge

4. ✅ **Require signed commits**
   - Ensures all commits are cryptographically signed
   - Prevents unauthorized code injection
   - See [GitHub's commit signing guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

5. ✅ **Block force pushes**
   - Prevents rewriting commit history
   - Protects against accidental data loss

#### Optional but Recommended Rules

1. **Require code scanning results**
   - Requires CodeQL security analysis to pass
   - Blocks merges if vulnerabilities are found

2. **Require deployments to succeed**
   - Ensures deployment workflow completes successfully
   - Select `github-pages` environment

**Setting up commit signing** (required for contributors):

```bash
# Generate GPG key
gpg --gen-key

# Get your GPG key ID
gpg --list-secret-keys --keyid-format=long

# Configure Git to use it
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Add GPG key to GitHub
gpg --armor --export YOUR_KEY_ID
# Copy output and add to GitHub: Settings → SSH and GPG keys → New GPG key
```

### 2. Security and Analysis Features

**Location**: Settings → Security & Analysis

**Required - Enable these features:**

1. ✅ **Dependency graph**
   - Automatically detects dependencies
   - Required for Dependabot functionality
   - Should be enabled by default

2. ✅ **Dependabot alerts**
   - Alerts you to vulnerable dependencies
   - Click **"Enable"** if not already enabled
   - Free for all repositories

3. ✅ **Dependabot security updates**
   - Automatically creates PRs to fix vulnerabilities
   - Click **"Enable"** if not already enabled
   - Works immediately when vulnerabilities are detected

4. ✅ **Code scanning (CodeQL — default setup)**
   - Settings → Security & Analysis → Code scanning → **Set up → Default**
   - Use GitHub's **default setup** (no `codeql.yml` workflow needed)
   - Do **not** add an advanced CodeQL workflow file — a `codeql.yml`
     advanced workflow and default setup cannot both be enabled and will
     conflict. This template intentionally ships **without** one.
   - Verify scans appear under "Code scanning alerts" after the first run

**Recommended:**

1. ✅ **Secret scanning**
   - Scans for leaked secrets and tokens
   - Available for public repositories (always enabled)
   - Available for private repositories with GitHub Advanced Security

2. ✅ **Push protection**
   - Blocks pushes that contain secrets
   - Available for public repositories
   - Prevents accidental credential exposure

### 3. Dependabot Configuration

The template includes `.github/dependabot.yml` for automated dependency updates.

**Verify configuration**:

1. Check that `.github/dependabot.yml` exists
2. Ensure Dependabot alerts are enabled (Settings → Security & Analysis)
3. Ensure Dependabot security updates are enabled
4. Wait for first Dependabot run (Mondays at 9:00 AM UTC)

**Expected behavior**:

- Weekly PRs for npm dependency updates (grouped by production/development)
- Weekly PRs for GitHub Actions version updates
- Immediate PRs for security vulnerabilities
- PRs are labeled with `dependencies` and ecosystem tags

**Monitoring Dependabot**:

- View open Dependabot PRs: Filter PRs by author `dependabot[bot]`
- View security alerts: Security tab → Dependabot alerts
- View update insights: Insights tab → Dependency graph → Dependabot

See [DEPENDABOT.md](./DEPENDABOT.md) for complete Dependabot documentation.

### 4. CODEOWNERS Configuration

**Location**: `.github/CODEOWNERS`

Update the CODEOWNERS file to automatically request reviews from your team:

1. Open `.github/CODEOWNERS`
2. Replace `@clarkemoyer` with your GitHub usernames/teams
3. Example:

   ```
   # Default owners for everything
   * @your-username @your-team-name

   # Security files
   /SECURITY.md @security-team

   # Workflows
   /.github/workflows/ @devops-team
   ```

4. Commit the changes

**What CODEOWNERS does**:

- Automatically requests reviews from specified users/teams
- Shows ownership information in GitHub's file browser
- Helps distribute review responsibility
- Works in conjunction with branch protection rules

---

## Optional Features

### 1. GitHub Sponsors

**Location**: `.github/FUNDING.yml`

The template includes a FUNDING.yml file for GitHub Sponsors button:

```yaml
github: FreeForCharity
custom:
  - 'https://ffcworkingsite1.org'
  - 'https://ffcworkingsite1.org/#donate'
```

**To customize**:

1. Open `.github/FUNDING.yml`
2. Replace `FreeForCharity` with your GitHub org/username
3. Update custom links to your donation pages
4. Commit the changes
5. The "Sponsor" button will appear in your repository header

**Note**: You must have GitHub Sponsors enabled for your organization/account.

### 2. Lighthouse CI GitHub Integration

To enable Lighthouse CI to post detailed results and comments on pull requests:

1. Create a fine-grained GitHub Personal Access Token (recommended):
   - Go to GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   - Click **"Generate new token"**
   - Name: `Lighthouse CI`
   - Resource owner: Select your user or a dedicated bot account
   - Repository access: Choose **"Only select repositories"** and select this repository (and any others that need Lighthouse CI)
   - Permissions: Grant repository **read** access and **pull requests: write** access (required for posting PR comments via the Lighthouse workflow)
   - Click **"Generate token"** and copy it

2. Add the token to repository secrets:
   - Go to your repository **Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Name: `LHCI_GITHUB_APP_TOKEN`
   - Value: Paste your fine-grained token
   - Click **"Add secret"**

3. Lighthouse CI will now be able to post PR comments with detailed performance reports

**Security note**: Avoid using classic personal access tokens with broad `repo` scope for CI. If you must use a classic token, restrict it to the smallest possible set of repositories and permissions, or use a dedicated bot account.

**Without this token**: Lighthouse CI still runs and generates reports locally (stored in `.lighthouseci` directory), but cannot post results as PR comments or GitHub status checks. The workflow will upload reports as artifacts that you can download manually.

**Note**: The current configuration uses filesystem storage (`lighthouserc.json`). If you want to enable historical trend tracking, you would need to configure a Lighthouse Server or use the temporary public storage option by changing the upload target in `lighthouserc.json`.

### 3. Preview Deployments (Cloudflare Pages or Vercel)

The template works great with preview deployment services:

#### Option A: Cloudflare Pages (Recommended)

**Why Cloudflare Pages**:

- Unlimited bandwidth (vs Vercel's 100GB/month)
- Most likely to remain free long-term
- Excellent Next.js static export support
- Automatic PR preview deployments

**Setup steps**:

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: Leave `NEXT_PUBLIC_BASE_PATH` empty
4. Enable "Automatic preview deployments"
5. Enable "Comments on pull requests"

**Result**: Every PR gets a preview URL automatically posted as a comment.

#### Option B: Vercel

**Setup steps**:

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
4. Deploy

**Result**: Automatic preview deployments for every PR with Vercel comments.

**Note**: Both services work alongside GitHub Pages - use them for PR previews, keep GitHub Pages for production.

### 4. Issue and PR Templates

The template includes comprehensive issue and PR templates:

**Location**: `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`

**Available templates**:

- Bug report
- Feature request
- Documentation improvement
- Reviewer onboarding

**Customization**:

1. Review templates in `.github/ISSUE_TEMPLATE/`
2. Customize labels, assignees, and content for your workflow
3. Edit `.github/ISSUE_TEMPLATE/config.yml` to update support links
4. Commit changes

### 5. Merge Queue

GitHub merge queues help prevent merge conflicts and ensure all PRs are tested together before merging.

**To enable**:

1. Go to Settings → General → Pull Requests
2. Scroll to "Merge queue"
3. ✅ Enable merge queue
4. Configure settings:
   - **Merge method**: Choose your preferred method (squash, merge, rebase)
   - **Required status checks**: Add same checks as branch protection
   - **Maximum merge queue size**: 5-10 (recommended)
   - **Merge queue check interval**: 5 minutes (recommended)

**Benefits**:

- Prevents "merge train" conflicts
- Ensures all PRs pass tests with latest main branch code
- Automatically rebases and tests PRs before merging

---

## Customizing for Your Organization

### 1. Update Organization Information

Search and replace these values throughout the repository:

**Organization name**: "Free For Charity" → "Your Nonprofit Name"

```bash
# Use your editor's find-and-replace or:
grep -r "Free For Charity" . --exclude-dir=node_modules --exclude-dir=.git
```

**EIN**: "46-2471893" → "Your EIN"

```bash
grep -r "46-2471893" . --exclude-dir=node_modules --exclude-dir=.git
```

**Domain**: "ffcworkingsite1.org" → "yourwebsite.org"

```bash
grep -r "ffcworkingsite1.org" . --exclude-dir=node_modules --exclude-dir=.git
```

**Social media links**: Update in `src/components/footer/index.tsx`

### 2. Update Contact Information

Files to update:

- `src/components/footer/index.tsx` - Footer contact info
- `src/components/contact-us/` - Contact section
- `SECURITY.md` - Security contact
- `CODE_OF_CONDUCT.md` - Conduct reporting contact
- `SUPPORT.md` - Support contact

### 3. Replace Branding Assets

**Logo files** (in `/public` directory):

- Replace `logo.svg` with your logo
- Update `favicon.ico` with your favicon
- Update Open Graph images in `/public` if present

**Color scheme**: Edit `src/app/globals.css` and Tailwind configuration

**Fonts**: Update font imports in `src/app/layout.tsx` (if using Google Fonts)

### 4. Update Team and Content

**Team members**: Edit `src/data/team/`

- Add/remove team member files
- Update photos in `/public/team/`

**FAQs**: Edit `src/data/faqs/`

- Update questions and answers for your organization

**Testimonials**: Edit `src/data/testimonials/`

- Replace with your organization's testimonials

### 5. Customize Documentation

Update these files with your information:

- `README.md` - Main project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `GOVERNANCE.md` - Project governance
- `MAINTAINERS.md` - List of maintainers
- `CITATION.cff` - Citation information
- `ADOPTERS.md` - Organizations using your template

### 6. Update Community Health Files

Review and customize:

- `CODE_OF_CONDUCT.md` - Contact email for conduct issues
- `SECURITY.md` - Security reporting contact
- `SUPPORT.md` - Support resources
- `.github/FUNDING.yml` - Sponsorship links
- `.github/CODEOWNERS` - Code review assignments

---

## Troubleshooting

### Deployment Failures

**Problem**: Deploy workflow fails with "Resource not accessible by integration"

**Solution**:

1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"
4. Re-run the failed workflow

**Problem**: GitHub Pages shows 404 Not Found

**Solution**:

1. Verify Settings → Pages source is set to `gh-pages` branch
2. Wait 2-5 minutes for deployment to propagate
3. Check Actions tab to ensure deploy workflow succeeded
4. Verify `NEXT_PUBLIC_BASE_PATH` in deploy.yml matches your repository name

**Problem**: Images don't load on GitHub Pages

**Solution**:

1. Verify `NEXT_PUBLIC_BASE_PATH` is set correctly in deploy workflow
2. Check that images use the `assetPath()` helper function
3. Rebuild and redeploy the site

### CI Workflow Failures

**Problem**: E2E tests fail in CI

**Solution**:

1. Check if Playwright browsers are installed (workflow should handle this)
2. Verify the build completes successfully before tests run
3. Check test logs in Actions tab for specific errors

**Problem**: Linting fails with unexpected errors

**Solution**:

1. Run `npm run format` locally to fix formatting issues
2. Run `npm run lint` locally to see full error details
3. Commit formatting fixes and push

### Dependabot Issues

**Problem**: Dependabot PRs are not being created

**Solution**:

1. Verify Dependabot alerts are enabled (Settings → Security & Analysis)
2. Verify Dependabot security updates are enabled
3. Check that `.github/dependabot.yml` syntax is valid
4. Wait for the scheduled run (Mondays at 9:00 AM UTC)
5. Check Insights → Dependency graph → Dependabot for errors

**Problem**: Cannot merge Dependabot PRs

**Solution**:

1. Ensure Actions workflow permissions include "Allow GitHub Actions to create and approve pull requests"
2. Check if branch protection rules are blocking automated PRs
3. Verify status checks are passing on the Dependabot PR

### Commit Signing Issues

**Problem**: Commits are rejected due to missing signature

**Solution**:

1. Set up GPG commit signing: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
2. Configure Git to sign commits automatically:
   ```bash
   git config --global commit.gpgsign true
   git config --global user.signingkey YOUR_KEY_ID
   ```
3. Add your GPG key to GitHub account

**Problem**: GitHub shows "Unverified" on signed commits

**Solution**:

1. Ensure GPG key is added to your GitHub account
2. Verify email address in GPG key matches GitHub account email
3. Use `git log --show-signature` to verify local signatures

### Custom Domain Issues

**Problem**: Custom domain shows "Not Found"

**Solution**:

1. Verify DNS records are configured correctly
2. Wait 24-48 hours for DNS propagation
3. In Settings → Pages, verify domain shows "DNS check successful"
4. Ensure HTTPS enforcement is enabled after DNS check passes

**Problem**: Custom domain shows certificate errors

**Solution**:

1. Wait a few minutes for GitHub to provision SSL certificate
2. Ensure "Enforce HTTPS" is enabled in Pages settings
3. If errors persist after 24 hours, remove and re-add custom domain

---

## Next Steps

After completing the setup:

1. **Review the QUICK_START.md** for local development workflow
2. **Read CONTRIBUTING.md** for contribution guidelines
3. **Check DEPLOYMENT.md** for deployment details
4. **Review TESTING.md** for testing practices
5. **Read SECURITY.md** for security policies

**Getting Help**:

- Review existing documentation in the repository
- Check the [GitHub Discussions](https://github.com/FreeForCharity/FFC_Single_Page_Template/discussions) for Q&A
- Open an [Issue](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues) for bugs or questions
- Read [SUPPORT.md](./SUPPORT.md) for support resources

---

## Reducing Template Setup Burden

This template has been designed to minimize post-creation configuration. Here are the features that require no additional setup:

### ✅ Already Configured (No Action Needed)

- **Next.js static export** - Works out of the box
- **TypeScript** - Fully configured with strict mode
- **Tailwind CSS** - Complete setup with custom configuration
- **ESLint and Prettier** - Code quality tools pre-configured
- **Pre-commit hooks (Husky)** - Automatically enforces code quality
- **Jest unit tests** - Testing framework ready to use
- **Playwright E2E tests** - E2E testing configured
- **GitHub Actions CI** - Continuous integration workflow ready
- **Dependabot config file** - Version updates pre-configured
- **Issue and PR templates** - Complete set of templates
- **Community health files** - Code of conduct, security policy, contributing guide
- **SEO optimization** - Metadata, sitemap, robots.txt configured

### ⚙️ Requires GitHub Settings (One-Time Setup)

These settings cannot be included in the template files and must be configured through GitHub's web interface:

- **GitHub Pages deployment** - Must be enabled in repository settings
- **Actions permissions** - Must grant read/write permissions
- **Dependabot features** - Must enable alerts and security updates
- **Branch protection rules** - Must configure rulesets for main branch
- **Environment protection** - Optional deployment protection rules

### 🎨 Requires Customization (Expected)

These items are specific to your organization and must be customized:

- Organization name, EIN, and contact information
- Logo and branding assets
- Social media links
- Team member information
- FAQs and testimonials
- Custom domain name
- CODEOWNERS file

### Future Improvements to Reduce Setup Burden

The issue mentions "reducing the number of settings that need to occur." Here are potential improvements:

1. **Repository Template Settings**: GitHub is working on allowing templates to include repository settings like branch protection rules and Actions permissions. When available, this template will be updated to include these settings.

2. **First-Run Setup Script**: We could add an interactive CLI script that:
   - Guides through required settings
   - Updates configuration files automatically
   - Generates checklists of manual steps needed
   - Validates GitHub settings via API

3. **GitHub API Automation**: For organizations managing multiple repositories, a setup automation script could:
   - Enable GitHub Pages via API
   - Configure branch protection rules
   - Enable security features
   - Set up environments
   - However, this requires GitHub API access tokens with admin permissions

4. **Documentation Generator**: A tool that:
   - Scans your repository
   - Detects which settings are configured
   - Generates a personalized checklist of remaining tasks

5. **Content Customization Script**: A CLI tool that reduces manual find-and-replace work when adapting for a new charity:
   - Interactive prompts for organization details (name, EIN, domain, contact info)
   - Automated search-and-replace across all files
   - Generates checklist of remaining manual customizations (logos, team photos, FAQs, testimonials)
   - Validates that all placeholders have been replaced
   - Example usage: `npm run customize-for-charity`

### Reducing Manual Steps for New Charity Customization

When adapting this template for a new charity, many tasks can be automated using AI/Copilot:

**Tasks That Can Be Fully Automated by Copilot:**

After completing the "Rebrand Template To A New Brand" issue with all required information, you can assign these tasks to Copilot:

- Organization name replacement: "Free For Charity" → Your charity name
- EIN replacement: "46-2471893" → Your EIN
- Domain replacement: "ffcworkingsite1.org" → Your domain
- Contact email updates: Multiple files with contact information
- Social media links: Footer and other components
- CODEOWNERS updates: GitHub usernames
- Workflow basePath updates: `.github/workflows/deploy.yml` and `.github/workflows/lighthouse.yml`

**Example Copilot Instructions:**

```
Based on the information in issue #[number], update all instances of:
- "Free For Charity" to "[New Org Name]"
- "46-2471893" to "[New EIN]"
- "ffcworkingsite1.org" to "[new-domain.org]"
- Update CODEOWNERS with @[username1], @[username2]
- Update NEXT_PUBLIC_BASE_PATH in both workflow files to /[new-repo-name]
- Update all social media links in footer components
```

**Tasks That Require Manual File Uploads:**

These cannot be automated by AI and require manual work:

- Logo files (`/public/logo.svg`, `/public/favicon.ico`) - Must upload new files
- Team member photos (`/public/team/`) - Must upload new images
- Team member data (`src/data/team/*.json`) - Can be updated by Copilot with provided information
- FAQs (`src/data/faqs/*.json`) - Can be updated by Copilot with provided Q&A content
- Testimonials (`src/data/testimonials/*.json`) - Can be updated by Copilot with provided testimonial text

**Optimal Workflow:**

1. **Complete GitHub Web UI Settings First** (manual, cannot be automated)
   - Repository settings, GitHub Pages, Actions permissions, etc.

2. **Fill Out Rebrand Issue Template** (manual data collection)
   - Provide all organization details, board member info, content, etc.

3. **Assign Bulk Updates to Copilot** (automated text replacements)
   - Copilot handles all text-based find-and-replace operations
   - Updates workflow configurations, CODEOWNERS, data files
   - **Time estimate: 5-10 minutes for Copilot to complete**

4. **Upload Binary Files** (manual file uploads)
   - Upload logos, photos, and other assets
   - **Time estimate: 15-30 minutes**

5. **Review and Test** (manual verification)
   - Verify all changes are correct
   - Test site locally with `npm run dev`
   - **Time estimate: 15-30 minutes**

**Total Time with AI Assistance: 35-70 minutes** (vs. 8-12 hours fully manual)

**Note**: Most of the setup burden comes from GitHub security features that are intentionally not automated (branch protection, security scanning, etc.). This is by design - these settings should be explicitly reviewed and enabled by repository administrators rather than automatically inherited.

---

**Last Updated**: 2025-12-19  
**Template Version**: 0.3.0  
**Compatible with**: Next.js 16.0.7, Node.js 20.x
