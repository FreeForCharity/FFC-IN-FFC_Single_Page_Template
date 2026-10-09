# Threat model — FFC-IN-FFC_Single_Page_Template

Written for Anthropic OSS Scanner, and kept in step with the human-facing
[`THREAT-MODEL.md`](../THREAT-MODEL.md). If they disagree, the code is right and
both documents need fixing.

## What this project does

This is the full single-page website template of
[Free For Charity](https://freeforcharity.org) (FFC), a nonprofit that builds
free websites for 501(c)(3) charities. Charity sites (`FFC-EX-<domain>`
repositories) are created **from this repository**, so a defect here is copied
into every site built from it. Sites that already exist are **not** fixed
unless someone backports the fix. Together with its sibling
`FFC-IN-Footer_Only_Template`, this template is behind more than 100 charity
sites.

The product is a **static export** (`next build` with `output: 'export'`)
served by GitHub Pages. There is no server, database, login or API. What
ships:

- a single landing page with sections for hero, mission, programs, results,
  testimonials, FAQ, team, volunteering, events and donation
- embeds: a Zeffy donation form, a Microsoft Forms application form, a
  GuideStar widget, and YouTube/Facebook frames
- JSON-LD structured data (`src/components/seo/`) and per-event JSON-LD
- policy pages, a cookie-consent banner implementing Google Consent Mode v2
  that gates Google Tag Manager, GA4, Clarity and the Meta Pixel, plus
  `security.txt` and a CSP `<meta>` tag

## Where untrusted input enters

Ranked by how much we care:

1. **Event feeds: fully untrusted, third-party data.**
   `scripts/fetch-events.mjs` runs on a schedule
   (`.github/workflows/refresh-events.yml`) and as `prebuild`. It fetches
   Google Calendar / Outlook **ICS** feeds and the **Facebook Graph API**,
   parses them (`src/lib/events/`: ICS unfolding/unescaping, RRULE expansion,
   timezones), and commits `src/data/events.generated.json` through a PR.
   Anyone who can create or edit an event on the connected calendar or Facebook
   page controls the titles, descriptions, locations, URLs and image URLs.
   In scope:
   - the parser: crashes, pathological RRULE/size inputs, prototype
     pollution, path issues;
   - URL sanitising (`src/lib/events/safeUrl.ts`, which must reject
     `javascript:`, `data:` and protocol-relative URLs);
   - JSON-LD serialisation (`safeJsonLdSerialize`, which must stop
     `</script>` breakout);
   - every place an event field reaches HTML or an attribute;
   - the refresh workflow's handling of secrets and the data it commits.
2. **The visitor's browser state, read at runtime.**
   `localStorage['cookie-consent']` and the `cookie-consent` cookie are parsed
   in `src/components/cookie-consent/index.tsx`. Cookies can be planted by
   sibling subdomains on shared hosts such as `*.github.io`.
   `window.location` is used to build cookie `domain=`/`path` attributes.
   The Consent Mode bootstrap (`src/lib/consent-mode.ts`) is inlined in
   `src/app/layout.tsx`.
3. **Build-time content authored by charity volunteers.** This is
   semi-trusted. It arrives by reviewed PR, but reviewers do not audit for
   injection. It covers `src/lib/site.config.ts`,
   `src/lib/analytics.config.ts` (the `GTM_ID` is interpolated into an inline
   `<script>`), `src/data/{team,faqs,testimonials}/*.json`,
   `src/data/results.ts`, and embed URLs (donation form, Microsoft Form). Any
   path where a value reaches HTML, a `<script>` body, an `href`/`src`/iframe
   `src`, a CSP directive or JSON-LD without escaping or validation is in
   scope, and so is a bypass of `scripts/check-site-config.mjs` /
   `scripts/check-drift.mjs`.
4. **CI and supply chain.** `.github/workflows/*.yml`: fork PRs,
   `workflow_run` consumers, the scheduled `refresh-events.yml`
   (`contents: write`, holds the `EVENTS_*` secrets), token permissions,
   action pinning. Also `pnpm-workspace.yaml` supply-chain settings.

## Components that matter most / least

- **Most:** `scripts/fetch-events.mjs`, `src/lib/events/`,
  `src/components/home-page/Events/`, `src/components/seo/`,
  `src/components/cookie-consent/`, `src/lib/consent-mode.ts`,
  `src/components/google-tag-manager/`, `src/app/layout.tsx` (CSP and inline
  scripts), `src/components/ui/ApplicationFormButton.tsx`,
  `src/components/home-page/SupportFreeForCharity/`,
  `.github/workflows/refresh-events.yml`.
- **Less:** animations, fonts, images, Tailwind styling, the Lighthouse and
  bundle-size checks.
- **Out of scope:** third-party code loaded by design (GTM, GA4, Clarity, the
  Meta Pixel, and the Zeffy, GuideStar, Microsoft Forms and YouTube frames).
  Report a CSP or embed that admits an origin we did not list, not the fact that
  a listed one can run. GitHub Pages cannot send custom response headers; that is
  a known platform limit, documented in `public/_headers`.

## How to exercise it

- `pnpm test` runs the Jest unit tests in `__tests__/`, including the event
  parsers and URL sanitising.
- `node scripts/fetch-events.mjs` with no `EVENTS_*` variables leaves the
  committed snapshot untouched. To feed crafted data offline, edit
  `src/data/events.generated.json` and rebuild, or call the parsers in
  `src/lib/events/` directly from a test.
- `pnpm run build` writes the static site to `out/`, which is exactly what
  ships. `pnpm run verify:build` checks it.
- `pnpm run test:e2e` runs Playwright (`tests/`, including `events.spec.ts`)
  against `out/`, served locally. Chromium is installed in the image. With no
  network, two `application-form.spec.ts` cases that wait for the Microsoft
  Forms iframe's loading indicator fail, because the iframe errors instantly
  offline. That is expected and is not a finding. All other cases pass offline.

## How we rate severity

There is no server-side state and no credentials in the shipped site, so
impact is measured against **visitors** and **the integrity of the published
site**:

- **Critical:** script execution in a visitor's browser triggered by **event
  feed data** (anyone with calendar or Facebook-page edit access) or by a
  default-config build. Any path that lets an outside contributor's PR or a
  feed value change what is deployed, or obtain a write token or the
  `EVENTS_*` secrets.
- **High:** XSS that needs a malicious but plausible volunteer-authored
  config/data value. A consent bypass that sets analytics or marketing cookies
  after a visitor declined. A CSP or embed weakness that admits an unlisted
  origin. A feed-driven denial of the scheduled build, for example a parser hang
  that stops every future refresh.
- **Medium:** consent tampering that affects only the visitor's own choice,
  open redirects through event links, and supply-chain weaknesses that need an
  upstream compromise first.
- **Low:** disclosure of already-public data (EIN, addresses, contact emails),
  and missing hardening with no demonstrated exploit.

## Anything to leave alone

- `'unsafe-inline'` in `script-src` is a known trade-off: static export on
  GitHub Pages has no per-request nonces. Report a concrete injection that
  reaches it, not its presence. `'unsafe-eval'` is different: no rationale is
  recorded for it. If nothing in the shipped site needs it, we want to know,
  as a low-severity hardening finding.
- FFC's identity in the template (names, EIN 46-2471893, the sample team and
  testimonials, the template's GTM container) is intentional sample data that
  each fork replaces; `check:rebrand` enforces it.
- Contact details in `security.txt`, the footer and the policy pages are
  public by design.

## Reports and patches

Reports go to the address in `.oss-scanner/project.yaml`. Please include a
minimal reproducer (a feed payload, config value or URL, plus the resulting
`out/` HTML or browser behavior) and a patch against `main`. Confirmed issues
are fixed here first and then backported to the charity sites built from this
template.
