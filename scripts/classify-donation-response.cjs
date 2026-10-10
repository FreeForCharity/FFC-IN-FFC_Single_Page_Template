/** A provider challenge means automation could not verify the form, not that it works. */
function classifyDonationResponse({ provider, status, server = '', body = '' }) {
  const cloudflareBlock =
    provider === 'zeffy' &&
    status === 403 &&
    /cloudflare/i.test(server) &&
    /Attention Required!\s*(?:&#124;|\|)\s*Cloudflare/i.test(body) &&
    /Sorry, you have been blocked/i.test(body)
  if (cloudflareBlock) return 'automation-blocked'
  return status >= 200 && status < 400 ? 'reachable' : 'unreachable'
}

module.exports = { classifyDonationResponse }
