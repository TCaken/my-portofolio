import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-white/15 text-white border border-white/20 hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/50',
  outline: 'border border-white/30 bg-transparent hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50',
  ghost: 'hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50',
}

export function Button({ className, variant = 'default', ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  )
}
