const { writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { getSiteTrustProfile } = require('../src/lib/site-trust-profile.ts')

// Node 24 loads the typed module directly. The JSON is regenerated before export.
writeFileSync(
  join(__dirname, '../public/site-profile.json'),
  JSON.stringify(getSiteTrustProfile(), null, 2) + '\n'
)
