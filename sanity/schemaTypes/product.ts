// ============================================================
// The Edit — Sanity Schema: Product
// ============================================================

import { defineField, defineType } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  orderings: [
    {
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Highest Rated',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Price: Low to High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
  fields: [
    // ── Core identity ──────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      description: 'The product name as it appears on site.',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One sentence editorial hook. e.g. "The last spatula you\'ll ever need."',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Full editorial description. Shown below the fold on the product page.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Pricing & purchase ─────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      description: 'Approximate retail price in Canadian dollars.',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'affiliateUrl',
      title: 'Affiliate URL',
      type: 'url',
      description: 'Full affiliate link. NEVER shown in HTML source — routed through /api/track.',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'retailer',
      title: 'Retailer',
      type: 'string',
      description: 'The store name shown to users. e.g. Amazon, IKEA, H&M Home',
      options: {
        list: [
          { title: 'Amazon', value: 'Amazon' },
          { title: 'IKEA', value: 'IKEA' },
          { title: 'H&M Home', value: 'H&M Home' },
          { title: 'Etsy', value: 'Etsy' },
          { title: 'Wayfair', value: 'Wayfair' },
          { title: 'Target', value: 'Target' },
          { title: 'West Elm', value: 'West Elm' },
          { title: 'CB2', value: 'CB2' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),

    // ── Classification ─────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Used for filtering. e.g. under-50, bestseller, staff-pick, minimalist',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'Under $50', value: 'under-50' },
          { title: 'Under $100', value: 'under-100' },
          { title: 'Bestseller', value: 'bestseller' },
          { title: 'Staff Pick', value: 'staff-pick' },
          { title: 'Minimalist', value: 'minimalist' },
          { title: 'Eco-Friendly', value: 'eco-friendly' },
          { title: 'Gift Idea', value: 'gift-idea' },
          { title: 'Trending', value: 'trending' },
        ],
      },
    }),

    // ── Media ──────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'First image is used as the card thumbnail and OG image.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),

    // ── Editorial ──────────────────────────────────────────────
    defineField({
      name: 'rating',
      title: 'Our Rating (1–5)',
      type: 'number',
      description: 'Editorial rating from The Edit team.',
      options: {
        list: [1, 2, 3, 4, 5],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      description: 'What we love. Keep each point to one concise sentence.',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      description: 'Honest drawbacks. Builds trust with readers.',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'featured',
      title: 'Staff Pick',
      type: 'boolean',
      description: 'Featured on the homepage Staff Picks grid.',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Controls sort order on category pages.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tagline',
      media: 'images.0',
      price: 'price',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, price, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `$${price} — ${subtitle}`,
        media,
      }
    },
  },
})
