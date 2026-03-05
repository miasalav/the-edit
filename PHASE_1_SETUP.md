# The Edit — Phase 1 Setup Guide

Phase 1 foundation files are ready. Follow these steps to get the project running.

---

## Step 1 — Scaffold the Next.js App

Run this in your terminal (do NOT skip flags):

```bash
npx create-next-app@latest the-edit \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

When prompted:
- Would you like to use Turbopack? → **No** (stability over speed for now)

---

## Step 2 — Copy Phase 1 Files

Copy every file from this folder into your new `the-edit/` project,
replacing any auto-generated files with the same name.

**Files to copy:**
```
types/index.ts
lib/sanity.ts
lib/sanity.server.ts
lib/queries.ts
lib/utils.ts
sanity/schemaTypes/category.ts
sanity/schemaTypes/product.ts
sanity/schemaTypes/buyingGuide.ts
sanity/schemaTypes/index.ts
sanity/structure.ts
sanity/sanity.config.ts
app/layout.tsx
app/globals.css
app/studio/[[...tool]]/page.tsx
app/studio/layout.tsx
tailwind.config.ts
tsconfig.json
next.config.ts
.gitignore
CLAUDE.md
```

---

## Step 3 — Install Dependencies

```bash
npm install next-sanity @sanity/image-url @portabletext/react @sanity/vision
npm install zod clsx tailwind-merge
npm install --save-dev @sanity/types
```

---

## Step 4 — Set Up Sanity

Create your Sanity project at [sanity.io](https://sanity.io) if you don't have one, then:

```bash
npm create sanity@latest -- \
  --project the-edit \
  --dataset production \
  --template clean \
  --output-path sanity-temp
```

Grab your **Project ID** from the Sanity dashboard, then:

---

## Step 5 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=   ← your project ID from sanity.io
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

To get a read token: Sanity dashboard → API → Tokens → Add API token (Viewer role).

---

## Step 6 — Run the Dev Server

```bash
npm run dev
```

Visit:
- `http://localhost:3000` — Next.js app (blank for now, pages come in Phase 2)
- `http://localhost:3000/studio` — Sanity Studio ✓

---

## Step 7 — Add Your First Content in Sanity

In the Studio at `/studio`, add these in order:

1. **Categories first** (products reference them):
   - Kitchen · 🍳 · order: 1
   - Bedroom · 🛏 · order: 2
   - Living Room · 🛋 · order: 3
   - Home Tech · 📱 · order: 4
   - Decor · 🪴 · order: 5
   - Under $50 · 💰 · order: 6

2. **Add 3–5 test products** — assign each to a category, mark one as "Staff Pick"

---

## Step 8 — Verify Phase 1 is Working

```bash
npm run validate   # should pass with 0 errors
```

Manual check — in a Server Component, add temporarily:
```typescript
import { client } from '@/lib/sanity'
import { ALL_CATEGORIES_QUERY } from '@/lib/queries'

const categories = await client.fetch(ALL_CATEGORIES_QUERY)
console.log(categories)
```

If you see your categories logged → Phase 1 complete. Remove the console.log.

---

## Phase 1 Complete ✓

You now have:
- ✅ Full TypeScript type system
- ✅ Sanity client (public + server-only)
- ✅ All GROQ queries in one place
- ✅ Shared utilities (cn, formatPrice, truncate, formatDate)
- ✅ All three Sanity schemas with validation
- ✅ Embedded Studio at /studio
- ✅ Brand Tailwind config (cream, ink, terracotta palette)
- ✅ Fonts loaded via next/font (Playfair Display + DM Sans)
- ✅ Global CSS with prose styles for rich text
- ✅ Strict TypeScript config

**Next: Phase 2 — build the components and pages.**
