#!/usr/bin/env bash
# Compose a daily status report for an FFC site. Concatenates data from several
# optional sources into a single markdown document. Each section is rendered
# only if its data file (or command) is available, so unused sections silently
# disappear instead of erroring.
#
# Usage:
#   bash scripts/build-daily-report.sh [--out path] [--repo owner/name]
#
# Env / inputs:
#   REPO         (or --repo)  GitHub repo for PR/issue stats. Defaults to current repo.
#   GA_REPORT    JSON file with GA metrics produced by ga-report workflow.
#   BROKEN_LINKS markdown file from broken-link-checker workflow.
#
# Closes #229.
set -euo pipefail

OUT=""
REPO_ARG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --out)  OUT="$2"; shift 2 ;;
    --repo) REPO_ARG="$2"; shift 2 ;;
    *)      echo "unknown flag $1"; exit 2 ;;
  esac
done

REPO="${REPO_ARG:-${REPO:-$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || echo "")}}"

ts="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

emit () { if [ -n "$OUT" ]; then echo "$@" >> "$OUT"; else echo "$@"; fi }

[ -n "$OUT" ] && : > "$OUT"

emit "# Daily report — $ts"
emit ""
emit "Repo: \`${REPO:-unknown}\`"
emit ""

if [ -n "$REPO" ] && command -v gh >/dev/null 2>&1; then
  emit "## Open PRs"
  emit ""
  gh pr list --repo "$REPO" --state open --json number,title,author,createdAt --limit 20 \
    --jq '.[] | "- #\(.number) \(.title) — @\(.author.login)"' | while read -r line; do emit "$line"; done
  emit ""

  emit "## CI runs (last 24h, failed)"
  emit ""
  gh run list --repo "$REPO" --limit 50 --json conclusion,name,createdAt,url \
    --jq '.[] | select(.conclusion=="failure") | "- [\(.name)](\(.url)) — \(.createdAt)"' \
    | head -20 | while read -r line; do emit "$line"; done
  emit ""
fi

if [ -n "${GA_REPORT:-}" ] && [ -f "$GA_REPORT" ]; then
  emit "## Analytics (last period)"
  emit ""
  emit '```json'
  cat "$GA_REPORT" | while IFS= read -r l; do emit "$l"; done
  emit '```'
  emit ""
fi

if [ -n "${BROKEN_LINKS:-}" ] && [ -f "$BROKEN_LINKS" ]; then
  emit "## Broken links"
  emit ""
  cat "$BROKEN_LINKS" | while IFS= read -r l; do emit "$l"; done
  emit ""
fi

[ -n "$OUT" ] && echo "wrote $OUT" >&2 || true
