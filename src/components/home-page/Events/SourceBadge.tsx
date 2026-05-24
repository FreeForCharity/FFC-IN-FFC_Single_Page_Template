import React from 'react'
import type { EventSource } from '@/lib/events/types'
import { SOURCE_LABELS } from '@/lib/events/types'

// Darker text on tinted background — verified ≥ 4.5:1 against the 50-tint bg
// per WCAG 2.2 AA for small text.
const SOURCE_STYLES: Record<EventSource, string> = {
  google: 'bg-[#E8F0FE] text-[#0B57D0] border-[#0B57D0]/40',
  microsoft: 'bg-[#E5F4FB] text-[#005A9E] border-[#005A9E]/40',
  facebook: 'bg-[#E7F0FF] text-[#0C4A9E] border-[#0C4A9E]/40',
}

export default function SourceBadge({ source }: { source: EventSource }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SOURCE_STYLES[source]}`}
      id="lato-font"
    >
      {SOURCE_LABELS[source]}
    </span>
  )
}
