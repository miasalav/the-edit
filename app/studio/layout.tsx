// ============================================================
// The Edit — Studio Layout
// Applies noindex to all /studio/* routes.
// ============================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout — Sanity Studio renders its own full UI
  return <>{children}</>
}
