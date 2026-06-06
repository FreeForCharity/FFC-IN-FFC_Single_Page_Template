#!/usr/bin/env node
/**
 * Link checker that serves ./out the way GitHub Pages does and points
 * linkinator at it.
 *
 * Why: linkinator's built-in file server does not map a clean URL like
 * `/privacy-policy` to `privacy-policy.html` — it only resolves exact files
 * or `<dir>/index.html`. Our static export (Next.js `output: 'export'` with
 * the default no-trailing-slash scheme) emits `privacy-policy.html`, and
 * GitHub Pages serves `/privacy-policy` from it via .html fallback. Pointing
 * linkinator at the raw directory therefore produced false 404s for every
 * policy route. Serving through this small GitHub-Pages-equivalent handler
 * resolves them correctly while still surfacing genuinely broken links.
 *
 * The linkinator skip list / retry config still comes from
 * `.linkinatorrc.json` via the CLI `--config` flag.
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..', 'out')
const PORT = Number(process.env.LINK_CHECK_PORT || 3100)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

// Resolve a request path to a file on disk, mirroring how `serve` and
// GitHub Pages answer a static export with the no-trailing-slash scheme:
//   /foo       -> out/foo  | out/foo.html | out/foo/index.html
//   /foo/      -> out/foo/index.html | out/foo.html
//   /foo.html  -> out/foo.html
// The trailing-slash → `.html` fallback matters because linkinator probes the
// slashed variant of clean links even when the page only links no-slash.
function resolveCandidates(urlPath) {
  const raw = urlPath.split('?')[0].split('#')[0]
  // decodeURIComponent throws on malformed percent-encoding (e.g. a stray
  // `%`). Fall back to the raw path so the server can answer 404 rather
  // than crash the whole check.
  let clean
  try {
    clean = decodeURIComponent(raw)
  } catch {
    clean = raw
  }
  // Block path traversal: normalize and strip any leading "../" segments.
  const safe = normalize(clean).replace(/^(\.\.(\/|\\|$))+/, '')
  const hadTrailingSlash = clean.endsWith('/')
  const rel = safe.replace(/^\/+/, '').replace(/\/+$/, '')
  if (rel === '') return [join(ROOT, 'index.html')]
  if (hadTrailingSlash) {
    return [join(ROOT, rel, 'index.html'), join(ROOT, `${rel}.html`)]
  }
  return [join(ROOT, rel), join(ROOT, `${rel}.html`), join(ROOT, rel, 'index.html')]
}

const server = createServer(async (req, res) => {
  for (const candidate of resolveCandidates(req.url || '/')) {
    if (!candidate.startsWith(ROOT)) continue
    try {
      const s = await stat(candidate)
      if (!s.isFile()) continue
      const body = await readFile(candidate)
      res.writeHead(200, { 'Content-Type': MIME[extname(candidate)] || 'application/octet-stream' })
      res.end(body)
      return
    } catch {
      /* try next candidate */
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
})

server.listen(PORT, () => {
  const child = spawn(
    'npx',
    [
      'linkinator',
      `http://localhost:${PORT}`,
      '--recurse',
      '--config',
      resolve(__dirname, '..', '.linkinatorrc.json'),
    ],
    { stdio: 'inherit' }
  )
  child.on('exit', (code) => {
    server.close(() => process.exit(code ?? 0))
  })
  child.on('error', (err) => {
    console.error(`[check-links] failed to launch linkinator: ${err.message}`)
    server.close(() => process.exit(1))
  })
})
