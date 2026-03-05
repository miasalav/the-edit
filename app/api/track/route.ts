// ============================================================
// The Edit — Affiliate Click Tracking API
// POST /api/track
// Logs click data — swap console.log for a DB insert later.
// ============================================================

import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  productSlug: z.string().min(1),
  retailer: z.string().min(1),
})

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { productSlug, retailer } = result.data

  // Log the click — easy to swap for a DB insert (e.g. Supabase, PlanetScale)
  // eslint-disable-next-line no-console
  console.log(
    `[CLICK] ${new Date().toISOString()} | slug: ${productSlug} | retailer: ${retailer}`
  )

  return NextResponse.json({ success: true })
}
