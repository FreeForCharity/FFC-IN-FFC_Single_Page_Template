import React from 'react'
import { PENDING_TEXT } from '@/lib/site.config'

/**
 * Visible stand-in for a footer-standard field the charity has not supplied
 * yet (see `PendingField` in src/lib/site.config.ts). Plain text, never a
 * link: a gap in the standard should read as a call to action, not as a
 * working control (no `tel:`, no `mailto:`, no seal, no map link).
 */
export default function PendingNote({ className = '' }: { className?: string }) {
  return <span className={`block italic ${className}`.trim()}>{PENDING_TEXT}</span>
}
