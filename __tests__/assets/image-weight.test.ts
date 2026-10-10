import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

/**
 * Image weight guard. Static export ships every byte under public/ to every
 * visitor with no Next.js image optimization, so oversized assets are a
 * permanent tax — especially on the low-bandwidth connections many charity
 * constituents use. New images must arrive web-compressed (WebP/AVIF at
 * sensible quality); this suite fails CI when one doesn't.
 *
 * Related-but-separate budgets (different measurement layers):
 * - lighthouserc.json resource-summary asserts per-PAGE transfer budgets
 *   (image 1MB, media 1MB, total 3.5MB).
 * - scripts/check-bundle-size.mjs asserts the gzipped JS bundle budget.
 * This suite asserts per-FILE source weights under public/.
 */

const PUBLIC_DIR = join(__dirname, '..', '..', 'public')
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'])
const MAX_KB = 400

// Existing assets at/over the limit, grandfathered deliberately (each has a
// reason). Shrink the list over time — never grow it without a comment.
const GRANDFATHERED = new Set<string>([])

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return IMAGE_EXTS.has(extname(entry.name).toLowerCase()) ? [full] : []
  })
}

describe('public/ image weights', () => {
  const images = walk(PUBLIC_DIR)

  it('finds images to audit (sanity)', () => {
    expect(images.length).toBeGreaterThan(0)
  })

  it(`every image is under ${MAX_KB}KB (or explicitly grandfathered)`, () => {
    // Compare raw bytes so a 400.4KB file can't sneak under the cap via
    // rounding; the rounded kb value is only for readable failure output.
    const offenders = images
      .map((file) => ({
        file: file.slice(PUBLIC_DIR.length + 1),
        bytes: statSync(file).size,
        kb: Math.round(statSync(file).size / 1024),
      }))
      .filter((i) => i.bytes > MAX_KB * 1024 && !GRANDFATHERED.has(i.file))
    expect(offenders).toEqual([])
  })

  // The mission video is click-to-play (never part of the initial page
  // weight), but the file itself must stay a reasonable on-demand download
  // (1080p30 at ~CRF 28 fits easily). Forks may remove or replace the video
  // entirely (see CONTENT_REPLACEMENT_GUIDE.md), so only enforce the ceiling
  // when the file exists instead of crashing their test run with ENOENT.
  const VIDEO_PATH = join(PUBLIC_DIR, 'videos', 'mission-video.mp4')
  const videoTest = existsSync(VIDEO_PATH) ? it : it.skip
  videoTest('mission video stays under 6MB', () => {
    const bytes = statSync(VIDEO_PATH).size
    expect(bytes).toBeLessThan(6144 * 1024)
  })
})
