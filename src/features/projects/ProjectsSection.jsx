import { Github } from 'lucide-react'
import { useGitHubRepos } from './useGitHubRepos'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from '@/components/ui/skeleton'

const SKELETON_COUNT = 6

/**
 * Bento grid of GitHub repos with skeleton loading. Semantic section for MX.
 */
export function ProjectsSection() {
  const { data: repos, isLoading, error } = useGitHubRepos()

  return (
    <section
      id="projects"
      role="region"
      aria-labelledby="projects-heading"
      className="scroll-mt-20"
    >
      <h2
        id="projects-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <Github className="h-7 w-7 shrink-0" aria-hidden />
        Featured Projects
      </h2>

      {isLoading && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-live="polite"
          aria-label="Projects are loading"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <ProjectCardSkeleton
              key={i}
              className={i === 0 ? 'md:col-span-2' : ''}
            />
          ))}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/30 bg-red-950/30 p-6 text-red-200 backdrop-blur-xl"
        >
          <p className="font-medium">Could not load projects</p>
          <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && repos && repos.length > 0 && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="List of featured GitHub repositories"
        >
          {repos.map((repo, index) => (
            <div key={repo.id} role="listitem" className="contents">
              <ProjectCard
                repo={repo}
                size={
                  index === 0
                    ? 'wide'
                    : index === 2
                      ? 'tall'
                      : 'default'
                }
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && repos && repos.length === 0 && (
        <p className="text-white/70">No public repositories to show.</p>
      )}
    </section>
  )
}
