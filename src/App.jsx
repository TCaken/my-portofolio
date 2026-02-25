import { resume } from '@/data/resume'
import { ExperienceSection } from '@/features/experience/ExperienceSection'
import { EducationSection } from '@/features/education/EducationSection'
import { SkillsSection } from '@/features/skills/SkillsSection'
import { CredentialsSection } from '@/features/credentials/CredentialsSection'
import { ProjectsSection } from '@/features/projects/ProjectsSection'
import { ContactSection } from '@/features/contact/ContactSection'

const { contact } = resume

const navLinks = [
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#credentials', label: 'Certifications' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function App() {
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
            <a
              href="/"
              className="text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)] rounded"
              aria-label="Home"
            >
              {contact.name}
            </a>
            <ul className="flex flex-wrap gap-4 sm:gap-6" role="list">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-white/90 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded text-sm sm:text-base"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main
        id="main-content"
        role="main"
        className="mx-auto max-w-5xl px-6 py-16 md:py-24"
      >
        <header className="mb-20">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {contact.name}
          </h1>
          <p className="mb-4 text-xl text-white/80 leading-relaxed">
            {contact.tagline}
          </p>
          {(contact.phone || contact.email) && (
            <p className="text-sm text-white/70" aria-label="Contact details">
              {contact.phone && <span>{contact.phone}</span>}
              {contact.phone && contact.email && ' · '}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-white/90 underline-offset-2 hover:underline"
                >
                  {contact.email}
                </a>
              )}
            </p>
          )}
          {!contact.phone && !contact.email && (
            <p className="text-sm text-white/60">
              Get in touch via the contact form below.
            </p>
          )}
        </header>

        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <CredentialsSection />
        <ProjectsSection />
        <ContactSection />
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
