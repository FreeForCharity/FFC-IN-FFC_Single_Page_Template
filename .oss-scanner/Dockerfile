# Build image for Anthropic OSS Scanner (https://github.com/anthropics/oss-scanner).
#
# Contract (from the scanner's templates/Dockerfile):
#   - the build context is this repository, and the checkout must live at /src;
#   - the network is available while this file builds and is REMOVED afterwards,
#     so every dependency the audit agent needs (node_modules, the Playwright
#     browser, the built site) has to be fetched here;
#   - a failing RUN fails the build and emails the log to primary_contact, so
#     only steps that must work are allowed to fail the build.
#
# CI builds this image and runs the unit tests in it with --network none
# (.github/workflows/oss-scanner-image.yml), so a change that breaks the
# offline audit fails a PR here instead of surfacing as a scanner email.
#
# The base image is pinned by digest; Dependabot (docker ecosystem,
# directory /.oss-scanner) keeps the digest current.
FROM node:24-bookworm@sha256:3d27e5c11e5786e309ec3e03f93ae536eb36e6e5eb3714d5eb3300a36157add0

ENV CI=true \
    NEXT_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# scanner contract: the checkout lives inside the image, at /src
COPY . /src
WORKDIR /src

# pnpm version comes from package.json "packageManager", exactly as CI uses it.
RUN corepack enable && corepack install

# Same install CI runs. --frozen-lockfile: the audit must see the locked
# dependency tree, not whatever resolves today.
RUN pnpm install --frozen-lockfile

# Chromium plus its system libraries, so `pnpm run test:e2e` works offline.
RUN pnpm exec playwright install --with-deps chromium

# Build the static export exactly as CI does. out/ is the artifact that ships.
# `prebuild` runs scripts/fetch-events.mjs; with no EVENTS_* variables set it
# keeps the committed src/data/events.generated.json snapshot and exits 0.
RUN pnpm run build

# Cheap checks that prove the image works; reported, never fatal.
RUN pnpm test || echo "WARNING: unit tests reported failures"

# Where things are, for the audit agent (also described in threat_model.md):
#   src/            the Next.js app (App Router, static export)
#   out/            the built site that GitHub Pages serves
#   scripts/        Node build/guard scripts run in CI; fetch-events.mjs
#                   parses UNTRUSTED ICS / Facebook Graph feeds
#   src/lib/events/ parsers, URL sanitising and JSON-LD for those events
#   __tests__/      Jest unit tests      -> pnpm test
#   tests/          Playwright e2e tests -> pnpm run test:e2e (serves out/ locally)
