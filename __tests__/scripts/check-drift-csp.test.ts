import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * Contract tests for checkCspSync in scripts/check-drift.mjs.
 *
 * The property under test is which finding has the standing to fail a run.
 * `public/_headers` is a Cloudflare Pages / Netlify build feature and is inert
 * on the stack FFC deploys (GitHub Pages origin behind the Cloudflare proxy —
 * measured in FFC-Cloudflare-Automation#884), so a finding about it must be a
 * warning AND must never suppress the finding about the layout.tsx CSP meta
 * tag, which is the only security header an FFC site actually serves.
 *
 * Before this was fixed, two of the three `_headers` states returned early and
 * a site with no CSP anywhere passed the check reporting only the inert file.
 */
const root = join(__dirname, '..', '..')

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self'",
  "media-src 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ')

type HeadersState = 'absent' | 'no-csp' | 'csp'

function layoutSource(withMeta: boolean): string {
  const meta = withMeta ? `<meta httpEquiv="Content-Security-Policy" content="${CSP}" />` : ''
  return `export default function RootLayout() {
  return (
    <html><head>${meta}</head><body /></html>
  )
}
`
}

/** Builds a throwaway repo carrying only what checkCspSync reads. */
function run(headers: HeadersState, layoutMeta: boolean): { code: number; output: string } {
  const dir = mkdtempSync(join(tmpdir(), 'ffc-drift-csp-'))
  try {
    mkdirSync(join(dir, 'scripts'), { recursive: true })
    mkdirSync(join(dir, 'src/app'), { recursive: true })
    mkdirSync(join(dir, 'src/lib'), { recursive: true })
    mkdirSync(join(dir, 'public/.well-known'), { recursive: true })
    cpSync(join(root, 'scripts/check-drift.mjs'), join(dir, 'scripts/check-drift.mjs'))
    // The other checks read these; copy the real ones so their findings stay
    // out of the way and only the CSP assertions vary between cases.
    cpSync(join(root, 'src/lib/site.config.ts'), join(dir, 'src/lib/site.config.ts'))
    cpSync(join(root, 'public/security.txt'), join(dir, 'public/security.txt'))
    cpSync(
      join(root, 'public/.well-known/security.txt'),
      join(dir, 'public/.well-known/security.txt')
    )

    writeFileSync(join(dir, 'src/app/layout.tsx'), layoutSource(layoutMeta))
    if (headers === 'no-csp') {
      writeFileSync(join(dir, 'public/_headers'), '/*\n  X-Frame-Options: SAMEORIGIN\n')
    } else if (headers === 'csp') {
      writeFileSync(join(dir, 'public/_headers'), `/*\n  Content-Security-Policy: ${CSP}\n`)
    }

    return runScript(join(dir, 'scripts/check-drift.mjs'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/**
 * Both streams, always. The script prints errors AND warnings via
 * console.error/console.warn (stderr) and only the summary line to stdout, so
 * reading stdout alone makes every warning assertion vacuously fail — and, more
 * dangerously, would make a "does not contain" assertion pass for the wrong
 * reason.
 */
function runScript(scriptPath: string): { code: number; output: string } {
  const res = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8' })
  return { code: res.status ?? 1, output: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

const HEADERS_STATES: HeadersState[] = ['absent', 'no-csp', 'csp']

describe('check-drift CSP: the inert file never masks the live control', () => {
  // The regression this file exists for. Run as a matrix rather than a single
  // case because the masking bug lived in the early returns, so it only showed
  // up in the _headers states that returned before reaching the layout check.
  it.each(HEADERS_STATES)(
    'fails when the layout CSP meta tag is missing, with _headers %s',
    (headers) => {
      const { code, output } = run(headers, false)
      expect(output).toContain(
        'src/app/layout.tsx has no <meta http-equiv="Content-Security-Policy">'
      )
      expect(code).toBe(1)
    }
  )

  it.each(HEADERS_STATES)('passes on a served CSP, with _headers %s', (headers) => {
    const { code } = run(headers, true)
    expect(code).toBe(0)
  })
})

describe('check-drift CSP: unreadable is not the same as absent', () => {
  // The warning severity above is correct only for a file that is genuinely
  // absent. A file that exists but cannot be read (permissions, EISDIR, I/O)
  // is a different fact, and collapsing the two would both misdiagnose it
  // ("restore the file" — it is already there) and let the run pass, because
  // the absent case is only a warning.
  function runWithUnreadableHeaders(layoutMeta = true): { code: number; output: string } {
    const dir = mkdtempSync(join(tmpdir(), 'ffc-drift-unreadable-'))
    try {
      mkdirSync(join(dir, 'scripts'), { recursive: true })
      mkdirSync(join(dir, 'src/app'), { recursive: true })
      mkdirSync(join(dir, 'src/lib'), { recursive: true })
      mkdirSync(join(dir, 'public/.well-known'), { recursive: true })
      cpSync(join(root, 'scripts/check-drift.mjs'), join(dir, 'scripts/check-drift.mjs'))
      cpSync(join(root, 'src/lib/site.config.ts'), join(dir, 'src/lib/site.config.ts'))
      cpSync(join(root, 'public/security.txt'), join(dir, 'public/security.txt'))
      cpSync(
        join(root, 'public/.well-known/security.txt'),
        join(dir, 'public/.well-known/security.txt')
      )
      writeFileSync(join(dir, 'src/app/layout.tsx'), layoutSource(layoutMeta))
      // A directory where the file should be: readFile gives EISDIR, which is
      // portable and needs no chmod (root ignores permission bits in CI).
      mkdirSync(join(dir, 'public/_headers'))
      return runScript(join(dir, 'scripts/check-drift.mjs'))
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }

  it('errors, and does not report it as missing', () => {
    const { code, output } = runWithUnreadableHeaders()
    expect(output).toContain('Could not read public/_headers')
    expect(output).not.toContain('public/_headers is missing')
    expect(code).toBe(1)
  })

  // Unreadable is the fourth state _headers can be in, and it must obey the
  // same rule as the other three: never end the check before the layout CSP has
  // been assessed. The run fails either way, so the cost here is not a silent
  // pass — it is a reader who fixes the read error, re-runs, and only then
  // learns their site has no CSP. One finding at a time is the failure mode
  // this function was rewritten to remove.
  it('still reports the missing live CSP alongside the read error', () => {
    const { code, output } = runWithUnreadableHeaders(false)
    expect(output).toContain('Could not read public/_headers')
    expect(output).toContain(
      'src/app/layout.tsx has no <meta http-equiv="Content-Security-Policy">'
    )
    expect(code).toBe(1)
  })
})

describe('check-drift CSP: _headers findings are warnings, not coverage', () => {
  it('warns rather than errors when public/_headers is missing', () => {
    const { code, output } = run('absent', true)
    expect(output).toContain('public/_headers is missing')
    // The claim under test is the severity: the file is inert, so its absence
    // changes nothing that is served and must not fail the run.
    expect(output).toContain('inert on FFC deploys')
    expect(code).toBe(0)
  })

  it('warns rather than errors when public/_headers carries no CSP', () => {
    const { code, output } = run('no-csp', true)
    expect(output).toContain('public/_headers has no Content-Security-Policy directive')
    expect(code).toBe(0)
  })

  it('does not claim security headers will stop being served', () => {
    const { output } = run('absent', true)
    // The pre-fix text read "CSP and other security headers will not be served",
    // which was false on this stack in both directions: restoring the file
    // serves nothing, and the CSP that IS served comes from layout.tsx.
    expect(output).not.toContain('security headers will not be served')
  })
})

describe('check-drift CSP: the sync diff still holds', () => {
  it('errors when a third-party origin exists in only one of the two copies', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ffc-drift-csp-sync-'))
    try {
      mkdirSync(join(dir, 'scripts'), { recursive: true })
      mkdirSync(join(dir, 'src/app'), { recursive: true })
      mkdirSync(join(dir, 'src/lib'), { recursive: true })
      mkdirSync(join(dir, 'public/.well-known'), { recursive: true })
      cpSync(join(root, 'scripts/check-drift.mjs'), join(dir, 'scripts/check-drift.mjs'))
      cpSync(join(root, 'src/lib/site.config.ts'), join(dir, 'src/lib/site.config.ts'))
      cpSync(join(root, 'public/security.txt'), join(dir, 'public/security.txt'))
      cpSync(
        join(root, 'public/.well-known/security.txt'),
        join(dir, 'public/.well-known/security.txt')
      )
      writeFileSync(join(dir, 'src/app/layout.tsx'), layoutSource(true))
      writeFileSync(
        join(dir, 'public/_headers'),
        `/*\n  Content-Security-Policy: ${CSP} https://widget.example\n`
      )

      const { code, output } = runScript(join(dir, 'scripts/check-drift.mjs'))

      expect(output).toContain('drifted between public/_headers and src/app/layout.tsx')
      expect(output).toContain('https://widget.example')
      expect(code).toBe(1)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
