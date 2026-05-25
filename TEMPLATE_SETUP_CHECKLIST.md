# Template Setup Checklist

Quick reference checklist for setting up a new repository from the FFC Single Page Template.

**For complete instructions, see [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md)**

---

## Initial Repository Creation

- [ ] Click "Use this template" button on GitHub
- [ ] Create new repository with kebab-case name
- [ ] Add repository description and topics
- [ ] Clone repository locally
- [ ] Run `npm install` to verify dependencies
- [ ] Run `npm run build` to verify build works
- [ ] Run `npm run dev` to test locally

---

## Essential GitHub Settings (Required)

### General Settings (Settings → General)

- [ ] Set repository description
- [ ] Add topics (nextjs, nonprofit, static-site, etc.)
- [ ] Enable Issues
- [ ] Enable Discussions (optional)

### GitHub Pages (Settings → Pages)

- [ ] **Source: GitHub Actions** (NOT "Deploy from a branch" — this repo's
      `.github/workflows/deploy.yml` uploads a Pages artifact via
      `actions/deploy-pages`; there is no `gh-pages` branch)
- [ ] Custom domain (if applicable): Enter domain name and click "Save"
- [ ] Wait for DNS check to complete
- [ ] Enable "Enforce HTTPS" (after DNS configured)
- [ ] `NEXT_PUBLIC_BASE_PATH` is now selected automatically by
      `deploy.yml` and `lighthouse.yml` from `public/CNAME` (empty when
      CNAME is present, `/<repo-name>` when it's not). No manual edit
      required.

### Actions Permissions (Settings → Actions → General)

- [ ] Allow all actions and reusable workflows
- [ ] Workflow permissions: Read and write permissions
- [ ] Allow GitHub Actions to create and approve pull requests ✅

### Security & Analysis (Settings → Security & Analysis)

- [ ] Enable Dependency graph ✅
- [ ] Enable Dependabot alerts ✅
- [ ] Enable Dependabot security updates ✅
- [ ] Enable Code scanning (CodeQL) - auto-configured by workflow
- [ ] Enable Secret scanning (if available)

---

## Branch Protection Rules (Settings → Rules → Rulesets)

Create ruleset named "Protect Main":

- [ ] Target branches: Include default branch (main)
- [ ] Restrict deletions ✅
- [ ] Require pull request before merging ✅
- [ ] Require status checks to pass:
  - [ ] Test and Build (CI workflow)
  - [ ] Analyze (javascript-typescript)
  - [ ] Analyze (actions)
- [ ] Require branches to be up to date ✅
- [ ] Require signed commits ✅
- [ ] Block force pushes ✅

**Set up commit signing**: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits

---

## Update Repository Configuration Files

### basePath in Workflows — automatic

`deploy.yml` and `lighthouse.yml` derive `NEXT_PUBLIC_BASE_PATH` from
`public/CNAME` at build time:

- **Custom domain** (CNAME file present): build uses empty basePath so
  asset URLs resolve from the origin root.
- **github.io subpath** (no CNAME): build uses `/<repo-name>` so asset
  URLs resolve under the Pages subpath.

You don't have to edit either workflow when you rename the repo.

### Update CODEOWNERS

- [ ] Edit `.github/CODEOWNERS`
- [ ] Replace `@clarkemoyer` with your GitHub usernames/teams

### Update FUNDING.yml (Optional)

- [ ] Edit `.github/FUNDING.yml`
- [ ] Update GitHub Sponsors username
- [ ] Update custom donation links

---

## Customize Content and Branding

### Organization Information (use `siteConfig`, NOT find-and-replace)

- [ ] Edit `src/lib/site.config.ts` — sets the name, URL, description,
      twitter handle, contact email, social links, theme color
      everywhere they're consumed (title, OG/Twitter, footer, 404,
      manifest, sitemap, robots, security headers)
- [ ] Run `npm run check:drift` after editing — the placeholder-URL
      and CSP-sync rules will flag anything still pointing at
      `ffcworkingsite1.org` or out of sync
- [ ] Update the EIN, mailing addresses, phone number, and GuideStar
      profile link still hardcoded in `src/components/footer/index.tsx`
      (these are not in siteConfig yet)

### Contact Information

- [ ] `siteConfig.contactEmail` drives the footer e-mail link
- [ ] Update `public/.well-known/security.txt` `Contact:` line (RFC
      9116 requires it on the file itself; drift check warns on stale)
- [ ] Update `SECURITY.md` — Security contact
- [ ] Update `CODE_OF_CONDUCT.md` — Conduct reporting contact
- [ ] Update `SUPPORT.md` — Support resources

### Branding Assets

- [ ] Replace `public/favicon.ico`, `public/icon.png`,
      `public/apple-icon.png`, `public/android-chrome-{192,512}.png`,
      and `public/web-app-manifest-512x512.png` with the charity's
      branded assets (KEEP the filenames so layout.tsx and manifest.ts
      pick them up automatically)
- [ ] Replace the header logo: `src/components/header/index.tsx`
      currently hardcodes an external `https://freeforcharity.org/...`
      WordPress URL. Self-host a logo under `public/Images/` and use
      `assetPath('/Images/your-logo.png')` instead.
- [ ] Replace the OG / Twitter card image — `layout.tsx` references
      `/web-app-manifest-512x512.png` (a square 512×512). For proper
      social cards, drop a 1200×630 image at the same filename or
      update both layout.tsx references to point at a new asset.
- [ ] Replace branded images and SVGs under `public/Images/` and
      `public/Svgs/`
- [ ] Update color scheme in `src/app/globals.css`
- [ ] Update fonts in `src/app/layout.tsx` (if needed)

### Content Data

- [ ] Update team members in `src/data/team/`
- [ ] Update team photos in `/public/team/`
- [ ] Update FAQs in `src/data/faqs/`
- [ ] Update testimonials in `src/data/testimonials/`

### Documentation

- [ ] Update `README.md` with your information
- [ ] Update `MAINTAINERS.md` with your maintainers
- [ ] Update `GOVERNANCE.md` for your processes
- [ ] Update `CITATION.cff` with your details
- [ ] Review and customize `CONTRIBUTING.md`

---

## Optional Features

### Lighthouse CI GitHub Integration

- [ ] Create a **fine-grained** or **repository-scoped** GitHub token limited to this repository with the minimal permissions Lighthouse CI needs (for example, read access to contents and pull requests; avoid classic PATs with broad `repo` scope).
- [ ] Add this least-privilege token to repository secrets as `LHCI_GITHUB_APP_TOKEN`
- [ ] Note: This enables PR comments and status checks; without it, Lighthouse runs but only stores results locally

### Preview Deployments

**Option A: Cloudflare Pages (Recommended)**

- [ ] Sign up at pages.cloudflare.com
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Framework: Next.js (Static HTML Export)
  - Build command: `npm run build`
  - Output: `out`
- [ ] Enable automatic preview deployments
- [ ] Enable PR comments

**Option B: Vercel**

- [ ] Sign up at vercel.com
- [ ] Import GitHub repository
- [ ] Configure settings (auto-detected for Next.js)
- [ ] Deploy

### Merge Queue

- [ ] Enable merge queue in Settings → Pull Requests
- [ ] Configure maximum queue size (5-10)
- [ ] Set check interval (5 minutes)

---

## Verification Steps

### Test Local Development

- [ ] Run `npm run dev` - Site loads at http://localhost:3000
- [ ] Run `npm run lint` - Only expected warnings (16 total)
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run build` - Build succeeds
- [ ] Run `npm run preview` - Built site works

### Test GitHub Pages Deployment

- [ ] Push changes to main branch
- [ ] Check Actions tab - CI workflow passes
- [ ] Check Actions tab - Deploy workflow succeeds
- [ ] Visit GitHub Pages URL - Site loads correctly
- [ ] Check custom domain (if configured) - Site loads
- [ ] Verify images load correctly
- [ ] Test navigation and mobile menu

### Verify Security Features

- [ ] Check Security tab - CodeQL scans are running
- [ ] Check Security tab - Dependabot alerts enabled
- [ ] Try pushing unsigned commit - Should be blocked
- [ ] Try pushing directly to main - Should be blocked
- [ ] Open test PR - Branch protection rules enforced

### Verify Dependabot

- [ ] Check Pull Requests - Look for Dependabot PRs
- [ ] Check Insights → Dependency graph → Dependabot
- [ ] Verify alerts appear in Security tab

---

## Post-Setup Tasks

### Documentation Review

- [ ] Read QUICK_START.md for development workflow
- [ ] Read CONTRIBUTING.md for contribution guidelines
- [ ] Read DEPLOYMENT.md for deployment details
- [ ] Read TESTING.md for testing practices
- [ ] Read SECURITY.md for security policies

### Community Setup

- [ ] Announce repository to team members
- [ ] Share contribution guidelines
- [ ] Set up team communication channels
- [ ] Plan first sprint or iteration

### Monitoring Setup

- [ ] Add repository to monitoring dashboard (if applicable)
- [ ] Set up notifications for security alerts
- [ ] Configure PR review notifications
- [ ] Set up deployment notifications

---

## Common Issues and Solutions

### Deployment fails with "Resource not accessible"

✅ **Solution**: Enable "Read and write permissions" and "Allow GitHub Actions to create and approve pull requests" in Settings → Actions → General

### GitHub Pages shows 404

✅ **Solution**:

1. Verify Pages source is set to **"GitHub Actions"** (Settings → Pages → Source)
2. Wait 2-5 minutes for propagation
3. Check Actions tab for the "Deploy to GitHub Pages" workflow status
4. Confirm the "Determine base path" step in the deploy run printed the
   expected value (empty for custom-domain deploys, `/<repo-name>` for
   subpath deploys)
5. If you have a custom domain, confirm `public/CNAME` contains it
   (no scheme, no trailing slash)

### Images don't load on GitHub Pages

✅ **Solution**:

1. Check the deploy run's "Determine base path" step printed the
   expected value for your setup (empty with CNAME, `/<repo-name>` without)
2. Confirm all image references use the `assetPath()` helper — `npm run
check:drift` will fail if any are missing
3. Rebuild and redeploy

### Commits rejected (unsigned)

✅ **Solution**: Set up GPG commit signing - https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits

### Dependabot PRs not created

✅ **Solution**:

1. Enable Dependabot alerts in Settings → Security & Analysis
2. Enable Dependabot security updates
3. Wait for scheduled run (Mondays 9:00 AM UTC)
4. Check Insights → Dependency graph for errors

---

## Need Help?

- 📖 **Complete Guide**: [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/FreeForCharity/FFC_Single_Page_Template/issues)
- 💬 **Ask Questions**: [GitHub Discussions](https://github.com/FreeForCharity/FFC_Single_Page_Template/discussions)
- 📚 **Documentation**: Review all `.md` files in repository root

---

**Last Updated**: 2025-12-19  
**Template Version**: 0.3.0  
**Compatible with**: Next.js 16.0.7, Node.js 20.x
