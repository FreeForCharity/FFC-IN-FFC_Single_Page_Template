import React from 'react'
import { render, screen } from '@testing-library/react'
import EndowmentFeatures from '../../../src/components/home-page/Endowment-Features'

describe('Endowment-Features', () => {
  it('renders the section heading', () => {
    render(<EndowmentFeatures />)
    expect(
      screen.getByRole('heading', { name: /Free For Charity Endowment Features/i })
    ).toBeInTheDocument()
  })
})
