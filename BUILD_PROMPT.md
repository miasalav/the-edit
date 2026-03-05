# The Edit — Master Build Prompt
## Copy this into your AI tool at the start of every major session.
## It establishes full context before writing any code.

---

## PROJECT OVERVIEW

You are helping me build "The Edit" — a curated affiliate lifestyle product website
for tasteful, affordable home and lifestyle products. Target audience: style-conscious
young adults in their 20s–30s. The brand tone is editorial, clean, and trustworthy.
Think Apartment Therapy meets Wirecutter — we curate the good stuff so people don't
have to hunt for it.

This is a portfolio project demonstrating strong React/Next.js architecture with a
headless CMS. Architecture quality matters as much as features. Before writing any
code, always read CLAUDE.md for project rules.

---

## TECH STACK (exact versions)

- Next.js 15 with App Router
- TypeScript 5 with strict mode
- Sanity v3 (headless CMS)
- Tailwind CSS v3
- @portabletext/react (for Sanity rich text)
- @sanity/image-url (for Sanity image URLs)
- next-sanity (official Next.js + Sanity integration)
- zod (API route validation)
- clsx + tailwind-merge (for cn() utility)

**No other packages without asking first.**

---

## DESIGN DIRECTION

The visual style is: clean editorial, warm neutral palette, generous whitespace.
Think high-end lifestyle magazine translated to web.

- **Colors:** Warm off-white background (#FAFAF8), near-black text (#1A1612),
  terracotta/burnt orange accent (#C4622D), light warm gray for borders (#E8E2DA)
- **Typography:** A serif display font (Playfair Display or similar via next/font)
  for headings, a clean sans-serif (Inter or DM Sans) for body
- **Layout:** Max content width 1280px, generous padding, 12-column grid
- **Cards:** Minimal, image-forward. Price and retailer badge visible at a glance
- **Tone:** Every piece of copy feels curated and intentional — not salesy

---

## FULL FEATURE LIST

### Content (managed in Sanity)
- [ ] Products with: title, tagline, description, price, rating (1–5 stars),
      pros/cons list, affiliate URL, retailer name, category, tags, images
- [ ] Categories: Kitchen, Bedroom, Living Room, Home Tech, Decor, Under $50
- [ ] Buying Guides: editorial articles featuring 5–10 curated products
- [ ] Featured/Staff Pick flags on products

### Pages
- [ ] **Homepage (/)** — hero section, featured products grid, category nav,
      latest buying guide preview
- [ ] **Category page (/[category])** — all products in a category, tag filter,
      sort by (price low-high, rating, newest)
- [ ] **Product page (/products/[slug])** — full product detail, image gallery,
      pros/cons, rating, affiliate CTA, related products
- [ ] **Guides index (/guides)** — grid of all buying guides
- [ ] **Guide detail (/guides/[slug])** — rich text intro, product list with CTAs
- [ ] **Sanity Studio (/studio)** — embedded CMS for content management

### Functionality
- [ ] **Affiliate click tracking** — /api/track logs every click before redirect
- [ ] **Client-side search** — filter products by name/tag without a full reload
- [ ] **Dynamic sitemap** — /sitemap.xml with all products, categories, guides
- [ ] **SEO metadata** — generateMetadata on every page, Open Graph images
- [ ] **ISR** — product and category pages revalidate every hour automatically

---

## PHASE 1 — FOUNDATION
*Goal: Working app skeleton with Sanity connected and one full data flow end-to-end.*

### Step 1.1 — Project Setup
```
npx create-next-app@latest the-edit \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

Then install dependencies:
```
npm install next-sanity @sanity/image-url @portabletext/react
npm install zod clsx tailwind-merge
npm install --save-dev @sanity/types
```

Initialize Sanity:
```
npm create sanity@latest -- --project the-edit --dataset production --template clean
```

### Step 1.2 — Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=your_read_token
```

### Step 1.3 — TypeScript Types
Create `/types/index.ts` with these interfaces before building anything else:

```typescript
export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
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
  description: any[] // PortableText blocks
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
  intro: any[] // PortableText blocks
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
```

### Step 1.4 — Sanity Client Setup
Create `/lib/sanity.ts`:
```typescript
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '@/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}
```

### Step 1.5 — GROQ Queries
Create `/lib/queries.ts` with ALL queries. Nothing else should contain GROQ strings.

```typescript
// Homepage
export const FEATURED_PRODUCTS_QUERY = `
  *[_type == "product" && featured == true] | order(publishedAt desc) [0...8] {
    _id, title, slug, tagline, price, retailer, rating, tags, featured,
    "image": images[0],
    "categorySlug": category->slug.current
  }
`

// All categories
export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(order asc) {
    _id, title, slug, description, coverImage, icon, order
  }
`

// Products by category slug
export const PRODUCTS_BY_CATEGORY_QUERY = `
  *[_type == "product" && category->slug.current == $categorySlug]
  | order(publishedAt desc) {
    _id, title, slug, tagline, price, retailer, rating, tags,
    "image": images[0],
    category->{ title, slug }
  }
`

// Single product by slug
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id, title, slug, tagline, description, price, affiliateUrl, retailer,
    rating, pros, cons, tags, images, featured, publishedAt,
    category->{ title, slug }
  }
`

// Related products (same category, excluding current)
export const RELATED_PRODUCTS_QUERY = `
  *[_type == "product"
    && category->slug.current == $categorySlug
    && slug.current != $currentSlug
  ] | order(rating desc) [0...4] {
    _id, title, slug, tagline, price, retailer, rating,
    "image": images[0]
  }
`

// All guides
export const ALL_GUIDES_QUERY = `
  *[_type == "buyingGuide"] | order(publishedAt desc) {
    _id, title, slug, publishedAt,
    "productCount": count(products),
    category->{ title, slug }
  }
`

// Single guide by slug
export const GUIDE_BY_SLUG_QUERY = `
  *[_type == "buyingGuide" && slug.current == $slug][0] {
    _id, title, slug, intro, publishedAt, seo,
    category->{ title, slug },
    products[]->{ _id, title, slug, tagline, price, retailer, rating, tags, "image": images[0] }
  }
`

// Sitemap — all slugs
export const SITEMAP_QUERY = `
  {
    "products": *[_type == "product"]{ "slug": slug.current, publishedAt },
    "categories": *[_type == "category"]{ "slug": slug.current },
    "guides": *[_type == "buyingGuide"]{ "slug": slug.current, publishedAt }
  }
`
```

### Step 1.6 — Utility Functions
Create `/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(price)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}
```

### Step 1.7 — Sanity Schemas
Create these files in `/sanity/schemaTypes/`:

**category.ts**, **product.ts**, **buyingGuide.ts**

Each schema must match the TypeScript interfaces in `/types/index.ts` exactly.
Field names, types, and required/optional status must be in sync.

### Step 1.8 — Embedded Sanity Studio
Create `/app/studio/[[...tool]]/page.tsx`:
```typescript
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-dynamic'
export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Add to root layout metadata:
```typescript
// studio routes should never be indexed
// add this to /app/studio/layout.tsx
export const metadata = { robots: 'noindex, nofollow' }
```

**Phase 1 complete when:** You can open `/studio`, create a Category and a Product,
and `console.log` the product data in a Server Component using the Sanity client.

---

## PHASE 2 — CORE PAGES

### Step 2.1 — Tailwind Config
Update `tailwind.config.ts` to add the brand palette:
```typescript
theme: {
  extend: {
    colors: {
      cream: '#FAFAF8',
      ink: '#1A1612',
      terracotta: '#C4622D',
      border: '#E8E2DA',
      muted: '#8C8680',
    },
    fontFamily: {
      serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
    },
    maxWidth: {
      site: '1280px',
    }
  }
}
```

### Step 2.2 — Root Layout
`/app/layout.tsx` — sets up fonts, metadata defaults, and global styles.
The background should be `bg-cream text-ink`.

### Step 2.3 — Site Layout + Navigation
`/app/(site)/layout.tsx` wraps all public pages with:
- **Header:** Logo ("The Edit" in serif font), category nav links, optional search icon
- **Footer:** tagline, category links, "All links are affiliate links" disclosure

The header category nav fetches all categories as a Server Component.

### Step 2.4 — Shared Components to Build First
Build these before any pages — pages will compose from them:

**`/components/ui/Badge.tsx`**
- Props: `{ label: string, variant?: 'default' | 'featured' | 'tag' }`
- Used for tags, retailer names, "Staff Pick" label

**`/components/ui/Rating.tsx`**
- Props: `{ score: number, max?: number }`
- Renders filled/empty stars, purely visual

**`/components/ui/Button.tsx`**
- Props: `{ children, variant?: 'primary' | 'secondary' | 'ghost', size?, ...rest }`
- Primary = terracotta background

**`/components/features/ProductCard.tsx`**
- Props: `{ product: ProductCardData }` (use a Pick<Product> type)
- Shows: image (next/image), title, tagline (truncated), price, retailer badge, rating
- The entire card links to `/products/[slug]`
- "Staff Pick" badge if `product.featured === true`
- Must be a Server Component (no interactivity needed)

**`/components/features/AffiliateButton.tsx`** ← 'use client'
- Props: `{ productSlug: string, retailer: string, affiliateUrl: string, label?: string }`
- On click: POST to `/api/track`, then `window.open(affiliateUrl, '_blank')`
- Shows loading state during the POST
- Label defaults to "Shop at [retailer]"

**`/components/features/ProductGrid.tsx`**
- Props: `{ products: ProductCardData[] }`
- Responsive grid: 1 col mobile → 2 col tablet → 3–4 col desktop
- Server Component

### Step 2.5 — Homepage (/)
`/app/(site)/page.tsx` — ISR, revalidate: 3600

Sections (top to bottom):
1. **Hero** — Editorial headline, subheadline, CTA to browse categories
   - Copy suggestion: "The good stuff. Curated for how you actually live."
2. **Category Strip** — Horizontal scrollable row of category cards with icon + name
3. **Featured Products** — "Staff Picks" heading, 8-product grid using ProductGrid
4. **Latest Guide** — Preview card for the most recent buying guide

All data fetched in the Server Component using queries from `/lib/queries.ts`.

### Step 2.6 — Category Page (/[category])
`/app/(site)/[category]/page.tsx` — ISR, revalidate: 3600

- Fetch category metadata + all products in that category
- Category hero: cover image, title, description
- Tag filter bar (all unique tags from products in this category)
  - Filtering is CLIENT-SIDE — pass products as props to a `'use client'` FilterableGrid
  - No API call needed, products are already in the page
- ProductGrid of filtered results
- `generateMetadata` using category title/description
- `generateStaticParams` for all category slugs

### Step 2.7 — Product Page (/products/[slug])
`/app/(site)/products/[slug]/page.tsx` — ISR, revalidate: 7200

Layout (desktop: 2-column, mobile: stacked):
- **Left column:** Image gallery (main image + thumbnails), scrollable
- **Right column:**
  - Category breadcrumb
  - Title (serif, large)
  - Tagline (muted)
  - Price (large, bold)
  - Retailer badge
  - Star rating
  - `AffiliateButton` ← this is the CTA
  - Pros list (checkmarks, green)
  - Cons list (x marks, muted)
  - Tags row
- **Below fold:** Rich text description (PortableText), Related Products grid
- `generateMetadata` using product title + tagline
- `generateStaticParams` for all product slugs

### Step 2.8 — Affiliate Click Tracking API
`/app/api/track/route.ts`

```typescript
// POST /api/track
// Body: { productSlug: string, retailer: string }
// Response: { success: true }
// Side effect: logs the click (console.log for now, easy to swap for DB later)

import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  productSlug: z.string().min(1),
  retailer: z.string().min(1),
})

export async function POST(request: Request) {
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { productSlug, retailer } = result.data

  // Log for now — swap for database insert later
  console.log(`[CLICK] ${new Date().toISOString()} | ${productSlug} | ${retailer}`)

  return NextResponse.json({ success: true })
}
```

**Phase 2 complete when:** Homepage, one category page, one product page all load
correctly with real Sanity data, and clicking AffiliateButton logs to console.

---

## PHASE 3 — CONTENT & SEO

### Step 3.1 — Buying Guides
`/app/(site)/guides/page.tsx` — SSG

- Grid of all guides
- Each card shows: title, category, product count, publish date
- `generateStaticParams` not needed here (list page, not dynamic)

`/app/(site)/guides/[slug]/page.tsx` — SSG with `generateStaticParams`

- Rich text intro (PortableText)
- Product list with AffiliateButton on each
- Related guides sidebar
- Full SEO metadata from `guide.seo`

### Step 3.2 — Dynamic Sitemap
`/app/sitemap.ts`
```typescript
import { client } from '@/lib/sanity'
import { SITEMAP_QUERY } from '@/lib/queries'

export default async function sitemap() {
  const data = await client.fetch(SITEMAP_QUERY)
  const base = 'https://the-edit.vercel.app'

  const products = data.products.map((p: any) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.publishedAt,
  }))

  const categories = data.categories.map((c: any) => ({
    url: `${base}/${c.slug}`,
  }))

  const guides = data.guides.map((g: any) => ({
    url: `${base}/guides/${g.slug}`,
    lastModified: g.publishedAt,
  }))

  return [
    { url: base },
    { url: `${base}/guides` },
    ...categories,
    ...products,
    ...guides,
  ]
}
```

### Step 3.3 — Open Graph Images
Each product and guide page should have:
```typescript
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug)
  return {
    title: `${product.title} | The Edit`,
    description: product.tagline,
    openGraph: {
      images: [urlFor(product.images[0]).width(1200).height(630).fit('crop').url()]
    }
  }
}
```

**Phase 3 complete when:** `npm run build` succeeds, sitemap.xml is accessible,
and Open Graph tags are visible in page source.

---

## PHASE 4 — POLISH

### Step 4.1 — Client-Side Search
Add a search input to the header. On input:
- Filter products in the current view by title/tags/tagline
- This is purely client-side — no API call
- Debounce input by 300ms (use a custom `useDebounce` hook in `/hooks/useDebounce.ts`)
- Show result count: "Showing 12 of 47 products"

### Step 4.2 — Loading States
Add `loading.tsx` files for:
- `/app/(site)/loading.tsx` — skeleton loader for site pages
- Product page: skeleton for image + detail columns

Use Tailwind's `animate-pulse` for skeleton elements.

### Step 4.3 — Error Handling
Add `error.tsx` files (must be `'use client'`):
- Generic error boundary with friendly message
- "Return home" button

### Step 4.4 — Robots.txt
`/app/robots.ts`
```typescript
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/studio' }
    ],
    sitemap: 'https://the-edit.vercel.app/sitemap.xml',
  }
}
```

### Step 4.5 — Affiliate Disclosure
Add to the footer and product pages:
*"The Edit participates in affiliate programs. We may earn a commission when
you purchase through our links, at no extra cost to you."*

---

## CONTENT TO ADD IN SANITY BEFORE LAUNCH

### Categories (add these first)
1. Kitchen — 🍳
2. Bedroom — 🛏
3. Living Room — 🛋
4. Home Tech — 📱
5. Decor — 🪴
6. Under $50 — 💰

### Suggested First Products (for testing)
- A minimalist kettle ($45, Amazon)
- A ceramic spice organizer ($32, Amazon)
- A Himalayan salt lamp ($28, Amazon)
- A bamboo desk organizer ($40, Etsy)
- A linen throw blanket ($65, H&M Home)
- A smart LED bulb starter kit ($35, Amazon)

---

## VALIDATION CHECKLIST (run before considering any phase complete)

```
npm run typecheck   # zero TypeScript errors
npm run lint        # zero ESLint errors
npm run build       # successful production build

Manual checks:
□ All pages load without console errors
□ Images all use next/image
□ Internal links all use next/link
□ AffiliateButton POSTs to /api/track before opening link
□ No raw affiliate URLs in page source (View Source)
□ Sanity Studio loads at /studio
□ /sitemap.xml returns valid XML
□ Mobile layout looks correct (use DevTools)
□ All pages have correct <title> and meta description
```

---

## PROMPTING GUIDE FOR THIS PROJECT

When asking your AI tool to implement something, always structure it like this:

```
"Implement [specific file/feature] for The Edit.

Context:
- Read CLAUDE.md before writing any code
- Relevant existing files: [list them]
- This component is a [Server/Client] Component because [reason]

Requirements:
- [specific requirement 1]
- [specific requirement 2]

Constraints:
- No new packages
- Under [N] lines
- Must use [existing utility/type/query]

At the end: explain the key decisions you made."
```

---

*Built with Next.js 15 App Router + Sanity v3. Architecture by you. Code by AI.*
