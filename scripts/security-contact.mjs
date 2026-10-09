/**
 * The security.txt `Contact:` rule for the post-deploy smoke check, aware of
 * `siteConfig.pending`.
 *
 * A charity whose contact email is still awaiting information lists 'email'
 * in `siteConfig.pending`, keeps `contactEmail` empty, and (per the template
 * docs) leaves the `Contact:` line out of security.txt rather than list
 * another organization's address. For that site a missing Contact line is
 * expected: it is reported as a notice, not a failure. For every other site
 * the line stays required.
 *
 * `pending` is read from the checkout's src/lib/site.config.ts, the config the
 * deployed build was made from (deploy.yml checks out the deployed commit to
 * run the smoke check). If it cannot be read, nothing is treated as pending,
 * so the check stays strict rather than quietly relaxing.
 */
import { pathToFileURL } from 'node:url'

/**
 * The fields `siteConfig` lists as pending, or [] for a missing or malformed
 * list.
 *
 * @param {string} configPath absolute path to site.config.ts
 * @returns {Promise<{ pending: string[], error: string | null }>}
 */
export async function readPendingFields(configPath) {
  try {
    // A file URL, not a bare path: on Windows import() rejects `C:\...`.
    const { siteConfig } = await import(pathToFileURL(configPath).href)
    const pending = siteConfig?.pending
    return {
      pending: Array.isArray(pending) ? pending.filter((f) => typeof f === 'string') : [],
      error: null,
    }
  } catch (err) {
    return { pending: [], error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Evaluates a served security.txt body against the Contact rule.
 *
 * @param {string} body the security.txt body
 * @param {readonly string[]} pending siteConfig.pending
 * @returns {{ ok: boolean, detail: string, notice: string | null }}
 */
export function contactCheck(body, pending) {
  const contact = /^Contact:\s*(.+)$/im.exec(body)?.[1]?.trim()
  if (contact) return { ok: true, detail: contact, notice: null }
  if (pending.includes('email')) {
    return {
      ok: true,
      detail: 'none yet',
      notice:
        "security.txt has no Contact: line, as expected while 'email' is listed in " +
        'siteConfig.pending. Add `Contact: mailto:<address>` once the charity supplies one.',
    }
  }
  return { ok: false, detail: 'missing', notice: null }
}
