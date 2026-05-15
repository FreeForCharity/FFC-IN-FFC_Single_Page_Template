# GitHub Copilot Agent Setup

How to wire the GitHub Copilot coding agent — and the Google Jules agent —
for a new FFC charity site forked from this template.

## 1. Enable Copilot for the repo

1. Org admin: confirm the Copilot organization plan is active and the repo's
   org is opted into Copilot coding agent.
2. Repo admin: `Settings → Code & automation → Copilot → Coding agent` → enable.

If you do not see the option, the org has not opted in. File a ticket with
the FFC org admin team.

## 2. Verify MCP config is loaded

The Copilot coding agent reads `.copilot/mcp-config.json` from this repo.
After enabling Copilot, open any issue, assign it to `Copilot`, and confirm
that Copilot can read repo files (the GitHub MCP is wired by default).

To extend with Cloudflare / Google Analytics MCPs (already in
[`.copilot/mcp-config.json`](./.copilot/mcp-config.json)), set the following
repository secrets:

| Secret                       | Used by                  |
|------------------------------|--------------------------|
| `CLOUDFLARE_API_TOKEN`       | Cloudflare MCP           |
| `CLOUDFLARE_ACCOUNT_ID`      | Cloudflare MCP           |
| `GA_PROPERTY_ID`             | Google Analytics MCP, GA workflows |
| `GA_SERVICE_ACCOUNT_EMAIL`   | Google Analytics MCP, GA workflows |
| `GA_PRIVATE_KEY`             | Google Analytics MCP, GA workflows |

## 3. Validate the config locally

```bash
npm run validate:mcp
```

Catches malformed JSON, missing required keys, and accidental token commits.
The same script runs in CI; commits that break it will fail their check.

## 4. Dispatch a dry-run review cycle

To confirm the review cycle works end-to-end against a no-op PR:

1. Open a draft PR with a trivial change (a typo fix in a doc file).
2. Mark it ready for review.
3. The `auto-review-on-ready.yml` workflow will dispatch
   `copilot-review-cycle.yml` automatically.
4. Or trigger manually: `gh workflow run copilot-review-cycle.yml -f pr_number=<n>`.

You should see Copilot post a review comment within 2–3 minutes. The cycle
will stop after one round if nothing further is flagged.

## 5. Stalled-task recovery

If Copilot's assigned issue is stuck (no activity > 24 h), the daily
`retrigger-stalled-agent-tasks.yml` workflow will retrigger by removing and
re-adding the `Copilot` assignee. To target a single issue manually:

```bash
gh workflow run retrigger-stalled-agent-tasks.yml -f issue_number=42
```

Use `-f dry_run=true` to preview before retriggering.

## 6. Google Jules agent

To enable Jules:

1. Provision Jules access in Google Cloud Console (per-org).
2. Add the `JULES_TOKEN` repository secret.
3. Label any issue with `jules` to hand it off. The `jules-on-label.yml`
   workflow comments on the issue with FFC conventions and invokes Jules.

Without `JULES_TOKEN` the workflow degrades gracefully — it comments on the
issue but does not invoke Jules.

## 7. Multi-agent etiquette

See [`.agent/workflows/pull_request_protocol.md`](./.agent/workflows/pull_request_protocol.md)
for the shared branch-naming, commit-format, and review-cycle conventions.

## 8. Troubleshooting

| Symptom                                            | Likely cause / fix                                    |
|----------------------------------------------------|--------------------------------------------------------|
| Workflows stuck `action_required`                  | `auto-approve-bot-workflows.yml` runs every 15 min   |
| Copilot review cycle fails immediately             | Required secrets missing — see step 2                 |
| Jules comment appears but no PR follows            | `JULES_TOKEN` not configured — step 6                 |
| MCP config validation fails on commit              | Run `npm run validate:mcp` locally to see the error  |

## Out of scope

- Copilot org-level billing / seat management
- Provisioning Cloudflare or Google Cloud accounts themselves
