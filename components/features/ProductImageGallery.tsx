'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'

interface GalleryImage {
  url: string
  alt: string
}

interface ProductImageGalleryProps {
  images: GalleryImage[]
  featured: boolean
}

export function ProductImageGallery({ images, featured }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  if (activeImage === undefined) {
    return (
      <div className="aspect-square rounded-lg bg-cream-dark flex items-center justify-center text-muted text-sm">
        No image
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-cream-dark">
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <Badge label="Staff Pick" variant="featured" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-none w-16 h-16 rounded overflow-hidden bg-cream-dark border-2 transition-colors ${
                i === activeIndex ? 'border-terracotta' : 'border-border hover:border-border-strong'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
