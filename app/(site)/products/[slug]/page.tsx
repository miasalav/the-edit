// ============================================================
// The Edit — Product Page (/products/[slug])
// ISR: revalidates every 2 hours
// ============================================================

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity'
import {
  ALL_PRODUCT_SLUGS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
} from '@/lib/queries'
import { AffiliateButton } from '@/components/features/AffiliateButton'
import { ProductGrid } from '@/components/features/ProductGrid'
import { ProductImageGallery } from '@/components/features/ProductImageGallery'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductCardData } from '@/types'

export const revalidate = 7200

// ── Static params ──────────────────────────────────────────────
export async function generateStaticParams() {
  const products = await client.fetch<Array<{ slug: string }>>(
    ALL_PRODUCT_SLUGS_QUERY
  )
  return products.map((p) => ({ slug: p.slug }))
}

// ── Metadata ───────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  })

  if (!product) return { title: 'Product Not Found' }

  const ogImage =
    product.images?.[0]
      ? urlFor(product.images[0]).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    title: product.title,
    description: product.tagline,
    openGraph: ogImage
      ? { images: [{ url: ogImage, width: 1200, height: 630 }] }
      : undefined,
  }
}

// ── Page ───────────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug,
  })

  if (!product) notFound()

  const relatedProducts = await client.fetch<ProductCardData[]>(
    RELATED_PRODUCTS_QUERY,
    {
      categorySlug: product.category.slug.current,
      currentSlug: slug,
    }
  )

  // Build image URLs for the gallery
  const galleryImages = product.images?.slice(0, 5).map((img) => ({
    url: urlFor(img).width(800).height(700).fit('crop').auto('format').url(),
    alt: img.alt ?? product.title,
  })) ?? []

  return (
    <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${product.category.slug.current}`}
          className="hover:text-ink transition-colors"
        >
          {product.category.title}
        </Link>
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main product layout: image left, details right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* ── Left: Image gallery ────────────────────────────── */}
        <ProductImageGallery images={galleryImages} featured={product.featured} />

        {/* ── Right: Product details ─────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Retailer badge */}
          <Badge label={product.retailer} variant="default" className="self-start" />

          {/* Title */}
          <h1 className="font-sans tracking-wide text-3xl md:text-4xl font-bold text-ink leading-tight">
            {product.title}
          </h1>

          {/* Tagline */}
          <p className="text-muted leading-relaxed">{product.tagline}</p>

          {/* Price + Rating row */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            <Rating score={product.rating} />
          </div>

          {/* Affiliate CTA */}
          <AffiliateButton
            productSlug={product.slug.current}
            retailer={product.retailer}
            affiliateUrl={product.affiliateUrl}
          />

          {/* Affiliate disclosure */}
          <p className="text-xs text-muted">
            Affiliate link — we may earn a commission at no extra cost to you.
          </p>

          {/* Divider */}
          <hr className="border-border" />

          {/* Pros */}
          {product.pros?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">What we love</h3>
              <ul className="space-y-1.5">
                {product.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <span className="text-success mt-0.5 flex-none">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {product.cons?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">Worth knowing</h3>
              <ul className="space-y-1.5">
                {product.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-0.5 flex-none">–</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="tag" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Description (PortableText) ─────────────────────────── */}
      {product.description?.length > 0 && (
        <div className="mt-14 pt-10 border-t border-border">
          <h2 className="font-sans tracking-wide text-xl font-bold text-ink mb-5">
            About this product
          </h2>
          <div className="prose prose-stone max-w-prose text-sm leading-relaxed text-ink">
            <PortableText value={product.description} />
          </div>
        </div>
      )}

      {/* ── Related Products ───────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 pt-10 border-t border-border">
          <h2 className="font-sans tracking-wide text-xl font-bold text-ink mb-7">
            You might also like
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
