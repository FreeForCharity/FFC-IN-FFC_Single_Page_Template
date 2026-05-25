import React from 'react'
import { render, screen } from '@testing-library/react'

// framer-motion uses IntersectionObserver (via useInView) and DOM measurements
// that jsdom doesn't provide. Mock the specific hooks the component imports
// so the static (reduced-motion) render path is exercised end-to-end.
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
          // Return a passthrough component for any motion.<tag> lookup.
          const Pass = ({ children, ...rest }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement('span', rest, children)
          return Pass
        },
      }
    ),
  }
})

import AnimatedNumber from '../../../src/components/ui/AnimatedNumber'

describe('AnimatedNumber', () => {
  it('renders the target value statically when reduced motion is preferred', () => {
    render(<AnimatedNumber value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('applies className when provided', () => {
    const { container } = render(<AnimatedNumber value={7} className="text-xl" />)
    expect(container.querySelector('.text-xl')).not.toBeNull()
  })

  it('applies id when provided', () => {
    const { container } = render(<AnimatedNumber value={3} id="impact-stat-1" />)
    expect(container.querySelector('#impact-stat-1')).not.toBeNull()
  })

  it('handles a value of zero', () => {
    render(<AnimatedNumber value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
