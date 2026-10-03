import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * The smoke check's security.txt Contact rule. The helper is an ESM script,
 * so it runs through node like the other script suites.
 */
const script = join(process.cwd(), 'scripts', 'security-contact.mjs')

function evaluate(expression: string): unknown {
  const result = spawnSync(
    'node',
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(pathToFileURL(script).href)});\nprocess.stdout.write(JSON.stringify(await (${expression})))`,
    ],
    { cwd: process.cwd(), encoding: 'utf8' }
  )
  if (result.status !== 0) throw new Error(`node exited ${result.status}: ${result.stderr}`)
  return JSON.parse(result.stdout)
}

type Check = { ok: boolean; detail: string; notice: string | null }
const check = (body: string, pending: string[]) =>
  evaluate(`m.contactCheck(${JSON.stringify(body)}, ${JSON.stringify(pending)})`) as Check

const EXPIRES = 'Expires: 2099-01-01T00:00:00.000Z\n'

describe('security.txt Contact rule', () => {
  it('passes with a Contact line', () => {
    const result = check(`Contact: mailto:hello@example.org\n${EXPIRES}`, [])
    expect(result).toEqual({ ok: true, detail: 'mailto:hello@example.org', notice: null })
  })

  it('fails without a Contact line when the email is not pending', () => {
    expect(check(EXPIRES, []).ok).toBe(false)
    // Another pending field does not excuse a missing Contact line.
    expect(check(EXPIRES, ['phone', 'ein']).ok).toBe(false)
  })

  it('passes with a notice, not a failure, while the email is pending', () => {
    const result = check(`# No Contact line yet\n${EXPIRES}`, ['email'])
    expect(result.ok).toBe(true)
    expect(result.notice).toContain('siteConfig.pending')
  })

  it('ignores a commented-out Contact line', () => {
    expect(check(`# Contact: mailto:x@example.org\n${EXPIRES}`, []).ok).toBe(false)
  })
})

describe('reading siteConfig.pending', () => {
  let dir: string
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'security-contact-'))
  })
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  const read = (path: string) =>
    evaluate(`m.readPendingFields(${JSON.stringify(path)})`) as {
      pending: string[]
      error: string | null
    }

  it('reads the list from a site.config.ts', () => {
    const config = join(dir, 'site.config.ts')
    writeFileSync(
      config,
      "export const siteConfig: { pending?: string[] } = { pending: ['email', 'team'] }\n"
    )
    expect(read(config)).toEqual({ pending: ['email', 'team'], error: null })
  })

  it('treats an absent list as nothing pending', () => {
    const config = join(dir, 'site.config.ts')
    writeFileSync(config, "export const siteConfig = { name: 'Example' }\n")
    expect(read(config)).toEqual({ pending: [], error: null })
  })

  // Unreadable config must keep the check strict, never relax it.
  it('treats an unreadable config as nothing pending, and says why', () => {
    const result = read(join(dir, 'missing.ts'))
    expect(result.pending).toEqual([])
    expect(result.error).toBeTruthy()
  })

  it("reads this repo's own config", () => {
    const result = read(join(process.cwd(), 'src', 'lib', 'site.config.ts'))
    expect(result.error).toBeNull()
    expect(Array.isArray(result.pending)).toBe(true)
  })
})
