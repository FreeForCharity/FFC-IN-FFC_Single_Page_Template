import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import '@testing-library/jest-dom'
import { Search, type SearchEntry } from '../../src/components/search'

const SAMPLE: SearchEntry[] = [
  { path: '/about-us', title: 'About us', summary: 'Who we are' },
  { path: '/donate', title: 'Donate', summary: 'Support our mission' },
  { path: '/contact-us', title: 'Contact us', summary: 'Get in touch' },
]

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(SAMPLE),
    } as Response),
  ) as unknown as typeof fetch
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('<Search>', () => {
  it('renders an accessible search input', async () => {
    const { container } = render(<Search />)
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText(/search this site/i)).toBeInTheDocument()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('matches by title prefix and shows results', async () => {
    render(<Search />)
    const input = screen.getByLabelText(/search this site/i)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'about' } })

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /about us/i })).toBeInTheDocument()
    })
    expect(screen.queryByRole('option', { name: /donate/i })).not.toBeInTheDocument()
  })

  it('supports keyboard navigation', async () => {
    render(<Search />)
    const input = screen.getByLabelText(/search this site/i)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'us' } })

    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0))

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })
})
