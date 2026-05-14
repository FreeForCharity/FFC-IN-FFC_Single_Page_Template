<#
.SYNOPSIS
  Tail a running GitHub Actions workflow run from the terminal.

.DESCRIPTION
  Wraps `gh run watch`. If no run ID is given, picks the most recent run on
  the current branch. Useful for Windows-based FFC contributors who don't have
  a pleasant equivalent of POSIX `gh run watch | tee`.

.PARAMETER RunId
  Specific run ID to watch. Optional.

.PARAMETER IntervalSeconds
  Poll interval (default 5).
#>
[CmdletBinding()]
param(
    [string]$RunId,
    [int]$IntervalSeconds = 5
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error 'gh CLI is required. Install from https://cli.github.com/.'
    exit 2
}

if (-not $RunId) {
    $branch = (git rev-parse --abbrev-ref HEAD).Trim()
    Write-Host "No run ID given. Looking up latest run on '$branch'..."
    $RunId = (gh run list --branch $branch --limit 1 --json databaseId --jq '.[0].databaseId').Trim()
    if (-not $RunId) {
        Write-Error "No runs found on branch '$branch'."
        exit 1
    }
}

Write-Host "Watching run $RunId (poll every ${IntervalSeconds}s, Ctrl+C to stop)..."
gh run watch $RunId --interval $IntervalSeconds --exit-status
