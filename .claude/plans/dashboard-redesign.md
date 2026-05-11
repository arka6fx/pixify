# Dashboard Redesign

## Overview

Replace the existing placeholder dashboard and standalone `/studio` with a polished, creator-focused dashboard. The dashboard features a collapsible sidebar (Linear/Framer-inspired), an overview/home page, an AI thumbnail generator, and a generations gallery. The old `/studio` route redirects to `/dashboard/generate` within the navigation shell.

**Tech stack:** Next.js 16, Tailwind CSS v4, shadcn/ui (New York, neutral), Framer Motion v12, Lucide React.

**Design system:** Dark-only OKLCH colors, Geist typography, 8px grid, violet accent, no card shadows. Follow `DESIGN.md` strictly.

---

## Architecture

```
src/app/dashboard/
├── layout.tsx              # App shell with collapsible sidebar
├── page.tsx                # Overview/Home (stats, recent, quick actions)
├── loading.tsx
├── generate/
│   └── page.tsx            # AI Thumbnail Generator (two-panel)
└── generations/
    └── page.tsx            # Generations gallery grid
```

```
src/components/dashboard/
├── dashboard-layout.tsx       # Client shell: sidebar + main area
├── dashboard-sidebar.tsx      # Collapsible nav sidebar
├── stat-card.tsx              # Metric display card
├── welcome-header.tsx         # User greeting + stats row
├── prompt-input.tsx           # Large prompt textarea
├── upload-dropzone.tsx        # Drag-and-drop file upload
├── style-selector.tsx         # Style preset chip grid
├── generation-preview.tsx     # Preview panel with toolbar
├── generation-variations.tsx  # Variation thumbnail row
├── thumbnail-card.tsx         # Thumbnail grid card
├── thumbnail-grid.tsx         # Responsive grid wrapper
└── empty-state.tsx            # Empty state with CTA
```

---

## Execution Plan

### Wave 1 — Foundation (parallel, no deps)

| Task | Files | Description |
|------|-------|-------------|
| T1: Layout & Sidebar | `dashboard/layout.tsx`, `dashboard-layout.tsx`, `dashboard-sidebar.tsx` | App shell with collapsible sidebar (260px ↔ 64px), nav items, user section, mobile drawer, Framer Motion animation |
| T2: Types & Mock Data | `src/lib/types.ts` | `Thumbnail`, `BrandAsset`, `CreatorAvatar`, `DashboardStats`, `StylePreset` types + `MOCK_THUMBNAILS` (12), `MOCK_ASSETS` (6), `MOCK_AVATARS` (4), `MOCK_STATS` |

### Wave 2 — Pages (parallel, deps on Wave 1)

| Task | Files | Description |
|------|-------|-------------|
| T3: Overview Page | `stat-card.tsx`, `welcome-header.tsx`, `dashboard/page.tsx` (rewrite) | Stats grid, recent generations strip, quick action cards |
| T4: Generator Page | `prompt-input.tsx`, `upload-dropzone.tsx`, `style-selector.tsx`, `generation-preview.tsx`, `generation-variations.tsx`, `generate/page.tsx` | Two-panel generator with prompt, uploads, styles, preview, variations |
| T5: Generations Page | `thumbnail-card.tsx`, `thumbnail-grid.tsx`, `empty-state.tsx`, `generations/page.tsx` | Responsive grid with hover actions, filter tabs, empty state |
| T6: Cleanup | `studio/page.tsx` (redirect), navbar.tsx (CTA), hero.tsx (CTA), delete `studio-sidebar.tsx`, `studio-canvas.tsx` | Redirect /studio → /dashboard/generate, update CTAs, remove old components |

---

## Key Design Details

### Sidebar
- Expanded: 260px (`w-[260px]`), collapsed: 64px icon-only (`w-[64px]`)
- Nav items with `usePathname()` active detection
- Generate item visually distinct (primary color accent)
- Collapse toggle: `PanelLeftClose` / `PanelLeftOpen` icon
- Active: `bg-sidebar-accent text-sidebar-accent-foreground`
- Inactive: `text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50`
- Bottom: `Separator` + user avatar + name + `mode-toggle` + sign out
- Mobile: overlay drawer (not collapsible)

### Generator (two-panel)
- Left: 380px panel (`bg-card border-r border-border`) with prompt, uploads, styles, Generate
- Right: flex-1 with centered preview + variations + toolbar
- Mock generation: 2s `setTimeout`, then populate preview + 4 variations

### Thumbnail Card
- 16:9 aspect ratio, hover overlay with actions (favorite, download, delete)
- Info footer: prompt (truncated), style badge, relative date
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

### Data Types
```typescript
export interface Thumbnail {
  id: string;
  prompt: string;
  style: StylePreset;
  imageUrl: string;
  createdAt: Date;
  isFavorite: boolean;
  aspectRatio: "16:9" | "9:16";
}
export type AssetType = "logo" | "icon" | "brand-kit" | "overlay" | "graphic";
export interface BrandAsset { id: string; name: string; type: AssetType; imageUrl: string; createdAt: Date; fileSize: number; }
export interface CreatorAvatar { id: string; name: string; imageUrl: string; isDefault: boolean; createdAt: Date; }
export interface DashboardStats { totalThumbnails: number; weeklyGenerations: number; storageUsed: number; totalAssets: number; }
export type StylePreset = "Cinematic" | "Minimal" | "Bold" | "Neon" | "Vintage" | "Clean" | "Dark" | "Vibrant" | "Retro" | "Gaming";
```

### Mock image URLs
- Thumbnails: `https://picsum.photos/seed/thumb{id}/960/540`
- Assets/avatars: `https://picsum.photos/seed/{name}/200/200`

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

## Cleanup
- `/studio` redirects to `/dashboard/generate`
- `src/components/studio-sidebar.tsx` — delete
- `src/components/studio-canvas.tsx` — delete
- Navbar CTA: `/studio` → `/dashboard/generate`
- Hero CTA: `/studio` → `/dashboard/generate`
