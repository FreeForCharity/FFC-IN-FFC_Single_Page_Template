# Search Implementation

Client-side search for static-export FFC sites. No backend, no SSR, no Algolia /
Pagefind dependency. Closes #246.

## When to use it

- Site has more than ~10 pages of meaningful content.
- Visitors arrive via search-engine or social and want to jump to specific
  topics.

If your site is a small landing page, skip this — adding a search box that
nobody uses is noise.

## What ships

| File                                       | Role                             |
| ------------------------------------------ | -------------------------------- |
| `src/components/search/Search.tsx`         | The `<Search />` React component |
| `src/components/search/index.ts`           | Barrel export                    |
| `__tests__/components/search.test.tsx`     | Unit + a11y tests                |
| `public/search-index.json` _(you provide)_ | Static search index              |

## Mounting

Add the component to your layout's header:

```tsx
// src/app/layout.tsx
import { Search } from '@/components/search'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          {/* ... existing nav ... */}
          <Search className="ml-auto" />
        </header>
        {children}
      </body>
    </html>
  )
}
```

Sites that don't want it just don't import it — there's no global side effect.

## Index format

`public/search-index.json` is an array of `SearchEntry` objects:

```json
[
  {
    "path": "/about-us",
    "title": "About us",
    "summary": "Who we are and why this charity exists",
    "body": "Optional longer text used for fuzzy match"
  }
]
```

- `path` — URL path relative to the site root. Required.
- `title` — Page title displayed in the dropdown. Required.
- `summary` — One-line description. Optional but recommended.
- `body` — Searchable body text. Optional. Not rendered.

## Scoring

Strict tiered match (higher wins):

| Match                   | Score |
| ----------------------- | ----: |
| Title equals query      |   100 |
| Title starts with query |    80 |
| Title contains query    |    60 |
| Summary contains query  |    40 |
| Body contains query     |    20 |

This is intentionally simple — no Levenshtein, no stemming, no synonyms. For
small charity sites it's enough; visitors who don't find what they want via
exact-substring match are usually better served by Google.

## Generating the index

There's no automatic indexer in the template (different sites organize content
differently). The minimum viable approach:

1. Add a build-time script that walks `src/app/**/page.tsx`, reads the frontmatter
   or first `<h1>`, and writes the index to `public/search-index.json`.
2. Wire it into `prebuild` in `package.json`:
   ```json
   {
     "scripts": {
       "prebuild": "tsx scripts/build-search-index.ts"
     }
   }
   ```

A reference implementation lives at `clarkemoyer/technologyadoptionbarriers.org`
under `scripts/`. Adopt and trim to your site.

## Accessibility

- The input is wrapped in `role="search"` with an `aria-label`.
- Results use `role="listbox"` / `role="option"` with `aria-selected`.
- Keyboard: ↑ / ↓ navigate, Enter follows the link, Esc closes.
- All tests run with `jest-axe`; the suite includes a violation check.

## Static export compatibility

The component is marked `'use client'`. It calls `fetch()` against a static
file in `public/`, so it works under `output: 'export'` without any server
component or API route.

If your site uses `NEXT_PUBLIC_BASE_PATH`, pass the prefix through `assetPath()`:

```tsx
import { assetPath } from '@/lib/assetPath'
;<Search indexUrl={assetPath('/search-index.json')} />
```

## Out of scope

- Server-side search.
- Tokenization, stemming, or language-aware indexing.
- Tracking which queries get zero results (privacy choice; sites can add
  their own GA event if they want this).
- TABS-specific corpora.
