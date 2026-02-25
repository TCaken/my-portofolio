import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resume } from '@/data/resume'
import { ExperienceSection } from '@/features/experience/ExperienceSection'
import { EducationSection } from '@/features/education/EducationSection'
import { SkillsSection } from '@/features/skills/SkillsSection'
import { CredentialsSection } from '@/features/credentials/CredentialsSection'
import { ProjectsSection } from '@/features/projects/ProjectsSection'
import { ContactSection } from '@/features/contact/ContactSection'

const { contact } = resume

export function HomePage() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <>
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
    </>
  )
}
