import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        // Variants
        variant === 'primary' &&
          'bg-terracotta text-white hover:bg-terracotta-dark active:bg-terracotta-dark',
        variant === 'secondary' &&
          'bg-cream-dark text-ink border border-border hover:bg-gray-200 active:bg-gray-300',
        variant === 'ghost' &&
          'text-terracotta hover:bg-cream-dark active:bg-gray-200',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm gap-1.5',
        size === 'md' && 'px-5 py-2.5 text-sm gap-2',
        size === 'lg' && 'px-6 py-3 text-base gap-2',
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
