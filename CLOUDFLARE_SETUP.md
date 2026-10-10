# Cloudflare Configuration for GitHub Pages

This guide explains how to use Cloudflare **alongside** a GitHub Pages site. **All features listed are available on Cloudflare's Free plan.**

> [!NOTE]
> **This whole guide is optional.** This template deploys and is tested on the
> GitHub Pages default URL
> (`https://freeforcharity.github.io/FFC-IN-FFC_Single_Page_Template/`), which
> needs no Cloudflare configuration at all. Everything below applies only if
> your fork adds a **custom domain** (e.g., `your-domain.org`) and you want
> Cloudflare as its DNS provider.

> [!WARNING]
> **Do NOT proxy your GitHub Pages records (keep the cloud grey / "DNS only").**
>
> GitHub Pages issues and **auto-renews** the HTTPS certificate for your custom
> domain through Let's Encrypt. That renewal only works while your domain's
> **public** DNS resolves to GitHub's servers so GitHub's certificate
> validation can reach the site.
>
> If you switch the records to **Proxied** (the orange cloud), the public DNS
> resolves to Cloudflare's IPs instead. GitHub can no longer validate the
> domain, marks it "misconfigured," disables **Enforce HTTPS**, and **stops
> renewing the certificate**. The site keeps working until the existing
> certificate expires (~90 days), then HTTPS breaks — a silent, delayed
> failure that is painful to diagnose.
>
> **For GitHub Pages, the correct and only supported configuration is DNS-only
> (grey cloud).** In that mode Cloudflare serves as your DNS provider and
> nothing more — the CDN, caching, edge security headers, and TLS features
> below **do not apply**, because Cloudflare never sees the HTTP traffic.
>
> If you need Cloudflare's edge features (caching rules, security headers,
> minification), the supported path is to **move hosting to Cloudflare Pages**,
> not to proxy GitHub Pages. See
> [If you need edge features: Cloudflare Pages](#if-you-need-edge-features-cloudflare-pages).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Basic Setup (DNS-only)](#basic-setup-dns-only)
3. [HTTPS on GitHub Pages](#https-on-github-pages)
4. [Security Headers on GitHub Pages](#security-headers-on-github-pages)
5. [Caching and Performance on GitHub Pages](#caching-and-performance-on-github-pages)
6. [If you need edge features: Cloudflare Pages](#if-you-need-edge-features-cloudflare-pages)
7. [Testing Your Configuration](#testing-your-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Cloudflare account (free plan is sufficient) used **for DNS**
- A custom domain for your fork (this template itself uses none), delegated to
  Cloudflare nameservers
- GitHub Pages site deployed, with the custom domain configured and **Enforce
  HTTPS** enabled

---

## Basic Setup (DNS-only)

### 1. Add Your Domain to Cloudflare

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name (e.g., `your-domain.org`)
4. Select the **Free** plan
5. Cloudflare will scan your existing DNS records

### 2. Update DNS Records

1. Keep your existing DNS records that point to GitHub Pages:

   ```
   Type: A      Name: @    Content: 185.199.108.153
   Type: A      Name: @    Content: 185.199.109.153
   Type: A      Name: @    Content: 185.199.110.153
   Type: A      Name: @    Content: 185.199.111.153
   Type: CNAME  Name: www  Content: yourusername.github.io
   ```

2. Set **Proxy status** to **DNS only** (grey cloud icon) for **all** of these
   records. **Do not enable the orange cloud** — see the warning at the top of
   this guide.

### 3. Update Nameservers

1. Copy the Cloudflare nameservers shown (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Go to your domain registrar
3. Update nameservers to point to Cloudflare
4. Wait 24-48 hours for DNS propagation

### 4. (Recommended) Add a CAA record

Restrict which certificate authorities may issue certificates for your domain.
GitHub Pages uses Let's Encrypt:

```
Type: CAA   Name: @   Flags: 0   Tag: issue   Value: letsencrypt.org
```

If you use CAA records at all, at least one must allow `letsencrypt.org`, or
GitHub cannot obtain the certificate.

---

## HTTPS on GitHub Pages

With DNS-only records, **GitHub manages TLS end-to-end** — you do not configure
any SSL/TLS settings in Cloudflare (those settings only take effect for proxied
traffic, which you are intentionally not using).

1. In your repository: **Settings → Pages**
2. Confirm the custom domain shows a green check ("DNS check successful")
3. Enable **Enforce HTTPS**

GitHub provisions a Let's Encrypt certificate automatically and renews it before
expiry. If the domain ever shows "unavailable / misconfigured," the first thing
to check is that the records are **DNS-only**, not proxied.

---

## Security Headers on GitHub Pages

**GitHub Pages cannot serve custom HTTP response headers.** It ignores the
`public/_headers` file (that file is a Cloudflare Pages / Netlify convention,
shipped in this template for forks that deploy to those hosts). And because a
DNS-only setup keeps Cloudflare out of the request path, Cloudflare cannot
inject headers either. So on a GitHub-Pages-hosted site, the following HTTP
headers are simply **not delivered**:

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options` / CSP `frame-ancestors` (clickjacking defense)
- `Permissions-Policy`
- Cross-origin isolation (COOP / COEP / CORP)

### What the template does instead

Two protections are delivered from **inside the HTML** and work on GitHub Pages:

- **Content-Security-Policy** via `<meta http-equiv>` in `src/app/layout.tsx`.
  Note the spec limits: a `<meta>` CSP **cannot** carry `frame-ancestors`,
  `sandbox`, or `report-uri`, and only governs content that appears after it in
  the document.
- **Referrer-Policy** via `<meta name="referrer">` — equivalent to the header
  for browser behavior.

### Accepted-risk posture

For a static site with no login and no user-generated content, the missing
headers are **defense-in-depth against attack surfaces this site class does not
have** (there is no authenticated, state-changing UI to clickjack; assets are
developer-committed with correct content types). This is a documented, accepted
risk — see `THREAT-MODEL.md`. If a compliance requirement or a security-scanner
grade (e.g. [securityheaders.com](https://securityheaders.com/)) makes full
headers mandatory, the fix is to move hosting to Cloudflare Pages (below), not
to proxy GitHub Pages.

### security.txt note

`/.well-known/security.txt` (the canonical RFC 9116 path) **is served** on this
template's Pages deploy: the deploy workflow uploads the artifact with
`include-hidden-files: true`, because `actions/upload-pages-artifact` defaults
to dropping dot-prefixed entries, which would 404 the path. Keep that setting if
you customize the workflow. The template also ships a root **`/security.txt`**
fallback, which many scanners and researchers check. Both paths work on
Cloudflare Pages as well.

---

## Caching and Performance on GitHub Pages

On a DNS-only setup, **caching and performance are handled by GitHub's own CDN
(Fastly)**, not Cloudflare. The template already ships good cache behavior:

- Fingerprinted Next.js assets under `/_next/static/*` are immutable and
  long-cached.
- `public/_headers` documents the intended `Cache-Control` values for hosts
  that honor it (Cloudflare Pages / Netlify).

Cloudflare Page Rules, Auto Minify, Brotli, Early Hints, Rocket Loader, HTTP/3,
and 0-RTT are **edge features that require proxied traffic** and therefore have
**no effect** in a DNS-only GitHub Pages setup. Do not enable proxying to get
them — it breaks HTTPS (see the top warning). Use Cloudflare Pages if you want
them.

---

## If you need edge features: Cloudflare Pages

If you want Cloudflare's CDN, caching rules, edge security headers, and
minification, the supported approach is to **host the site on Cloudflare Pages**
instead of GitHub Pages. Cloudflare then owns the full request path **and** the
TLS lifecycle (no GitHub certificate dance), and this template's
`public/_headers` file is honored **natively** — every header listed in
[Security Headers](#security-headers-on-github-pages) is served automatically,
with no Transform Rules to maintain.

High level:

1. Create a Cloudflare Pages project connected to this GitHub repository.
2. Build command `npm run build`, output directory `out` (matches the static
   export in `next.config.ts`).
3. Point the custom domain at the Pages project (proxied is correct **here** —
   Cloudflare is the host, so there is no GitHub certificate to break).
4. `public/_headers` deploys as-is; verify headers with
   [securityheaders.com](https://securityheaders.com/).

Everything below — Page Rules, Transform-Rule headers, Auto Minify, Brotli,
SSL/TLS modes — applies **only** to a proxied Cloudflare-hosted deployment, not
to GitHub Pages.

<details>
<summary>Reference: Cloudflare edge settings (Cloudflare Pages / proxied only)</summary>

### Security Headers (Transform Rules)

On Cloudflare Pages, `public/_headers` already sets these, so Transform Rules
are usually unnecessary. If you prefer rules: **Rules → Transform Rules →
Modify Response Header → Set static** for each of
`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
and `Permissions-Policy`.

### Caching (Page Rules)

- `*/_next/static/*` → Cache Everything, Edge TTL 1 month, Browser TTL 1 year
  (immutable, content-hashed).
- `*/Images/*`, `*/Svgs/*` → Cache Everything, long TTLs.
- `*/*.html` → Cache Everything, short TTL (updates on deploy).

### Performance toggles

Auto Minify (JS/CSS/HTML), Brotli, Early Hints, HTTP/3 (with QUIC), and 0-RTT
under **Speed → Optimization** / **Network**. Rocket Loader is optional and can
break JS-heavy pages — test before leaving it on.

### SSL/TLS

**SSL/TLS → Overview → Full (strict)**, and set **Minimum TLS Version** to
1.2 or higher under **Edge Certificates**. Enable **Always Use HTTPS**.

</details>

---

## Testing Your Configuration

### 1. Verify DNS is NOT proxied

```bash
# Should return GitHub Pages IPs (185.199.108-111.153), NOT Cloudflare IPs.
dig +short your-domain.org
```

If you see Cloudflare IPs (e.g. `104.x` / `172.67.x`), the record is proxied —
switch it back to DNS-only.

### 2. Verify HTTPS and certificate issuer

```bash
curl -sI https://your-domain.org/ | grep -i '^HTTP'
# Expect: HTTP/2 200
```

In **Settings → Pages**, confirm the certificate is issued and **Enforce
HTTPS** is on.

### 3. Verify security posture

```
https://securityheaders.com/?q=https://your-domain.org
```

Expect the meta CSP to be detected and the HTTP-header items to be flagged —
that is the documented, accepted state for a GitHub-Pages-hosted site (see
[Accepted-risk posture](#accepted-risk-posture)).

### 4. Test SSL configuration

```
https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.org
```

---

## Troubleshooting

### Issue: HTTPS broke / certificate error a few weeks after enabling Cloudflare

**Almost always caused by proxying (orange cloud) a GitHub Pages record.** GitHub
stopped renewing the certificate because it can no longer validate the domain.

**Fix:**

1. Set the GitHub Pages records back to **DNS only** (grey cloud).
2. In **Settings → Pages**, remove and re-enter the custom domain to force
   re-validation, then re-enable **Enforce HTTPS** once the green check appears.
3. Wait for GitHub to re-issue the certificate (usually minutes to an hour).

### Issue: Custom domain shows "unavailable" / "misconfigured" in GitHub

1. Confirm records are **DNS only**, not proxied.
2. Confirm the A records are GitHub's four `185.199.10x.153` addresses (and the
   `www` CNAME points to `yourusername.github.io`).
3. Confirm your fork's `public/CNAME` file matches the custom domain. (This
   template ships no `public/CNAME` — add one when you configure a custom
   domain, or set the domain in the repository's Pages settings.)

### Issue: Expecting security headers but scanners show none

Expected on GitHub Pages — see
[Security Headers on GitHub Pages](#security-headers-on-github-pages). Move to
Cloudflare Pages if HTTP headers are required.

---

## Summary

| Deployment                                             | HTTPS                          | Edge caching / headers           | `public/_headers` honored    |
| ------------------------------------------------------ | ------------------------------ | -------------------------------- | ---------------------------- |
| **GitHub Pages, default URL** (this template)          | GitHub-managed                 | ❌ (no Cloudflare involved)      | ❌ (GitHub Pages ignores it) |
| **GitHub Pages + Cloudflare DNS-only** (custom domain) | GitHub-managed (Let's Encrypt) | ❌ none (Cloudflare not in path) | ❌ (GitHub Pages ignores it) |
| **Cloudflare Pages** (proxied)                         | Cloudflare-managed             | ✅ full                          | ✅ natively                  |
| ⛔ GitHub Pages + Cloudflare **proxied**               | **breaks on cert renewal**     | —                                | —                            |

---

## Additional Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [GitHub Pages: Managing a custom domain / HTTPS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)

---

**Last Updated:** 2026-08-29

For questions or issues, contact Free For Charity at hello@freeforcharity.org
