# MCP Quick Reference

Copy-paste setup snippets for the MCP servers cataloged in
[`MCP_SERVERS.md`](./MCP_SERVERS.md).

## 1. GitHub Copilot Coding Agent

Already wired in `.copilot/mcp-config.json`. To extend:

```json
{
  "mcpServers": {
    "new-server-name": {
      "type": "http",
      "url": "https://example.com/mcp",
      "tools": ["*"],
      "headers": { "Authorization": "Bearer ${NEW_SERVER_TOKEN}" }
    }
  }
}
```

Then add `NEW_SERVER_TOKEN` as a repository secret.

## 2. Claude Desktop

Copy `mcp.json.example` to your local Claude Desktop config and replace
placeholders:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Restart Claude Desktop after editing.

## 3. VS Code / Cursor / Cline

These clients read `~/.cursor/mcp.json` (or the editor-specific equivalent).
The schema matches `mcp.json.example`. Bearer-style entries use
`mcp.bearer.json.example`.

## 4. Validating your config

```bash
npm run validate:mcp
```

Fails when:

- JSON is invalid
- A server entry is missing both `url` and `command`
- A value looks like a real token (heuristic match on `ghp_`, `gho_`, `sk-`,
  long `Bearer` headers)

## 5. Tokens — where they live

| Use case            | Storage                                      |
| ------------------- | -------------------------------------------- |
| CI workflows        | `Settings → Secrets and variables → Actions` |
| Copilot agent       | Same as CI workflows                         |
| Local dev (Desktop) | `mcp.json` (gitignored)                      |
| Local dev (bearer)  | `mcp.bearer.json` (gitignored)               |

Rotate via the issuing platform first, then update the secret store.

## 6. Per-server quick references

### GitHub MCP

| Capability      | Toolset name        |
| --------------- | ------------------- |
| Repos           | `repos`             |
| Issues          | `issues`            |
| PRs             | `pull_requests`     |
| Code security   | `code_security`     |
| Secret scanning | `secret_protection` |
| Actions         | `actions`           |
| Web search      | `web_search`        |

Set via the `X-MCP-Toolsets` header (comma-separated).

### Cloudflare MCP

Needs `CLOUDFLARE_API_TOKEN` with at minimum:

- Zone:Read
- DNS:Edit
- Pages:Edit

For Workers / R2 / KV / D1 / Hyperdrive features, scope the token accordingly.

### Google Analytics MCP

Needs a service account with **Viewer** on the GA property:

- `GA_PROPERTY_ID`
- `GA_SERVICE_ACCOUNT_EMAIL`
- `GA_PRIVATE_KEY` (multi-line; preserve `\n` in the secret value)

Same credentials power `ga-api-smoke.yml`, `ga-report.yml`, and `seo-metrics.yml`.
