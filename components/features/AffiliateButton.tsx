'use client'

// Must be a Client Component — uses onClick + window.open
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AffiliateButtonProps {
  productSlug: string
  retailer: string
  affiliateUrl: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AffiliateButton({
  productSlug,
  retailer,
  affiliateUrl,
  label,
  size = 'lg',
}: AffiliateButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, retailer }),
      })
    } catch {
      // Non-blocking — open the link even if tracking fails
    } finally {
      setLoading(false)
    }

    window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleClick}
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Opening…' : (label ?? `Shop at ${retailer}`)}
    </Button>
  )
}
