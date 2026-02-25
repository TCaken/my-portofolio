import { GraduationCap } from 'lucide-react'
import { resume } from '@/data/resume'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function EducationSection() {
  return (
    <section
      id="education"
      role="region"
      aria-labelledby="education-heading"
      className="scroll-mt-20"
    >
      <h2
        id="education-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <GraduationCap className="h-7 w-7 shrink-0" aria-hidden />
        Education
      </h2>

      <ul className="space-y-6" role="list">
        {resume.education.map((edu) => (
          <li key={edu.school}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">
                  {edu.degree}
                </CardTitle>
                <p className="text-sm font-medium text-white/80">{edu.school}</p>
                <p className="text-sm text-white/60">{edu.period}</p>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-white/80" role="list">
                  {edu.details.map((d, i) => (
                    <li key={i}>{d}</li>
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
