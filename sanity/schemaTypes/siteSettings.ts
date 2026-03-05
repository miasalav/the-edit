// ============================================================
// The Edit — Sanity Schema: Site Settings (singleton)
// One document, fixed ID "siteSettings".
// ============================================================

import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Prevent editors from creating or deleting this singleton
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image displayed behind the homepage hero text.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers (e.g. "Cosy living room with warm lighting").',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
