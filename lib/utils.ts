// ============================================================
// The Edit — Shared Utilities
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── cn() — conditional Tailwind class merging ─────────────────
// Usage: cn('base-class', isActive && 'active-class', className)
// Merges Tailwind classes correctly — handles conflicts like
// 'p-4 p-8' → 'p-8' rather than keeping both.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── formatPrice() ─────────────────────────────────────────────
// Formats a number as Canadian dollars.
// Usage: formatPrice(49.99) → "$50" (no cents for round numbers)

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ── truncate() ────────────────────────────────────────────────
// Truncates a string to maxLength chars, adding ellipsis.
// Usage: truncate('Long tagline text here', 60)

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

// ── formatDate() ──────────────────────────────────────────────
// Formats an ISO date string for display.
// Usage: formatDate('2024-03-15T00:00:00Z') → "March 15, 2024"

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── slugToTitle() ─────────────────────────────────────────────
// Converts a URL slug to a readable title for breadcrumbs.
// Usage: slugToTitle('home-tech') → "Home Tech"

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
