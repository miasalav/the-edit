'use client'

// Client Component — handles tag filtering and sort UI
import { useState, useMemo } from 'react'
import { ProductGrid } from '@/components/features/ProductGrid'
import { cn } from '@/lib/utils'
import type { ProductCardData } from '@/types'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating'

interface FilterableGridProps {
  products: ProductCardData[]
  allTags: string[]
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
]

export function FilterableGrid({ products, allTags }: FilterableGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    const result = activeTag
      ? products.filter((p) => p.tags?.includes(activeTag))
      : products

    return [...result].sort((a, b) => {
      if (sortKey === 'price-asc') return a.price - b.price
      if (sortKey === 'price-desc') return b.price - a.price
      if (sortKey === 'rating') return b.rating - a.rating
      return 0 // 'newest' — already ordered by publishedAt from GROQ
    })
  }, [products, activeTag, sortKey])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
                activeTag === null
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-muted border-border hover:border-border-strong hover:text-ink'
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
                  activeTag === tag
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-muted border-border hover:border-border-strong hover:text-ink'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Sort + result count */}
        <div className="flex items-center gap-3 sm:ml-auto">
          <p className="text-xs text-muted whitespace-nowrap">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs border border-border rounded px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid products={filtered} />
    </div>
  )
}
