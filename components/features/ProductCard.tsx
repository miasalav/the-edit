// Server Component — no interactivity, just display
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { formatPrice, truncate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import type { ProductCardData } from '@/types'

interface ProductCardProps {
  product: ProductCardData
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image
    ? urlFor(product.image).width(600).height(480).fit('crop').auto('format').url()
    : null

  return (
    <Link
      href={`/products/${product.slug.current}`}
      className="group flex flex-col bg-white rounded-lg overflow-hidden border border-border hover:border-border-strong hover:shadow-sm transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[5/4] bg-cream-dark overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
            No image
          </div>
        )}

        {product.featured && (
          <div className="absolute top-3 left-3">
            <Badge label="Staff Pick" variant="featured" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Retailer */}
        <Badge label={product.retailer} variant="default" className="self-start" />

        {/* Title */}
        <h3 className="font-sans tracking-wide font-semibold text-ink text-[1rem] leading-snug group-hover:text-terracotta transition-colors">
          {product.title}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-muted leading-relaxed flex-1">
          {truncate(product.tagline, 80)}
        </p>

        {/* Price + Rating */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-border">
          <span className="font-semibold text-ink text-sm">
            {formatPrice(product.price)}
          </span>
          <Rating score={product.rating} />
        </div>
      </div>
    </Link>
  )
}
