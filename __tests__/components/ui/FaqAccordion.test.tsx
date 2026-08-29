import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FrequentlyAskedQuestions from '../../../src/components/ui/Frequently-Asked-Questions'
import OrangeFaqItem from '../../../src/components/ui/OrangeFaqItem'

// Both accordion components share the same accessibility contract: the toggle
// button is associated with its collapsible panel via aria-controls /
// aria-labelledby, exposes aria-expanded, and the toggle icon's alt text
// reflects the action (Expand / Collapse).
describe.each([
  ['Frequently-Asked-Questions', FrequentlyAskedQuestions],
  ['OrangeFaqItem', OrangeFaqItem],
])('%s accordion accessibility', (_name, Accordion) => {
  it('links the toggle button to its panel via aria-controls', () => {
    const { container } = render(
      <Accordion title="What is this?">
        <p>Answer body</p>
      </Accordion>
    )
    const button = screen.getByRole('button')
    const panelId = button.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()

    // Use an attribute selector rather than `#${panelId}`: useId() ids can
    // contain ':' which a CSS id selector treats as a pseudo-class separator.
    const panel = container.querySelector(`[id="${panelId}"]`)
    expect(panel).not.toBeNull()
    expect(panel).toHaveAttribute('aria-labelledby', button.id)
    expect(button.id).toBeTruthy()
  })

  it('reflects open/closed state in aria-expanded and icon alt text', () => {
    render(
      <Accordion title="What is this?">
        <p>Answer body</p>
      </Accordion>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByAltText('Expand')).toBeInTheDocument()

    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByAltText('Collapse')).toBeInTheDocument()
  })
})
