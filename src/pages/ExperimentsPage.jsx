import { ExternalLink, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { experiments } from '@/data/experiments'
import { cn } from '@/lib/utils'

export function ExperimentsPage() {
  return (
    <>
      <header className="mb-12">
        <h1 className="mb-2 flex items-center gap-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          <FlaskConical className="h-10 w-10 shrink-0 text-white/80" aria-hidden />
          Experiments & stuff
        </h1>
        <p className="max-w-2xl text-xl text-white/80">
          Small projects and tools. Some live here; others move to their own site when they’re ready.
        </p>
      </header>

      <ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="List of experiments and side projects"
      >
        {experiments.map((item) => {
          const isLink = item.href != null
          const Wrapper = isLink && item.external ? 'a' : isLink ? Link : 'div'
          const wrapperProps = isLink
            ? item.external
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : { to: item.href }
            : {}

          return (
            <li key={item.id} role="listitem">
              <Wrapper
                {...(isLink ? wrapperProps : {})}
                className={cn(
                  'group block rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/[0.08]',
                  isLink && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg)]'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  {item.status === 'moved' && (
                    <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-xs text-white/80">
                      Moved out
                    </span>
                  )}
                  {isLink && item.external && (
                    <ExternalLink className="h-4 w-4 shrink-0 text-white/50 group-hover:text-white/80" aria-hidden />
                  )}
                </div>
                <p className="mt-2 text-sm text-white/70">
                  {item.description}
                </p>
              </Wrapper>
            </li>
          )
        })}
      </ul>
    </>
  )
}
