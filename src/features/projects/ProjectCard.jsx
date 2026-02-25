import { ExternalLink, Github } from 'lucide-react'
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const cardBase =
  'rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl flex flex-col'

/**
 * Single project card for Bento grid. Semantic and MX-friendly.
 * @param {{ repo: { id: number, name: string, description: string | null, html_url: string, language?: string, stargazers_count?: number }, className?: string, size?: 'default' | 'wide' | 'tall' }} props
 */
export function ProjectCard({ repo, className, size = 'default' }) {
  const description = repo.description || 'No description provided.'
  return (
    <article
      className={cn(
        cardBase,
        'transition hover:bg-white/[0.08]',
        size === 'wide' && 'md:col-span-2',
        size === 'tall' && 'md:row-span-2',
        className
      )}
      aria-labelledby={`repo-name-${repo.id}`}
      aria-describedby={`repo-desc-${repo.id}`}
    >
      <CardHeader>
        <CardTitle id={`repo-name-${repo.id}`} className="flex items-center gap-2 font-semibold">
          <Github className="h-5 w-5 shrink-0 text-white/80" aria-hidden />
          {repo.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p id={`repo-desc-${repo.id}`} className="text-sm text-white/80 line-clamp-3">
          {description}
        </p>
        {repo.language && (
          <p className="mt-2 text-xs text-white/50" aria-label="Primary language">
            {repo.language}
            {typeof repo.stargazers_count === 'number' && repo.stargazers_count > 0 && (
              <span className="ml-2"> · ★ {repo.stargazers_count}</span>
            )}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t border-white/10 pt-4">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/90 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-bg)] rounded"
          aria-label={`Open repository ${repo.name} on GitHub`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View on GitHub
        </a>
      </CardFooter>
    </article>
  )
}
