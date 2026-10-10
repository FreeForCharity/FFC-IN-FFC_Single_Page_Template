/**
 * Helper function to construct asset paths that work with GitHub Pages basePath
 *
 * When deployed to GitHub Pages at freeforcharity.github.io/FFC-IN-FFC_Single_Page_Template/,
 * all assets need to be prefixed with the repository name. This is the
 * template's default (and tested) deployment mode — no custom domain needed.
 *
 * If a fork adds a custom domain (public/CNAME), the site serves from the
 * origin root and no basePath is needed; the deploy workflow sets
 * NEXT_PUBLIC_BASE_PATH accordingly in both cases.
 *
 * @param path - The asset path starting with /
 * @returns The full asset path including basePath if configured
 */
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${basePath}${path}`
}
