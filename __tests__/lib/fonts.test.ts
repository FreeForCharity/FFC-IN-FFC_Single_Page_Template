import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Mock next/font/local so it echoes the call's configuration back out.
// next/jest's default mock returns literal "variable", which strips the
// data we care about (the configured CSS variable name and the src files).
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: (config: Record<string, unknown>) => ({
    className: 'mock-className',
    style: { fontFamily: 'mock-family' },
    variable: config.variable,
    src: config.src,
    display: config.display,
  }),
}))

import { openSans, lato, faustina } from '../../src/lib/fonts'

const ROOT = join(__dirname, '..', '..')
const SRC_DIR = join(ROOT, 'src')
// next/font/local resolves each `path` relative to the calling module.
const FONTS_MODULE_DIR = join(SRC_DIR, 'lib')

type LocalSrc = { path: string; weight: string; style: string }
type MockFont = { variable?: string; src?: LocalSrc[]; display?: string }

const allFonts = { openSans, lato, faustina } as const
type FontName = keyof typeof allFonts

const srcOf = (font: unknown) => (font as MockFont).src ?? []

describe('fonts module exports', () => {
  it('exports exactly the three expected font instances', () => {
    expect(Object.keys(allFonts).sort()).toEqual(['faustina', 'lato', 'openSans'].sort())
    for (const font of Object.values(allFonts)) {
      expect(font).toBeDefined()
      expect(typeof font).toBe('object')
    }
  })

  it('exposes a CSS variable name on every font matching --font-<kebab-name>', () => {
    const expected: Record<FontName, string> = {
      openSans: '--font-open-sans',
      lato: '--font-lato',
      faustina: '--font-faustina',
    }
    for (const [name, font] of Object.entries(allFonts)) {
      expect({ name, variable: (font as MockFont).variable }).toEqual({
        name,
        variable: expected[name as FontName],
      })
    }
  })

  it('uses swap display for every font', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      expect({ name, display: (font as MockFont).display }).toEqual({ name, display: 'swap' })
    }
  })

  // A `weight` is either one weight ('400', a static file) or a range
  // ('300 800', a variable file covering every weight in between).
  const covers = (weight: string, w: string) => {
    const [lo, hi = lo] = weight.split(' ').map(Number)
    return Number(w) >= lo && Number(w) <= hi
  }

  it('covers every normal-style weight the Google definition had', () => {
    const expectedWeights: Record<FontName, string[]> = {
      openSans: ['400', '500', '600', '700', '800'],
      lato: ['400', '700'],
      faustina: ['400', '500', '600', '700'],
    }
    for (const [name, font] of Object.entries(allFonts)) {
      const src = srcOf(font)
      const missing = expectedWeights[name as FontName].filter(
        (w) => !src.some((s) => covers(s.weight, w))
      )
      expect({ name, missing }).toEqual({ name, missing: [] })
      expect({ name, styles: [...new Set(src.map((s) => s.style))] }).toEqual({
        name,
        styles: ['normal'],
      })
    }
  })

  it('loads the variable families from ONE file each, as the Google loader did', () => {
    // A file per weight added seven preloaded requests and cost Lighthouse
    // performance (FreeForCharity/FFC-IN-FFC_Single_Page_Template#479).
    expect(srcOf(openSans).map((s) => s.weight)).toEqual(['300 800'])
    expect(srcOf(faustina).map((s) => s.weight)).toEqual(['300 800'])
    expect(Object.values(allFonts).flatMap(srcOf)).toHaveLength(4)
  })

  it('points every source at a committed latin woff2 file that exists', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      const src = srcOf(font)
      expect(src.length).toBeGreaterThan(0)
      for (const { path, weight } of src) {
        const abs = resolve(FONTS_MODULE_DIR, path)
        const expectedSuffix = weight.includes(' ')
          ? '-latin-wght-normal.woff2'
          : `-latin-${weight}-normal.woff2`
        expect({ name, path, suffix: path.endsWith(expectedSuffix) }).toEqual({
          name,
          path,
          suffix: true,
        })
        expect({ name, path, exists: existsSync(abs) }).toEqual({ name, path, exists: true })
        // woff2 magic number: the file is a real font, not an LFS pointer or stub.
        expect(readFileSync(abs).subarray(0, 4).toString('latin1')).toBe('wOF2')
      }
    }
  })

  it('ships the OFL license alongside every self-hosted family', () => {
    const familyDirs = new Set(
      Object.values(allFonts).flatMap((f) =>
        srcOf(f).map((s) => resolve(FONTS_MODULE_DIR, s.path, '..'))
      )
    )
    expect(familyDirs.size).toBe(3)
    for (const dir of familyDirs) {
      const license = join(dir, 'OFL.txt')
      expect({ dir, exists: existsSync(license) }).toEqual({ dir, exists: true })
      expect(readFileSync(license, 'utf8')).toContain('SIL Open Font License, Version 1.1')
    }
  })
})

describe('no Google-hosted fonts', () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const full = join(dir, n)
      return statSync(full).isDirectory() ? walk(full) : [full]
    })

  // Same rule as check:drift's googleFontFindings: an import, re-export, dynamic
  // import or require of the module counts; naming it in a comment does not
  // (src/lib/fonts.ts explains in a comment why it is banned).
  const NEXT_FONT_GOOGLE =
    /\b(?:from|import|require)\s*\(?\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)*(['"])next\/font\/google(?:\/[^'"]*)?\1/g
  // Same scan as check:drift's commentSpans: one pass that tracks strings and
  // url(...), so a `//` or `/*` inside a string is not a comment. '...' and
  // "..." strings end at a line break, as in JS.
  const commentSpans = (body: string) => {
    const spans: Array<[number, number]> = []
    let i = 0
    while (i < body.length) {
      const ch = body[i]
      if (ch === '"' || ch === "'" || ch === '`') {
        i++
        while (i < body.length && body[i] !== ch && (ch === '`' || body[i] !== '\n')) {
          i += body[i] === '\\' ? 2 : 1
        }
        i++
      } else if (/^url\(/i.test(body.slice(i, i + 4))) {
        const end = body.indexOf(')', i)
        i = end === -1 ? body.length : end + 1
      } else if (ch === '/' && (body[i + 1] === '*' || body[i + 1] === '/')) {
        const end = body[i + 1] === '*' ? body.indexOf('*/', i + 2) : body.indexOf('\n', i)
        const stop = end === -1 ? body.length : body[i + 1] === '*' ? end + 2 : end
        spans.push([i, stop])
        i = stop
      } else i++
    }
    return spans
  }
  const inComment = (code: string, at: number) =>
    commentSpans(code).some(([start, stop]) => at >= start && at < stop)
  const flagged = (code: string) =>
    [...code.matchAll(NEXT_FONT_GOOGLE)].some((m) => !inComment(code, m.index ?? 0))

  it('never imports next/font/google anywhere under src/', () => {
    const offenders = walk(SRC_DIR)
      .filter((f) => /\.(tsx?|jsx?|mjs|cjs)$/.test(f))
      .filter((f) => flagged(readFileSync(f, 'utf8')))
      .map((f) => f.slice(ROOT.length + 1))
    expect(offenders).toEqual([])
  })

  it('applies that rule to imports but not to comments', () => {
    expect(flagged("import { Lato } from 'next/font/google'")).toBe(true)
    expect(flagged("const u = 'https://x.example'; import('next/font/google')")).toBe(true)
    expect(flagged("await import(/* webpackPrefetch: true */ 'next/font/google')")).toBe(true)
    expect(flagged("// import { Lato } from 'next/font/google'")).toBe(false)
    expect(flagged("const u = '//cdn.example'; import('next/font/google')")).toBe(true)
    expect(flagged("const x = 1// import('next/font/google')")).toBe(false)
    expect(flagged("const s = '/*'; import('next/font/google')")).toBe(true)
    expect(flagged("/*\n import { Lato } from 'next/font/google'\n*/")).toBe(false)
  })

  it('imports next/font/local in src/lib/fonts.ts', () => {
    const body = readFileSync(join(FONTS_MODULE_DIR, 'fonts.ts'), 'utf8')
    expect(body).toMatch(/from\s+['"]next\/font\/local['"]/)
  })
})
