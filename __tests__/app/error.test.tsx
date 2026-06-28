import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GlobalError from '@/app/error'
import { siteConfig } from '@/lib/site.config'

describe('error page (GlobalError)', () => {
  // The component logs to console.error outside production; silence it so the
  // test output stays clean.
  let errorSpy: jest.SpyInstance
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    errorSpy.mockRestore()
  })

  it('renders branded error copy', () => {
    render(<GlobalError error={new Error('boom')} reset={() => {}} />)
    expect(screen.getByRole('heading', { name: /unexpected error/i })).toBeInTheDocument()
    // Substring match (not a RegExp built from config) so a fork name with
    // regex metacharacters can't break or throw.
    expect(screen.getByText(siteConfig.name, { exact: false })).toBeInTheDocument()
  })

  it('calls reset when "Try again" is clicked', () => {
    const reset = jest.fn()
    render(<GlobalError error={new Error('boom')} reset={reset} />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('shows the digest reference id when present', () => {
    const err = Object.assign(new Error('boom'), { digest: 'abc123' })
    render(<GlobalError error={err} reset={() => {}} />)
    expect(screen.getByText(/abc123/)).toBeInTheDocument()
  })
})
