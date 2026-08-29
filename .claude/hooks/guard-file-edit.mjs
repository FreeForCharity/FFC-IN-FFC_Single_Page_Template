#!/usr/bin/env node
/**
 * PreToolUse(Write|Edit|MultiEdit) guard for Claude Code.
 *
 * Two protections, both "shifting left" the existing security checks so a
 * problem is caught the instant the AI tries to write it — not later at
 * commit time (husky) or CI time (check-drift):
 *
 *  1. Refuse to write secret-bearing files (.env, *.pem, *.key, credentials)
 *     that .gitignore exists to keep OUT of the repo. (.env.example and
 *     friends are explicitly allowed — they hold placeholders.)
 *  2. Refuse to write content that matches a known credential pattern. The
 *     regexes are kept in sync with scripts/check-drift.mjs's checkSecrets().
 *
 * Contract: read the tool call JSON on stdin. To block, print a reason to
 * stderr and exit 2. Otherwise exit 0 (fail open on any internal error).
 */

import { basename } from 'node:path'

async function readInput() {
  const chunks = []
  for await (const c of process.stdin) chunks.push(c)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

function deny(reason) {
  process.stderr.write(`🛑 Blocked by guard-file-edit hook: ${reason}\n`)
  process.exit(2)
}

// Filenames that may safely carry .env-style names because they hold only
// placeholders, not real values.
const ALLOWED_ENV_FILES = /^\.env\.(example|sample|template)$/

function isSecretFile(filePath) {
  const name = basename(filePath)
  if (ALLOWED_ENV_FILES.test(name)) return false
  if (name === '.env' || /^\.env\./.test(name))
    return '.env files hold real secrets and are gitignored. Put values in .env (untracked) and commit only .env.example with placeholders.'
  if (/\.(pem|key|p12|pfx)$/i.test(name))
    return `${name} looks like a private key / certificate. These must never be committed — store them in GitHub Secrets or a local untracked file.`
  if (/^(credentials|secrets)\.json$/i.test(name))
    return `${name} is a credentials file. Keep it out of the repo; reference secrets via environment variables instead.`
  if (/^id_(rsa|ed25519|ecdsa|dsa)$/.test(name))
    return `${name} is an SSH private key and must never be written into the repo.`
  return false
}

// Kept in lockstep with scripts/check-drift.mjs checkSecrets().
const SECRET_PATTERNS = [
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_\-]{35}\b/ },
  { name: 'GitHub personal access token', re: /\bghp_[A-Za-z0-9]{36,}\b/ },
  { name: 'GitHub fine-grained token', re: /\bgithub_pat_[A-Za-z0-9_]{82,}\b/ },
  { name: 'Slack token', re: /\bxox[abeprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'Private key block', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
]

/** Collect the new text being written across Write / Edit / MultiEdit. */
function newContent(input) {
  const ti = input?.tool_input ?? {}
  if (typeof ti.content === 'string') return ti.content // Write
  if (typeof ti.new_string === 'string') return ti.new_string // Edit
  if (Array.isArray(ti.edits)) return ti.edits.map((e) => e?.new_string ?? '').join('\n') // MultiEdit
  return ''
}

const input = await readInput()
const filePath = String(input?.tool_input?.file_path ?? '')

if (filePath) {
  const fileReason = isSecretFile(filePath)
  if (fileReason) deny(fileReason)
}

const content = newContent(input)
if (content) {
  for (const p of SECRET_PATTERNS) {
    if (p.re.test(content)) {
      deny(
        `This edit contains what looks like a ${p.name}. Never hardcode credentials — move it to .env (gitignored) or GitHub Secrets and rotate it if it is real.`
      )
    }
  }
}

process.exit(0)
