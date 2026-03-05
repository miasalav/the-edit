// ============================================================
// The Edit — Sanity Studio Desk Structure
// Customises the sidebar layout in the Studio.
// ============================================================

import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('The Edit — Content')
    .items([
      S.listItem()
        .title('🍳 Categories')
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('🛍 Products')
        .child(
          S.documentTypeList('product')
            .title('All Products')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('⭐ Staff Picks')
        .child(
          S.documentTypeList('product')
            .title('Staff Picks')
            .filter('featured == true')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('📖 Buying Guides')
        .child(
          S.documentTypeList('buyingGuide')
            .title('Buying Guides')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('⚙️ Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
    ])
