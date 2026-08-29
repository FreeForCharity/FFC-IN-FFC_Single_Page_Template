#!/usr/bin/env node
/**
 * SessionStart hook for Claude Code.
 *
 * Two jobs:
 *  1. Make sure dependencies are installed, so lint / test / build / e2e
 *     actually run in a fresh web or container session. Without node_modules
 *     the pre-commit checklist silently can't execute. Installs ONLY when
 *     node_modules is missing, so warm sessions start instantly.
 *  2. Print a short reminder (added to the model's context) of the
 *     pre-commit checklist and the guardrails this repo enforces.
 *
 * Never fails the session: any error is reported as a note and we exit 0.
 */

import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const notes = []

if (existsSync('package.json') && !existsSync('node_modules')) {
  notes.push('Installing dependencies (node_modules missing) so lint/test/build can run…')
  const res = spawnSync('npm', ['install', '--no-audit', '--no-fund'], {
    stdio: 'ignore',
    timeout: 300000,
  })
  notes.push(
    res.status === 0
      ? 'Dependencies installed.'
      : 'npm install did not complete cleanly — run `npm install` manually before relying on lint/test/build.'
  )
}

const context = `FFC template session — quality & security guardrails are active:
- PreToolUse hooks block dangerous shell commands and writes of secret files/content.
- PostToolUse formats edited files with Prettier automatically.
Before committing, run the checklist in order: npm run format → npm run lint → npm run check:drift → npm test → npm run build → npm run test:e2e.
Conventions: kebab-case route folders, assetPath() for all asset references, Conventional Commits, never commit secrets.${
  notes.length ? '\n\nSession setup:\n- ' + notes.join('\n- ') : ''
}`

// SessionStart stdout is added to the session context.
process.stdout.write(context + '\n')
process.exit(0)
