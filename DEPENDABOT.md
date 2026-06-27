# Dependabot Configuration Guide

This document provides comprehensive information about GitHub Dependabot configuration and usage for the FFC Single Page Template project.

## Overview

GitHub Dependabot is enabled for this repository to automate dependency management and security updates. It monitors our dependencies and creates pull requests to keep them up-to-date and secure.

### Dependabot Components

Dependabot consists of three components that work together:

1. **Dependency Graph & Alerts** (Repository Settings)
   - Enabled in: Settings → Security & Analysis → Dependency graph
   - Purpose: Detects and alerts about vulnerable dependencies
   - Action: Provides notifications only, no automatic PRs

2. **Security Updates** (Repository Settings)
   - Enabled in: Settings → Security & Analysis → Dependabot security updates
   - Purpose: Automatically creates PRs to fix security vulnerabilities
   - Configuration: Works automatically, no YAML file needed
   - Trigger: Runs immediately when vulnerabilities are detected

3. **Version Updates** (Configuration File)
   - Enabled by: Creating `.github/dependabot.yml` file
   - Purpose: Regularly checks for and updates all dependencies
   - Configuration: Requires YAML file to specify ecosystems, schedule, and behavior
   - Trigger: Runs on the schedule defined in the configuration

**Note**: All three components should be enabled for complete dependency management. The `.github/dependabot.yml` file (version updates) works alongside the repository settings (security alerts and updates).

## Features Enabled

### 1. Version Updates

Dependabot automatically checks for newer versions of dependencies and creates pull requests to update them.

**What it does**:

- Checks for updates on a weekly schedule (every Monday at 9:00 AM UTC)
- Creates grouped pull requests for easier review
- Includes changelogs, release notes, and compatibility information
- Helps prevent dependency drift and technical debt

**Ecosystems Monitored**:

- **npm**: All JavaScript/Node.js dependencies in `package.json`
- **GitHub Actions**: All actions used in `.github/workflows/` files

### 2. Security Updates

Dependabot monitors the GitHub Advisory Database for known security vulnerabilities and creates immediate pull requests to fix them.

**What it does**:

- Runs immediately when a vulnerability is detected (bypasses weekly schedule)
- Updates only the affected dependencies to secure versions
- Prioritizes security fixes with special labels
- Provides severity ratings and CVE information

## Configuration File

**Location**: `.github/dependabot.yml`

### Current Configuration

```yaml
version: 2
updates:
  # npm ecosystem
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
      day: 'monday'
      time: '09:00'
    open-pull-requests-limit: 10
    commit-message:
      prefix: 'npm'
      include: 'scope'
    labels:
      - 'dependencies'
      - 'npm'
    groups:
      production-dependencies:
        dependency-type: 'production'
        update-types: ['minor', 'patch']
      development-dependencies:
        dependency-type: 'development'
        update-types: ['minor', 'patch']

  # GitHub Actions ecosystem
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'weekly'
      day: 'monday'
      time: '09:00'
    open-pull-requests-limit: 5
    commit-message:
      prefix: 'ci'
      include: 'scope'
    labels:
      - 'dependencies'
      - 'github-actions'
```

### Configuration Options Explained

#### Package Ecosystem: npm

- **directory**: `"/"` - Looks for `package.json` in the root directory
- **schedule**: Weekly checks every Monday at 9:00 AM UTC
- **open-pull-requests-limit**: Maximum of 10 open PRs at once
- **commit-message prefix**: `"npm"` - All commits start with "npm:"
- **labels**: PRs tagged with "dependencies" and "npm" for easy filtering
- **groups**:
  - **production-dependencies**: Groups all production deps (minor + patch updates)
  - **development-dependencies**: Groups all dev deps (minor + patch updates)
  - Major version updates are handled individually for safety

#### Package Ecosystem: github-actions

- **directory**: `"/"` - Looks for workflows in `.github/workflows/`
- **schedule**: Weekly checks every Monday at 9:00 AM UTC
- **open-pull-requests-limit**: Maximum of 5 open PRs at once
- **commit-message prefix**: `"ci"` - All commits start with "ci:"
- **labels**: PRs tagged with "dependencies" and "github-actions"

## Enabling Dependabot in Repository Settings

To get full Dependabot functionality, you need to enable features in your repository settings:

### Step 1: Enable Dependency Graph

1. Go to your repository on GitHub
2. Click **Settings** → **Security & Analysis**
3. Under **Dependency graph**, click **Enable** (if not already enabled)
   - This allows GitHub to detect dependencies in your repository
   - Required for both security alerts and security updates

### Step 2: Enable Dependabot Alerts

1. In the same **Security & Analysis** section
2. Under **Dependabot alerts**, click **Enable**
   - This enables vulnerability detection and notifications
   - You'll receive alerts when vulnerabilities are found

### Step 3: Enable Dependabot Security Updates

1. In the same **Security & Analysis** section
2. Under **Dependabot security updates**, click **Enable**
   - This enables automatic PRs for security vulnerabilities
   - PRs are created immediately when vulnerabilities are detected
   - No configuration file needed for this feature

### Step 4: Verify Version Updates Configuration

1. Ensure `.github/dependabot.yml` exists in your repository (✅ already configured)
2. Verify the YAML syntax is valid
3. Wait for the next scheduled run or trigger manually

**Note**: The `.github/dependabot.yml` file in this repository enables version updates. The repository settings control security alerts and security updates. Both should be enabled for complete coverage.

## How to Use Dependabot

### Monitoring Dependabot Activity

#### View Open Dependabot PRs

1. Go to the repository on GitHub
2. Click on **Pull Requests**
3. Filter by author: `dependabot[bot]`

#### View Dependabot Insights

1. Go to repository **Insights** tab
2. Click **Dependency graph**
3. Click **Dependabot** to see:
   - Update frequency
   - PRs created over time
   - Success/failure rates

#### View Security Alerts

1. Go to repository **Security** tab
2. Click **Dependabot alerts**
3. See all known vulnerabilities with:
   - Severity ratings (Critical, High, Medium, Low)
   - Affected packages and versions
   - Suggested fixes
   - CVE information

### Working with Dependabot Pull Requests

#### Review Process

1. **Check the PR Description**
   - Review what's being updated
   - Check the changelog and release notes
   - Look for breaking changes or important notices

2. **Review the Code Changes**
   - Click on **Files changed** tab
   - For `package.json`: Verify version numbers
   - For `package-lock.json`: Usually safe to trust Dependabot
   - For GitHub Actions: Review workflow file changes

3. **Check CI/CD Status**
   - Wait for automated tests to complete
   - All checks must pass before merging
   - Review test results if any failures occur

4. **Merge the PR**
   - Click **Merge pull request** if everything looks good
   - Use "Squash and merge" or "Rebase and merge" based on preference
   - Delete the branch after merging

#### Dependabot Commands

You can interact with Dependabot by commenting on its pull requests:

- `@dependabot rebase` - Rebase the PR to resolve conflicts
- `@dependabot recreate` - Recreate the PR from scratch
- `@dependabot merge` - Merge the PR (after checks pass)
- `@dependabot squash and merge` - Squash and merge the PR
- `@dependabot cancel merge` - Cancel a pending merge
- `@dependabot reopen` - Reopen a closed PR
- `@dependabot close` - Close the PR without merging
- `@dependabot ignore this dependency` - Stop updates for this package
- `@dependabot ignore this major version` - Ignore this major version
- `@dependabot ignore this minor version` - Ignore this minor version
- `@dependabot ignore this patch version` - Ignore this patch version

### Best Practices

#### ✅ DO

1. **Review PRs regularly** - Check at least weekly to avoid pileup
2. **Merge security updates promptly** - Security should be top priority
3. **Keep groups together** - Merge grouped updates as a unit when possible
4. **Test locally for major updates** - Pull the branch and test before merging
5. **Read changelogs** - Especially for packages you rely on heavily
6. **Monitor test results** - Ensure CI/CD passes before merging
7. **Keep Dependabot enabled** - It's a valuable security tool

#### ⚠️ DON'T

1. **Ignore security alerts** - They exist for a reason
2. **Let PRs pile up** - This creates merge conflicts and complexity
3. **Auto-merge blindly** - Always ensure tests pass first
4. **Disable without reason** - Dependabot provides important updates
5. **Ignore breaking changes** - Read the changelog for major updates
6. **Merge during active development** - Wait for a stable moment
7. **Rush security updates** - Quick, but still review for compatibility

### Handling Common Scenarios

#### Scenario 1: Merge Conflicts

**Problem**: Dependabot PR has merge conflicts

**Solution**:

```
# Comment on the PR:
@dependabot rebase

# Or close and reopen:
@dependabot close
@dependabot reopen
```

#### Scenario 2: Failing Tests

**Problem**: CI/CD tests fail on Dependabot PR

**Solution**:

1. Review the test failure logs
2. Determine if it's a breaking change in the dependency
3. Options:
   - Fix the code to work with the new version
   - Pin the dependency to an older version
   - Use `@dependabot ignore this major version`
4. Create a separate PR to fix compatibility if needed

#### Scenario 3: Too Many PRs

**Problem**: Dependabot creating too many PRs to review

**Solution**:

1. **Reduce the limit**: Lower `open-pull-requests-limit` in `dependabot.yml`
2. **Adjust grouping**: Add more dependencies to groups
3. **Change schedule**: Switch from `daily` to `weekly` or `monthly`
4. **Ignore some dependencies**: Use `@dependabot ignore` for non-critical packages

#### Scenario 4: Breaking Changes

**Problem**: A dependency update introduces breaking changes

**Solution**:

1. **For major versions**: Review changelog thoroughly before merging
2. **Test locally**:
   ```bash
   gh pr checkout <PR_NUMBER>  # Check out the Dependabot PR
   npm install                  # Install new dependencies
   npm run dev                  # Test the application
   npm test                     # Run tests
   ```
3. **Fix compatibility issues** in a separate commit on the PR
4. **Ignore the version** if it's too breaking:
   ```
   @dependabot ignore this major version
   ```

#### Scenario 5: Outdated PR

**Problem**: Dependabot PR is out of date with main branch

**Solution**:

```
# Comment on the PR:
@dependabot rebase
```

This will update the PR to include the latest changes from main.

## Customization Options

### Adjust Update Frequency

Change the `interval` in `dependabot.yml`:

```yaml
schedule:
  # Choose one: 'daily', 'weekly' (current), or 'monthly'
  interval: 'weekly'
```

### Change Update Day/Time

Customize when checks run:

```yaml
schedule:
  interval: 'weekly'
  day: 'friday' # monday, tuesday, etc.
  time: '17:00' # Use 24-hour format, timezone is UTC
```

### Ignore Specific Dependencies

Add to the ecosystem configuration:

```yaml
ignore:
  - dependency-name: 'package-name'
    update-types: ['version-update:semver-major']
```

### Adjust PR Limits

Change the maximum open PRs:

```yaml
open-pull-requests-limit: 5 # Lower number = fewer concurrent PRs
```

### Add More Labels

Customize PR labels:

```yaml
labels:
  - 'dependencies'
  - 'npm'
  - 'automerge' # Add custom labels
```

### Create More Groups

Add additional grouping strategies:

```yaml
groups:
  # Group by package name pattern
  testing-dependencies:
    patterns:
      - '@playwright/*'
      - 'jest*'

  # Group by update type
  patch-updates:
    update-types:
      - 'patch'
```

## Troubleshooting

### Dependabot Not Creating PRs

**Check**:

1. Dependabot is enabled in repository settings
   - Go to: Settings → Security & Analysis → Dependabot
2. `.github/dependabot.yml` syntax is valid
   - Use a YAML linter to check
3. No errors in Dependabot logs
   - Check: Insights → Dependency graph → Dependabot

**Fix**:

- Validate YAML: `npx js-yaml .github/dependabot.yml`
- Enable in settings if disabled
- Check for network/permission issues

### PRs Not Merging Automatically

Dependabot doesn't auto-merge by default in this configuration. To enable auto-merge:

1. **Use GitHub Actions** to auto-approve and merge:

   ```yaml
   # .github/workflows/dependabot-auto-merge.yml
   name: Dependabot auto-merge
   on: pull_request

   jobs:
     dependabot:
       runs-on: ubuntu-latest
       if: ${{ github.actor == 'dependabot[bot]' }}
       steps:
         - name: Enable auto-merge
           run: gh pr merge --auto --merge "$PR_URL"
           env:
             PR_URL: ${{github.event.pull_request.html_url}}
             GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
   ```

2. **Or manually** set auto-merge on each PR:
   ```
   @dependabot merge
   ```

### Configuration Changes Not Taking Effect

**Solution**:

1. Validate your `dependabot.yml` syntax
2. Commit and push changes to main branch
3. Wait up to 1 hour for GitHub to pick up changes
4. Force a refresh: close and reopen an existing Dependabot PR

### Security Alerts Not Showing

**Check**:

1. Dependabot alerts are enabled
   - Settings → Code security → Dependabot alerts
2. Repository has dependencies with known vulnerabilities
   - Check: Security → Dependabot alerts
3. You have appropriate permissions to view alerts

## Security Considerations

### Dependency Security Best Practices

1. **Review security updates promptly** - Within 24-48 hours
2. **Test security patches** - Even security updates can break things
3. **Monitor advisory database** - Check GitHub Security Advisories regularly
4. **Use `npm audit`** - Run locally to catch issues early
5. **Keep all dependencies updated** - Outdated deps = security risk
6. **Review transitive dependencies** - Vulnerabilities can be deep in the tree

### Verifying Dependabot PRs

Before merging Dependabot PRs, verify:

1. **Source is legitimate**: Author should be `dependabot[bot]`
2. **Changes are reasonable**: Review the diff carefully
3. **Tests pass**: All CI/CD checks must be green
4. **Changelogs reviewed**: Read release notes for major updates
5. **Security notices checked**: Look for CVE information

### When to Ignore Updates

Valid reasons to ignore or delay updates:

1. **Breaking changes** require significant refactoring
2. **Beta/RC versions** in production dependencies
3. **Known bugs** in the new version
4. **Compatibility issues** with other dependencies
5. **Active development** - wait for a stable moment

## Additional Resources

### Official Documentation

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Configuration Options Reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [About Dependabot Security Updates](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates)
- [About Dependabot Version Updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates)

### GitHub Advisory Database

- [GitHub Advisory Database](https://github.com/advisories)
- [npm Security Advisories](https://github.com/advisories?query=ecosystem%3Anpm)

### Related Tools

- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [CodeQL](https://codeql.github.com/)
- [Snyk](https://snyk.io/)

## Maintenance

This Dependabot configuration should be reviewed and updated periodically:

- **Monthly**: Review if PR limits and grouping are working well
- **Quarterly**: Check if schedule needs adjustment
- **Yearly**: Review ignored dependencies and consider re-enabling
- **As needed**: Add new ecosystems when new dependency types are added

## Support

For issues or questions about Dependabot:

1. Check this documentation first
2. Review [GitHub Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
3. Check [GitHub Community Discussions](https://github.com/orgs/community/discussions/categories/code-security)
4. Contact repository maintainers

---

**Configuration Version**: 1.0  
**Last Updated**: 2025-12-03  
**Repository**: FreeForCharity/FFC_Single_Page_Template  
**Node.js**: 20.x (validated with v20.19.6)  
**Maintained By**: FreeForCharity Team
