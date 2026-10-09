import React from 'react'
import { render } from '@testing-library/react'

// Self-hiding behavior (FFC-Cloudflare-Automation#816 Part B): a fork that
// clears src/data/results.ts stats should render NOTHING rather than the FFC
// sample impact numbers. Mock the data module to the empty case for this file
// only; the populated render is covered by Results-2023.test.tsx.
jest.mock('@/data/results', () => ({ results: { heading: 'Results', stats: [] } }))

import Results from '../../../src/components/home-page/Results-2023'

describe('Results-2023 — self-hiding', () => {
  it('renders nothing when there are no stat cards', () => {
    const { container } = render(<Results />)
    expect(container).toBeEmptyDOMElement()
  })
})
