// ============================================================
// The Edit — TypeScript Interfaces
// All types live here. Never define types inline in components.
// ============================================================

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

// PortableText block type (Sanity rich text)
export interface PortableTextBlock {
  _type: string
  _key: string
  children?: Array<{
    _type: string
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  style?: string
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description: string
  coverImage: SanityImage
  icon: string
  order: number
}

export interface Product {
  _id: string
  title: string
  slug: { current: string }
  tagline: string
  description: PortableTextBlock[]
  price: number
  affiliateUrl: string
  retailer: string
  category: Category
  tags: string[]
  images: SanityImage[]
  rating: number
  pros: string[]
  cons: string[]
  featured: boolean
  publishedAt: string
}

export interface BuyingGuide {
  _id: string
  title: string
  slug: { current: string }
  intro: PortableTextBlock[]
  category: Category
  products: Product[]
  publishedAt: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export interface ClickEvent {
  productSlug: string
  retailer: string
  timestamp: string
}

// ── Projected / Partial types used in list views ──────────────
// These are leaner versions of Product used by ProductCard.
// GROQ queries project exactly these fields — no more, no less.

export interface ProductCardData {
  _id: string
  title: string
  slug: { current: string }
  tagline: string
  price: number
  retailer: string
  rating: number
  tags: string[]
  featured: boolean
  image: SanityImage | null
  categorySlug: string
}

export interface GuideCardData {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  productCount: number
  category: {
    title: string
    slug: { current: string }
  }
}

export interface SiteSettings {
  heroImage: SanityImage | null
}

// ── Sitemap data shapes ────────────────────────────────────────

export interface SitemapData {
  products: Array<{ slug: string; publishedAt: string }>
  categories: Array<{ slug: string }>
  guides: Array<{ slug: string; publishedAt: string }>
}
