# FFC site profile / template trust contract

Wave 1A adds a small machine-readable profile that generated nonprofit sites and ffcadmin can consume without scraping page content.

## Endpoint

Every generated site should expose:

- `GET /site-profile.json`

The checked-in static file `public/site-profile.json` is copied to the static export at that path. `src/lib/site.config.ts` also exports the typed `siteTrustProfile` / `getSiteTrustProfile()` helpers so application code and tests can verify the public JSON contract against the site's metadata source of truth.

## Schema version

Current version: `ffc.site-profile.v1`

Consumers should treat `schemaVersion` as the compatibility key. Additive fields may be introduced under the same version; breaking changes should use a new version string.

## Contract fields

- `schemaVersion`: profile contract version.
- `siteId`: stable machine ID for this generated site.
- `siteName`: display name for dashboards and audit logs.
- `canonicalUrl`: production origin with no trailing slash.
- `organization`: nonprofit identity fields safe to publish (`name`, `legalName`, `ein`, `nonprofitStatus`, `country`).
- `template`: source template family, repository, branch, and issue used for parity tracking.
- `contacts`: public contact emails and the vulnerability disclosure path.
- `profileEndpoints`: stable public endpoints ffcadmin can check (`/site-profile.json`, `/.well-known/security.txt`, `/sitemap.xml`, `/robots.txt`).
- `trust`: declarative trust posture for generated sites. This intentionally includes no credentials, settings secrets, DNS writes, or production controls.

## Example

```json
{
  "schemaVersion": "ffc.site-profile.v1",
  "siteId": "ffc-working-site-1",
  "siteName": "Free For Charity",
  "canonicalUrl": "https://ffcworkingsite1.org",
  "organization": {
    "name": "Free For Charity",
    "legalName": "Free For Charity",
    "ein": "46-2471893",
    "nonprofitStatus": "us-501c3",
    "country": "US"
  },
  "template": {
    "family": "ffc-single-page-template",
    "repository": "FreeForCharity/FFC-IN-FFC_Single_Page_Template",
    "branch": "main",
    "issue": "https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template/issues/195"
  },
  "contacts": {
    "primaryEmail": "security@freeforcharity.org",
    "securityEmail": "security@freeforcharity.org",
    "vulnerabilityDisclosurePath": "/vulnerability-disclosure-policy"
  },
  "profileEndpoints": {
    "siteProfile": "/site-profile.json",
    "securityTxt": "/.well-known/security.txt",
    "sitemap": "/sitemap.xml",
    "robots": "/robots.txt"
  },
  "trust": {
    "generatedBy": "Free For Charity template factory",
    "hosting": "github-pages-static-export",
    "requiresHttps": true,
    "managesSecrets": false,
    "productionDnsManagedHere": false,
    "requiredChecks": [
      "npm run format:check",
      "npm run lint",
      "npm test",
      "npm run build",
      "npm run test:e2e",
      "npm run check:drift"
    ]
  }
}
```

## Customizing a generated site

When cloning this template for another nonprofit, update `siteConfig` and `siteTrustProfile` in `src/lib/site.config.ts`, then mirror the same public data in `public/site-profile.json`. The Jest contract test fails if the static JSON drifts from the typed profile. Keep `profileEndpoints` stable unless the route structure changes across the whole fleet.

The contract must remain public-data-only. Do not add API keys, GitHub tokens, DNS provider settings, private admin URLs, or deployment secrets.
