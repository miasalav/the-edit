// ============================================================
// The Edit — Sanity Server-Only Client
// NEVER import this in client components or pages marked 'use client'.
// Only used for server-side writes (e.g. recording clicks to Sanity).
// The write token is never exposed to the browser.
// ============================================================

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!apiVersion) throw new Error('Missing NEXT_PUBLIC_SANITY_API_VERSION')

// Token is optional — server client degrades to read-only if not provided.
// Required only for write operations.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  // Always bypass CDN for server writes — ensures we read/write latest data
  useCdn: false,
})
