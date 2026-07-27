/**
 * The donation-scope contract of the post-deploy smoke engine.
 *
 * This file is propagated across the FFC fleet by byte-identity (see the
 * fleet smoke-engine drift audit, FFC-Cloudflare-Automation#893), so every
 * defect in it ships to ~60 repos at once. The contract used to be
 * implemented TWICE inside the workflow — once in the Playwright compliance
 * script and once in the standing-issue shell step — and the two
 * implementations disagreed three ways: on when the committed config is
 * validated, on whether a `null` config is "empty" or "invalid", and on
 * whether a variable-sourced value is trimmed.
 *
 * The fix was to resolve it once, in the `scope` step. These tests drive the
 * SHIPPED resolver text out of the workflow file and run it, so they fail if
 * the behaviour changes — and the structural guards at the bottom fail if a
 * second implementation is ever reintroduced.
 */
import { execFileSync } from 'child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const WORKFLOW_PATH = join(__dirname, '..', '..', '.github', 'workflows', 'post-deploy-smoke.yml')
const workflow = readFileSync(WORKFLOW_PATH, 'utf8')

/** Pull the resolver script out of its heredoc and undo the YAML indentation. */
function extractResolver(): string {
  const match = workflow.match(/<<'RESOLVE_JS'\n([\s\S]*?)\n[ \t]*RESOLVE_JS\n/)
  if (!match) throw new Error('Could not find the RESOLVE_JS heredoc in post-deploy-smoke.yml')
  const lines = match[1].split('\n')
  const indent = Math.min(
    ...lines.filter((l) => l.trim().length > 0).map((l) => l.match(/^ */)![0].length)
  )
  return lines.map((l) => l.slice(indent)).join('\n')
}

const RESOLVER = extractResolver()

interface RunResult {
  code: number
  stdout: string
  stderr: string
  scope: string | null
  source: string | null
}

/**
 * Run the shipped resolver against a fixture repo.
 *
 * @param config  contents of .github/smoke.config.json, or null for "no file"
 * @param scopeVar value of the SMOKE_DONATION_SCOPE repo variable ('' = unset)
 */
function run(config: string | null, scopeVar = ''): RunResult {
  const dir = mkdtempSync(join(tmpdir(), 'smoke-scope-'))
  mkdirSync(join(dir, '.github'), { recursive: true })
  if (config !== null) writeFileSync(join(dir, '.github', 'smoke.config.json'), config)
  const scriptPath = join(dir, 'resolve.js')
  writeFileSync(scriptPath, RESOLVER)
  const outputPath = join(dir, 'gh-output')
  writeFileSync(outputPath, '')

  let code = 0
  let stdout = ''
  let stderr = ''
  try {
    stdout = execFileSync('node', [scriptPath], {
      cwd: dir,
      encoding: 'utf8',
      env: {
        ...process.env,
        SMOKE_DONATION_SCOPE: scopeVar,
        GITHUB_OUTPUT: outputPath,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string }
    code = err.status ?? 1
    stdout = err.stdout ?? ''
    stderr = err.stderr ?? ''
  }

  const written = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : ''
  const read = (key: string) => {
    const m = written.match(new RegExp(`^${key}=(.*)$`, 'm'))
    return m ? m[1] : null
  }
  return { code, stdout, stderr, scope: read('scope'), source: read('source') }
}

describe('donation scope resolution — valid declarations', () => {
  it('reports undeclared when neither the file nor the variable is set', () => {
    const r = run(null)
    expect(r.code).toBe(0)
    expect(r.scope).toBe('')
    expect(r.source).toBe('undeclared')
  })

  it('reports undeclared for an object with no donationScope key', () => {
    const r = run('{}')
    expect(r.code).toBe(0)
    expect(r.scope).toBe('')
    expect(r.source).toBe('undeclared')
  })

  it.each(['charity', 'ffc-interim', 'none'])('accepts %s from the committed file', (scope) => {
    const r = run(JSON.stringify({ donationScope: scope }))
    expect(r.code).toBe(0)
    expect(r.scope).toBe(scope)
    expect(r.source).toBe('file')
  })

  it('lets the repo variable override the committed file', () => {
    const r = run(JSON.stringify({ donationScope: 'none' }), 'charity')
    expect(r.code).toBe(0)
    expect(r.scope).toBe('charity')
    expect(r.source).toBe('variable')
  })
})

describe('donation scope resolution — normalization is the same for both sources', () => {
  // The shell path used to strip whitespace only inside the file branch, so
  // a variable-sourced ' charity ' matched no case arm downstream.
  it('trims and lowercases a value that came from the file', () => {
    const r = run(JSON.stringify({ donationScope: '  Charity ' }))
    expect(r.code).toBe(0)
    expect(r.scope).toBe('charity')
  })

  it('trims and lowercases a value that came from the variable', () => {
    const r = run(null, '  FFC-Interim ')
    expect(r.code).toBe(0)
    expect(r.scope).toBe('ffc-interim')
    expect(r.source).toBe('variable')
  })
})

describe('donation scope resolution — invalid input', () => {
  it('rejects unparseable JSON as a syntax error', () => {
    const r = run('{ not json')
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('is not valid JSON')
  })

  // `null`, `[]`, `"str"` and `42` all PARSE. The old shell path called them
  // "not valid JSON" (sending a maintainer after a syntax error that does not
  // exist), and `null` in particular resolved silently to an empty scope.
  it.each([
    ['null', 'null'],
    ['[]', 'array'],
    ['"hello"', 'string'],
    ['42', 'number'],
    ['true', 'boolean'],
  ])('rejects top-level %s as a type error, not a syntax error', (config, got) => {
    const r = run(config)
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('must contain a JSON object')
    expect(r.stderr).toContain(`(got ${got})`)
    expect(r.stderr).not.toContain('is not valid JSON')
  })

  it('rejects a donationScope outside the allowed set', () => {
    const r = run(JSON.stringify({ donationScope: 'sometimes' }))
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('is not one of charity|ffc-interim|none')
  })

  // The divergence that started this: the JS path validated the file even
  // when the variable was set, the shell path never opened it. One workflow
  // cannot hold both rules — validation now happens either way.
  it('still validates a malformed file when the variable would override it', () => {
    const r = run('{ not json', 'none')
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('is not valid JSON')
  })

  it('still validates a bad file donationScope when the variable would override it', () => {
    const r = run(JSON.stringify({ donationScope: 'sometimes' }), 'none')
    expect(r.code).toBe(1)
    expect(r.stderr).toContain('is not one of charity|ffc-interim|none')
  })
})

describe('donation scope resolution — an unrecognised repo variable', () => {
  // A typo'd variable must not silently mask a valid committed declaration.
  it('warns and falls back to the committed file', () => {
    const r = run(JSON.stringify({ donationScope: 'none' }), 'nonee')
    expect(r.code).toBe(0)
    expect(r.stdout).toContain('::warning::')
    expect(r.stdout).toContain('falling back to .github/smoke.config.json ("none")')
    expect(r.scope).toBe('none')
    expect(r.source).toBe('file')
  })

  // The warning must describe what actually happened. Promising a fallback
  // to a file that does not exist sends a maintainer looking for it.
  it('warns and reports undeclared when there is no file to fall back to', () => {
    const r = run(null, 'nonee')
    expect(r.code).toBe(0)
    expect(r.stdout).toContain('::warning::')
    expect(r.stdout).toContain('scope is undeclared')
    expect(r.stdout).not.toContain('falling back to')
    expect(r.scope).toBe('')
    expect(r.source).toBe('undeclared')
  })

  it('says undeclared when the file exists but declares no scope', () => {
    const r = run('{}', 'nonee')
    expect(r.code).toBe(0)
    expect(r.stdout).toContain('scope is undeclared')
    expect(r.stdout).not.toContain('falling back to')
    expect(r.scope).toBe('')
  })
})

describe('donation scope resolution — values reaching workflow commands are escaped', () => {
  // ::error::/::warning:: lines are newline-delimited and percent-escaped.
  // An unescaped value can close the annotation and have the remainder
  // parsed as further commands — including ::stop-commands::, which would
  // silence every annotation the rest of the run emits.
  it('escapes CR, LF and % in a rejected file donationScope', () => {
    const r = run(JSON.stringify({ donationScope: 'bad\nvalue\rwith%percent' }))
    expect(r.code).toBe(1)
    const line = r.stderr.split('\n').find((l) => l.startsWith('::error::'))!
    expect(line).toContain('%0A')
    expect(line).toContain('%0D')
    expect(line).toContain('%25')
    // The whole annotation is one line: nothing escaped from it.
    expect(r.stderr.trim().split('\n')).toHaveLength(1)
  })

  it('escapes a forged command smuggled through the file', () => {
    const r = run(JSON.stringify({ donationScope: 'x\n::stop-commands::abc' }))
    expect(r.code).toBe(1)
    expect(r.stderr).not.toMatch(/^::stop-commands::/m)
  })

  it('escapes CR, LF and % in an unrecognised repo variable', () => {
    const r = run(null, 'bad\nvalue\rwith%percent')
    expect(r.code).toBe(0)
    const line = r.stdout.split('\n').find((l) => l.startsWith('::warning::'))!
    expect(line).toContain('%0A')
    expect(line).toContain('%0D')
    expect(line).toContain('%25')
    expect(r.stdout).not.toMatch(/^::stop-commands::/m)
  })
})

describe('the contract has exactly one implementation', () => {
  const stepBodies = (heading: string) => {
    const start = workflow.indexOf(heading)
    expect(start).toBeGreaterThan(-1)
    const next = workflow.indexOf('\n      - name:', start + heading.length)
    return workflow.slice(start, next === -1 ? workflow.length : next)
  }

  it('only the resolver step opens .github/smoke.config.json', () => {
    // Steps may NAME the file in an error message or an issue body — that is
    // how a maintainer learns where to declare the scope. What no step but
    // the resolver may do is READ it.
    const steps = workflow.split(/\n      - name: /).slice(1)
    const resolvers = steps.filter((s) =>
      s.includes("const CONFIG_PATH = '.github/smoke.config.json'")
    )
    expect(resolvers).toHaveLength(1)

    // Two signals, both required, deliberately not on the same line. The
    // implementation this guard replaced built its path on one line and
    // called existsSync on the next:
    //
    //   const smokeConfigPath = process.env.GITHUB_WORKSPACE + '/.github/smoke.config.json'
    //   if (require('fs').existsSync(smokeConfigPath)) {
    //
    // so a regex demanding the primitive and the path together would miss
    // the exact regression this exists to catch. Requiring both anywhere in
    // the SAME STEP keeps that catch while leaving a step that reads some
    // unrelated file — and never mentions this config — alone.
    const readPrimitives = [
      /existsSync/,
      /readFileSync/,
      /\[ -f \.github\/smoke\.config\.json/,
      /jq -r '\.donationScope/,
    ]
    const NEAR = 3
    const otherSteps = steps.filter((s) => !resolvers.includes(s))
    for (const step of otherSteps) {
      const lines = step.split('\n')
      const name = lines[0]
      // The Playwright step legitimately names the config in a compliance
      // message, so "mentions it anywhere" is not the signal either — it is
      // a read PRIMITIVE sitting within a few lines of the path.
      const mentions = lines.flatMap((l, i) => (l.includes('smoke.config.json') ? [i] : []))
      if (mentions.length === 0) continue
      for (const primitive of readPrimitives) {
        const near = lines.flatMap((l, i) =>
          primitive.test(l) && mentions.some((m) => Math.abs(i - m) <= NEAR) ? [i + 1] : []
        )
        expect(`${name}: ${near.length ? `reads config at line ${near[0]}` : 'clean'}`).toBe(
          `${name}: clean`
        )
      }
    }
  })

  it('node is set up before the resolver runs, not inherited from the image', () => {
    // The resolver is a node script that runs before the smoke even knows
    // its target, so it must not depend on whatever node the runner image
    // happens to ship. Ordering is the whole guarantee here, and ordering is
    // exactly what a later edit reshuffles without noticing.
    const names = [...workflow.matchAll(/\n      - name: (.*)/g)].map((m) => m[1])
    const setupNode = names.findIndex((n) => n === 'Setup Node')
    const resolver = names.findIndex((n) => n.startsWith('Resolve donation scope'))
    expect(setupNode).toBeGreaterThan(-1)
    expect(resolver).toBeGreaterThan(-1)
    expect(setupNode).toBeLessThan(resolver)

    // ...and it must be unconditional: every `if:` in this job keys off the
    // skip decision, which is made in a step that now runs AFTER the resolver.
    const step = stepBodies('- name: Setup Node\n')
    expect(step).toContain('actions/setup-node')
    expect(step).not.toContain('if:')
  })

  it('the Playwright compliance step consumes the resolved output', () => {
    const step = stepBodies('- name: Visual check + screenshot + compliance assertions')
    expect(step).toContain('SMOKE_DONATION_SCOPE: ${{ steps.scope.outputs.scope }}')
    expect(step).not.toContain('vars.SMOKE_DONATION_SCOPE')
    expect(step).not.toContain('fileConfig')
  })

  it('the standing-issue step consumes the resolved output', () => {
    const step = stepBodies('- name: Maintain standing donation posture issues')
    expect(step).toContain('SCOPE: ${{ steps.scope.outputs.scope }}')
    expect(step).not.toContain('vars.SMOKE_DONATION_SCOPE')
    expect(step).not.toContain('jq -r')
  })

  it('no consumer re-normalizes the resolved value', () => {
    const step = stepBodies('- name: Maintain standing donation posture issues')
    // `tr '[:upper:]' '[:lower:]'` on an already-normalized value is how the
    // second implementation grew back last time.
    expect(step).not.toMatch(/SCOPE.*tr '\[:upper:\]'/)
  })
})
