import { Code2 } from 'lucide-react'
import { resume } from '@/data/resume'
import { cn } from '@/lib/utils'

const categoryOrder = [
  'Programming',
  'Web Development',
  'Cloud & DevOps',
  'Tools',
  'Languages',
]

export function SkillsSection() {
  const categories = categoryOrder.filter((c) => resume.skills[c])

  return (
    <section
      id="skills"
      role="region"
      aria-labelledby="skills-heading"
      className="scroll-mt-20"
    >
      <h2
        id="skills-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <Code2 className="h-7 w-7 shrink-0" aria-hidden />
        Skills
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
              {category}
            </h3>
            <ul className="flex flex-wrap gap-2" role="list">
              {resume.skills[category].map((skill) => (
                <li key={skill}>
                  <span
                    className={cn(
                      'inline-block rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/90',
                      'hover:bg-white/15 transition-colors'
                    )}
                  >
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
