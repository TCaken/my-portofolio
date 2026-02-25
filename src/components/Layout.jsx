import { NavLink, Link } from 'react-router-dom'
import { resume } from '@/data/resume'
import { cn } from '@/lib/utils'

const { contact } = resume

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/#experience', label: 'Experience' },
  { to: '/#education', label: 'Education' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#credentials', label: 'Certifications' },
  { to: '/#projects', label: 'Projects' },
  { to: '/experiments', label: 'Experiments' },
  { to: '/#contact', label: 'Contact' },
]

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] font-sans text-white antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-[var(--page-bg)] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header role="banner">
        <nav
          className="sticky top-0 z-40 border-b border-white/10 bg-[var(--glass-bg)] px-4 py-3 backdrop-blur-xl sm:px-6"
          aria-label="Main navigation"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)] rounded"
              aria-label="Home"
            >
              {contact.name}
            </Link>
            <ul className="flex flex-wrap gap-4 sm:gap-6" role="list">
              {navItems.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'text-sm sm:text-base underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded',
                        isActive ? 'text-white font-medium' : 'text-white/90'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {children}
      </main>

      <footer
        role="contentinfo"
        className="mt-24 border-t border-white/10 py-8 text-center text-sm text-white/60"
      >
        <p>© {new Date().getFullYear()} {contact.name}. Built with Vite + React.</p>
      </footer>
    </div>
  )
}
