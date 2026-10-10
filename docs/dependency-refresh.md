# Dependency refresh

The dependency refresh aligns Next.js and its lint/build tooling at 16.3.8,
uses Node 24 in the smoke workflow, and preserves the seven-day release cooldown.
Patched transitive versions are constrained by pnpm overrides so a new resolution
cannot reinstall vulnerable source-map-js, Sharp, YAML, URI, brace-expansion,
HTTP middleware, or browser-download dependencies.

The production audit has no known advisories. The full development audit still
reports braces (deeply nested pattern denial of service) and sprintf-js (unbounded
precision denial of service). Neither advisory has a published patched version.
They are development-only dependencies of lint/test tools; do not pass untrusted
patterns or format strings to those tools. These findings are not suppressed.

ESLint stays on version 9 because the React and accessibility plugins declare
support through that major. Next.js 16.4.0 is inside the release cooldown.

CI runs Jest with coverage, enforces the floors in jest.config.js, and retains
the unit-coverage artifact. Browser tests verify the rendered static site;
Lighthouse verifies the audit tooling after the transitive updates.
