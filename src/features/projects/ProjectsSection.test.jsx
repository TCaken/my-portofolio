import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectsSection } from './ProjectsSection'

vi.mock('lucide-react', () => ({ Github: () => <span data-testid="icon-github" /> }))

function wrapper({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('ProjectsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders section with accessible heading', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })
    render(<ProjectsSection />, { wrapper })
    expect(screen.getByRole('heading', { name: /featured projects/i })).toBeInTheDocument()
  })

  it('has correct section semantics for MX', () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })
    render(<ProjectsSection />, { wrapper })
    const section = screen.getByRole('region', { name: /featured projects/i })
    expect(section).toHaveAttribute('id', 'projects')
    expect(section).toHaveAttribute('aria-labelledby', 'projects-heading')
  })
})
