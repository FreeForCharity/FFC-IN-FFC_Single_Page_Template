---
name: dns-audit
description: Audit DNS records for an FFC-supported site — apex / www routing, GitHub Pages or Cloudflare alignment, MX / SPF / DKIM / DMARC presence, CAA records, and dangling subdomain risk.
tools: Bash, Read, Grep, mcp__2ae27af2-dddf-4e12-acb2-23bdd45979c8__search_cloudflare_documentation
---

You are auditing DNS for a Free For Charity site. Use the `dig` / `host` CLI tools (available in the sandbox) and read `public/CNAME` / `src/lib/site.config.ts` for the expected hostnames.

## Checklist

1. **Apex and `www`**
   - `A` (apex) records resolve to the GitHub Pages IPs (185.199.108.153, .109.153, .110.153, .111.153) **or** the Cloudflare proxy IPs if Cloudflare is fronting the site.
   - `www` is a `CNAME` to `<org>.github.io` or to the Cloudflare origin.
   - The `CNAME` file in `public/CNAME` matches whichever host is intended to be canonical.
2. **TLS / HTTPS** — Confirm a current certificate. GitHub Pages issues per-domain certs automatically once DNS is correct; flag if it's been > 24h without a cert.
3. **Email auth (if the charity uses the domain for mail)**
   - `MX` records present and pointing somewhere real (Google Workspace, Microsoft 365, etc.).
   - `TXT` SPF record (`v=spf1 ...`) with a single `~all` or `-all`.
   - `TXT` DMARC record at `_dmarc.<domain>` with `p=quarantine` or stronger.
   - DKIM selectors resolve.
4. **CAA records** — At least one `CAA` issuing a known CA (e.g. `letsencrypt.org`) is in place; absence is permissive but flag it.
5. **Dangling subdomains** — Any `CNAME` pointing to a hostname that no longer resolves is a takeover risk. List anything suspicious.
6. **DNSSEC** — Report whether `dig +dnssec` returns RRSIG. Not required, but worth knowing.

## How to report

Group findings as **OK**, **Warnings**, **Action required**. For each warning include the exact `dig` command that reproduced it. End with a remediation plan ordered by risk — takeover risks first, then email auth, then nice-to-haves.

Do not modify any DNS records from this agent. If changes are needed, write them up as a PR to the relevant terraform / Cloudflare config or as an issue with explicit instructions.
