/**
 * The root layout must emit the Google Consent Mode bootstrap inline in
 * <head> BEFORE the <GoogleTagManager /> component, so the consent
 * defaults (region-scoped denial, then unscoped grant) are already in the
 * dataLayer when any Google tag initializes.
 *
 * The layout cannot be rendered under Jest (next/font imports — see the
 * coverage exclusion in jest.config.js), so this asserts on the layout
 * source, and the bootstrap's own contents are asserted for real in
 * __tests__/lib/consent-mode.test.ts.
 */
import fs from 'fs'
import path from 'path'
import { CONSENT_MODE_BOOTSTRAP } from '../../src/lib/consent-mode'

const layoutSource = fs.readFileSync(path.join(__dirname, '../../src/app/layout.tsx'), 'utf8')

describe('root layout consent-mode bootstrap', () => {
  it('imports the bootstrap from the consent-mode lib', () => {
    expect(layoutSource).toMatch(/import \{ CONSENT_MODE_BOOTSTRAP \} from '@\/lib\/consent-mode'/)
  })

  it('emits the bootstrap as an inline script', () => {
    expect(layoutSource).toContain('dangerouslySetInnerHTML={{ __html: CONSENT_MODE_BOOTSTRAP }}')
  })

  it('emits the bootstrap BEFORE <GoogleTagManager />, inside <head>', () => {
    const bootstrapIndex = layoutSource.indexOf('__html: CONSENT_MODE_BOOTSTRAP')
    const gtmIndex = layoutSource.indexOf('<GoogleTagManager />')
    const headCloseIndex = layoutSource.indexOf('</head>')
    expect(bootstrapIndex).toBeGreaterThan(-1)
    expect(gtmIndex).toBeGreaterThan(-1)
    expect(headCloseIndex).toBeGreaterThan(-1)
    expect(bootstrapIndex).toBeLessThan(gtmIndex)
    expect(gtmIndex).toBeLessThan(headCloseIndex)
  })

  it('the emitted bootstrap denies storage globally, with no region carve-out', () => {
    // What the layout injects is the lib constant verbatim. The ordering
    // case above only proves the bootstrap runs first; this proves what it
    // says when it does. Both matter: running a permissive default early is
    // worse than running it late.
    expect(CONSENT_MODE_BOOTSTRAP).toContain("gtag('consent', 'default'")
    expect(CONSENT_MODE_BOOTSTRAP).toContain("'analytics_storage': 'denied'")
    expect(CONSENT_MODE_BOOTSTRAP).not.toContain("'region'")
    expect(CONSENT_MODE_BOOTSTRAP).not.toContain("'analytics_storage': 'granted'")
  })
})
