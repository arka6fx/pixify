# AI Image Generation

## Overview

Connect the existing dashboard and generation flows to real AI image generation using OpenAI's Images API (DALL-E 3) and Vision API (GPT-4o). Replace all mock data and simulated generation with real server-side API calls, database persistence, file uploads, and proper async UX.

**Dependencies added:** `openai` (official SDK)

**Tech stack:** Next.js 16, TypeScript, Drizzle ORM + PostgreSQL, OpenAI SDK, Tailwind CSS v4, shadcn/ui, Framer Motion v12

---

## Architecture

```
src/
├── lib/
│   ├── schema.ts            # +3 tables: thumbnail, brand_asset, creator_avatar
│   ├── env.ts               # +OPENAI_API_KEY validation
│   ├── openai.ts            # NEW — OpenAI SDK wrapper (DALL-E 3 + GPT-4o vision)
│   └── generation.ts        # NEW — prompt engineering + generation orchestration
│
├── app/api/
│   ├── generate/
│   │   └── route.ts         # NEW — POST: orchestrate thumbnail generation
│   ├── upload/
│   │   └── route.ts         # NEW — POST: file upload with DB persistence
│   ├── thumbnails/
│   │   ├── route.ts         # NEW — GET: list user's thumbnails
│   │   └── [id]/
│   │       ├── route.ts     # NEW — DELETE: remove thumbnail
│   │       └── favorite/
│   │           └── route.ts # NEW — PATCH: toggle favorite
│   ├── assets/
│   │   ├── route.ts         # NEW — GET: list brand assets
│   │   └── [id]/
│   │       └── route.ts     # NEW — DELETE: delete asset
│   └── avatars/
│       ├── route.ts         # NEW — GET + POST: list + create avatar
│       └── [id]/
│           └── route.ts     # NEW — DELETE: delete avatar
│
├── app/dashboard/
│   ├── page.tsx             # MODIFY: fetch real stats + recent thumbnails
│   ├── generate/
│   │   └── page.tsx         # MODIFY: real generation flow + loading + error
│   ├── generations/
│   │   └── page.tsx         # MODIFY: fetch from API
│   ├── favorites/
│   │   └── page.tsx         # MODIFY: fetch from API
│   ├── assets/
│   │   └── page.tsx         # MODIFY: upload/fetch/delete from API
│   └── avatars/
│       └── page.tsx         # MODIFY: upload/set-default/delete from API
│
└── components/dashboard/
    ├── thumbnail-card.tsx           # MODIFY: real favorite/download/delete
    ├── generation-preview.tsx       # MODIFY: real download button
    └── generation-variations.tsx    # MODIFY: real regenerate button
```

---

## Execution Plan

### Wave 1 — Data Layer (parallel, no deps)

| Task | Files | Description |
|------|-------|-------------|
| T1: DB Schema | `src/lib/schema.ts` | Add `thumbnail`, `brand_asset`, `creator_avatar` tables with proper foreign keys to `user`. Run `drizzle generate` + `drizzle migrate`. |
| T2: Env Validation | `src/lib/env.ts` | Add `OPENAI_API_KEY` to server env schema, add `openai` npm package |

### Wave 2 — Services (sequential deps on Wave 1)

| Task | Files | Description |
|------|-------|-------------|
| T3: OpenAI Service | `src/lib/openai.ts` | `generateThumbnail(prompt, aspectRatio)` → single DALL-E 3 call (1792×1024 for 16:9). `describeImage(imageUrl)` → GPT-4o vision to analyze reference photos. Returns URLs data. |
| T4: Generation Orchestrator | `src/lib/generation.ts` | `buildEnhancedPrompt(basePrompt, style, avatarDescription?)` — enriches with style modifiers + avatar context. `generateVariations(basePrompt, style, avatarId?, count)` — 4 parallel DALL-E 3 calls with controlled prompt variation. Downloads results via `storage.ts`. |

### Wave 3 — API Routes (parallel, deps on Wave 2)

| Task | Files | Description |
|------|-------|-------------|
| T5: Generate | `src/app/api/generate/route.ts` | Auth-guarded POST. Accept `{prompt, style, avatarId?, assetIds?}`. Orchestrates generation: vision analysis → prompt enrichment → 4 parallel DALL-E 3 calls → download & store → create DB records → return 4 thumbnails. |
| T6: Upload | `src/app/api/upload/route.ts` | Auth-guarded POST. Accept multipart file + type (avatar/asset). Validate, store via `storage.ts`, create DB record, return record. |
| T7: Thumbnails CRUD | `src/app/api/thumbnails/route.ts`, `[id]/route.ts`, `[id]/favorite/route.ts` | GET list (with `?favorites` filter). DELETE single. PATCH toggle favorite. |
| T8: Assets CRUD | `src/app/api/assets/route.ts`, `[id]/route.ts` | GET list (with `?type` filter). DELETE single (remove storage + DB). |
| T9: Avatars CRUD | `src/app/api/avatars/route.ts`, `[id]/route.ts` | GET list. POST create (upload + DB). DELETE single. `set-default` logic via PATCH. |

### Wave 4 — Frontend Integration (parallel, deps on Wave 3)

| Task | Files | Description |
|------|-------|-------------|
| T10: Generate Page | `src/app/dashboard/generate/page.tsx` | Upload files on drop → POST /api/upload. Click generate → POST /api/generate. Show loading spinner + progress. Display preview + 4 variations. Add download + regenerate buttons. |
| T11: ThumbnailCard | `src/components/dashboard/thumbnail-card.tsx` | Wire favorite toggle → PATCH /api/thumbnails/[id]/favorite. Wire download → trigger file save. Wire delete → DELETE /api/thumbnails/[id] with confirmation. |
| T12: Dashboard Home | `src/app/dashboard/page.tsx` | Fetch recent 4 thumbnails + dashboard stats from API. Remove mock data. |
| T13: Generations Page | `src/app/dashboard/generations/page.tsx` | Fetch all thumbnails from GET /api/thumbnails. Filter favorites client-side. |
| T14: Favorites Page | `src/app/dashboard/favorites/page.tsx` | Fetch from GET /api/thumbnails?favorites=true. |
| T15: Assets Page | `src/app/dashboard/assets/page.tsx` | Fetch from GET /api/assets. File picker + upload to POST /api/upload. Delete with confirmation → DELETE /api/assets/[id]. |
| T16: Avatars Page | `src/app/dashboard/avatars/page.tsx` | Fetch from GET /api/avatars. Upload new. Set default via PATCH. Delete via DELETE. |

### Wave 5 — Polish (parallel, deps on Wave 4)

| Task | Files | Description |
|------|-------|-------------|
| T17: Preview Actions | `src/components/dashboard/generation-preview.tsx` | Wire download button to fetch blob + trigger browser save. Wire share button to copy URL. |
| T18: Regenerate | `src/components/dashboard/generation-variations.tsx` | Wire regenerate button to POST /api/generate with same params but new seed/prompt variation. Replace variations in-place. |
| T19: next.config | `next.config.ts` | Add `oaidalleapiprodscus.blob.core.windows.net` to image remotePatterns (OpenAI image hosting domain). |
| T20: Error States | Various | Add toast notifications via sonner for success/error. Add error boundaries for API failures. Handle empty states gracefully. |

---

## Database Schema

### thumbnail
```typescript
export const thumbnail = pgTable("thumbnail", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  imageUrl: text("image_url").notNull(),
  aspectRatio: text("aspect_ratio").default("16:9").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [index("thumbnail_user_id_idx").on(table.userId)]);
```

### brand_asset
```typescript
export const brandAsset = pgTable("brand_asset", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // "logo" | "icon" | "brand-kit" | "overlay" | "graphic"
  imageUrl: text("image_url").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("asset_user_id_idx").on(table.userId)]);
```

### creator_avatar
```typescript
export const creatorAvatar = pgTable("creator_avatar", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("avatar_user_id_idx").on(table.userId)]);
```

---

## Generation Flow (detailed)

```
User drops file(s) on dropzone
  → POST /api/upload { file, type: "avatar"|"asset" }
  → File validated + sanitized (existing storage.ts)
  → Saved to Vercel Blob or /public/uploads/
  → Record created in brand_asset or creator_avatar table
  → Returns { id, url, name } to client

User clicks "Generate"
  → POST /api/generate { prompt, style, avatarId?, assetIds? }
  → Server:
      1. If avatarId → fetch avatar URL → GPT-4o vision describes the image
         (e.g., "A person with short brown hair, blue eyes, smiling, wearing a black hoodie")
      2. buildEnhancedPrompt(basePrompt, style, description):
         - Maps style → modifiers (Cinematic → "dramatic lighting, film-like color grading")
         - Injects avatar description if present
         - Returns enriched prompt string
      3. Generate 4 prompts with slight variation seeds
      4. Call DALL-E 3 in parallel (Promise.all):
         - model: "dall-e-3"
         - size: "1792x1024" (16:9)
         - quality: "standard"
         - style: "vivid"
         - n: 1
      5. For each result, download image buffer → upload via storage.ts
      6. Create 4 thumbnail records in DB
      7. Return array of { id, imageUrl, prompt, style }
  → Client renders main preview (index 0) + 3 variations

User clicks a variation
  → Main preview updates to selected variation

User clicks "Regenerate"
  → Same flow but with new prompt variation seeds
  → Variations strip replaced in-place

User clicks "Download"
  → Fetches image blob, triggers browser download

User clicks favorite icon
  → PATCH /api/thumbnails/[id]/favorite
  → Toggles isFavorite in DB
  → Updates heart icon state

User clicks delete
  → Confirmation dialog → DELETE /api/thumbnails/[id]
  → Removes storage file + DB record
  → Removes card from DOM

User clicks "Upload Avatar" on Avatars page
  → File picker → POST /api/avatars (multipart)
  → Creates avatar record + saves file

User clicks "Set as Default" on avatar
  → PATCH /api/avatars/[id] { isDefault: true }
  → Unsets default on all other user avatars
```

---

## OpenAI SDK Usage

### DALL-E 3 Generation
```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: enrichedPrompt,
  n: 1,
  size: "1792x1024",
  quality: "standard",
  style: "vivid",
  response_format: "url",
});

const imageUrl = response.data[0].url;
```

### GPT-4o Vision
```typescript
const visionResponse = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Describe this person's appearance in detail for an AI image generation prompt. Focus on: hair style and color, face shape, expression, clothing, accessories, and any distinctive features." },
        { type: "image_url", image_url: { url: avatarUrl } },
      ],
    },
  ],
  max_tokens: 300,
});

const description = visionResponse.choices[0].message.content;
```

### Style → Prompt Modifier Mapping
```typescript
const STYLE_MODIFIERS: Record<StylePreset, string> = {
  Cinematic: "dramatic lighting, film-like color grading, shallow depth of field, cinematic composition,  anamorphic look",
  Minimal: "clean composition, plenty of negative space, minimalist design, subtle accents, uncluttered",
  Bold: "high contrast, saturated colors, punchy visual hierarchy, striking, attention-grabbing",
  Neon: "synthwave-inspired, glowing neon accents, cyberpunk aesthetic, vibrant purples and pinks, dark background with bright neon",
  Vintage: "warm tones, film grain texture, retro color palette, nostalgic, 1970s-80s aesthetic",
  Clean: "bright and crisp, professional look, soft natural tones, well-lit, polished",
  Dark: "moody atmosphere, high contrast, dramatic shadows, dark aesthetics, brooding tones",
  Vibrant: "high-energy, colorful explosion, eye-popping color combinations, dynamic",
  Retro: "80s/90s inspired, nostalgic color schemes, retro-futuristic, arcade aesthetic",
  Gaming: "esports-ready, dynamic composition, energetic, motion feel, competitive gaming vibe",
};
```

---

## Design Rules (from DESIGN.md)
- Background never pure black (`oklch(0.09 0.008 270)`)
- Borders: `border-border` (8% white-alpha), never stronger than 12%
- Violet accent (`--primary`) in ≤4 places per screen, never on headings or icons
- No `shadow-*` on cards — border defines the edge
- Spacing: 8px grid, Tailwind multiples of 2
- Typography: Geist Sans, weight palette 400/500/700
- Framer Motion entrance only (no loops), `whileInView + once: true`
- Easing: `[0.25, 0.46, 0.45, 0.94]`

---

## Error Handling

| Scenario | UX |
|----------|-----|
| OpenAI API key missing | Toast: "Generation not configured. Contact support." Disable Generate button. |
| DALL-E rate limit | Toast: "Too many requests. Please wait a moment and try again." |
| Vision API failure | Fall back to generation without avatar description. Toast: "Could not analyze reference image. Generation continues without it." |
| Upload too large | Toast: "File too large. Maximum size is 5MB." |
| Invalid file type | Toast: "File type not supported. Please upload an image." |
| Network error | Toast: "Network error. Please check your connection." Keep form state intact. |
| Generation fails mid-way | Toast: "Generation failed. Please try again." |
