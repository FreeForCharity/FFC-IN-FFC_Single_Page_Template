import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Contract tests for scripts/check-site-config.mjs, the zero-dependency
 * SiteConfig drift guard shared byte-for-byte between
 * FFC-IN-FFC_Single_Page_Template and FFC-IN-Footer_Only_Template.
 *
 * The minimal validator is exercised by importing the module in a child
 * node process (the script is ESM and must stay outside the jest/ts
 * transform); the script itself is also run end-to-end against the repo's
 * real config + schema.
 */
const root = join(__dirname, '..', '..')
const script = join(root, 'scripts', 'check-site-config.mjs')

/** Runs `m.validate(schema, value, 'cfg', errors)` in a child node process. */
function validateInChild(schema: unknown, value: unknown): string[] {
  const href = pathToFileURL(script).href
  const out = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(href)});` +
        `const errors = [];` +
        `m.validate(${JSON.stringify(schema)}, ${JSON.stringify(value)}, 'cfg', errors);` +
        `process.stdout.write(JSON.stringify(errors))`,
    ],
    { encoding: 'utf8' }
  )
  return JSON.parse(out)
}

describe('check-site-config validator: additionalProperties', () => {
  const closedSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['name'],
    properties: { name: { type: 'string' } },
  }

  it('rejects unknown keys when additionalProperties is false', () => {
    // Before this was implemented the keyword was whitelisted but ignored —
    // a schema that closed the object would silently false-pass.
    const errors = validateInChild(closedSchema, { name: 'x', rogue: 1 })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('unknown key "rogue"')
    expect(errors[0]).toContain('additionalProperties: false')
  })

  it('accepts declared keys when additionalProperties is false', () => {
    expect(validateInChild(closedSchema, { name: 'x' })).toEqual([])
  })

  it('does not flag the keyword itself as unsupported (boolean forms)', () => {
    for (const value of [true, false]) {
      const errors = validateInChild(
        { type: 'object', additionalProperties: value, properties: {} },
        {}
      )
      expect(errors.filter((e) => e.includes('unsupported keyword'))).toEqual([])
    }
  })

  it('leaves objects open when additionalProperties is true or omitted', () => {
    expect(
      validateInChild({ type: 'object', additionalProperties: true, properties: {} }, { extra: 1 })
    ).toEqual([])
    expect(validateInChild({ type: 'object', properties: {} }, { extra: 1 })).toEqual([])
  })

  it('fails loudly on the unimplemented sub-schema form instead of silently passing', () => {
    const errors = validateInChild(
      { type: 'object', additionalProperties: { type: 'string' }, properties: {} },
      { extra: 'x' }
    )
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('non-boolean "additionalProperties"')
  })

  it('applies the closed-object rule to nested objects', () => {
    const schema = {
      type: 'object',
      properties: { social: closedSchema },
    }
    const errors = validateInChild(schema, { social: { name: 'x', rogue: 1 } })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('cfg.social')
  })
})

describe('check-site-config script (end to end)', () => {
  it('passes against the real src/lib/site.config.ts and shared schema', () => {
    const out = execFileSync(process.execPath, [script], { encoding: 'utf8' })
    expect(out).toContain('SiteConfig contract check passed')
  })
})
