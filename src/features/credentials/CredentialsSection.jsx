import { Award, ShieldCheck } from 'lucide-react'
import { resume } from '@/data/resume'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CredentialsSection() {
  return (
    <section
      id="credentials"
      role="region"
      aria-labelledby="credentials-heading"
      className="scroll-mt-20"
    >
      <h2
        id="credentials-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <ShieldCheck className="h-7 w-7 shrink-0" aria-hidden />
        Certifications & Awards
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldCheck className="h-5 w-5 text-white/70" aria-hidden />
            Certifications
          </h3>
          <ul className="space-y-3" role="list">
            {resume.certifications.map((cert) => (
              <li key={cert.name}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="py-3 px-4">
                    <p className="text-sm font-medium text-white">{cert.name}</p>
                    <p className="text-xs text-white/60">{cert.date}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Award className="h-5 w-5 text-white/70" aria-hidden />
            Awards
          </h3>
          <ul className="space-y-3" role="list">
            {resume.awards.map((a) => (
              <li key={a.name}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="py-3 px-4">
                    <p className="text-sm font-medium text-white">{a.name}</p>
                    <p className="text-xs text-white/70">{a.detail}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
