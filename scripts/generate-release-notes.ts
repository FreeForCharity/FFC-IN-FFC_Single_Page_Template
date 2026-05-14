#!/usr/bin/env tsx
/**
 * Generate release notes from Conventional Commits between the last tag and HEAD
 * (or between two explicit refs).
 *
 * Usage:
 *   tsx scripts/generate-release-notes.ts [--from <ref>] [--to <ref>] [--out <path>]
 *
 * Defaults: --from = latest tag, --to = HEAD, --out = stdout.
 */
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

type Group = {
  heading: string
  match: RegExp
  bullets: string[]
}

function sh(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

function getArg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

function latestTag(): string {
  try {
    return sh('git describe --tags --abbrev=0')
  } catch {
    return sh('git rev-list --max-parents=0 HEAD | tail -n1')
  }
}

const from = getArg('from', latestTag())!
const to = getArg('to', 'HEAD')!
const outPath = getArg('out')

const log = sh(`git log ${from}..${to} --pretty=format:%s---%h`).split('\n').filter(Boolean)

const groups: Group[] = [
  { heading: 'Features', match: /^feat(\(.+\))?:/i, bullets: [] },
  { heading: 'Bug fixes', match: /^fix(\(.+\))?:/i, bullets: [] },
  { heading: 'Performance', match: /^perf(\(.+\))?:/i, bullets: [] },
  { heading: 'Refactors', match: /^refactor(\(.+\))?:/i, bullets: [] },
  { heading: 'Tests', match: /^test(\(.+\))?:/i, bullets: [] },
  { heading: 'Docs', match: /^docs(\(.+\))?:/i, bullets: [] },
  { heading: 'Build / CI', match: /^(ci|build|chore)(\(.+\))?:/i, bullets: [] },
  { heading: 'Style', match: /^style(\(.+\))?:/i, bullets: [] },
]
const other: string[] = []

for (const line of log) {
  const [subject, hash] = line.split('---')
  if (!subject) continue
  const bullet = `- ${subject} (${hash})`
  const group = groups.find((g) => g.match.test(subject))
  if (group) group.bullets.push(bullet)
  else other.push(bullet)
}

const lines: string[] = []
lines.push(`# Release notes (${from}..${to})`, '')
for (const g of groups) {
  if (!g.bullets.length) continue
  lines.push(`## ${g.heading}`, '', ...g.bullets, '')
}
if (other.length) lines.push('## Other', '', ...other, '')

const out = lines.join('\n')

if (outPath) {
  writeFileSync(outPath, out)
  process.stderr.write(`wrote ${outPath}\n`)
} else {
  process.stdout.write(out)
}
