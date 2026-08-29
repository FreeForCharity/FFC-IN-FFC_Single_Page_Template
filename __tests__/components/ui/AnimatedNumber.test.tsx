import React from 'react'
import { render, screen } from '@testing-library/react'

// AnimatedNumber now uses native IntersectionObserver + matchMedia (stubbed in
// jest.setup.js, which reports prefers-reduced-motion: reduce). Under that
// setting the component renders its static value path, exercised below.
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
