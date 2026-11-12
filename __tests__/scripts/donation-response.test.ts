import { createRequire } from 'module'
import path from 'path'

const requireScript = createRequire(path.join(process.cwd(), 'package.json'))
const { classifyDonationResponse } = requireScript('./scripts/classify-donation-response.cjs')

const block = {
  provider: 'zeffy',
  status: 403,
  server: 'cloudflare',
  body: '<title>Attention Required! | Cloudflare</title><h1>Sorry, you have been blocked</h1>',
}

describe('donation response classification', () => {
  it('reports the exact observed Zeffy challenge as unverified by automation', () => {
    expect(classifyDonationResponse(block)).toBe('automation-blocked')
  })
  it.each([
    { ...block, provider: 'paypal' },
    { ...block, status: 404 },
    { ...block, server: 'nginx' },
    { ...block, body: 'Forbidden' },
    { ...block, body: '<h1>Sorry, you have been blocked</h1>' },
  ])('keeps ordinary errors as failures: %j', (response) => {
    expect(classifyDonationResponse(response)).toBe('unreachable')
  })
  // Shape measured 2026-11-12: identical for a live hosted button and a made-up one.
  const dataDome = {
    provider: 'paypal',
    status: 403,
    server: '',
    body: '<html lang="en"><head><title>paypal.com</title><script>var re=new RegExp(\'datadome=([^;]+)\')</script>',
  }
  it("reports PayPal's DataDome challenge as unverified by automation", () => {
    expect(classifyDonationResponse(dataDome)).toBe('automation-blocked')
  })
  it.each([
    { ...dataDome, provider: 'zeffy' },
    { ...dataDome, status: 404 },
    { ...dataDome, body: '<title>paypal.com</title>Forbidden' },
    { ...dataDome, body: '<title>Error</title><script>datadome</script>' },
  ])('keeps anything short of the exact PayPal challenge a failure: %j', (response) => {
    expect(classifyDonationResponse(response)).toBe('unreachable')
  })
  it('accepts a successful provider response', () => {
    expect(classifyDonationResponse({ provider: 'zeffy', status: 200 })).toBe('reachable')
  })
  it('keeps connection failures as failures', () => {
    expect(classifyDonationResponse({ provider: 'zeffy', status: 0 })).toBe('unreachable')
  })
})
