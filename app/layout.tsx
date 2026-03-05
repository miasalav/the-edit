// ============================================================
// The Edit — Root Layout
// Loads fonts, sets global metadata defaults, wraps all routes.
// Fonts loaded here via next/font — never via <link> tags.
// ============================================================

import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

// Serif display font — used for headings and the wordmark
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Sans-serif body font — used for body copy, UI labels, prices
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// ── Global metadata defaults ──────────────────────────────────
// Individual pages override these with generateMetadata().

export const metadata: Metadata = {
  title: {
    default: 'The Edit — Curated Lifestyle Products',
    // Used by child pages: "Product Name | The Edit"
    template: '%s | The Edit',
  },
  description:
    'The good stuff, curated for how you actually live. Tasteful, affordable home and lifestyle products for style-conscious adults.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    siteName: 'The Edit',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body className="bg-cream text-ink font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
