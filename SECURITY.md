# Security Documentation

This document outlines the security measures implemented in the Free For Charity web application repository to protect code quality, maintain integrity, and ensure safe collaboration.

## Branch Protection Rules

The `main` branch is protected by a ruleset named **"Protect Main"** that enforces strict quality and security controls. These protections ensure that all code merged into the main branch meets our standards and has been properly reviewed and tested.

### Active Branch Protection Settings

#### 1. ✅ Restrict Deletions

**Status**: Enabled

Only users with bypass permission can delete the `main` branch.

**Why this matters**: Prevents accidental deletion of the main branch, which could cause catastrophic loss of the production codebase and deployment history.

**For developers**: The main branch cannot be deleted through normal GitHub operations. This protects against accidents and unauthorized changes.

---

#### 2. ✅ Require Signed Commits

**Status**: Enabled

All commits pushed to `main` must have verified GPG/SSH signatures.

**Why this matters**: Ensures that every commit comes from a verified author, preventing unauthorized code injection and maintaining a trusted commit history.

**For developers**:

- You must configure commit signing on your local machine
- See [GitHub's guide on signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- Unsigned commits will be rejected when pushing to `main` (typically via pull requests)

**How to set up commit signing**:

```bash
# For GPG signing
git config --global user.signingkey YOUR_GPG_KEY_ID
git config --global commit.gpgsign true

# For SSH signing (GitHub supports this too)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

---

#### 3. ✅ Require a Pull Request Before Merging

**Status**: Enabled

All commits must be made to a non-target branch and submitted via a pull request before being merged into `main`.

**Why this matters**: Ensures that all changes go through a review process and prevents direct commits to the main branch, which could bypass quality checks and introduce bugs or security issues.

**For developers**:

- Create a feature branch for your work: `git checkout -b feature/your-feature-name`
- Push your branch to GitHub: `git push origin feature/your-feature-name`
- Open a pull request to merge your changes into `main`
- Wait for required checks to pass and obtain any necessary approvals
- Never attempt to push directly to `main` - it will be rejected

**Typical workflow**:

```bash
# Create and switch to a new branch
git checkout -b feature/add-new-component

# Make your changes and commit
git add .
git commit -m "Add new component"

# Push to GitHub
git push origin feature/add-new-component

# Open a pull request on GitHub
# Wait for CI checks and code review
```

---

#### 4. ✅ Require Code Scanning Results

**Status**: Enabled

Code scanning tools must successfully analyze the code before changes can be merged.

**Why this matters**: Automated security analysis catches potential vulnerabilities, code quality issues, and security flaws before they reach production.

**For developers**:

- Code scanning tools are configured in the repository and must pass before merging
- GitHub runs code scanning checks when configured (e.g., CodeQL, third-party tools)
- Wait for the scanning to complete - this usually takes a few minutes
- If issues are found, review the security alerts and fix them before merging
- Code scanning failures will block the merge until resolved

**What's being scanned**:

- Security vulnerabilities (SQL injection, XSS, etc.)
- Code quality issues
- Dependency vulnerabilities
- Common coding mistakes that could lead to bugs

---

#### 5. ✅ Block Force Pushes

**Status**: Enabled

Users are prevented from force pushing to `main`, even with bypass permissions.

**Why this matters**: Force pushing can rewrite commit history, potentially losing work from other developers and breaking the continuous integration/deployment pipeline.

**For developers**:

- You cannot use `git push --force` or `git push --force-with-lease` to the main branch
- If you need to modify commits, do so on your feature branch before merging
- Once code is merged to `main`, it becomes part of the permanent history

**If you need to fix something after merging**:

```bash
# Don't try to force push! Instead, create a new fix:
git checkout -b fix/correct-previous-merge
# Make your corrections
git commit -m "Fix issue from previous merge"
git push origin fix/correct-previous-merge
# Open a new pull request
```

---

### Disabled Branch Protection Settings

The following protections are available in GitHub but are **not currently enabled** for this repository:

#### ⭕ Restrict Creations

**Status**: Not enabled

Without this setting, developers can create branches that match the protected branch pattern.

**Current behavior**: Anyone with write access can create new branches freely.

---

#### ⭕ Restrict Updates

**Status**: Not enabled

Without this setting, developers can update refs that match the protected branch pattern (through PRs).

**Current behavior**: Changes can be made through the normal pull request process.

---

#### ⭕ Require Linear History

**Status**: Not enabled

Without this setting, merge commits are allowed in the commit history.

**Current behavior**: Both merge commits and squash/rebase merges are permitted when merging pull requests.

---

#### ⭕ Require Merge Queue

**Status**: Not enabled

Without this setting, pull requests merge directly without going through a merge queue.

**Current behavior**: Pull requests merge immediately once all requirements are met, without queuing.

---

#### ⭕ Require Deployments to Succeed

**Status**: Not enabled

Without this setting, code can be merged without waiting for successful deployment to specific environments.

**Current behavior**: Deployments happen after merge through GitHub Actions, but are not a pre-merge requirement.

---

## Required Status Checks

The repository uses automated quality checks to ensure code quality and security. These checks run at different stages of the development and deployment workflow:

### 1. Pre-merge Checks (on Pull Requests)

**CI Workflow** (`.github/workflows/ci.yml`)

- Runs automatically on every pull request targeting `main`
- Steps include:
  - Code formatting check (Prettier)
  - Linting (ESLint)
  - Unit tests (Jest)
  - Static site build with proper basePath configuration
  - End-to-end tests (Playwright)
- Must pass before merging

**CodeQL Code Scanning** (GitHub code scanning **default setup** — no workflow file)

- Runs automatically on every pull request targeting `main`
- Scans for security vulnerabilities and code quality issues
- Must pass before merging

**Status Visibility**

- You can see the status of these checks in your pull request
- Click "Details" next to any check to see the full logs
- If a check fails, review the error messages and fix the issue
- Push new commits to your branch to re-trigger the checks

### 2. Post-merge Deployment (on Push to Main)

**Deploy Workflow** (`.github/workflows/deploy.yml`)

- Runs automatically after CI workflow completes successfully on `main` branch
- **Only deploys if all tests pass** in the CI workflow
- Can also be triggered manually via workflow dispatch (bypasses CI wait)
- Steps include:
  - Node.js 20 environment setup
  - Clean dependency installation (`npm ci`)
  - Next.js static site build with basePath for GitHub Pages
  - Static site artifact upload
  - Deployment to GitHub Pages from `./out` directory
- Deployment is skipped if CI workflow fails or is cancelled

**Security Scanning**

- CodeQL continues to run on main branch pushes
- Dependency vulnerability checks are performed
- Security alerts visible in repository Security tab

---

## Security Best Practices

### For New Developers

If you're new to this project, follow these security guidelines:

1. **Set up commit signing** (required)
   - Configure GPG or SSH signing before your first commit
   - Test it with a practice commit on a feature branch
   - See the "Require Signed Commits" section above for setup instructions

2. **Never commit secrets**
   - Don't include API keys, passwords, or tokens in code
   - Use environment variables for sensitive configuration
   - Check `.gitignore` to ensure sensitive files are excluded

3. **Keep dependencies updated**
   - Run `npm audit` to check for vulnerabilities
   - Use `npm audit --audit-level=moderate` to set the CI exit threshold to moderate and higher severity issues
   - Update dependencies promptly when security patches are released
   - Review dependency changes in pull requests

4. **Follow the pull request workflow**
   - Always create a feature branch for your work
   - Write clear commit messages
   - Request reviews from team members
   - Address all feedback before merging

5. **Test your changes**
   - Run `npm run lint` before committing
   - Run `npm run build` to ensure your changes build successfully
   - Run `npm test` to verify all tests pass
   - Test manually in your browser when changing UI

### Reporting Security Vulnerabilities

If you discover a security vulnerability in this repository:

1. **Do NOT open a public issue** - this could put the live site at risk
2. **Report privately** using one of these methods:
   - **Preferred**: Use GitHub's [Security Advisories feature](https://github.com/FreeForCharity/FFC_Single_Page_Template/security/advisories/new)
   - **Alternative**: Email clarkemoyer@freeforcharity.org with subject line "Security Vulnerability Report"
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Affected versions (if known)
   - Suggested fix (if you have one)

#### Response Timeline

- **Initial Response**: Within 48 hours of receipt
- **Assessment**: Within 5 business days
- **Fix Development**: Timeframe depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Best effort basis
- **Public Disclosure**: After fix is deployed and users have time to update

#### Supported Versions

We support security updates for:

- **Current release**: Latest version deployed to production
- **Previous release**: One version back (if applicable)

Older versions may not receive security updates. We recommend always using the latest version.

#### Security Contact

**Primary Contact**: Clarke Moyer, Founder  
**Email**: clarkemoyer@freeforcharity.org  
**Phone**: 520-222-8104 (text preferred)  
**Response Window**: 48 hours for initial acknowledgment

---

## Working with Protected Branches

### Standard Development Workflow

```bash
# 1. Update your local main branch
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit (will be signed automatically if configured)
git add .
git commit -m "Descriptive commit message"

# 4. Push your branch
git push origin feature/your-feature-name

# 5. Open a pull request on GitHub
# - Go to the repository on GitHub
# - Click "Pull requests" → "New pull request"
# - Select your branch
# - Fill in the PR description
# - Submit the PR

# 6. Wait for checks to complete
# - CI/CD pipeline will run automatically
# - Code scanning will analyze your changes
# - All checks must pass

# 7. Address review feedback (if any)
# - Make additional commits to your branch
# - Push them (they'll automatically update the PR)

# 8. Merge once approved and checks pass
# - Use GitHub's merge button
# - Choose merge strategy (merge commit, squash, or rebase)
```

### Common Issues and Solutions

#### Issue: "Required status check has not been met"

**Solution**: Wait for all CI/CD checks to complete. If they fail, review the logs and fix the issues.

#### Issue: "Unsigned commits are not allowed"

**Solution**: Set up commit signing (see instructions above) and amend your commits:

```bash
git commit --amend --no-edit -S
git push --force-with-lease origin your-branch-name
```

**Note**: Using `--force-with-lease` is safe on your feature branches but is blocked on the `main` branch due to branch protection rules.

#### Issue: "Direct push to main is not allowed"

**Solution**: You should be working on a feature branch. If you accidentally committed to main:

```bash
# Create a new branch from your current main
git checkout -b feature/my-changes

# Reset your local main to match remote
git checkout main
git reset --hard origin/main

# Push your feature branch and create a PR
git checkout feature/my-changes
git push origin feature/my-changes
```

---

## Additional Security Measures

### Repository Security Features

Beyond branch protection, this repository uses:

1. **Automated Dependency Scanning**
   - Dependabot alerts for vulnerable dependencies
   - Regular security updates

2. **Code Quality Checks**
   - ESLint for code style and common issues
   - TypeScript strict mode for type safety

3. **Automated Testing**
   - Playwright end-to-end tests
   - Tests run after merge to main as part of the deployment pipeline

4. **Static Site Security**
   - No server-side code reduces attack surface
   - Static site generation eliminates many common vulnerabilities
   - Content Security Policy headers (configured in hosting)

---

## Known Security Vulnerabilities

### Current Status (December 2025)

The project currently has **4 low severity vulnerabilities** identified by npm audit:

- **4 low severity**: tmp package vulnerabilities
  - Affects: @lhci/cli (Lighthouse CI - dev dependency only)
  - Vulnerability: Arbitrary temporary file/directory write via symbolic link (GHSA-52f5-9888-hmc6)
  - Impact: Limited to development environment, does not affect production site
  - Fix available via `npm audit fix --force` (may involve breaking changes to Lighthouse CI)

**Good News**: The previously reported critical Next.js RCE vulnerability (GHSA-9qr9-h5gf-34mp) has been resolved. The project is now using next@16.0.7, which includes the security fix.

### Monitoring and Updates

- Dependencies are monitored through GitHub Dependabot
- Security updates are automatically proposed via pull requests
- Critical vulnerabilities should be addressed promptly
- Low severity vulnerabilities in dev dependencies are lower priority

### Checking for Vulnerabilities

```bash
# Check for known vulnerabilities
npm audit

# View detailed vulnerability information
npm audit --json

# Automatically fix vulnerabilities (use with caution)
npm audit fix

# Fix including breaking changes (⚠️ WARNING: Test thoroughly in development first!)
npm audit fix --force
```

**Important**: Always test security updates thoroughly before deploying to production:

1. Run updates in a development environment first
2. Run all tests: `npm test` and `npm run test:e2e`
3. Build and preview: `npm run build && npm run preview`
4. Manually test critical functionality
5. Only deploy after confirming everything works correctly

---

## Questions?

If you have questions about these security measures or need help setting up your development environment:

- Check the [README.md](./README.md) for general project information
- Review [TESTING.md](./TESTING.md) for testing guidelines
- Open a GitHub Discussion for questions
- Contact the repository maintainers

---

**Last Updated**: December 2025  
**Applies to**: All contributors with write access to the repository
