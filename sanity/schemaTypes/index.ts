// ============================================================
// The Edit — Sanity Schema Registry
// Register all schemas here. Order controls Studio sidebar order.
// ============================================================

import { categorySchema } from './category'
import { productSchema } from './product'
import { buyingGuideSchema } from './buyingGuide'
import { siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  // Order matters: categories first since products reference them
  categorySchema,
  productSchema,
  buyingGuideSchema,
  siteSettingsSchema,
]
