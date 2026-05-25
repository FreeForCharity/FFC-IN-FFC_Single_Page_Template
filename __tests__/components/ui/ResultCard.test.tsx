import React from 'react'
import { render, screen } from '@testing-library/react'

// Reuse the same framer-motion mock pattern as AnimatedNumber.test.tsx —
// ResultCard renders AnimatedNumber for numeric titles, and that pulls in
// IntersectionObserver-backed hooks that jsdom doesn't provide.
jest.mock('framer-motion', () => {
  return {
    useReducedMotion: () => true,
    useInView: () => true,
    useMotionValue: (initial: number) => ({
      set: jest.fn(),
      get: () => initial,
      on: () => () => undefined,
    }),
    useSpring: (mv: { on: (event: string, cb: (latest: number) => void) => () => void }) => mv,
    motion: new Proxy(
      {},
      {
        get: () => {
          const Pass = ({ children, ...rest }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement('span', rest, children)
          return Pass
        },
      }
    ),
  }
})

import ResultCard from '../../../src/components/ui/ResultCard'

describe('ResultCard', () => {
  it('renders the title and description when title is non-numeric', () => {
    render(<ResultCard title="N/A" description="No data this year" />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
    expect(screen.getByText('No data this year')).toBeInTheDocument()
  })

  it('wraps a numeric title in AnimatedNumber (renders the parsed number)', () => {
    render(<ResultCard title="125" description="Volunteers" />)
    expect(screen.getByText('125')).toBeInTheDocument()
    expect(screen.getByText('Volunteers')).toBeInTheDocument()
  })

  it('renders the title inside an <h1>', () => {
    render(<ResultCard title="50" description="Partners" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('50')
  })

  it('falls back to plain text for titles that mix digits and letters', () => {
    render(<ResultCard title="100+" description="Hours" />)
    expect(screen.getByText('100+')).toBeInTheDocument()
  })
})
