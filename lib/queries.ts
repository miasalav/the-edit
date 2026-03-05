// ============================================================
// The Edit — GROQ Queries
// ALL Sanity queries are defined here and nowhere else.
// Components import from this file — never write inline GROQ.
// Fields are always projected — never use ... (all fields).
// ============================================================

// ── Site Settings (singleton) ─────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    heroImage
  }
`

// ── Homepage ──────────────────────────────────────────────────

export const FEATURED_PRODUCTS_QUERY = `
  *[_type == "product" && featured == true] | order(publishedAt desc) [0...8] {
    _id,
    title,
    slug,
    tagline,
    price,
    retailer,
    rating,
    tags,
    featured,
    "image": images[0],
    "categorySlug": category->slug.current
  }
`

export const LATEST_GUIDE_QUERY = `
  *[_type == "buyingGuide"] | order(publishedAt desc) [0] {
    _id,
    title,
    slug,
    publishedAt,
    "productCount": count(products),
    category->{ title, slug }
  }
`

// ── Categories ────────────────────────────────────────────────

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    icon,
    order
  }
`

export const CATEGORY_BY_SLUG_QUERY = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    coverImage,
    icon,
    order
  }
`

// ── Products ──────────────────────────────────────────────────

// Used on category pages — lean projection for card display
export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && category->slug.current == $categorySlug]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    tagline,
    price,
    retailer,
    rating,
    tags,
    featured,
    "image": images[0],
    "categorySlug": category->slug.current
  }
`

// Used on product detail page — full projection
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tagline,
    description,
    price,
    affiliateUrl,
    retailer,
    rating,
    pros,
    cons,
    tags,
    images,
    featured,
    publishedAt,
    category->{ _id, title, slug }
  }
`

// Related products — same category, exclude the current one
export const RELATED_PRODUCTS_QUERY = `
  *[_type == "product"
    && category->slug.current == $categorySlug
    && slug.current != $currentSlug
  ] | order(rating desc) [0...4] {
    _id,
    title,
    slug,
    tagline,
    price,
    retailer,
    rating,
    featured,
    "image": images[0],
    "categorySlug": category->slug.current
  }
`

// All product slugs for generateStaticParams
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product"] { "slug": slug.current }
`

// ── Buying Guides ─────────────────────────────────────────────

// Lean projection for guide list/cards
export const ALL_GUIDES_QUERY = `
  *[_type == "buyingGuide"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "productCount": count(products),
    category->{ title, slug }
  }
`

// Full guide with embedded products for detail page
export const GUIDE_BY_SLUG_QUERY = `
  *[_type == "buyingGuide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    intro,
    publishedAt,
    seo,
    category->{ title, slug },
    products[]->{
      _id,
      title,
      slug,
      tagline,
      price,
      retailer,
      rating,
      tags,
      featured,
      "image": images[0],
      "categorySlug": category->slug.current
    }
  }
`

// All guide slugs for generateStaticParams
export const ALL_GUIDE_SLUGS_QUERY = `
  *[_type == "buyingGuide"] { "slug": slug.current }
`

// ── Sitemap ───────────────────────────────────────────────────

export const SITEMAP_QUERY = `
  {
    "products": *[_type == "product"] {
      "slug": slug.current,
      publishedAt
    },
    "categories": *[_type == "category"] {
      "slug": slug.current
    },
    "guides": *[_type == "buyingGuide"] {
      "slug": slug.current,
      publishedAt
    }
  }
`
