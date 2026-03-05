// ============================================================
// The Edit — Sanity Client (Public / Read-only)
// Safe to import in Server Components and client components.
// Never put write tokens here — use sanity.server.ts for that.
// ============================================================

import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

// Validate that required env vars are present
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!apiVersion) throw new Error('Missing NEXT_PUBLIC_SANITY_API_VERSION')

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: true = serve from Sanity's CDN (cached, fast, great for ISR)
  // useCdn: false = bypass CDN (live data, use for preview mode)
  useCdn: true,
})

// ── Image URL builder ──────────────────────────────────────────
// Usage: urlFor(product.images[0]).width(800).height(600).url()
// Always use this — never construct Sanity image URLs manually.

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}
