/** A provider challenge means automation could not verify the form, not that it works. */
function classifyDonationResponse({ provider, status, server = '', body = '' }) {
  const cloudflareBlock =
    provider === 'zeffy' &&
    status === 403 &&
    /cloudflare/i.test(server) &&
    /Attention Required!\s*(?:&#124;|\|)\s*Cloudflare/i.test(body) &&
    /Sorry, you have been blocked/i.test(body)
  // PayPal answers every automated request -- a live hosted button and a made-up
  // one alike -- with this DataDome challenge page, so a 403 here says nothing
  // about whether the button works.
  const dataDomeBlock =
    provider === 'paypal' &&
    status === 403 &&
    /<title>\s*paypal\.com\s*<\/title>/i.test(body) &&
    /datadome/i.test(body)
  if (cloudflareBlock || dataDomeBlock) return 'automation-blocked'
  return status >= 200 && status < 400 ? 'reachable' : 'unreachable'
}

module.exports = { classifyDonationResponse }
