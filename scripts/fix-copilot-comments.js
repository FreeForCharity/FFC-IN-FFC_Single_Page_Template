#!/usr/bin/env node
/**
 * Resolve Copilot review threads whose flagged hunk no longer exists in the latest commit.
 *
 * Usage:
 *   node scripts/fix-copilot-comments.js --pr <number> [--dry-run]
 *
 * Requires: `gh` CLI authenticated.
 */
const { execSync } = require('node:child_process')

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return fallback
  return process.argv[i + 1]
}

const pr = arg('pr')
const dryRun = process.argv.includes('--dry-run')
if (!pr) {
  console.error('--pr <number> is required')
  process.exit(2)
}

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

const repo = sh('gh repo view --json nameWithOwner --jq .nameWithOwner')

// Fetch all review threads via GraphQL
const query = `
  query($owner: String!, $name: String!, $pr: Int!) {
    repository(owner: $owner, name: $name) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            isOutdated
            comments(first: 1) {
              nodes { author { login } path originalLine }
            }
          }
        }
      }
    }
  }
`

const [owner, name] = repo.split('/')
const out = sh(`gh api graphql -F owner=${owner} -F name=${name} -F pr=${pr} -f query='${query}'`)
const data = JSON.parse(out)
const threads = data.data.repository.pullRequest.reviewThreads.nodes

const targets = threads.filter((t) => {
  if (t.isResolved) return false
  const author = t.comments.nodes[0]?.author?.login ?? ''
  if (!author.toLowerCase().includes('copilot')) return false
  return t.isOutdated
})

console.log(`Found ${targets.length} outdated Copilot threads on PR #${pr}.`)

if (!dryRun) {
  for (const t of targets) {
    sh(
      `gh api graphql -F id=${t.id} -f query='mutation($id: ID!) { resolveReviewThread(input: { threadId: $id }) { thread { id } } }'`
    )
    console.log(`resolved ${t.id}`)
  }
}
