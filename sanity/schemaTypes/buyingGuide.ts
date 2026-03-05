// ============================================================
// The Edit — Sanity Schema: Buying Guide
// ============================================================

import { defineField, defineType } from 'sanity'

export const buyingGuideSchema = defineType({
  name: 'buyingGuide',
  title: 'Buying Guide',
  type: 'document',
  fields: [
    // ── Core ───────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "The Best Kitchen Tools Under $50"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Primary category this guide belongs to.',
      validation: (rule) => rule.required(),
    }),

    // ── Content ────────────────────────────────────────────────
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      description: 'Editorial intro shown at the top of the guide. 2–4 paragraphs.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                  }),
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description: 'Add 5–10 products. Order them as you want them to appear.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      validation: (rule) => rule.required().min(3).max(12),
    }),

    // ── Publishing ─────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    // ── SEO ────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Shown in browser tab and search results. 50–60 chars ideal.',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Shown in search results. 150–160 chars ideal.',
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      productCount: 'products',
    },
    prepare({ title, categoryTitle, productCount }) {
      const count = Array.isArray(productCount) ? productCount.length : 0
      return {
        title,
        subtitle: `${categoryTitle} · ${count} product${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
