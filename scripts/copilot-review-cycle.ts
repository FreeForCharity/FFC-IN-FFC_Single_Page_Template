#!/usr/bin/env tsx
/**
 * Run a multi-round Copilot review cycle on a PR.
 *
 * Each round: request a fresh Copilot review, wait for it to complete, capture
 * resulting comments / requested changes, and stop once Copilot has nothing
 * new to flag or `maxRounds` is reached.
 *
 * Optional `--auto-merge`: enable auto-merge once all required checks are green.
 *
 * Usage:
 *   tsx scripts/copilot-review-cycle.ts --pr <n> [--max-rounds 7] [--auto-merge] [--repo owner/name]
 *
 * Requires: `gh` CLI authenticated with `repo` + Copilot scopes.
 * Closes #206 (review-cycle portion).
 */
import { execSync } from 'node:child_process'

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

function sh(cmd: string, capture = true): string {
  return execSync(cmd, { encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' }).toString().trim()
}

const pr = arg('pr')
if (!pr) {
  console.error('--pr <number> is required')
  process.exit(2)
}
const repo = arg('repo') ?? sh('gh repo view --json nameWithOwner --jq .nameWithOwner')
const maxRounds = Number(arg('max-rounds', '7'))
const autoMerge = flag('auto-merge')

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

async function commentCount(): Promise<number> {
  const raw = sh(
    `gh api repos/${repo}/pulls/${pr}/comments --paginate --jq 'length'`,
  )
  return Number(raw || 0)
}

async function checksGreen(): Promise<boolean> {
  try {
    const out = sh(`gh pr checks ${pr} --repo ${repo} --required`)
    return !out.includes('fail') && !out.includes('pending')
  } catch {
    return false
  }
}

async function requestReview() {
  sh(`gh pr edit ${pr} --repo ${repo} --add-reviewer github-copilot[bot]`)
}

for (let round = 1; round <= maxRounds; round++) {
  console.error(`\n=== round ${round}/${maxRounds} ===`)
  const before = await commentCount()
  console.error(`comments before: ${before}`)
  await requestReview()
  // Give Copilot time to review. 90s is conservative.
  await sleep(90_000)
  const after = await commentCount()
  console.error(`comments after:  ${after}`)
  if (after === before) {
    console.error('No new comments — Copilot is done.')
    break
  }
}

if (autoMerge) {
  if (await checksGreen()) {
    sh(`gh pr merge ${pr} --repo ${repo} --auto --squash`)
    console.error('auto-merge enabled.')
  } else {
    console.error('checks not green — skipping auto-merge.')
  }
}
