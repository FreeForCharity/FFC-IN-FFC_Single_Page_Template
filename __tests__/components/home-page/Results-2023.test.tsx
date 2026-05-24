import React from 'react'
import { render, screen } from '@testing-library/react'

// Results-2023 renders four ResultCards, each of which uses framer-motion's
// IntersectionObserver-backed useInView via AnimatedNumber. Mock framer-motion
// so the static render path is taken (same shape as the AnimatedNumber and
// ResultCard suite mocks).
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

import Results from '../../../src/components/home-page/Results-2023'

describe('Results-2023', () => {
  it('renders the section heading', () => {
    render(<Results />)
    expect(screen.getByRole('heading', { level: 1, name: /Results - 2023/i })).toBeInTheDocument()
  })

  it('mounts under the #results section landmark id', () => {
    const { container } = render(<Results />)
    expect(container.querySelector('#results')).not.toBeNull()
  })

  it('renders four stat cards', () => {
    const { container } = render(<Results />)
    // Each ResultCard wraps a value in <h1>; the section heading is also <h1>,
    // so the count is 1 (heading) + 4 (cards) = 5.
    const headings = container.querySelectorAll('h1')
    expect(headings.length).toBe(5)
  })
})
