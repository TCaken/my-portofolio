import { Briefcase } from 'lucide-react'
import { resume } from '@/data/resume'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export function ExperienceSection() {
  return (
    <section
      id="experience"
      role="region"
      aria-labelledby="experience-heading"
      className="scroll-mt-20"
    >
      <h2
        id="experience-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <Briefcase className="h-7 w-7 shrink-0" aria-hidden />
        Experience
      </h2>

      <ul className="space-y-6" role="list" aria-label="Work experience timeline">
        {resume.experience.map((job, i) => (
          <li key={`${job.company}-${job.period}`} role="listitem">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-lg text-white">
                    {job.role}
                  </CardTitle>
                  <span className="text-sm text-white/60">{job.period}</span>
                </div>
                <p className="text-sm font-medium text-white/80">
                  {job.company}
                  {job.location && (
                    <span className="font-normal text-white/60"> · {job.location}</span>
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-white/80" role="list">
                  {job.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
