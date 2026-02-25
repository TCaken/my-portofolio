import { cn } from '@/lib/utils'

/**
 * Skeleton placeholder for loading states. Accessible and machine-friendly.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-pulse rounded-xl bg-white/10', className)}
      {...props}
    />
  )
}

/**
 * Bento-style project card skeleton for the projects grid.
 */
export function ProjectCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl',
        className
      )}
      role="status"
      aria-label="Loading project"
    >
      <Skeleton className="mb-3 h-6 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />
      <div className="mt-auto flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  )
}
