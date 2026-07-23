'use client'

import React from 'react'

interface TeamMemberCardProps {
  name: string
  role: string
  /**
   * Optional LinkedIn profile URL. When provided, the whole card becomes a
   * link to it (new tab, safe rel). When omitted, the card is plain content.
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

export default function TeamMemberCard({ name, role, linkedinUrl }: TeamMemberCardProps) {
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

  if (linkedinUrl) {
    return (
      <a
        href={linkedinUrl}
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
