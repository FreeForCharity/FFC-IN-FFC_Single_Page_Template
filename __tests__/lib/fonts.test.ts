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

  it('configures the same normal-style weights the Google definition had', () => {
    const expectedWeights: Record<FontName, string[]> = {
      openSans: ['400', '500', '600', '700', '800'],
      lato: ['400', '700'],
      faustina: ['400', '500', '600', '700'],
    }
    for (const [name, font] of Object.entries(allFonts)) {
      const src = srcOf(font)
      expect({ name, weights: src.map((s) => s.weight) }).toEqual({
        name,
        weights: expectedWeights[name as FontName],
      })
      expect({ name, styles: [...new Set(src.map((s) => s.style))] }).toEqual({
        name,
        styles: ['normal'],
      })
    }
  })

  it('points every weight at a committed latin woff2 file that exists', () => {
    for (const [name, font] of Object.entries(allFonts)) {
      const src = srcOf(font)
      expect(src.length).toBeGreaterThan(0)
      for (const { path, weight } of src) {
        const abs = resolve(FONTS_MODULE_DIR, path)
        expect({ name, path, isWoff2: /-latin-\d+-normal\.woff2$/.test(path) }).toEqual({
          name,
          path,
          isWoff2: true,
        })
        expect(path).toContain(`-latin-${weight}-normal.woff2`)
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

  it('never imports next/font/google anywhere under src/', () => {
    const offenders = walk(SRC_DIR)
      .filter((f) => /\.(tsx?|jsx?|mjs|cjs)$/.test(f))
      .filter((f) => /(['"])next\/font\/google(?:\/[^'"]*)?\1/.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(ROOT.length + 1))
    expect(offenders).toEqual([])
  })

  it('imports next/font/local in src/lib/fonts.ts', () => {
    const body = readFileSync(join(FONTS_MODULE_DIR, 'fonts.ts'), 'utf8')
    expect(body).toMatch(/from\s+['"]next\/font\/local['"]/)
  })
})
