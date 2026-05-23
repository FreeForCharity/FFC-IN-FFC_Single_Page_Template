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

| Property                      | Where it shows up                                         |
| ----------------------------- | --------------------------------------------------------- |
| `name`                        | `<title>`, OG/Twitter `site_name`, 404 page, error page   |
| `tagline`                     | Default `<title>` and OG title                            |
| `description`                 | `<meta description>`, OG description, Twitter description |
| `url`                         | `metadataBase`, sitemap entries, robots `Sitemap:` line   |
| `twitterHandle`               | Twitter card `site` attribute                             |
| `contactEmail`                | (used by your own pages — security.txt has its own copy)  |
| `keywords`                    | `<meta keywords>`                                         |
| `themeColor`                  | Reserved for the manifest / `<meta name="theme-color">`   |
| `githubPagesBasePath`         | Deploy workflow's `NEXT_PUBLIC_BASE_PATH`                 |
| `vulnerabilityDisclosurePath` | 404 page CTA, future security pages                       |
| `social`                      | Footer social link rail                                   |

After editing, **run `npm run check:drift`** to confirm nothing else still
references the old placeholder values.

## Files you'll likely touch when rebranding

| File                                  | What to change                                                 |
| ------------------------------------- | -------------------------------------------------------------- |
| `public/CNAME`                        | Custom domain (delete if using only github.io)                 |
| `public/.well-known/security.txt`     | `Contact`, `Canonical`, `Policy`, `Acknowledgments`, `Expires` |
| `public/site.webmanifest`             | `name`, `short_name`, theme/background colors                  |
| `public/Images/*`, `public/Svgs/*`    | Brand assets (keep filenames where possible)                   |
| `src/data/*`                          | Testimonials, FAQs, team — your real content                   |
| `src/components/home-page/*`          | Home page sections                                             |
| `src/app/privacy-policy/page.tsx` etc | Legal pages (have a lawyer review)                             |

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

| Concern                  | Where it lives                                                       |
| ------------------------ | -------------------------------------------------------------------- |
| CSP (Cloudflare/Netlify) | `public/_headers`                                                    |
| CSP (GitHub Pages)       | `<meta httpEquiv="Content-Security-Policy">` in `src/app/layout.tsx` |
| security.txt             | `public/.well-known/security.txt`                                    |
| Vuln disclosure page     | `src/app/vulnerability-disclosure-policy/page.tsx`                   |
| Branch protection        | `SECURITY.md` (configure in GitHub repo settings)                    |
| Dep scanning             | `.github/dependabot.yml`, `.github/workflows/security-audit.yml`     |
| Static analysis          | `.github/workflows/codeql.yml`                                       |
| Supply-chain score       | `.github/workflows/scorecard.yml`                                    |
| Secret patterns          | `scripts/check-drift.mjs` (locally) + GitHub secret scanning         |

When you add a new third-party origin (analytics, embed, payment), update
**both** `public/_headers` and the CSP `<meta>` tag in `src/app/layout.tsx` —
otherwise the resource will load on Cloudflare-hosted sites but fail on
GitHub Pages, or vice versa.

## Verifying nothing drifted

```
npm run format         # auto-fix formatting
npm run lint           # ESLint
npm run check:drift    # FFC best-practices
npm test               # Jest unit tests
npm run build          # static export
npm run test:e2e       # Playwright
```

CI runs the same set on every PR. Get it green locally first to keep PR
review cycles short.
