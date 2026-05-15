'use client'

/**
 * Lightweight client-side search component for static-export sites.
 *
 * - Loads a static index from `/public/search-index.json` on first focus.
 * - Fuzzy-ish match: case-insensitive substring with title weighting.
 * - Full keyboard nav: ↑ / ↓ / Enter / Esc.
 * - Mount via the layout — sites that don't want it simply don't import it.
 *
 * Generated docs in `SEARCH_IMPLEMENTATION.md`. Closes #246 (UI part).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type SearchEntry = {
  /** Stable URL path for the result, e.g. `/about-us` */
  path: string
  /** Human-readable page title shown in the dropdown */
  title: string
  /** Short summary line shown under the title */
  summary?: string
  /** Searchable body text — kept on the entry, not rendered */
  body?: string
}

type Props = {
  /** Index URL. Defaults to `/search-index.json` (with assetPath when basePath is set). */
  indexUrl?: string
  /** Limit results shown. Default 8. */
  limit?: number
  /** Optional className for outer wrapper */
  className?: string
}

function score(entry: SearchEntry, q: string): number {
  if (!q) return 0
  const needle = q.toLowerCase()
  const title = entry.title.toLowerCase()
  if (title === needle) return 100
  if (title.startsWith(needle)) return 80
  if (title.includes(needle)) return 60
  if ((entry.summary ?? '').toLowerCase().includes(needle)) return 40
  if ((entry.body ?? '').toLowerCase().includes(needle)) return 20
  return 0
}

export function Search({ indexUrl = '/search-index.json', limit = 8, className }: Props) {
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadIndex = useCallback(async () => {
    if (index !== null || error) return
    try {
      const res = await fetch(indexUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: SearchEntry[] = await res.json()
      setIndex(data)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [indexUrl, index, error])

  const results = useMemo(() => {
    if (!index || !query.trim()) return [] as SearchEntry[]
    const scored = index
      .map((e) => [score(e, query.trim()), e] as const)
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0])
      .map(([, e]) => e)
    return scored.slice(0, limit)
  }, [index, query, limit])

  useEffect(() => {
    setActive(0)
  }, [query])

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      const r = results[active]
      if (r) {
        window.location.href = r.path
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={className} role="search">
      <label htmlFor="ffc-search-input" className="sr-only">
        Search this site
      </label>
      <input
        id="ffc-search-input"
        ref={inputRef}
        type="search"
        placeholder="Search…"
        value={query}
        autoComplete="off"
        onFocus={() => {
          setOpen(true)
          void loadIndex()
        }}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKey}
        aria-controls="ffc-search-results"
        aria-expanded={open && results.length > 0}
        aria-autocomplete="list"
      />
      {open && (error || results.length > 0) && (
        <ul
          id="ffc-search-results"
          role="listbox"
          aria-label="Search results"
        >
          {error && <li role="alert">Search index unavailable: {error}</li>}
          {results.map((r, i) => (
            <li
              key={r.path}
              role="option"
              aria-selected={i === active}
              data-active={i === active || undefined}
            >
              <a href={r.path} onMouseDown={(e) => e.preventDefault()}>
                <strong>{r.title}</strong>
                {r.summary && <span> — {r.summary}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search
