import { render, screen, waitFor } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('@/lib/api', () => ({
  getPortfolio: jest.fn(() => Promise.resolve({
    profile: {
      name: 'Test Name',
      title: 'Test Title',
      about: 'Test About',
      email: 'test@example.com',
      github_url: 'https://github.com/test',
      linkedin_url: 'https://linkedin.com/in/test'
    },
    skills: [],
    projects: []
  }))
}))

describe('Home', () => {
  it('renders a heading after loading', async () => {
    render(<Home />)

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Test Name/i)
    })
  })
})
