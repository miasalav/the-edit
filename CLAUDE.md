# Project: The Edit
A curated affiliate lifestyle storefront for tasteful, affordable products.
Target audience: style-conscious young adults (20s–30s). Editorial tone — think
Apartment Therapy meets Wirecutter. Built with Next.js 15 App Router + Sanity CMS.

---

## Tech Stack
- **Framework:** Next.js 15, App Router ONLY — never use Pages Router patterns
- **Language:** TypeScript strict mode — `noImplicitAny: true`, no `any` types ever
- **CMS:** Sanity v3 — all content lives here, never hardcode content in components
- **Styling:** Tailwind CSS utility classes only — no custom CSS files, no inline styles
- **Fonts:** Next.js `next/font` — loaded in `/app/layout.tsx`, never via `<link>` tags
- **Images:** `next/image` always — never raw `<img>` tags
- **Links:** `next/link` for all internal navigation — never raw `<a>` tags
- **Deployment:** Vercel

---

## Folder Structure
```
app/
  (site)/               → all public-facing routes
    page.tsx            → homepage (/)
    [category]/
      page.tsx          → /kitchen, /bedroom, /tech, /decor
    products/
      [slug]/
        page.tsx        → /products/[slug]
    guides/
      page.tsx          → /guides
      [slug]/
        page.tsx        → /guides/[slug]
    layout.tsx          → shared nav + footer for all site pages
  studio/
    [[...tool]]/
      page.tsx          → Sanity Studio at /studio
  api/
    track/
      route.ts          → affiliate click tracking endpoint
  layout.tsx            → root layout (fonts, metadata, providers)
  sitemap.ts            → dynamic sitemap
  robots.ts             → robots.txt

components/
  ui/                   → atomic, stateless: Button, Badge, Card, Rating
  features/             → composed, domain-aware: ProductCard, AffiliateButton

lib/
  sanity.ts             → Sanity client (read-only, public)
  sanity.server.ts      → Sanity client (with write token, server-only)
  queries.ts            → ALL GROQ queries defined here, nowhere else
  utils.ts              → shared helpers (formatPrice, truncate, cn)

types/
  index.ts              → all TypeScript interfaces (Product, Category, Guide, Click)

sanity/
  schemaTypes/          → all Sanity schema definitions
  structure.ts          → Studio desk structure
  sanity.config.ts      → Sanity project config
```

---

## Rendering Strategy (CRITICAL — follow this exactly)

| Route | Strategy | Implementation |
|---|---|---|
| `/` homepage | ISR | `revalidate: 3600` (1 hour) |
| `/[category]` | ISR | `revalidate: 3600` |
| `/products/[slug]` | ISR | `revalidate: 7200` |
| `/guides` | SSG | `revalidate: false` or `generateStaticParams` |
| `/guides/[slug]` | SSG | `generateStaticParams` |
| Search UI | CSR | `'use client'` with client-side filter |
| `/studio` | Client-only | Sanity Studio, never indexed |
| `/api/track` | Server (Route Handler) | no caching |

**Rule:** Default to Server Components. Add `'use client'` ONLY when a component
uses `useState`, `useEffect`, event handlers, or browser APIs. If in doubt, ask.

---

## Data Fetching Rules
- Fetch data in Server Components, not in `useEffect`
- All GROQ queries live in `/lib/queries.ts` — never write inline GROQ in components
- Use the Sanity client from `/lib/sanity.ts` in Server Components
- Never expose the Sanity write token to the client — use `/lib/sanity.server.ts` server-side only
- Always project only the fields you need in GROQ — never fetch `...` (all fields)
- Use `generateStaticParams` for all dynamic SSG routes

---

## Sanity Schema — Content Types

### Product
```
title, slug, tagline, description (block),
price (number), affiliateUrl (url), retailer (string),
category (reference → Category), tags (array of strings),
images (array of image), rating (1–5),
pros (array of string), cons (array of string),
featured (boolean), publishedAt (datetime)
```

### Category
```
title, slug, description, coverImage, icon (string), order (number)
```

### BuyingGuide
```
title, slug, intro (block), category (reference → Category),
products (array of references → Product),
publishedAt (datetime), seo { metaTitle, metaDescription }
```

---

## Component Rules
- Named exports only — never `export default` from component files
- Server Components by default — no `'use client'` unless required
- Props must be fully typed — no implicit `any`, no untyped props
- Every component that renders a product must accept `Product` from `/types/index.ts`
- `ProductCard` is the canonical product display — never build one-off product cards
- `AffiliateButton` handles ALL affiliate link clicks — it calls `/api/track` before redirecting
- Never put affiliate URLs directly in `href` — always route through `AffiliateButton`

---

## Affiliate Link Rules (Business Logic)
- ALL affiliate clicks go through `/api/track` route
- The track route: logs click → returns the affiliate URL → client redirects
- `AffiliateButton` must be a `'use client'` component (uses onClick)
- Track payload: `{ productSlug, retailer, timestamp }`
- Never expose raw affiliate URLs in the HTML source (SEO + competitor risk)

---

## Styling Rules
- Tailwind only — no custom CSS, no CSS modules, no styled-components
- Use the `cn()` utility from `/lib/utils.ts` for conditional classes (clsx + tailwind-merge)
- Color palette lives in `tailwind.config.ts` — never use arbitrary hex values in components
- All interactive elements must have `hover:` and `focus:` states
- Mobile-first: base styles = mobile, `md:` = tablet, `lg:` = desktop

---

## SEO Rules
- Every page must export a `generateMetadata` function
- Pull `metaTitle` and `metaDescription` from Sanity content where available
- Product pages: title = `${product.title} | The Edit`, description = `product.tagline`
- Open Graph image: use Sanity image URL with `?w=1200&h=630&fit=crop`
- `/sitemap.ts` must include all products, categories, and guides
- Never index `/studio` — add `noindex` to studio layout

---

## TypeScript Rules
- All types in `/types/index.ts` — never define types inline in components
- Sanity responses must be typed — use the schema to define return types
- Use `z` (Zod) for runtime validation of API route inputs
- Never use `as` type casting — fix the type properly
- Never use `!` non-null assertion — handle `null` and `undefined` explicitly

---

## Commands
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build (run this to catch errors before deploying)
- `npm run typecheck` — TypeScript check without building (`tsc --noEmit`)
- `npm run lint` — ESLint check
- `npm run validate` — runs typecheck + lint together (run after every AI session)
- `npm run sanity` — starts Sanity Studio dev server (if running standalone)

---

## NEVER Do These Things
- NEVER use `document.querySelector` or any direct DOM manipulation
- NEVER use `any` type in TypeScript
- NEVER use raw `<img>` tags — always `next/image`
- NEVER use raw `<a>` tags for internal links — always `next/link`
- NEVER write GROQ queries inline in components — use `/lib/queries.ts`
- NEVER put affiliate URLs directly in rendered HTML
- NEVER install new packages without asking first
- NEVER use inline styles or CSS modules
- NEVER add `'use client'` without a specific reason
- NEVER commit `.env.local` or any file containing API keys

---

## Environment Variables
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=        ← server only, never NEXT_PUBLIC_
SANITY_API_WRITE_TOKEN=       ← server only, never NEXT_PUBLIC_
```
`NEXT_PUBLIC_` variables are safe to expose. All others are server-only.

---

## Known Gotchas
- Sanity images require `urlFor()` from `@sanity/image-url` — import from `/lib/sanity.ts`
- ISR in App Router uses `export const revalidate = N` at the top of the route file
- `generateStaticParams` must be exported from the same file as the page component
- The Sanity Studio page needs `export const dynamic = 'force-dynamic'`
- Block content (rich text) from Sanity requires `@portabletext/react` to render
- Category slugs are the URL segment — keep them lowercase, hyphenated, no spaces
- `/api/track` must return a JSON response, not a redirect (client handles the redirect)

---

## Reference Files
- Sanity schemas: `/sanity/schemaTypes/`
- All GROQ queries: `/lib/queries.ts`
- TypeScript types: `/types/index.ts`
- Tailwind config: `/tailwind.config.ts`
- For auth patterns (if added later): see Next.js docs on middleware
