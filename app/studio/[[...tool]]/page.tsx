// ============================================================
// The Edit — Embedded Sanity Studio
// Accessible at /studio — never indexed by search engines.
// Must be a Client Component — Sanity Studio requires the browser.
// ============================================================

'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

// force-dynamic: Studio should never be statically rendered or cached
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
