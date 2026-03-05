// ============================================================
// The Edit — Category Page (/[category])
// ISR: revalidates every hour
// ============================================================

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import {
  ALL_CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from '@/lib/queries'
import { FilterableGrid } from '@/components/features/FilterableGrid'
import type { Category, ProductCardData } from '@/types'

export const revalidate = 3600

// ── Static params ──────────────────────────────────────────────
export async function generateStaticParams() {
  const categories = await client.fetch<Array<{ slug: { current: string } }>>(
    ALL_CATEGORIES_QUERY
  )
  return categories.map((cat) => ({ category: cat.slug.current }))
}

// ── Metadata ───────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = await client.fetch<Category | null>(CATEGORY_BY_SLUG_QUERY, {
    slug: category,
  })

  if (!cat) return { title: 'Category Not Found' }

  return {
    title: cat.title,
    description: cat.description,
  }
}

// ── Page ───────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  const [cat, products] = await Promise.all([
    client.fetch<Category | null>(CATEGORY_BY_SLUG_QUERY, { slug: category }),
    client.fetch<ProductCardData[]>(PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug: category,
    }),
  ])

  if (!cat) notFound()

  // Collect all unique tags from products in this category
  const allTags = Array.from(
    new Set(products.flatMap((p) => p.tags ?? []))
  ).sort()

  return (
    <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
      {/* Category header */}
      <div className="mb-10">
        {cat.icon && (
          <span className="text-4xl block mb-3" role="img" aria-label={cat.title}>
            {cat.icon}
          </span>
        )}
        <h1 className="font-sans tracking-wide text-3xl md:text-4xl font-bold text-ink mb-2">
          {cat.title}
        </h1>
        {cat.description && (
          <p className="text-muted max-w-xl leading-relaxed">{cat.description}</p>
        )}
      </div>

      {/* Filterable product grid */}
      <FilterableGrid products={products} allTags={allTags} />
    </div>
  )
}
