# Threat Model

Security threat model for **FFC-IN-FFC_Single_Page_Template**, the full
single-page website template of Free For Charity (FFC). It covers what the
template ships, where untrusted input enters, the threats that matter, and how
they are mitigated today.

A machine-oriented version of the same model, written for automated
vulnerability scanning, lives in
[`.oss-scanner/threat_model.md`](./.oss-scanner/threat_model.md). Keep the two
in step. When either disagrees with the code, the code is right.

## Why this template is security-relevant

Charity websites, `FFC-EX-<domain>` repositories, are created **from this
repository** by FFC's provisioning automation in
`FreeForCharity/FFC-Cloudflare-Automation`. Older sites were all built from it,
and it is still a selectable template alongside `FFC-IN-Footer_Only_Template`.
Consequences:

- a defect here is **copied into every site built after it**;
- a fix here does **not** reach existing sites. Each fix needs a deliberate
  backport to the `FFC-EX-*` repositories;
- each site is run by a 501(c)(3) charity whose volunteers edit content but
  do not review code for security.

## System overview

| Part                  | What it is                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application           | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4; **static export** (`output: 'export'`); exact versions in `package.json`                                                                     |
| Hosting               | GitHub Pages, deployed by `.github/workflows/deploy.yml` after CI succeeds on `main`                                                                                                                       |
| Package manager       | pnpm (pinned by `packageManager`); `pnpm-workspace.yaml` sets a 7-day `minimumReleaseAge`, and pnpm 10 blocks dependency lifecycle scripts by default                                                      |
| Event feeds           | `scripts/fetch-events.mjs` pulls Google/Outlook ICS and the Facebook Graph API on a schedule (`refresh-events.yml`) and commits `src/data/events.generated.json` by PR                                     |
| Embeds                | Zeffy donation form, Microsoft Forms application form (sandboxed iframe), GuideStar widget, YouTube/Facebook frames                                                                                         |
| Runtime third parties | Google Tag Manager → GA4, Microsoft Clarity, Meta Pixel. All are gated by the cookie-consent banner and Google Consent Mode v2                                                                              |
| Security headers      | CSP and Referrer-Policy as `<meta>` tags in `src/app/layout.tsx`. GitHub Pages cannot send response headers; `public/_headers` is for a future Cloudflare Pages deploy (see T10)                          |
| Disclosure            | `security.txt` (`public/` and `public/.well-known/`), `/vulnerability-disclosure-policy`, `/security-acknowledgements`                                                                                     |

There is no server, database, user account or API. All content is fixed at
build time.

## Trust boundaries and untrusted input

1. **Event feeds (untrusted).** Anyone who can edit an event on the
   connected calendar or Facebook page controls its title, description,
   location, links and image URL. The data is parsed in `src/lib/events/`,
   URL-filtered by `safeUrl.ts` (http/https only; https for images), and
   emitted as HTML and JSON-LD (`safeJsonLdSerialize` escapes `<`).
2. **Visitor's browser state.** The consent banner reads `localStorage` and
   the `cookie-consent` cookie, which a sibling subdomain on a shared host such
   as `*.github.io` can plant. Stored consent is parsed and validated, never
   trusted.
3. **Volunteer-authored content (semi-trusted).** `src/lib/site.config.ts`,
   `src/lib/analytics.config.ts`, `src/data/{team,faqs,testimonials}/*.json`,
   `src/data/results.ts`, and embed URLs arrive by reviewed PR. They are checked
   by `check:site-config`, `check:drift`, and `check:rebrand`.
4. **Third-party scripts and frames.** These run with the privileges their
   placement gives them; the CSP limits which origins may run or be framed.
5. **CI/CD.** Fork PRs run CI with a read-only token. `refresh-events.yml`
   holds the `EVENTS_*` secrets and `contents: write`. `deploy.yml` holds
   `pages: write` and `id-token: write`.
6. **Dependencies.** The npm registry, via the committed `pnpm-lock.yaml`.

## Threats and mitigations

| ID  | Threat                                                                                                          | Impact   | Current mitigations                                                                                                                                                                                                              | Residual |
| --- | --------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| T1  | XSS or link injection from **event feed** data (`javascript:` URLs, `</script>` in JSON-LD, markup in text)     | Critical | React escaping; `safeHttpUrl`/`safeHttpsImageUrl`; `safeJsonLdSerialize`; parser unit tests in `__tests__/lib/events`; refresh lands as a reviewable PR, not a direct push                                                      | Medium   |
| T2  | Parser abuse from feeds (oversized responses, pathological RRULEs, hangs)                                       | Medium   | 10 MiB cap per feed; 30 s fetch timeout; bounded Facebook pagination; allowlisted ICS hosts; a failing source is skipped, not fatal                                                                                               | Low      |
| T3  | XSS via volunteer-authored config/data or embed URLs                                                            | High     | React escaping; config validation; CSP `object-src 'none'`, `base-uri 'self'`, `frame-src` allowlist; sandboxed Microsoft Forms iframe                                                                                           | Medium   |
| T4  | Consent bypass: analytics or marketing cookies or identifying hits after a decline                              | High     | Consent Mode v2 regional defaults before GTM; `update` pushed before GA config; non-granted cookies expired on every apply; Playwright `cookie-consent.spec.ts`                                                                   | Low      |
| T5  | `'unsafe-inline'` / `'unsafe-eval'` in `script-src` turn any HTML injection into script execution               | High     | `'unsafe-inline'` is a known trade-off (no per-request nonces on GitHub Pages). `'unsafe-eval'` has **no recorded rationale** and should be removed if nothing needs it. Defence today is T1/T3 input handling                | Medium   |
| T6  | Event-feed secrets leak, or the refresh workflow is abused to push content                                      | High     | Secrets only in `refresh-events.yml`; `scrubSecrets` removes feed URLs and tokens from logged errors; output is a PR against `main`, so it is reviewed and CI-gated                                                                                                   | Low      |
| T7  | Compromised or malicious dependency                                                                             | Critical | Lockfile; `minimumReleaseAge` 7 days; lifecycle scripts blocked; daily `pnpm audit` (`security-audit.yml`); Dependabot (npm, Actions, scanner base image)                                                                        | Medium   |
| T8  | CI injection or token abuse from a fork PR or `workflow_run`                                                    | Critical | `pull_request` (not `pull_request_target`); least-privilege `permissions:`; deploy only from `main` after CI success; OpenSSF Scorecard tracks token permissions and pinning                                                       | Low      |
| T9  | Unreviewed change reaches `main` (account takeover, social engineering)                                         | Critical | `main` ruleset (see [SECURITY.md](./SECURITY.md)): PRs, required status checks and code scanning, signed commits, no force-push/deletion                                                                                          | Medium   |
| T10 | Missing HTTP security headers (HSTS, `nosniff`, framing, `Permissions-Policy`) on GitHub Pages                  | Low      | CSP and Referrer-Policy via `<meta>`; HTTPS enforced. Moving to Cloudflare Pages would honor `public/_headers`. **Do not** proxy the Pages DNS through Cloudflare (orange cloud): it breaks GitHub's certificate renewal ~90 days later | Low      |
| T11 | A template defect propagates to every charity site built from it                                                | High     | This model; OSS Scanner enrollment (below); fixes tracked for backport across `FFC-EX-*` sites                                                                                                                                   | Medium   |
| T12 | Third-party script or embed compromise (GTM tags, Zeffy, GuideStar)                                             | High     | Consent gating; CSP allowlists; no secrets or PII in the page                                                                                                                                                                    | Medium   |
| T13 | Stale `security.txt` stops researchers from reaching us                                                         | Low      | `security-txt-expiry.yml` checks the `Expires` field weekly                                                                                                                                                                      | Low      |

## Verification in place

- **CI** (`ci.yml`): format, lint, Jest unit tests (including the event
  parsers), static build, Playwright e2e (including `events.spec.ts`).
- **Guards**: `check:drift`, `check:site-config`, `check:rebrand`,
  `verify:build`.
- **Code scanning**: CodeQL default setup (`javascript-typescript`,
  `actions`) on every PR.
- **Supply chain**: `security-audit.yml` (`pnpm audit`, daily and on lockfile
  changes); Dependabot; **OpenSSF Scorecard** (`scorecard.yml`, published to the
  OpenSSF API).
- **Automated vulnerability scanning**: enrollment in
  [Anthropic OSS Scanner](https://github.com/anthropics/oss-scanner) is
  prepared under [`.oss-scanner/`](./.oss-scanner/README.md).
  `oss-scanner-image.yml` proves the scanner image builds and its tests pass
  with no network. Tracking: FreeForCharity/FFC-Cloudflare-Automation#1582.

## Out of scope

The security of visitors' devices and networks, GitHub's, Google's, Meta's and
the embed providers' infrastructure, the connected calendar and Facebook
accounts themselves, and physical security. DNS and domain security are covered
in `FreeForCharity/FFC-Cloudflare-Automation`.

## Reporting

See [SECURITY.md](./SECURITY.md#reporting-a-vulnerability). Do not report
vulnerabilities in public issues.

## Review

Review this model when the architecture changes (hosting, a new embed or data
feed), after any security incident, when an automated-scanner report reveals a
threat missing here, and at least annually.

**Last reviewed:** 2026-10-09 · **Next review due:** 2027-10-09
