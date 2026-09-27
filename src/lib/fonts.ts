import localFont from 'next/font/local'

// Only the three font families actually used by the template are loaded:
//   - Open Sans  -> .aria-font / #header
//   - Lato       -> .lato-font (and Tailwind --font-sans)
//   - Faustina   -> body default / .faustina-font (and --font-serif-display)
// Earlier the template loaded eight families; the others (Raleway, Cantata
// One, Fauna One, Montserrat, Cinzel) were only referenced by components that
// have since been removed, so loading them just cost bytes and main-thread
// work. Add a family back here (and a matching CSS rule) if you start using it.
//
// The fonts are SELF-HOSTED (src/app/fonts/<family>/, latin subset, normal
// style, one woff2 per weight — copied from the @fontsource 5.3.0 packages,
// each directory carrying its OFL license). The Google loader in next/font
// downloads the files from Google during `next build`, which made builds fail
// whenever that fetch did (FreeForCharity/FFC-IN-Footer_Only_Template#163) — a
// build must never depend on Google. `scripts/check-drift.mjs` rejects any
// import of that loader, or any Google Fonts URL, under src/.
//
// next/font/local resolves `path` relative to THIS file, and every argument
// must be a literal (the compiler reads it statically), so the weight lists
// are spelled out rather than generated.
export const openSans = localFont({
  src: [
    {
      path: '../app/fonts/open-sans/open-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/open-sans/open-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/open-sans/open-sans-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../app/fonts/open-sans/open-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../app/fonts/open-sans/open-sans-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-open-sans',
  adjustFontFallback: 'Arial',
})

export const lato = localFont({
  src: [
    { path: '../app/fonts/lato/lato-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../app/fonts/lato/lato-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-lato',
  adjustFontFallback: 'Arial',
})

export const faustina = localFont({
  src: [
    {
      path: '../app/fonts/faustina/faustina-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/faustina/faustina-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../app/fonts/faustina/faustina-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../app/fonts/faustina/faustina-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-faustina',
  adjustFontFallback: 'Times New Roman',
})
