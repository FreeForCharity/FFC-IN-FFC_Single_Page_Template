import React from 'react'

interface TeamMemberCardProps {
  name: string
  role: string
  /**
   * Optional LinkedIn profile URL. When it is a safe `https://` LinkedIn URL,
   * the whole card becomes a link to it (new tab, safe rel). Anything else
   * (a non-https scheme like `javascript:`, or a non-LinkedIn host) is treated
   * as "no link" so this component can never emit an unsafe external href.
   */
  linkedinUrl?: string
}

/**
 * Build the avatar monogram from a name: the first letter of the first and
 * last whitespace-separated parts (e.g. "Clarke Moyer" -> "CM", "Cher" -> "C").
 * We deliberately render initials instead of a photo — LinkedIn's ToS prohibit
 * scraping and there is no API to fetch a third party's portrait by profile
 * URL, so a forking charity never has to source or host member photos.
 */
export function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + last).toUpperCase()
}

/**
 * Accept a URL only if it is `https://` on linkedin.com (or a subdomain like
 * `www.`/`uk.`). This is defence-in-depth: the committed team JSON is trusted,
 * but the component takes an arbitrary prop, so we refuse `javascript:` and
 * off-site hrefs rather than rendering them.
 */
export function safeLinkedInUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }
  if (parsed.protocol !== 'https:') return undefined
  const host = parsed.hostname.toLowerCase()
  if (host !== 'linkedin.com' && !host.endsWith('.linkedin.com')) return undefined
  // Return the parsed/serialized form so the href is normalized (whitespace
  // and other odd-but-parseable input are stripped) rather than echoed raw.
  return parsed.href
}

export default function TeamMemberCard({ name, role, linkedinUrl }: TeamMemberCardProps) {
  const safeUrl = safeLinkedInUrl(linkedinUrl)

  const content = (
    <div className="flex flex-col items-center max-w-[388px] w-full mx-auto">
      {/* Initials monogram on the site brand color (no photos) */}
      <div
        aria-hidden="true"
        className="relative w-[300px] h-[300px] mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-primary text-paper flex items-center justify-center"
      >
        <span className="text-[96px] font-[400] leading-none lato-font select-none">
          {memberInitials(name)}
        </span>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-2">
        <h3 className="text-[32px] font-[400] lato-font">{name}</h3>
        <p className="text-[25px] font-[400] lato-font">{role}</p>
      </div>
    </div>
  )

  if (safeUrl) {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} on LinkedIn`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[20px]"
      >
        {content}
      </a>
    )
  }

  return content
}
