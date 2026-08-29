# Threat Model

This document outlines the security threat model for the Free For Charity website, identifying potential security risks, trust boundaries, and mitigation strategies for our technology stack.

## Overview

The Free For Charity website is a static Next.js application deployed to GitHub Pages. As a nonprofit organization, we prioritize protecting our reputation, maintaining service availability, and ensuring the security of our community.

## System Architecture

### Components

1. **Frontend Application**
   - Next.js 16.0.7 (App Router)
   - TypeScript, React 19.2.0
   - Static site generation (`output: "export"`)
   - Client-side JavaScript

2. **Hosting and Deployment**
   - GitHub Pages (static hosting)
   - Custom domain: ffcworkingsite1.org
   - GitHub Actions CI/CD pipeline

3. **Development Pipeline**
   - GitHub repository
   - npm package dependencies
   - Automated testing (Jest, Playwright)
   - Code scanning (CodeQL)
   - Dependabot security updates

4. **Third-Party Integrations**
   - Google Analytics (via Google Tag Manager)
   - External assets (images, fonts)

## Trust Boundaries

### Boundary 1: User Browser ↔ Website

**Trust Relationship**: We serve static content; users trust us to provide safe, legitimate content.

**Assets at Risk**:

- User privacy
- User device security
- Organization reputation

### Boundary 2: GitHub Repository ↔ Deployment

**Trust Relationship**: GitHub Actions automates deployment; we trust GitHub's infrastructure.

**Assets at Risk**:

- Website integrity
- Source code confidentiality
- Deployment credentials

### Boundary 3: Dependencies ↔ Application

**Trust Relationship**: We depend on npm packages; we trust the npm ecosystem and package maintainers.

**Assets at Risk**:

- Application security
- User data
- Build integrity

### Boundary 4: Developers ↔ Repository

**Trust Relationship**: Maintainers have write access; we trust them to follow security practices.

**Assets at Risk**:

- Code quality
- Security posture
- Project integrity

## Threat Analysis

### 1. Static Site Threats

#### T1.1: Cross-Site Scripting (XSS)

**Description**: Injection of malicious scripts into the website through user-generated content or compromised dependencies.

**Impact**: High - Could steal user data, deface site, redirect users to malicious sites

**Likelihood**: Low - Static site with no user input forms currently active

**Mitigations**:

- ✅ React automatically escapes output
- ✅ Next.js built-in XSS protections
- ✅ Content Security Policy headers (configured via GitHub Pages)
- ✅ Regular dependency updates via Dependabot
- ⚠️ Manual review of third-party scripts (Google Tag Manager)

**Residual Risk**: Low

#### T1.2: Content Injection via Compromised Build

**Description**: Attacker modifies source code or dependencies to inject malicious content during build.

**Impact**: Critical - Could compromise all users

**Likelihood**: Low - Strong branch protection and code review

**Mitigations**:

- ✅ Branch protection rules on main branch
- ✅ Required code reviews
- ✅ Signed commits requirement
- ✅ CodeQL scanning on all PRs
- ✅ Automated testing before deployment
- ✅ Force push blocked

**Residual Risk**: Low

### 2. Dependency Chain Attacks

#### T2.1: Malicious npm Package

**Description**: A dependency or transitive dependency contains malicious code.

**Impact**: Critical - Could execute arbitrary code during build or in user browsers

**Likelihood**: Medium - npm ecosystem is a known target

**Mitigations**:

- ✅ pnpm audit runs in CI/CD
- ✅ Dependabot alerts enabled
- ✅ Lock file committed (pnpm-lock.yaml)
- ✅ Limited dependencies (minimal attack surface)
- ⚠️ Manual review of dependency updates
- ⚠️ No automated dependency update merging

**Residual Risk**: Medium

#### T2.2: Dependency Confusion

**Description**: Attacker publishes malicious package with same name as internal package.

**Impact**: Medium - Could compromise build pipeline

**Likelihood**: Low - No internal packages currently

**Mitigations**:

- ✅ All dependencies from public npm registry
- ✅ pnpm-lock.yaml ensures consistent versions

**Residual Risk**: Low

### 3. CI/CD Pipeline Threats

#### T3.1: GitHub Actions Workflow Manipulation

**Description**: Attacker modifies workflow files to inject malicious steps.

**Impact**: Critical - Could compromise deployment keys, source code, or deployed site

**Likelihood**: Low - Protected by branch protection

**Mitigations**:

- ✅ Workflow files protected by branch protection
- ✅ Required reviews for all changes
- ✅ Signed commits required
- ✅ Limited use of third-party actions
- ✅ Actions pinned to specific versions (where possible)

**Residual Risk**: Low

#### T3.2: Secrets Exposure

**Description**: Sensitive credentials exposed in logs, code, or artifacts.

**Impact**: High - Could allow unauthorized deployments or access

**Likelihood**: Low - No sensitive secrets currently stored

**Mitigations**:

- ✅ GitHub secrets used for any credentials
- ✅ .gitignore configured to exclude sensitive files
- ✅ Pre-commit hooks prevent accidental commits
- ✅ Public repository - no false sense of security

**Residual Risk**: Low

#### T3.3: Build Artifact Tampering

**Description**: Attacker modifies built artifacts before deployment.

**Impact**: Critical - Could serve malicious content to users

**Likelihood**: Very Low - Direct pipeline from build to deployment

**Mitigations**:

- ✅ Automated deployment pipeline (no manual steps)
- ✅ Build and deploy happen in same workflow
- ✅ GitHub Actions infrastructure security

**Residual Risk**: Very Low

### 4. GitHub Pages Hosting Threats

#### T4.1: DNS Hijacking

**Description**: Attacker compromises DNS records to redirect traffic.

**Impact**: Critical - Could phish users or damage reputation

**Likelihood**: Low - DNS provider security

**Mitigations**:

- ⚠️ DNSSEC (depends on DNS provider configuration)
- ⚠️ CAA records to restrict certificate issuance
- ✅ HTTPS enforced by GitHub Pages
- ✅ Regular monitoring of domain configuration

**Residual Risk**: Low

#### T4.2: GitHub Pages Infrastructure Compromise

**Description**: GitHub Pages infrastructure is compromised.

**Impact**: Critical - Could affect all users

**Likelihood**: Very Low - GitHub's security measures

**Mitigations**:

- ✅ Trust in GitHub's security practices
- ✅ Multiple availability zones
- ✅ GitHub's incident response

**Residual Risk**: Very Low (external dependency)

### 5. Social Engineering and Account Compromise

#### T5.1: Maintainer Account Takeover

**Description**: Attacker gains access to maintainer GitHub account.

**Impact**: Critical - Could push malicious code

**Likelihood**: Medium - Common attack vector

**Mitigations**:

- ⚠️ 2FA enforcement (recommended, not technically enforced)
- ✅ Branch protection prevents direct pushes
- ✅ Required reviews provide oversight
- ✅ Signed commits for verification
- ⚠️ Regular security training for maintainers

**Residual Risk**: Medium

#### T5.2: Social Engineering of Reviewers

**Description**: Attacker tricks reviewers into approving malicious PR.

**Impact**: High - Could introduce vulnerabilities

**Likelihood**: Low - Small, trusted team

**Mitigations**:

- ✅ Automated security scanning (CodeQL)
- ✅ Multiple eyes on changes
- ✅ Test suite must pass
- ⚠️ Security awareness training

**Residual Risk**: Low

### 6. Client-Side Threats

#### T6.1: Browser-Based Attacks

**Description**: Attacks targeting users' browsers (drive-by downloads, etc.).

**Impact**: Medium - Could harm users

**Likelihood**: Low - Static content, no file uploads

**Mitigations**:

- ✅ HTTPS enforced
- ✅ Content Security Policy
- ✅ No user file uploads
- ✅ No server-side code execution
- ✅ Subresource Integrity for external scripts (where possible)

**Residual Risk**: Low

#### T6.2: Third-Party Script Compromise

**Description**: Google Tag Manager or other third-party scripts compromised.

**Impact**: High - Could inject malicious code

**Likelihood**: Low - Google's security practices

**Mitigations**:

- ✅ Limited third-party scripts
- ✅ Async loading to limit impact
- ⚠️ Subresource Integrity (not always available for third-party services)
- ⚠️ Regular review of third-party integrations

**Residual Risk**: Medium (external dependency)

### 7. Data Privacy Threats

#### T7.1: Analytics Data Leakage

**Description**: Sensitive user information collected or exposed via analytics.

**Impact**: Medium - Privacy violation, regulatory risk

**Likelihood**: Low - Minimal data collection

**Mitigations**:

- ✅ Cookie consent banner
- ✅ Privacy policy published
- ✅ No PII intentionally collected
- ✅ Google Analytics configured for privacy
- ⚠️ Regular privacy policy reviews

**Residual Risk**: Low

### 8. Availability Threats

#### T8.1: DDoS Attack

**Description**: Distributed denial of service against the website.

**Impact**: Medium - Site unavailable, but no data loss

**Likelihood**: Low - Not a high-value target

**Mitigations**:

- ✅ GitHub Pages CDN provides some DDoS protection
- ✅ Static content is highly cacheable
- ✅ Nonprofit status reduces motivation

**Residual Risk**: Low

#### T8.2: GitHub Pages Outage

**Description**: GitHub Pages service disruption.

**Impact**: Medium - Site temporarily unavailable

**Likelihood**: Low - GitHub's reliability

**Mitigations**:

- ✅ Static site can be hosted elsewhere if needed
- ✅ Source code in Git (can redeploy)
- ⚠️ No automatic failover to backup hosting

**Residual Risk**: Medium (external dependency)

## Risk Summary

### Critical Risks

None currently - all critical threats have effective mitigations

### High Risks

- **H1**: Maintainer account takeover (Medium likelihood) - Recommend enforcing 2FA
- **H2**: Third-party script compromise (Low likelihood) - External dependency

### Medium Risks

- **M1**: Malicious npm package (Medium likelihood) - Ongoing monitoring needed
- **M2**: GitHub Pages outage (Low likelihood) - Acceptable external dependency risk

## Security Roadmap

### Immediate Actions (High Priority)

1. ✅ Document threat model (this document)
2. ⚠️ Enable 2FA for all maintainers
3. ⚠️ Review and document third-party script usage

### Short-Term Actions (3-6 months)

1. ⚠️ Implement automated dependency update reviews
2. ⚠️ Add CSP headers verification to tests
3. ⚠️ Document security incident response plan
4. ⚠️ Security training for maintainers

### Long-Term Actions (6-12 months)

1. ⚠️ Regular security audits
2. ⚠️ Penetration testing
3. ⚠️ Consider backup hosting provider
4. ⚠️ Evaluate WAF (Web Application Firewall) options

## Security Assumptions

1. **GitHub Security**: We trust GitHub's infrastructure security
2. **npm Ecosystem**: We trust npm registry with appropriate verification
3. **Browser Security**: We assume users have up-to-date, secure browsers
4. **HTTPS**: We rely on HTTPS for transport security
5. **Static Site Model**: Reduced attack surface due to no server-side code

## Out of Scope

The following are not covered by this threat model:

- User device security
- Network security between user and GitHub
- Social media account security
- Email security
- Physical security

## Reporting Security Issues

See [SECURITY.md](./SECURITY.md) for instructions on reporting security vulnerabilities.

## Review and Updates

This threat model should be reviewed:

- Annually
- After major architectural changes
- After security incidents
- When new threat intelligence emerges

---

**Last Updated**: December 6, 2025  
**Version**: 1.0  
**Next Review**: December 6, 2026

For security policies and vulnerability reporting, see [SECURITY.md](./SECURITY.md).
