import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Contract tests for the Pages config-discard rule in scripts/check-drift.mjs.
 *
 * `actions/configure-pages` with `static_site_generator: next` only understands
 * next.config.js/.mjs. With a TypeScript config it writes its OWN next.config.js
 * — which Next then prefers — so every setting in next.config.ts is discarded on
 * each deploy. Measured on Footer_Only_Template: removing that input alone
 * flipped /privacy-policy/ from 404 to 200
 * (FreeForCharity/FFC-Cloudflare-Automation#880).
 *
 * The detector is a pure function, exercised by importing the module in a child
 * node process (the script is ESM and must stay outside the jest/ts transform);
 * the script itself is also run end-to-end against this repo's real workflows.
 */
const root = join(__dirname, '..', '..')
const script = join(root, 'scripts', 'check-drift.mjs')

type Finding = { path: string; line: number; message: string }

/** Runs `pagesConfigDiscardFindings(workflows, configs)` in a child node process. */
function findingsInChild(
  workflows: { path: string; body: string }[],
  nextConfigFilenames: string[]
): Finding[] {
  const href = pathToFileURL(script).href
  const out = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(href)});` +
        `const out = m.pagesConfigDiscardFindings(` +
        `${JSON.stringify(workflows)}, ${JSON.stringify(nextConfigFilenames)});` +
        `process.stdout.write(JSON.stringify(out))`,
    ],
    { encoding: 'utf8' }
  )
  return JSON.parse(out)
}

const wf = (body: string) => [{ path: '.github/workflows/deploy.yml', body }]

const ACTIVE_INPUT = [
  'jobs:',
  '  build:',
  '    steps:',
  '      - name: Setup Pages',
  '        uses: actions/configure-pages@v6',
  '        with:',
  '          static_site_generator: next',
  '',
].join('\n')

// The real remediation in this repo: the input is gone and a comment block
// explains why. A guard that matched the string rather than the YAML key would
// flag this and make the fix unshippable.
const COMMENTED_OUT = [
  '      - name: Setup Pages',
  '        uses: actions/configure-pages@v6',
  '        # `static_site_generator: next` is deliberately NOT set. It only understands',
  '        # next.config.js/.mjs; this repo uses next.config.ts, so the action logged',
  '        # "Using default blank configuration" and WROTE ITS OWN next.config.js.',
  '',
].join('\n')

describe('check-drift: Pages config discard', () => {
  it('flags an active static_site_generator input alongside next.config.ts', () => {
    const findings = findingsInChild(wf(ACTIVE_INPUT), ['next.config.ts'])
    expect(findings).toHaveLength(1)
    expect(findings[0].path).toBe('.github/workflows/deploy.yml')
    expect(findings[0].line).toBe(7)
    expect(findings[0].message).toContain('next.config.ts')
    expect(findings[0].message).toContain('FFC-Cloudflare-Automation#880')
  })

  it('does not flag the input when it is only named in a comment', () => {
    expect(findingsInChild(wf(COMMENTED_OUT), ['next.config.ts'])).toEqual([])
  })

  it('does not flag a JavaScript Next config — the action can read those', () => {
    expect(findingsInChild(wf(ACTIVE_INPUT), ['next.config.js'])).toEqual([])
    expect(findingsInChild(wf(ACTIVE_INPUT), ['next.config.mjs'])).toEqual([])
  })

  it('flags every TypeScript config extension the action cannot read', () => {
    for (const cfg of ['next.config.ts', 'next.config.mts', 'next.config.cts']) {
      expect(findingsInChild(wf(ACTIVE_INPUT), [cfg])).toHaveLength(1)
    }
  })

  it('stays quiet when a readable JS config sits alongside the TypeScript one', () => {
    // The action edits that file instead of generating one, and Next prefers it
    // over the .ts either way — so the .ts is dead for a reason removing this
    // input would not fix. Wrong diagnosis, no CI failure.
    for (const readable of ['next.config.js', 'next.config.mjs']) {
      expect(findingsInChild(wf(ACTIVE_INPUT), [readable, 'next.config.ts'])).toEqual([])
    }
  })

  it('still flags a .cjs alongside the TypeScript config — the action reads neither', () => {
    expect(findingsInChild(wf(ACTIVE_INPUT), ['next.config.cjs', 'next.config.ts'])).toHaveLength(1)
  })

  it('is not fooled by quoting, spacing, or a trailing comment', () => {
    const variants = [
      '          static_site_generator: "next"',
      "          static_site_generator: 'next'",
      '          static_site_generator:   next',
      '          static_site_generator: next # injects basePath',
    ]
    for (const line of variants) {
      expect(findingsInChild(wf(line + '\n'), ['next.config.ts'])).toHaveLength(1)
    }
  })

  it('reports every occurrence across every workflow, not just the first', () => {
    const findings = findingsInChild(
      [
        { path: '.github/workflows/deploy.yml', body: ACTIVE_INPUT + ACTIVE_INPUT },
        { path: '.github/workflows/staging.yml', body: ACTIVE_INPUT },
      ],
      ['next.config.ts']
    )
    expect(findings).toHaveLength(3)
    expect(findings.map((f) => f.path)).toContain('.github/workflows/staging.yml')
  })

  it('reports nothing when no Next config is present at all', () => {
    expect(findingsInChild(wf(ACTIVE_INPUT), [])).toEqual([])
  })
})

/** Calls an exported pure function of check-drift.mjs in a child node process. */
function callInChild<T>(fn: string, ...args: unknown[]): T {
  const href = pathToFileURL(script).href
  const out = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `const m = await import(${JSON.stringify(href)});` +
        `process.stdout.write(JSON.stringify(m.${fn}(...${JSON.stringify(args)})))`,
    ],
    { encoding: 'utf8' }
  )
  return JSON.parse(out)
}

type IdentityFinding = { path: string; line: number; label: string }

describe('check-drift: brand identity', () => {
  const FFC_PAGE = [
    "const PAGE_NAME = 'Free For Charity Donation Policy'",
    '<p>Free For Charity, a US 501(c)(3) non-profit organization (EIN 46-2471893)</p>',
  ].join('\n')
  const findings = (files: { path: string; body: string }[], name = 'Riverbend Pantry') =>
    callInChild<IdentityFinding[]>('brandIdentityFindings', files, name)

  it("exempts Free For Charity's own donation policy page, which is FFC's by design", () => {
    expect(
      findings([{ path: 'src/app/free-for-charity-donation-policy/page.tsx', body: FFC_PAGE }])
    ).toEqual([])
  })

  it('exempts that page by exact path only — the same text anywhere else is an error', () => {
    const out = findings([{ path: 'src/app/donation-policy/page.tsx', body: FFC_PAGE }])
    expect(out.map((f) => f.line)).toEqual([1, 2, 2])
    expect(out.map((f) => f.label).join(' ')).toMatch(/org name.*org name.*EIN/)
  })

  it('accepts Windows separators for the exempt path', () => {
    expect(
      findings([{ path: 'src\\app\\free-for-charity-donation-policy\\page.tsx', body: FFC_PAGE }])
    ).toEqual([])
  })

  it("stays dormant on the template itself, where FFC's identity is correct", () => {
    expect(
      findings([{ path: 'src/app/donation-policy/page.tsx', body: FFC_PAGE }], 'Free For Charity')
    ).toEqual([])
  })
})

describe('check-drift: reading siteConfig.name', () => {
  const nameOf = (source: string) => callInChild<string | null>('siteNameFromConfig', source)

  it('skips the unquoted type declaration and reads the value', () => {
    expect(
      nameOf("export type SiteConfig = {\n  name: string\n}\nconst c = {\n  name: 'Riverbend',\n}")
    ).toBe('Riverbend')
  })

  it('reads a double-quoted name containing an apostrophe in full', () => {
    expect(nameOf(`  name: "St. Mary's Shelter & Kitchen",`)).toBe("St. Mary's Shelter & Kitchen")
  })

  it('reads a single-quoted name containing double quotes in full', () => {
    expect(nameOf(`  name: 'Café Éclair "Arts" Collective',`)).toBe('Café Éclair "Arts" Collective')
  })

  it('unescapes an escaped quote', () => {
    expect(nameOf("  name: 'O\\'Brien Fund',")).toBe("O'Brien Fund")
  })
})

type FontFinding = { path: string; line: number; label: string }

describe('check-drift: Google-hosted fonts', () => {
  const findings = (body: string, path = 'src/lib/fonts.ts') =>
    callInChild<FontFinding[]>('googleFontFindings', [{ path, body }])

  it('flags a static next/font/google import, with its line', () => {
    const body = "// fonts\nimport { Lato } from 'next/font/google'\n"
    expect(findings(body)).toEqual([
      { path: 'src/lib/fonts.ts', line: 2, label: 'a next/font/google import' },
    ])
  })

  it('flags double quotes, a subpath, a dynamic import and a require', () => {
    const body = [
      'import { Lato } from "next/font/google"',
      "export { Inter } from 'next/font/google/target.css'",
      "const m = await import('next/font/google')",
      "const r = require('next/font/google')",
      "const w = await import(/* webpackPrefetch: true */ 'next/font/google')",
      "const c = require(/* a */ /* b */ 'next/font/google')",
    ].join('\n')
    expect(findings(body).map((f) => f.line)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('flags a Google Fonts CSS or font-file URL in a stylesheet', () => {
    const body = [
      "@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');",
      '@font-face { src: url(https://fonts.gstatic.com/s/lato/v24/x.woff2); }',
    ].join('\n')
    expect(findings(body, 'src/app/globals.css')).toEqual([
      { path: 'src/app/globals.css', line: 1, label: 'a Google Fonts URL' },
      { path: 'src/app/globals.css', line: 2, label: 'a Google Fonts URL' },
    ])
  })

  it('flags protocol-relative Google Fonts URLs, which are not comments', () => {
    const css = '@font-face { src: url(//fonts.gstatic.com/s/lato/v24/x.woff2); }'
    expect(findings(css, 'src/app/globals.css')).toEqual([
      { path: 'src/app/globals.css', line: 1, label: 'a Google Fonts URL' },
    ])
    const tsx = "const href = '//fonts.googleapis.com/css2?family=Lato'"
    expect(findings(tsx).map((f) => f.label)).toEqual(['a Google Fonts URL'])
  })

  it('treats // as a comment only outside a string, even straight after code', () => {
    expect(findings('const x = 1// was fonts.googleapis.com\n')).toEqual([])
    const masked = "const cdn = '//cdn.example'; import('next/font/google')"
    expect(findings(masked).map((f) => f.label)).toEqual(['a next/font/google import'])
  })

  it('does not read a /* inside a string as a block comment', () => {
    const body = "const s = '/*'\nimport { Lato } from 'next/font/google'\n"
    expect(findings(body)).toEqual([
      { path: 'src/lib/fonts.ts', line: 2, label: 'a next/font/google import' },
    ])
    expect(findings("/*\n const s = '*/'\n fonts.googleapis.com\n*/\n")).toEqual([
      { path: 'src/lib/fonts.ts', line: 3, label: 'a Google Fonts URL' },
    ])
  })

  it('ignores the module and hosts named only in comments or prose', () => {
    const body = [
      "import localFont from 'next/font/local'",
      '// `next/font/google` downloads from fonts.gstatic.com during next build',
      '/* never: import { Lato } from "next/font/google" */',
    ].join('\n')
    expect(findings(body)).toEqual([])
  })

  it('does not flag next/font/local or a look-alike module', () => {
    const body = [
      "import localFont from 'next/font/local'",
      "import x from 'next/font/google-ish'",
    ].join('\n')
    expect(findings(body)).toEqual([])
  })
})

describe('check-drift script (end to end)', () => {
  it('passes against this repo — no live workflow discards next.config.ts', () => {
    const out = execFileSync(process.execPath, [script], { encoding: 'utf8' })
    expect(out).toContain('No drift')
  })
})
