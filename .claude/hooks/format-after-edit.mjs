#!/usr/bin/env node
/**
 * PostToolUse(Write|Edit|MultiEdit) formatter for Claude Code.
 *
 * After the AI edits a file, run Prettier on just that file so the change
 * already satisfies the `npm run format:check` gate in CI. This keeps the AI
 * from generating a diff that is correct but fails formatting — a common,
 * avoidable round-trip.
 *
 * Non-blocking by design: this hook never fails the tool call. If Prettier
 * is not installed yet (fresh checkout) or the file type is unsupported, it
 * quietly does nothing and exits 0. Prettier honors .prettierignore on its
 * own, so ignored paths are left untouched.
 */

import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { extname } from 'node:path'

async function readInput() {
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

// Extensions Prettier can parse with the config in this repo. Restricting to
// these avoids noisy "No parser could be inferred" errors on other files.
const FORMATTABLE = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.css',
  '.scss',
  '.html',
  '.yml',
  '.yaml',
])

const input = await readInput()
const filePath = String(input?.tool_input?.file_path ?? '')

if (!filePath || !FORMATTABLE.has(extname(filePath).toLowerCase())) process.exit(0)
if (!existsSync(filePath)) process.exit(0)
// Prettier is a local devDependency; skip silently if deps aren't installed.
if (!existsSync('node_modules/.bin/prettier')) process.exit(0)

const res = spawnSync(
  'npx',
  ['--no-install', 'prettier', '--write', '--ignore-unknown', filePath],
  {
    stdio: 'ignore',
    timeout: 30000,
  }
)

if (res.status === 0) {
  process.stdout.write(`✨ Formatted ${filePath} with Prettier.\n`)
}

// Always succeed — formatting is a convenience, never a blocker.
process.exit(0)
