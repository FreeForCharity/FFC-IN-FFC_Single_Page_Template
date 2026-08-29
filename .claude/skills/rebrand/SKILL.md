---
name: rebrand
description: Rebrand this FFC template to a new nonprofit — swap identity, config, legal pages, and assets; delete unused demo content; fix per-page SEO; and verify nothing Free For Charity ships. Use when adapting the template to a new organization, or auditing a partially-rebranded fork for leftover "Free For Charity" identity.
---

# Rebrand the FFC template to a new organization

This skill turns the template into a specific nonprofit's site **without leaving
any Free For Charity identity behind**. It exists because the naive "find-and-
replace Free For Charity on the homepage" approach repeatedly ships forks whose
**legal pages, deep routes, and metadata still belong to FFC** — and passes
lint/build/tests while doing so.

Read this whole file before editing. Work top-to-bottom; the verification step
at the end is mandatory.

## Two checks, two jobs

- `npm run check:rebrand` — an **advisory** checklist (exits 0) of FFC _config
  and data_ defaults still present: `site.config.ts` values, the real GTM
  container, `security.txt`, and the sample team/testimonials/FAQ data. Run it
  early; run `npm run check:rebrand --strict` to make it exit non-zero while any
  default remains.
- `npm run check:drift` — an **enforced** CI gate. It now includes a
  brand-identity check: once `siteConfig.name` differs from `Free For Charity`,
  any leftover `Free For Charity`, `freeforcharity.org`, EIN `46-2471893`, phone
  `520-222-8104`, or `@freeforcharity.org` email in `src/app/**` or
  `src/components/**` is a hard error (footer platform credit excepted). This is
  the piece that catches the legal-page blind spot `check:rebrand` doesn't scan.

If both pass and you've done the SEO and delete-unused steps below, the rebrand
is real — not skin-deep.

## Inputs you need first

Collect these before editing. Where you can't get an authoritative answer, do
**not** guess — leave it out and flag it (see "Human-decision items"). A wrong
EIN, jurisdiction, or donation term is worse than an omitted one.

- Display name + tagline; SEO description + shorter OG/Twitter card description.
- Production URL (custom domain, or the github.io fallback).
- Contact email; security disclosure email (these can differ).
- Social links (or leave `href: ''` — the footer filters empties).
- Parent-org / fiscal-sponsor details if the site is a project of another org
  (these drive `siteConfig.parentOrg`, not hardcoded strings).
- Legal/entity facts **only if authoritative**: legal name, EIN, governing-law
  state, mailing address, phone, whether the org solicits donations.

## Procedure

### 1. Central config — `src/lib/site.config.ts`

Set every FFC default `npm run check:rebrand` reports: `name`, `tagline`,
`description`, `shortDescription`, `url` (bare origin, `https://`, no trailing
slash), `contactEmail`, `keywords`, `themeColor`, `social`, `parentOrg`,
`guidestar`, `foundingDate`, and the analytics/GTM container in
`src/lib/analytics.config.ts` (leaving FFC's GTM container sends your analytics
to FFC). This is the single source of truth — don't duplicate these elsewhere.

### 2. Domain + security.txt

- `public/CNAME`: the custom domain, or delete the file for github.io-only.
- `public/.well-known/security.txt` **and** `public/security.txt` (kept in sync
  by the drift checker): `Contact:` = security email, `Canonical:`/`Policy:`/
  `Acknowledgments:` = new URL, `Expires:` ≥ 12 months out.

### 3. Legal / policy pages — enumerate ALL of them

This is the step every shallow rebrand skips. Under `src/app/`, each has its own
`page.tsx` with hardcoded org name, URLs, emails, and sometimes phone/EIN/
jurisdiction:

- `privacy-policy/` · `terms-of-service/` · `cookie-policy/`
- `vulnerability-disclosure-policy/` · `security-acknowledgements/`
- `donation-policy/` (and any variant) — see delete-unused.

For each: fix the `metadata` (bare `title`, org-correct `description`, add
`alternates.canonical`), then the body — org name, `freeforcharity.org` → new
domain, contact emails → the org's, and remove FFC's phone/DPO name. Align the
vulnerability-disclosure contact with `security.txt`. **Have the org's counsel
review legal text before it goes live.**

### 4. Delete unused demo content — don't just edit it

The template ships demo sections and data a given org may not use. If a component
isn't imported by `src/app/home-page/index.tsx` (or anywhere), it's dead — delete
it and its test rather than leaving FFC content in the tree:

- `src/components/home-page/*` sections not rendered on the home page.
- `src/data/{team,testimonials,faqs}` if nothing imports them.
- Donation pages if the org doesn't solicit donations — and remove their entries
  from `src/app/sitemap.ts` and any Terms clause referencing a "Donation Policy"
  so no dangling reference remains.

Keep brand-neutral, reusable UI primitives (cards, buttons) even if unused.

### 5. Per-page SEO — the invisible regressions

- **Canonicals**: never set `alternates.canonical` on the root layout (App Router
  inherits it into every route → all pages canonicalize to `/`). Set it per page:
  home in `page.tsx`, `/articles`, each article via `generateMetadata`, every
  policy page.
- **Titles**: policy `title`s must be the bare page name so the layout template
  supplies the brand — not `'… | Free For Charity'`, which double-brands.
- **Article/detail pages**: give them their own `openGraph`/`twitter` metadata
  and `Article` JSON-LD instead of inheriting the homepage card.
- **Heading hierarchy**: the template's legal pages ship with broken headings —
  e.g. every section as its own `<h1>`, or a page whose top heading is an `<h2>`.
  Each page needs exactly one `<h1>` (the title) with a logical `h2`/`h3` nesting
  and no skipped levels. Check every policy page.

### 6. Assets, footer, repo metadata

- Swap `public/Images/` + `public/Svgs/`, keeping filenames so the LCP preload
  and manifest icons still resolve. Always reference via `assetPath()`.
- Footer: the parent-org / platform credit is config-driven via
  `siteConfig.parentOrg` — set it (or clear it), don't hardcode. If you add a
  hardcoded "Built with Free For Charity" credit line, it's an allowlisted
  identity exception.
- Footer attribution that is NOT a rebrand target: `siteConfig.supportedBy`
  (the permanent "Supported by Free For Charity" bottom-bar clause and the
  "Supported Charity Login" hub link) and the hardcoded "Free For Charity
  Donation Policy" label. These are part of the FFC footer standard — leave
  them exactly as shipped; `check:drift` and `check:rebrand` deliberately
  exempt them.

### 6b. Full docs & metadata cleanup — the whole repo, not just `src/`

The rebrand is not done when the app is clean; a fork also inherits a pile of
Markdown and config that still names the template's placeholder domain
(`ffcworkingsite1.org`) and, in functional metadata, points at the template repo.
Do a **repo-wide** sweep:

```
grep -rniE 'ffcworkingsite1\.org|46-?2471893|520[-. ]?222[-. ]?8104' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=out
```

- **Functional metadata (ships real data — must be correct):** `.github/FUNDING.yml`
  (fix the domain and drop any `#donate` link if the site has no donate flow),
  `CITATION.cff` (`url` + `repository-code`), `.github/ISSUE_TEMPLATE/config.yml`
  (contact links — point at the fork's repo, not the template repo), `README.md`.
  The drift checker scans these, so a stale value fails CI once rebranded.
- **Instance-describing docs (replace the placeholder domain with the real one):**
  `CONTRIBUTING.md`, `SECURITY.md`, `DEPLOYMENT.md`, `CLOUDFLARE_SETUP.md`,
  `THREAT-MODEL.md`, `ISSUE_RESOLUTION.md`, `NAMING_CONVENTIONS.md`,
  `FACEBOOK_EVENTS_SETUP.md`, and any workflow comments. Where these describe the
  new site (deployment, production URL, threat model), also swap the org NAME,
  not just the domain — a domain change with "Free For Charity" text left beside
  it reads as a mismatch.
- **Docs that describe Free For Charity the platform/org — NOT the placeholder:**
  `SUPPORT.md` (FFC's hosting/domain/grant services, EIN, support email) and the
  `ADOPTERS.md` Free For Charity entry describe the real FFC org. Their links go
  to `freeforcharity.org` — do NOT swap them to the new domain (that would claim
  the new org offers FFC's services). If a template placeholder appears there,
  fix it to `freeforcharity.org`, not the new site.
- **Template-authoring guides (leave the placeholder — it's the teaching example):**
  `TEMPLATE_USAGE.md`, `TEMPLATE_SETUP_CHECKLIST.md`, `TEMPLATE_CUSTOMIZATION.md`,
  `CONTENT_REPLACEMENT_GUIDE.md`, `.github/ISSUE_TEMPLATE/rebrand-template.md`, and
  `scripts/check-drift.mjs` (the `PLACEHOLDER_HOST` detection constant).
- **Stale doc references to deleted routes/components:** if you removed the
  donation pages (step 4), scrub their mentions from `README.md` and any guide
  so the docs match the shipped routes.
- Update the GitHub **repo description and topics** (web UI).

### 7. Human-decision items — ask, don't guess

Surface these to the org rather than inventing values:

- **EIN** and 501(c)(3) status (or the fiscal sponsor / parent org's).
- **Governing-law jurisdiction** in the Terms (the template's is FFC's state).
- **Donations**: does the org solicit them, and under which entity? Decides
  whether donation pages are kept-and-rebranded or deleted.

### 8. Verify — mandatory, in order

```
npm run format
npm run lint
npm run check:rebrand   # advisory: config/data defaults still present
npm run check:drift     # ENFORCED: includes the brand-identity gate
npm test
npm run build
npm run verify:build    # built-HTML: one <h1> + a canonical per page
npm run test:e2e
```

Then a belt-and-suspenders grep for surfaces the gate doesn't scan:

```
grep -rniE 'free ?for ?charity|freeforcharity\.org|46-?2471893|520[-. ]?222[-. ]?8104' src/ public/ \
  | grep -v 'Built with Free For Charity'
```

`verify:build` covers the built-output invariants (one `<h1>` per page, a
per-page canonical); still eyeball the `out/` policy `<title>`s and any article
`Article` JSON-LD.

### 9. PR

Open a PR listing every file changed, the `check:drift` + `check:rebrand`
output, confirmation that legal pages were reviewed by counsel, the production
URL, and an explicit **Decisions** section for every Human-decision item you
omitted or defaulted.

## Anti-patterns (all observed in real rebrands)

- Rebranding the homepage and calling it done — the legal pages are the trap.
- Trusting `check:rebrand` alone — it's advisory and doesn't scan the rendered
  legal pages; `check:drift`'s identity gate does, and it blocks.
- Editing demo data you should have deleted.
- Guessing an EIN, jurisdiction, or donation terms to fill a blank.
- Blanket-bumping a dependency to fix an advisory without checking it stays
  within the CI Node version's supported range (e.g. undici 8 needs Node 22).
