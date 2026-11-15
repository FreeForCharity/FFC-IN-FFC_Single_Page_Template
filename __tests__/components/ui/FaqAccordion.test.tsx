import React from 'react'
import { render } from '@testing-library/react'
import FrequentlyAskedQuestions from '../../../src/components/ui/Frequently-Asked-Questions'
import OrangeFaqItem from '../../../src/components/ui/OrangeFaqItem'

// Both accordion components are built on native <details>/<summary>
// (Modern Web Guidance: ui-components/accordion). The browser supplies the
// expandable-button semantics and open state, so the contract checked here
// is the structure: a closed <details> whose first child is the <summary>
// carrying the question, the answer inside, and decorative-only icons.
describe.each([
  ['Frequently-Asked-Questions', FrequentlyAskedQuestions],
  ['OrangeFaqItem', OrangeFaqItem],
])('%s accordion', (_name, Accordion) => {
  it('renders a closed <details> with the question as its <summary>', () => {
    const { container } = render(
      <Accordion title="What is this?">
        <p>Answer body</p>
      </Accordion>
    )
    const details = container.querySelector('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')

    const summary = details!.firstElementChild
    expect(summary?.tagName).toBe('SUMMARY')
    expect(summary).toHaveTextContent('What is this?')
    expect(details).toHaveTextContent('Answer body')
  })

  it('keeps the toggle icons out of the accessible name', () => {
    const { container } = render(
      <Accordion title="What is this?">
        <p>Answer body</p>
      </Accordion>
    )
    const summary = container.querySelector('summary')!
    for (const img of Array.from(summary.querySelectorAll('img'))) {
      expect(img).toHaveAttribute('alt', '')
    }
    // No hand-rolled ARIA: <details> exposes the expanded state itself
    expect(summary).not.toHaveAttribute('aria-expanded')
    expect(summary).not.toHaveAttribute('aria-controls')
  })
})
