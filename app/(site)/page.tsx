// ============================================================
// The Edit — Homepage (/)
// ISR: revalidates every hour
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import {
  FEATURED_PRODUCTS_QUERY,
  ALL_CATEGORIES_QUERY,
  LATEST_GUIDE_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/queries'
import { ProductGrid } from '@/components/features/ProductGrid'
import { formatDate } from '@/lib/utils'
import type { ProductCardData, Category, GuideCardData, SiteSettings } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'The Edit — Curated Lifestyle Products',
  description:
    'The good stuff, curated for how you actually live. Tasteful, affordable home and lifestyle products.',
}

export default async function HomePage() {
  const [featuredProducts, categories, latestGuide, siteSettings] = await Promise.all([
    client.fetch<ProductCardData[]>(FEATURED_PRODUCTS_QUERY),
    client.fetch<Category[]>(ALL_CATEGORIES_QUERY),
    client.fetch<GuideCardData | null>(LATEST_GUIDE_QUERY),
    client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
  ])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-ink border-b border-border overflow-hidden">
        {siteSettings?.heroImage != null && (
          <Image
            src={urlFor(siteSettings.heroImage).width(1920).height(800).url()}
            alt={siteSettings.heroImage.alt ?? ''}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative z-10 max-w-site mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-4">
              Curated for real life
            </p>
            <h1 className="font-sans tracking-wide text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              The good stuff.
              <br />
              <span className="text-terracotta">Curated</span> for how
              <br />
              you actually live.
            </h1>
            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
              No noise. No sponsored junk. Just tasteful, affordable products
              for style-conscious adults who know what they want.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#staff-picks"
                className="inline-flex items-center px-5 py-2.5 bg-terracotta text-white text-sm font-medium rounded hover:bg-terracotta-dark transition-colors"
              >
                See Staff Picks
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded border border-white/30 hover:bg-white/20 transition-colors"
              >
                Browse Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Strip ────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="border-b border-border bg-white">
          <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex gap-3 overflow-x-auto pb-1 -mb-1">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/${cat.slug.current}`}
                  className="flex-none flex flex-col items-center gap-1.5 px-5 py-3 rounded-lg bg-cream-dark hover:bg-gray-200 border border-border hover:border-border-strong transition-all group"
                >
                  <span className="text-2xl" role="img" aria-label={cat.title}>
                    {cat.icon}
                  </span>
                  <span className="text-xs font-medium text-muted group-hover:text-ink transition-colors whitespace-nowrap">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Staff Picks ───────────────────────────────────────── */}
      <section
        id="staff-picks"
        className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-14"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-1">
              Hand-picked
            </p>
            <h2 className="font-sans tracking-wide text-2xl md:text-3xl font-bold text-ink">
              Staff Picks
            </h2>
          </div>
        </div>

        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted text-sm">
              No featured products yet — add some in the Studio.
            </p>
          </div>
        )}
      </section>

      {/* ── Latest Guide Preview ──────────────────────────────── */}
      {latestGuide && (
        <section className="border-t border-border bg-cream-dark">
          <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-2">
                  Latest Guide
                </p>
                <h2 className="font-sans tracking-wide text-2xl md:text-3xl font-bold text-ink mb-3">
                  {latestGuide.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted">
                  {latestGuide.category && (
                    <span>{latestGuide.category.title}</span>
                  )}
                  <span>·</span>
                  <span>{latestGuide.productCount} products</span>
                  <span>·</span>
                  <span>{formatDate(latestGuide.publishedAt)}</span>
                </div>
              </div>
              <Link
                href={`/guides/${latestGuide.slug.current}`}
                className="inline-flex items-center px-5 py-2.5 bg-terracotta text-white text-sm font-medium rounded hover:bg-terracotta-dark transition-colors self-start md:self-center whitespace-nowrap"
              >
                Read the Guide →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
