#!/usr/bin/env tsx
/**
 * Watch open agent tasks (Copilot-assigned issues and `jules`-labeled issues)
 * and report which are stalled.
 *
 * Usage:
 *   tsx scripts/agent-task-monitor.ts [--repo <owner/name>] [--stall-hours <n>] [--json]
 *
 * Requires: `gh` CLI authenticated.
 */
import { execSync } from 'node:child_process'

function getArg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

const repo = getArg('repo') ?? sh('gh repo view --json nameWithOwner --jq .nameWithOwner')
const stallHours = Number(getArg('stall-hours', '24'))
const asJson = process.argv.includes('--json')

function sh(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

type Issue = {
  number: number
  title: string
  url: string
  updatedAt: string
  assignees: { login: string }[]
  labels: { name: string }[]
}

const raw = sh(
  `gh issue list --repo ${repo} --state open --limit 100 --json number,title,url,updatedAt,assignees,labels`,
)
const issues: Issue[] = JSON.parse(raw)

const now = Date.now()
const stallMs = stallHours * 60 * 60 * 1000

const tasks = issues
  .filter(
    (i) =>
      i.assignees.some((a) => a.login.toLowerCase().includes('copilot')) ||
      i.labels.some((l) => l.name === 'jules'),
  )
  .map((i) => {
    const ageMs = now - new Date(i.updatedAt).getTime()
    return {
      number: i.number,
      title: i.title,
      url: i.url,
      agent: i.assignees.find((a) => a.login.toLowerCase().includes('copilot'))?.login ?? 'jules',
      hours_since_update: Math.round(ageMs / (60 * 60 * 1000)),
      stalled: ageMs > stallMs,
    }
  })
  .sort((a, b) => b.hours_since_update - a.hours_since_update)

if (asJson) {
  console.log(JSON.stringify(tasks, null, 2))
} else {
  const stalled = tasks.filter((t) => t.stalled)
  console.log(`# Agent task monitor — ${repo}`)
  console.log(`Stall threshold: ${stallHours}h. Total agent tasks: ${tasks.length}. Stalled: ${stalled.length}.`)
  console.log('')
  for (const t of tasks) {
    const marker = t.stalled ? '!!' : '  '
    console.log(`${marker} #${t.number}  ${t.hours_since_update}h  ${t.agent}  ${t.title}`)
  }
}
