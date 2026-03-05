import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'default' | 'featured' | 'tag'
  className?: string
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variant === 'default' && 'bg-gray-100 text-muted',
        variant === 'featured' && 'bg-terracotta text-white',
        variant === 'tag' && 'bg-cream-dark text-muted border border-border',
        className
      )}
    >
      {label}
    </span>
  )
}
