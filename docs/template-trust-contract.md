# Public site trust profile

`GET /site-profile.json` publishes `ffc.site-profile.v1` for generated-site tooling.
The prebuild generator writes `public/site-profile.json` from `getSiteTrustProfile()`
before every Next.js export using Node 24's native TypeScript loader. The committed
JSON is an inspectable sample; deployed JSON is regenerated from configuration.

`siteId` and `canonicalUrl` use the canonical configured URL including the deployed
basePath. All endpoint URLs use the same site URL helper, so apex and GitHub Pages
deployments work. A canonical URL change also changes this identifier; consumers
must treat this as a URL identity, not a database ID that survives domain moves.

`organization` publishes the configured owning charity's name, EIN and explicit
schema.org nonprofit status. Pending/empty EIN and missing nonprofit status are
null. It does not infer a legal name, country or tax status. `supportedBy` is
separate FFC attribution, never the owning charity's EIN or legal identity.

`contacts.primaryEmail` is the configured public contact (null when pending).
The profile links to security.txt; it does not claim that its primary email is
the security reporting address. The security.txt contact remains managed there.

`template` identifies the source template. `trust` describes static hosting and
the required pnpm checks, including unit coverage. These are declared expectations,
not evidence that a downstream site has passed them. No credentials or integration
settings are included. Consumers use `schemaVersion` as the compatibility key.
