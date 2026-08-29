#!/usr/bin/env node
/**
 * FFC shared-SiteConfig drift guard.
 *
 * Validates the `siteConfig` object exported from src/lib/site.config.ts
 * against the cross-template contract in schema/site-config.schema.json.
 * That schema file must stay byte-for-byte identical in
 * FFC-IN-FFC_Single_Page_Template and FFC-IN-Footer_Only_Template — it is
 * the contract that keeps the two templates' SiteConfig shapes converged
 * (FreeForCharity/FFC-Cloudflare-Automation#693).
 *
 * Zero-dependency by design: the drift workflow runs without `npm ci`, so
 * instead of pulling in a TS loader or ajv, this script extracts the
 * siteConfig object literal from the TypeScript source and evaluates it in
 * an isolated `node:vm` context, then validates it with a minimal built-in
 * checker covering exactly the JSON Schema subset the contract uses
 * (type, required, properties, items, const, minLength, and boolean
 * additionalProperties). If the schema grows a keyword — or a keyword form,
 * e.g. a sub-schema additionalProperties — the checker does not know, the
 * run fails loudly rather than silently skipping the rule.
 *
 * Run: `node scripts/check-site-config.mjs` or `npm run check:site-config`.
 * Exits non-zero on any validation error.
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import process from 'node:process'
import vm from 'node:vm'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const CONFIG_PATH = join(ROOT, 'src', 'lib', 'site.config.ts')
const SCHEMA_PATH = join(ROOT, 'schema', 'site-config.schema.json')

/**
 * Extract the `export const siteConfig ... = { ... }` object literal from
 * the TypeScript source. Scans for the matching closing brace while
 * skipping string literals ('…', "…", `…`) and comments so braces inside
 * them do not unbalance the count.
 */
function extractSiteConfigLiteral(source) {
  const marker = /export const siteConfig\s*(?::\s*SiteConfig)?\s*=\s*\{/.exec(source)
  if (!marker) {
    throw new Error(
      `Could not find "export const siteConfig ... = {" in ${CONFIG_PATH}. ` +
        `If the export was renamed, update scripts/check-site-config.mjs to match.`
    )
  }
  const start = marker.index + marker[0].length - 1
  let depth = 0
  for (let i = start; i < source.length; i++) {
    const ch = source[i]
    const next = source[i + 1]
    if (ch === '/' && next === '/') {
      i = source.indexOf('\n', i)
      if (i === -1) break
      continue
    }
    if (ch === '/' && next === '*') {
      const close = source.indexOf('*/', i + 2)
      if (close === -1) break
      i = close + 1
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      for (i += 1; i < source.length; i++) {
        if (source[i] === '\\') {
          i += 1
        } else if (source[i] === ch) {
          break
        }
      }
      continue
    }
    if (ch === '{') depth += 1
    if (ch === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start, i + 1)
    }
  }
  throw new Error(`Unbalanced braces while extracting the siteConfig literal from ${CONFIG_PATH}.`)
}

export const SUPPORTED_KEYWORDS = new Set([
  '$schema',
  '$id',
  '$comment',
  'title',
  'description',
  'type',
  'required',
  'properties',
  'items',
  'const',
  'minLength',
  'additionalProperties',
])

function typeOf(value) {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'null'
  return typeof value
}

/** Minimal validator for the JSON Schema subset used by the contract. */
export function validate(schema, value, path, errors) {
  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_KEYWORDS.has(keyword)) {
      errors.push(
        `${path}: schema uses unsupported keyword "${keyword}" — ` +
          `extend the validator in scripts/check-site-config.mjs before using it.`
      )
    }
  }
  if (schema.const !== undefined && value !== schema.const) {
    errors.push(
      `${path}: must equal ${JSON.stringify(schema.const)} (got ${JSON.stringify(value)})`
    )
    return
  }
  if (schema.type !== undefined && typeOf(value) !== schema.type) {
    errors.push(`${path}: expected ${schema.type}, got ${typeOf(value)}`)
    return
  }
  if (schema.type === 'string' && schema.minLength !== undefined) {
    if (value.length < schema.minLength) {
      errors.push(`${path}: must be a non-empty string`)
    }
  }
  if (schema.type === 'object') {
    for (const key of schema.required ?? []) {
      if (!(key in value)) {
        errors.push(`${path}: missing required key "${key}"`)
      }
    }
    for (const [key, subSchema] of Object.entries(schema.properties ?? {})) {
      if (key in value) {
        validate(subSchema, value[key], `${path}.${key}`, errors)
      }
    }
    // `additionalProperties: false` closes the object: any key not declared
    // in `properties` is an error. `true` (or omitted) leaves it open. A
    // sub-schema form is NOT implemented — fail loudly rather than silently
    // passing whatever the schema author intended to constrain.
    if (schema.additionalProperties === false) {
      const declared = new Set(Object.keys(schema.properties ?? {}))
      for (const key of Object.keys(value)) {
        if (!declared.has(key)) {
          errors.push(
            `${path}: unknown key "${key}" — the schema sets additionalProperties: false, ` +
              `so every key must be declared in its "properties".`
          )
        }
      }
    } else if (schema.additionalProperties !== undefined && schema.additionalProperties !== true) {
      errors.push(
        `${path}: schema uses a non-boolean "additionalProperties" (sub-schema form) — ` +
          `extend the validator in scripts/check-site-config.mjs before using it.`
      )
    }
  }
  if (schema.type === 'array' && schema.items !== undefined) {
    value.forEach((item, index) => {
      validate(schema.items, item, `${path}[${index}]`, errors)
    })
  }
}

async function main() {
  const [schemaBody, configSource] = await Promise.all([
    readFile(SCHEMA_PATH, 'utf8'),
    readFile(CONFIG_PATH, 'utf8'),
  ])
  const schema = JSON.parse(schemaBody)
  const literal = extractSiteConfigLiteral(configSource)
  let siteConfig
  try {
    siteConfig = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 })
  } catch (error) {
    throw new Error(
      `Failed to evaluate the siteConfig object literal: ${error.message}. ` +
        `The literal must be plain data (no imports, identifiers, or interpolation).`
    )
  }

  const errors = []
  validate(schema, siteConfig, 'siteConfig', errors)

  if (errors.length > 0) {
    console.error('SiteConfig contract check FAILED:\n')
    for (const message of errors) console.error(`  ✗ ${message}`)
    console.error(
      '\nThe shared SiteConfig shape is defined in schema/site-config.schema.json,' +
        '\nwhich must stay identical in FFC-IN-FFC_Single_Page_Template and' +
        '\nFFC-IN-Footer_Only_Template. Fix src/lib/site.config.ts (or, for an' +
        '\nintentional cross-template shape change, update the schema in BOTH repos).'
    )
    process.exit(1)
  }

  console.log('SiteConfig contract check passed: src/lib/site.config.ts matches the shared schema.')
}

// Only run when executed directly (allows importing validate() in tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`check-site-config: ${error.message}`)
    process.exit(1)
  })
}
