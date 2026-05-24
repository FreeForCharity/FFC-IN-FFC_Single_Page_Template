import React from 'react'
import type { EventSource } from '@/lib/events/types'
import { SOURCE_LABELS } from '@/lib/events/types'

const SOURCE_STYLES: Record<EventSource, string> = {
  google: 'bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8]/30',
  microsoft: 'bg-[#E5F4FB] text-[#0078D4] border-[#0078D4]/30',
  facebook: 'bg-[#E7F0FF] text-[#1877F2] border-[#1877F2]/30',
}

export default function SourceBadge({ source }: { source: EventSource }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${SOURCE_STYLES[source]}`}
      id="lato-font"
    >
      {SOURCE_LABELS[source]}
    </span>
  )
}
