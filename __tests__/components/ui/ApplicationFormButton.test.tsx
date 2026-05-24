import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ApplicationFormButton from '../../../src/components/ui/ApplicationFormButton'

describe('ApplicationFormButton', () => {
  it('renders with the default button label when no text prop is provided', () => {
    render(<ApplicationFormButton />)
    expect(
      screen.getByRole('button', { name: 'Apply to Become a Supported Charity' })
    ).toBeInTheDocument()
  })

  it('renders with a custom button label when text prop is provided', () => {
    render(<ApplicationFormButton text="Apply now" />)
    expect(screen.getByRole('button', { name: 'Apply now' })).toBeInTheDocument()
  })

  it('does not render the modal until the button is clicked', () => {
    render(<ApplicationFormButton />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the dialog when the button is clicked and shows the iframe with the default form URL', () => {
    render(<ApplicationFormButton />)
    fireEvent.click(screen.getByRole('button', { name: 'Apply to Become a Supported Charity' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const iframe = dialog.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe).toHaveAttribute('src', 'https://forms.office.com/r/vePxGq6JqG')
    expect(iframe).toHaveAttribute('title', 'Charity Application Form')
  })

  it('uses the formUrl prop when provided', () => {
    render(<ApplicationFormButton formUrl="https://forms.office.com/r/customId" />)
    fireEvent.click(screen.getByRole('button'))
    const iframe = screen.getByRole('dialog').querySelector('iframe')
    expect(iframe).toHaveAttribute('src', 'https://forms.office.com/r/customId')
  })

  it('closes the dialog when the close button is clicked', () => {
    render(<ApplicationFormButton />)
    fireEvent.click(screen.getByRole('button', { name: 'Apply to Become a Supported Charity' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close application form' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
