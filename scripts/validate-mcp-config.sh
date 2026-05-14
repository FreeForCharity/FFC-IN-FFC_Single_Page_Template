#!/usr/bin/env bash
# Validate .copilot/mcp-config.json (and any mcp.*.json example files) for:
#   - parseable JSON
#   - required top-level "mcpServers" object
#   - per-entry required keys (type + url OR command)
#   - secrets are not committed (placeholders only)
#
# Exit codes: 0 pass, 1 fail.
# Closes #228.
set -euo pipefail

fail=0
err() { echo "  ❌ $*"; fail=1; }
ok()  { echo "  ✅ $*"; }

check_file () {
  local f="$1"
  echo "Checking $f ..."
  if ! command -v jq >/dev/null 2>&1; then
    err "jq is required (apt-get install jq, brew install jq)"
    return
  fi
  if [ ! -f "$f" ]; then
    err "file not found"
    return
  fi
  if ! jq empty "$f" >/dev/null 2>&1; then
    err "invalid JSON"
    return
  fi
  ok "valid JSON"

  if ! jq -e '.mcpServers | type == "object"' "$f" >/dev/null; then
    err "missing top-level \"mcpServers\" object"
    return
  fi
  ok "has mcpServers"

  local servers
  servers=$(jq -r '.mcpServers | keys[]' "$f")
  while IFS= read -r name; do
    [ -z "$name" ] && continue
    local entry
    entry=$(jq -c --arg n "$name" '.mcpServers[$n]' "$f")
    local has_url has_cmd t
    has_url=$(jq -r 'has("url")' <<<"$entry")
    has_cmd=$(jq -r 'has("command")' <<<"$entry")
    t=$(jq -r '.type // empty' <<<"$entry")
    if [ "$has_url" != "true" ] && [ "$has_cmd" != "true" ]; then
      err "[$name] missing both \"url\" and \"command\""
    else
      ok "[$name] has url or command ($t)"
    fi
    # secret leak check
    if jq -r '.. | strings?' <<<"$entry" | grep -qiE '(ghp_|gho_|sk-|Bearer [A-Za-z0-9]{20,})'; then
      err "[$name] looks like it contains a real secret. Use a placeholder + env var."
    fi
  done <<<"$servers"
}

# Targets
TARGETS=(".copilot/mcp-config.json")
[ -f "mcp.json.example" ]        && TARGETS+=("mcp.json.example")
[ -f "mcp.bearer.json.example" ] && TARGETS+=("mcp.bearer.json.example")

for f in "${TARGETS[@]}"; do
  check_file "$f"
  echo ""
done

if [ "$fail" -ne 0 ]; then
  echo "MCP config validation FAILED."
  exit 1
fi
echo "MCP config validation passed."
