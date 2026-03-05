// ============================================================
// The Edit — Sanity Studio Config
// ============================================================

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')

export default defineConfig({
  // Studio hosted at /studio inside the Next.js app
  basePath: '/studio',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Vision tool lets you run GROQ queries directly in the Studio
    // Great for testing your queries during development
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Show the "Published" badge on documents
    productionUrl: async (prev, { document }) => {
      const slug = (document as { slug?: { current?: string } }).slug?.current
      if (!slug) return prev

      const base = 'http://localhost:3000'

      if (document._type === 'product') return `${base}/products/${slug}`
      if (document._type === 'category') return `${base}/${slug}`
      if (document._type === 'buyingGuide') return `${base}/guides/${slug}`

      return prev
    },
  },
})
