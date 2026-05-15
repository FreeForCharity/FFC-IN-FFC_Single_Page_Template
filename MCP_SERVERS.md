# MCP Servers

Catalog of Model Context Protocol servers wired up in this template and what
each one is for. Configured in [`.copilot/mcp-config.json`](./.copilot/mcp-config.json)
for the GitHub Copilot coding agent and in [`mcp.json.example`](./mcp.json.example)
for Claude Desktop and equivalent clients.

> See [`MCP_QUICK_REFERENCE.md`](./MCP_QUICK_REFERENCE.md) for copy-paste setup
> snippets.

## Catalog

| Server             | Publisher       | Transport | Auth                          | Risk tier | What it provides                                                  |
|--------------------|-----------------|-----------|-------------------------------|-----------|-------------------------------------------------------------------|
| `github`           | GitHub, Inc.    | HTTP/SSE  | OAuth (Copilot) / PAT (Desktop) | Low       | Repos, issues, PRs, code search, code security, actions          |
| `microsoft-learn`  | Microsoft       | HTTP/SSE  | None                          | Low       | Microsoft Docs / Learn content search                            |
| `cloudflare`       | Cloudflare      | HTTP/SSE  | `CLOUDFLARE_API_TOKEN`        | Low       | DNS, Pages, Workers, R2, KV, D1, Hyperdrive                      |
| `google-analytics` | Google          | HTTP/SSE  | Service account               | Low       | GA Data API queries against the configured property              |

Risk tiers follow the FFC scheme:

- **Low** — first-party server from a major publisher with stable maintenance.
- **Medium** — community-maintained, multiple contributors, active in the
  last 90 days.
- **High** — single-maintainer, niche, or stale. Adopt with caution.

## Adding or removing a server

1. Edit `.copilot/mcp-config.json` to add the entry. Required keys per entry:
   - `type` (or omit for stdio-launched servers with `command`)
   - `url` **or** `command` / `args`
   - `headers` / `env` for auth, referencing `${VAR}` placeholders — never
     hard-code secrets.
2. Run `npm run validate:mcp` to validate JSON, required keys, and check that
   no committed value looks like a real token.
3. Document the new server in this file's table.
4. Open a PR.

## Auth pattern

All MCPs that need credentials reference `${VAR}` placeholders. Tokens live in:

- **Copilot agent runtime:** repo secrets (Settings → Secrets and variables → Actions).
- **Claude Desktop / local:** `mcp.json` (gitignored — copy from `mcp.json.example`).
- **CI workflows:** `${{ secrets.NAME }}` and `${{ vars.NAME }}`.

If you have leaked a token, rotate it in the issuing platform first, then update
the relevant secret store. The repo's `01-security.md` rule prevents agents from
echoing secrets in any committed text.

## Out of scope

MCP servers tied to research / survey integrations (e.g., Qualtrics, Zotero,
Prolific) are not part of this template — those live in the consuming site
repo if needed.
