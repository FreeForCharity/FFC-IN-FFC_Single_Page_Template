#!/usr/bin/env tsx
/**
 * Watch every open PR and dispatch the copilot-review-cycle workflow for any PR
 * that is marked ready-for-review and has fewer than `--max-rounds` review rounds.
 *
 * This is the orchestration script. It is intentionally idempotent — running it
 * many times in a row produces the same state.
 *
 * Usage:
 *   tsx scripts/copilot-review-loop.ts [--repo owner/name] [--max-rounds 7]
 *
 * Closes #206 (loop portion).
 */
import { execSync } from 'node:child_process'

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

function sh(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

const repo = arg('repo') ?? sh('gh repo view --json nameWithOwner --jq .nameWithOwner')
const maxRounds = arg('max-rounds', '7')!

type PR = { number: number; isDraft: boolean; reviewDecision: string | null; title: string }

const prs: PR[] = JSON.parse(
  sh(`gh pr list --repo ${repo} --state open --json number,isDraft,reviewDecision,title --limit 50`)
)

for (const pr of prs) {
  if (pr.isDraft) {
    console.error(`#${pr.number} draft — skipping`)
    continue
  }
  if (pr.reviewDecision === 'APPROVED') {
    console.error(`#${pr.number} approved — skipping`)
    continue
  }
  console.error(`dispatching review cycle for #${pr.number}: ${pr.title}`)
  try {
    sh(
      `gh workflow run copilot-review-cycle.yml --repo ${repo} -f pr_number=${pr.number} -f max_rounds=${maxRounds}`
    )
  } catch (err) {
    console.error(`  failed to dispatch: ${(err as Error).message}`)
  }
}
