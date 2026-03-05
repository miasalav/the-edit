import { cn } from '@/lib/utils'

interface RatingProps {
  score: number
  max?: number
  className?: string
}

export function Rating({ score, max = 5, className }: RatingProps) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${score} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(score)
        const half = !filled && i < score

        return (
          <svg
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              filled || half ? 'text-terracotta' : 'text-border'
            )}
            fill={filled ? 'currentColor' : half ? 'url(#half)' : 'none'}
            stroke="currentColor"
            strokeWidth={filled || half ? 0 : 1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {half && (
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        )
      })}
      <span className="ml-1 text-xs text-muted">{score.toFixed(1)}</span>
    </div>
  )
}
