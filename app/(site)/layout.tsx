// ============================================================
// The Edit — Site Layout
// Wraps all public-facing pages with header + footer.
// Header nav fetches categories as a Server Component.
// ============================================================

import Link from 'next/link'
import { client } from '@/lib/sanity'
import { ALL_CATEGORIES_QUERY } from '@/lib/queries'
import type { Category } from '@/types'

async function SiteHeader() {
  const categories = await client.fetch<Category[]>(ALL_CATEGORIES_QUERY)

  return (
    <header className="sticky top-0 z-50 bg-terracotta">
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-sans uppercase tracking-widest text-2xl font-bold text-white hover:text-black transition-colors"
          >
            The Edit
          </Link>

          {/* Category nav — hidden on small screens, shown md+ */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/${cat.slug.current}`}
                className="text-sm uppercase tracking-wide text-white hover:text-ink transition-colors font-medium"
              >
                {cat.title}
              </Link>
            ))}
          </nav>

          {/* Guides link */}
          <div className="flex items-center gap-4">
            <Link
              href="/guides"
              className="text-sm uppercase tracking-wide font-medium text-white hover:text-ink transition-colors hidden md:block"
            >
              Guides
            </Link>
          </div>
        </div>

        {/* Mobile category nav — horizontal scroll */}
        <nav className="md:hidden flex gap-4 overflow-x-auto pb-3 pt-1 -mx-4 px-4 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${cat.slug.current}`}
              className="text-sm text-muted hover:text-ink transition-colors whitespace-nowrap font-medium"
            >
              {cat.title}
            </Link>
          ))}
          <Link
            href="/guides"
            className="text-sm font-medium text-muted hover:text-ink transition-colors whitespace-nowrap"
          >
            Guides
          </Link>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream mt-20">
      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-sans tracking-wide text-lg font-bold text-ink mb-2">
              The Edit
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              The good stuff, curated for how you actually live.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Browse
            </p>
            <ul className="space-y-2">
              {['kitchen', 'bedroom', 'living-room', 'home-tech', 'decor', 'under-50'].map(
                (slug) => (
                  <li key={slug}>
                    <Link
                      href={`/${slug}`}
                      className="text-sm text-muted hover:text-ink transition-colors capitalize"
                    >
                      {slug.replace(/-/g, ' ')}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Disclosure */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
              Disclosure
            </p>
            <p className="text-xs text-muted leading-relaxed">
              The Edit participates in affiliate programs. We may earn a
              commission when you purchase through our links, at no extra cost
              to you. We only recommend products we genuinely believe in.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} The Edit. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            All product links are affiliate links.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
