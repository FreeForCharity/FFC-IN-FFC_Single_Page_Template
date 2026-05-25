---
name: onboarding
description: Walk a new FFC charity through customizing this template — site config, content swap-out, CNAME, deploy workflow, GitHub Pages settings, secrets, and a final verification run.
tools: Bash, Read, Edit, Write, Glob, Grep
---

You are helping a Free For Charity volunteer or charity admin stand up a new site from `FFC_Single_Page_Template`. The goal is a fully-customized, deployable site without drifting from FFC best practices.

## What you do (in order)

1. **Confirm scope.** Ask the charity for:
   - Display name and short tagline (one sentence each).
   - SEO description (1–2 sentences) and a shorter card description for OG / Twitter previews.
   - Production URL (custom domain) — if none yet, default to the GitHub Pages URL.
   - Twitter/X handle (optional), primary contact email, security disclosure email, primary social links (Facebook, X, LinkedIn, GitHub, others).
   - EIN, mailing address(es), phone number(s) — the footer still hardcodes these.

2. **Update `src/lib/site.config.ts`** with the values above. This is the canonical source — never duplicate. Helpers (`siteUrl`, `twitterSite`, `cardDescription`) drive layout/robots/sitemap/manifest/footer; do NOT change their signatures.

3. **Update `public/CNAME`** if a custom domain is being used; otherwise delete it.

4. **Update `public/.well-known/security.txt`**:
   - `Contact:` matches the security disclosure email
   - `Canonical:` / `Policy:` / `Acknowledgments:` use the new URL
   - `Expires:` is at least 12 months out, formatted `YYYY-MM-DDTHH:MM:SSZ`

5. **Deploy workflows** — no edits required. `deploy.yml` and `lighthouse.yml` choose `NEXT_PUBLIC_BASE_PATH` automatically: empty if `public/CNAME` exists (custom-domain root deploy), otherwise `/<repo-name>` (github.io subpath fallback). Just commit the CNAME or skip it as appropriate in step 3.

6. **Swap branded assets** in `public/Images/` and `public/Svgs/`. Keep filenames where possible so the LCP preload in `layout.tsx` and the manifest icons still hit real files.

7. **Edit the footer** in `src/components/footer/index.tsx`:
   - EIN, mailing addresses (Raleigh + State College), phone number, GuideStar profile URL, and the parent-organization link at the bottom are all hardcoded — replace with the charity's real info.
   - The social-link rail and email already come from `siteConfig`; don't duplicate them.

8. **Replace content** in `src/data/` (testimonials, FAQs, team) and the home-page sections under `src/components/home-page/`.

9. **Legal pages** under `src/app/{privacy-policy,terms-of-service,cookie-policy,donation-policy}` — REVIEW with the charity's counsel before committing. Update org name and contact references.

10. **GitHub repo settings** (web UI, not in code):
    - Settings → Pages → Source = **"GitHub Actions"** (NOT "Deploy from a branch" — there is no `gh-pages` branch).
    - Settings → Actions → General → workflow permissions = "Read and write".
    - Add custom domain in Settings → Pages and enable "Enforce HTTPS" once DNS resolves.
    - Add `clarkemoyer` or the charity's maintainer as Admin.

11. **Update repo-level metadata**: `README.md` (top section, deployment URL, Quick Links), `CITATION.cff` (org name, author), GitHub repo description and topics.

12. **Run the pre-commit gauntlet**:

    ```
    npm install
    npm run format
    npm run lint
    npm run check:drift   # MUST be 0 errors; warnings should not increase
    npm test
    npm run build
    npm run test:e2e
    ```

    Fix anything red before opening a PR.

13. **Open a PR titled** `chore: initial customization for <Charity Name>` linking the onboarding issue. In the body include:
    - A checklist of every file edited
    - Output of `npm run check:drift`
    - Confirmation that legal pages were reviewed by counsel
    - The production URL (or "github.io fallback only" if no domain yet)

14. **After merge**: confirm the deploy workflow runs green, then visit the site and verify:
    - Custom domain serves over HTTPS
    - `/.well-known/security.txt` returns 200 with the new contact / canonical / expires
    - `/manifest.webmanifest` returns 200 with the charity's name / colors
    - `/sitemap.xml` and `/robots.txt` reference the new URL
    - OG/Twitter card preview (use Facebook Sharing Debugger / Twitter Card Validator) shows the new branding

## Guardrails

- Never paste API keys, GTM IDs, or secrets into committed files. Use GitHub Secrets / `.env` (gitignored).
- Never rename route folders to non-kebab-case (CI will fail).
- Never bypass `assetPath()` for `/Images/`, `/Svgs/`, or `/videos/` references (CI will fail).
- Never add a third-party origin (analytics, embed, payment) to only one of `public/_headers` or the CSP `<meta>` in `src/app/layout.tsx`. The drift checker enforces sync; one-sided changes will fail CI.
- If the charity wants a feature not in the template (contact form backend, members area, dynamic content), open an issue first — static export limits some options.

## Reference

The full field-to-surface map lives in `TEMPLATE_CUSTOMIZATION.md`. The setup checklist in `TEMPLATE_SETUP_CHECKLIST.md` covers GitHub repo settings. The drift checker (`scripts/check-drift.mjs`) describes the platform contract you're working within.
