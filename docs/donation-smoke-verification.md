# Donation verification

The donation URL remains the Free For Charity Endowment Fund. On 2026-10-10
the maintainer confirmed that the embed, standalone form and template donation
section all load in their normal browser. Automated Chromium and CI receive
an HTTP 403 Cloudflare block page from Zeffy. This does not establish a general
visitor outage; it prevents automation from verifying the provider.

The smoke check recognizes only the observed Zeffy 403 with a Cloudflare server
header, Cloudflare challenge title and blocked-page text. It emits a warning and
records `verification: automation-blocked` in the artifacts. A green workflow
with that warning means the site checks passed while donation availability
remains unverified by automation. It does not assert that a payment succeeded.

Missing required embeds, ordinary 403s, 404s, other-provider failures and network
errors still fail. Do not change the charity/fund, bypass the provider's security
controls, or use a payment submission as a smoke test. A provider-approved way
to probe the form would restore automated reachability verification.
