import { Open_Sans, Lato, Faustina } from 'next/font/google'

// Only the three font families actually used by the template are loaded:
//   - Open Sans  -> .aria-font / #header
//   - Lato       -> .lato-font (and Tailwind --font-sans)
//   - Faustina   -> body default / .faustina-font (and --font-serif-display)
// Earlier the template loaded eight families; the others (Raleway, Cantata
// One, Fauna One, Montserrat, Cinzel) were only referenced by components that
// have since been removed, so loading them just cost bytes and main-thread
// work. Add a family back here (and a matching CSS rule) if you start using it.
export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700'],
})

export const faustina = Faustina({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-faustina',
  weight: ['400', '500', '600', '700'],
})
