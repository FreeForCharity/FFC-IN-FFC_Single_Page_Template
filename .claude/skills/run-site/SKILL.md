---
name: run-site
description: Build, run, and drive this FFC static site. Use when asked to start, build, preview, screenshot, or interact with the site, or verify a page renders. Static Next.js export driven with headless Chromium via .claude/skills/run-site/driver.mjs.
---

This repo is a Next.js **static export** (`output: 'export'` → `out/`). "Running
it" means building the export, serving `out/` over HTTP, and driving a headless
Chromium against it with `.claude/skills/run-site/driver.mjs` — which navigates
routes, screenshots each full page, and fails on real errors (bad HTTP status,
uncaught page errors, or same-origin request failures).

All paths below are relative to the repo root.

## Prerequisites

No `apt-get` needed in the Claude Code web container: Node and a Chromium build
are already present. The driver launches the pre-installed browser at
`/opt/pw-browsers/chromium` (override with `CHROME_PATH=...`). **In that
container** you do **not** run `npx playwright install` — the repo's pinned
Playwright may want a different browser build than the container ships, and
pointing at the existing one avoids the mismatch. On a local machine or CI
without a pre-installed browser, run `npx playwright install chromium` once, or
set `CHROME_PATH` to a system Chrome/Chromium.

## Setup

```bash
npm install
```

## Build

```bash
npm run build      # static export → out/. Do not cancel.
```

## Run (agent path)

Serve the export in the background, wait for the port, then drive it:

```bash
# 1. Serve out/ on :3000 (this is `npm run preview`)
nohup npm run preview >/tmp/preview.log 2>&1 &
echo $! > /tmp/preview.pid
timeout 30 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'

# 2. Drive it — screenshots the default route set (/)
node .claude/skills/run-site/driver.mjs

# 3. Stop the server when done
kill $(cat /tmp/preview.pid)
```

Screenshots (full-page) land in `.claude/skills/run-site/screenshots/<slug>.png`.
**Open them** — a green run only means nothing threw; look at the image to
confirm the page rendered.

### driver.mjs usage

| invocation                                             | what it does                                       |
| ------------------------------------------------------ | -------------------------------------------------- |
| `node .../driver.mjs`                                  | Smoke the default route set (`/`, or `ROUTES=...`) |
| `node .../driver.mjs / /privacy-policy/`               | Screenshot specific routes                         |
| `ROUTES="/,/about/,/contact/" node .../driver.mjs`     | Override the default route set                     |
| `EXPECT="Some text" node .../driver.mjs /`             | Also assert the text is present in the HTML        |
| `BASE_URL=http://localhost:3000 node .../driver.mjs /` | Override the server origin (e.g. `npm run dev`)    |
| `CHROME_PATH=/path/to/chrome node .../driver.mjs`      | Use a different Chromium binary                    |

Exit code is 0 only when every route is clean, so it works in a script.

## Run (human path)

```bash
npm run dev        # → http://localhost:3000 with Turbopack HMR. Ctrl-C to stop.
```

On its own this is useless in a headless container, since there is no window to
view. Point the driver at it with `BASE_URL=http://localhost:3000` when
iterating on a component, because it rebuilds on save.

## Test

```bash
npm run lint       # eslint
npm run build      # verify the static export
npm run test       # jest unit/component tests — not the browser
npm run test:e2e   # playwright e2e — needs the pinned browser; see gotcha below
```

## Gotchas

- **Cross-origin request failures are not counted as bugs.** Any failed request
  to an origin other than the page's (a third-party embed, CDN, analytics, etc.)
  is counted and reported as "N third-party failed" — the driver does **not**
  fail the run on them; it only fails on same-origin problems. In this sandbox
  these are usually blocked embeds (`ERR_CONNECTION_RESET`), which render blank
  in screenshots as a result.
- **`ERR_ABORTED` request failures are prefetches, not bugs.** Next.js `<Link>`
  prefetches the RSC payload and aborts those requests on navigate. The driver
  drops any `requestfailed` whose error text contains `ERR_ABORTED` (regardless
  of host), so they never count against a route.
- **Trailing slashes matter.** The export writes `out/<route>/index.html`, so hit
  `/privacy-policy/`, not `/privacy-policy`.
- **The repo's Playwright browser build ≠ the container's.** `npm run test:e2e`
  and any bare `chromium.launch()` may try a build the container doesn't have and
  error with "Executable doesn't exist … run npx playwright install". Do not
  install; pass `executablePath: '/opt/pw-browsers/chromium'` (the driver does).

## Troubleshooting

- **`browserType.launch: Executable doesn't exist at …chrome-headless-shell`**:
  Playwright version/browser mismatch. Use the driver (it sets `executablePath`)
  or export `CHROME_PATH=/opt/pw-browsers/chromium`.
- **`EADDRINUSE` on :3000**: a previous server is still up. Stop it by pidfile
  (`kill $(cat /tmp/preview.pid)`) or port (`fuser -k 3000/tcp`). Avoid
  `pkill -f 'serve'` — that substring also matches the shell running it and kills
  your own command.
- **A route is slow to settle**: navigation is capped at 30s and the post-load
  `networkidle` wait at 5s (ignored on timeout), so a blocked third-party request
  delays a route by at most ~5s rather than hanging it. A route that exceeds the
  30s nav cap fails with a timeout.
