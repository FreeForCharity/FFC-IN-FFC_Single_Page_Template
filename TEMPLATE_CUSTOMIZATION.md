# Customizing a Site Built From This Template

This template is designed so a brand-new Free For Charity (FFC) site can be
stood up by editing a small, well-defined set of files. Everything else flows
from there, and CI guards against accidental drift from FFC best practices.

If you are starting fresh, run through the checklist in
[`TEMPLATE_SETUP_CHECKLIST.md`](./TEMPLATE_SETUP_CHECKLIST.md). This document
is the **map** — what changes where, and why.

## The one file you must edit

[`src/lib/site.config.ts`](./src/lib/site.config.ts) is the central source of
truth for site-specific values. Update the `siteConfig` export with your
charity's name, URL, contact email, social links, etc.

| Property                      | Where it shows up                                                                                                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | `<title>`, OG/Twitter `site_name`, 404 page, error page, footer copyright, manifest                                                                                                                                    |
| `tagline`                     | Default `<title>` and OG title                                                                                                                                                                                         |
| `description`                 | `<meta description>` (long form for search engines), manifest fallback                                                                                                                                                 |
| `shortDescription`            | OG / Twitter card description (tuned for social previews; falls back to `description`)                                                                                                                                 |
| `url`                         | `metadataBase`, sitemap entries, robots `Sitemap:` line                                                                                                                                                                |
| `twitterHandle`               | Twitter card `site` attribute (the leading `@` is added automatically)                                                                                                                                                 |
| `contactEmail`                | Footer e-mail link. `security.txt` has its own `Contact:` line — keep them in sync.                                                                                                                                    |
| `keywords`                    | `<meta keywords>`                                                                                                                                                                                                      |
| `themeColor`                  | Web manifest `theme_color` and `background_color`                                                                                                                                                                      |
| `vulnerabilityDisclosurePath` | 404 page CTA, error page disclosure link                                                                                                                                                                               |
| `social`                      | Footer social-link rail (icon resolved by `label`: Facebook, X (Twitter), LinkedIn, GitHub)                                                                                                                            |
| `ein`                         | Footer EIN display line                                                                                                                                                                                                |
| `phone`                       | Footer phone link (`phone.display` shown, `phone.tel` used for the `tel:` link)                                                                                                                                        |
| `addresses`                   | Footer contact column (`addresses[].label` / `.lines` / `.mapUrl`)                                                                                                                                                     |
| `guidestar`                   | Footer GuideStar/Candid seal links (`guidestar.profileUrl`, `guidestar.directProfileUrl`)                                                                                                                              |
| `supportedBy`                 | Permanent "Supported by Free For Charity" bottom-bar attribution and "Supported Charity Login" hub link. Part of the FFC footer standard: required, always rendered — do **not** change or remove it when customizing. |
| `parentOrg`                   | Footer "a project of" parent-org clause (omit for a standalone charity)                                                                                                                                                |
| `integrations`                | Zeffy donation embed, Idealist profile, SociableKit events widget, Microsoft Forms URL                                                                                                                                 |

### Things `siteConfig` does NOT drive

- **Hero/section copy** — lives in component files under `src/components/home-page/` and `src/data/`.
- **GitHub Pages base path** — chosen automatically by `deploy.yml` and `lighthouse.yml` based on whether `public/CNAME` exists. With a CNAME the build uses an empty basePath (custom-domain root). Without a CNAME the build uses `/<repo-name>` for github.io subpath deploys. No manual workflow edit required when you rename the repo.
- **OG/Twitter card image** — `layout.tsx` points at `/Images/og-image.png` (1200×630 landscape, the size social cards expect). To rebrand, replace `public/Images/og-image.png` with your own 1200×630 image (keep the filename). The square `/web-app-manifest-512x512.png` is still used separately for the PWA icon and the JSON-LD logo.

After editing, **run `pnpm run check:drift`** to confirm nothing else still
references the old placeholder values.

### Are you done rebranding? — `pnpm run check:rebrand`

Run **`pnpm run check:rebrand`** at any point to get a checklist of every value
that still matches the Free For Charity template defaults — charity name, EIN,
phone, contact email, domain/CNAME, the GTM analytics container, and the sample
team / testimonials / FAQ content. It is a guide, not a gate: it always exits 0
on the template itself (the canonical repo intentionally keeps FFC's values), so
it never blocks a PR. If your fork wants to _enforce_ "fully rebranded before
deploy", wire `node scripts/rebrand-check.mjs --strict` (which exits non-zero
while any default remains) into your own CI.

> Note: leaving the GTM container as `GTM-TQ5H8HPR` sends your site's analytics
> to Free For Charity — replace it in `src/lib/analytics.config.ts` early.

## Analytics & tracking IDs

All analytics identifiers live in one file:
[`src/lib/analytics.config.ts`](./src/lib/analytics.config.ts). They are **not**
secrets — they are public, client-side IDs baked into the static export and
visible in the page source — so they are kept in a plain, easy-to-edit config
file rather than in environment variables or hardcoded inside components.

| Field              | Provider              | Placeholder          |
| ------------------ | --------------------- | -------------------- |
| `gtmId`            | Google Tag Manager    | `GTM-TQ5H8HPR` (FFC) |
| `gaMeasurementId`  | Google Analytics 4    | `G-XXXXXXXXXX`       |
| `metaPixelId`      | Meta (Facebook) Pixel | `XXXXXXXXXXXXXXX`    |
| `clarityProjectId` | Microsoft Clarity     | `XXXXXXXXXX`         |

To use your own accounts, edit the values in `analytics.config.ts`. Leaving a
value as its placeholder keeps that integration effectively inert. The GTM
component and the cookie-consent component both read from this file, and the
E2E tests assert against it, so there is a single source of truth.

## Files you'll likely touch when rebranding

| File                                                            | What to change                                                                                                                                                                                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/CNAME`                                                  | Custom domain (delete if using only github.io)                                                                                                                                                                                           |
| `public/.well-known/security.txt` **and** `public/security.txt` | `Contact`, `Canonical`, `Policy`, `Acknowledgments`, `Expires`. **Both copies must stay in sync** (the drift checker enforces it). The root copy exists because GitHub Pages does not serve dot-prefixed directories.                    |
| `public/Images/*`, `public/Svgs/*`                              | Brand assets (keep filenames where possible)                                                                                                                                                                                             |
| `src/components/footer/index.tsx`                               | Usually no edit needed — EIN, addresses, phone, GuideStar links, parent-org link, social rail, and email all read from `siteConfig`. Touch the footer code only to change the endorsement seal image/markup or other structural changes. |
| `src/data/*`                                                    | Testimonials, FAQs, team — your real content                                                                                                                                                                                             |
| `src/components/home-page/*`                                    | Home page sections                                                                                                                                                                                                                       |
| `src/app/privacy-policy/page.tsx` etc                           | Legal pages (have a lawyer review)                                                                                                                                                                                                       |

The web manifest is **auto-generated** from `siteConfig` at build time by `src/app/manifest.ts` — no separate file to edit.

## Files you should NOT touch on a per-site basis

These are part of the platform contract. Touching them often means you are
drifting from FFC best practices and CI will catch it:

- `scripts/check-drift.mjs` — best-practice enforcement
- `.github/workflows/*.yml` — CI / deploy / security workflows
- `.claude/agents/*.md` — shared agent definitions
- `next.config.ts` `output: 'export'` line — static export is required for GitHub Pages
- `src/lib/assetPath.ts` — the helper everyone depends on

If you have a real need to change one of these, open an issue first.

## Security surface

| Concern                     | Where it lives                                                       |
| --------------------------- | -------------------------------------------------------------------- |
| CSP (**the one served**)    | `<meta httpEquiv="Content-Security-Policy">` in `src/app/layout.tsx` |
| CSP (inert, forward-compat) | `public/_headers` — see the warning below                            |
| security.txt                | `public/.well-known/security.txt`                                    |
| Vuln disclosure page        | `src/app/vulnerability-disclosure-policy/page.tsx`                   |
| Branch protection           | `SECURITY.md` (configure in GitHub repo settings)                    |
| Dep scanning                | `.github/dependabot.yml`, `.github/workflows/security-audit.yml`     |
| Static analysis (CodeQL)    | GitHub code scanning **default setup** (no `codeql.yml` workflow)    |
| Supply-chain score          | `.github/workflows/scorecard.yml`                                    |
| Secret patterns             | `scripts/check-drift.mjs` (locally) + GitHub secret scanning         |

> **`public/_headers` is inert on FFC deploys.** It is a Cloudflare Pages /
> Netlify build feature. FFC sites are a GitHub Pages origin behind the
> Cloudflare _proxy_, and neither reads the file — measured on the wire in
> [FFC-Cloudflare-Automation#884](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/884).
> Do not count it as security coverage, and do not treat adding it to a site as
> closing a header gap.

Only the CSP `<meta>` tag is actually served. The other five headers in
`public/_headers` — HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` — **cannot be set from a static export
at all**; `<meta http-equiv>` is ignored for them. Serving those needs a
response-header rule on the Cloudflare zone, tracked fleet-wide in
[FFC-Cloudflare-Automation#894](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/894).

When you add a new third-party origin (analytics, embed, payment), update
**both** `public/_headers` and the CSP `<meta>` tag in `src/app/layout.tsx`.
Only the `<meta>` tag changes what the live site allows today; the `_headers`
copy is kept in lockstep so a future move to Cloudflare Pages inherits a
correct policy rather than a stale one. `pnpm run check:drift` errors if the two
disagree.

## Verifying nothing drifted

```
pnpm run format         # auto-fix formatting
pnpm run lint           # ESLint
pnpm run check:drift    # FFC best-practices
pnpm run check:rebrand  # remaining template defaults (guide only, never fails)
pnpm test               # Jest unit tests
pnpm run build          # static export
pnpm run test:e2e       # Playwright
```

CI runs the same set on every PR. Get it green locally first to keep PR
review cycles short.
