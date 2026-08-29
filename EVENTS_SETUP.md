# Events Setup

This template aggregates **Google Calendar**, **Microsoft 365**, and **Facebook** events into a single branded section on the home page (`#events`). All three sources are optional; configure only the ones your charity uses.

Events are fetched **at build time** by `scripts/fetch-events.mjs` and persisted to `src/data/events.generated.json`. Nothing is fetched from the browser, so:

- No API tokens are ever shipped to clients.
- No third-party cookies are set by the events section.
- The section is fully renderable in a static export.

A scheduled GitHub Action (`.github/workflows/refresh-events.yml`) re-runs the fetch every 6 hours and, when the snapshot changed, opens (or updates) a pull request on the fixed `automation/events-refresh` branch. It never pushes to `main` — merging that PR is what deploys the refreshed snapshot through the normal pipeline.

## Quick start

1. Decide which sources you want to enable. Each is independent.
2. Add the matching secrets to your GitHub repo at **Settings → Secrets and variables → Actions**.
3. Manually trigger the **Refresh Events Snapshot** workflow once to populate `src/data/events.generated.json` (or wait up to 6 hours). It opens a PR on the `automation/events-refresh` branch when the snapshot changed.
4. Review and merge that PR; the Pages deploy workflow then publishes the refreshed snapshot.

With no sources configured and an empty committed snapshot, the whole section (and its footer quick-link) self-hides — the template ships in that state. Once at least one source is configured, a refresh with zero upcoming events shows a friendly empty state instead, linking to the Facebook page set in `siteConfig.integrations.eventsFacebookPageUrl` (`src/lib/site.config.ts`). Turn the section off entirely with `siteConfig.sections.showEvents = false`.

## Secrets

| Secret                         | Required for | What to paste                                                                     |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------- |
| `EVENTS_GOOGLE_ICS_URL`        | Google       | Public iCal address of the calendar you want to expose (see below)                |
| `EVENTS_MICROSOFT_ICS_URL`     | Microsoft    | Published ICS URL from Outlook on the web (see below)                             |
| `EVENTS_FACEBOOK_PAGE_ID`      | Facebook     | Numeric Page ID of the charity's Facebook page                                    |
| `EVENTS_FACEBOOK_ACCESS_TOKEN` | Facebook     | Long-lived Page Access Token with `pages_read_engagement` (rotate every ~60 days) |

> ⚠️ **Before you connect a calendar:** every event in the source feeds — title,
> description, location — will be published on the charity's public website and
> committed into the repo's git history. **Do not** point this at a staff-only
> calendar, fundraiser planning calendar, donor list, or anything containing
> attendee emails or personal data. Create a dedicated "Public Events" calendar
> and put only outward-facing events on it.

## Google Workspace for Nonprofits

1. Open [Google Calendar](https://calendar.google.com) signed in as the charity's nonprofit Workspace user.
2. Create (or pick) a calendar named something like "Public Events".
3. Hover the calendar in the left sidebar → **⋮** → **Settings and sharing**.
4. Under **Access permissions for events**, check **"Make available to public"** and choose **"See all event details"**.
5. Scroll down to **Integrate calendar** and copy the **"Secret address in iCal format"**.
6. Paste that URL into the `EVENTS_GOOGLE_ICS_URL` secret.

> The "secret address" URL acts as a capability token. Treat it as a secret even though the calendar itself is public — anyone with the URL can poll the feed without rate limits being attributed to you.

## Microsoft 365 Business Standard for Nonprofits

1. Open [Outlook on the web](https://outlook.office.com/calendar) signed in as the charity's Microsoft 365 user.
2. Settings (gear) → **View all Outlook settings** → **Calendar** → **Shared calendars**.
3. Under **Publish a calendar**, pick the calendar you want to expose.
4. Permissions: **"Can view all details"**. Click **Publish**.
5. Copy the **ICS link** (it ends in `.ics`).
6. Paste that URL into the `EVENTS_MICROSOFT_ICS_URL` secret.

> Outlook regenerates the link if you republish; rotate the secret whenever you do.

## Facebook for Nonprofits

1. Become an admin of the charity's Facebook page.
2. Open the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) signed in with that account.
3. Create or select a Meta App (any type — "Business" is fine). Note the **App ID** and **App Secret** for later.
4. In the Explorer, **Generate Access Token** with the `pages_read_engagement` permission. You'll get a short-lived user token.
5. Get the long-lived page token (~60-day validity):

   ```bash
   # 1) Exchange short-lived user token for long-lived user token
   curl "https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_USER_TOKEN}"

   # 2) Get the page access token using the long-lived user token
   curl "https://graph.facebook.com/v23.0/{PAGE_ID}?fields=access_token&access_token={LONG_LIVED_USER_TOKEN}"
   ```

6. Paste the `access_token` field from step 2 into `EVENTS_FACEBOOK_ACCESS_TOKEN`.
7. Paste the numeric Page ID into `EVENTS_FACEBOOK_PAGE_ID`.

### Token rotation

Page Access Tokens expire roughly every 60 days. Set a calendar reminder for day 55 to rerun step 5 and update the GitHub secret. The script logs a warning and skips the source on auth failure, so a missed rotation degrades the section gracefully instead of breaking the build.

## Local development

`npm run dev` does not need any of these secrets — it reads whatever is already committed in `src/data/events.generated.json`. To preview real data locally:

```bash
EVENTS_GOOGLE_ICS_URL="https://..." \
EVENTS_MICROSOFT_ICS_URL="https://..." \
EVENTS_FACEBOOK_PAGE_ID="123" \
EVENTS_FACEBOOK_ACCESS_TOKEN="EAAB..." \
node scripts/fetch-events.mjs
```

Then run `npm run dev` and visit `#events`.

## Troubleshooting

| Symptom                                  | Likely cause                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Section hidden despite secrets set       | Secrets only reach the refresh workflow, not deploy builds — the section appears once a refresh PR with events has merged (or a build runs with EVENTS_* variables set). Also check `siteConfig.sections.showEvents`. |
| Empty state shown despite secrets set    | The refresh workflow hasn't run yet (or its PR is unmerged) — trigger **Refresh Events Snapshot** manually and merge its PR.  |
| All sources missing from snapshot        | Check the workflow logs — each source logs the exact reason it was skipped.                              |
| Facebook events disappear after ~60 days | Token expired — rotate per the section above.                                                            |
| Events appear in wrong time zone         | All-day events use UTC; timed events show the source's `TZID`. Compare with the calendar's own settings. |
| Build keeps the old snapshot             | Intentional: if a fetch returns 0 events we keep the last good snapshot to avoid wiping the section.     |

## Related files

- `src/lib/events/` — Types, config helpers, ICS + Facebook parsers, format/grouping/add-to-calendar utilities.
- `src/components/home-page/Events/` — Section component, cards, badges, empty state, add-to-calendar menu.
- `scripts/fetch-events.mjs` — Build-time aggregation script (also invoked by `prebuild`).
- `.github/workflows/refresh-events.yml` — Scheduled refresh workflow (opens a PR; never pushes to `main`).
- `__tests__/lib/events/` — Unit tests for parsers and helpers.
- `__tests__/components/Events.test.tsx` — Component-level and a11y tests.
- `tests/events.spec.ts` — Playwright E2E spec.
