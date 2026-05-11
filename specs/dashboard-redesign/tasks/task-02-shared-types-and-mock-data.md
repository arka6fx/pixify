# Task 02: Shared Types & Mock Data

## Status

complete

## Wave

1

## Description

Create domain type definitions and mock placeholder data used by all dashboard pages. This is the data foundation — every other dashboard task imports from here.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03, task-04, task-05

**Context from dependencies:** This is the first task. No prior work needed. The file is a pure TypeScript module with no UI code.

## Files to Create

- `src/lib/types.ts` — All domain types + mock data exports

## Files to Modify

- None

## Technical Details

### Domain Types

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

export interface BrandAsset {
  id: string;
  name: string;
  type: AssetType;
  imageUrl: string;
  createdAt: Date;
  fileSize: number; // KB
}

export interface CreatorAvatar {
  id: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalThumbnails: number;
  weeklyGenerations: number;
  storageUsed: number; // MB
  totalAssets: number;
}

export type StylePreset =
  | "Cinematic" | "Minimal" | "Bold" | "Neon"
  | "Vintage" | "Clean" | "Dark" | "Vibrant"
  | "Retro" | "Gaming";
```

### Mock Data — MOCK_STATS

```typescript
export const MOCK_STATS: DashboardStats = {
  totalThumbnails: 47,
  weeklyGenerations: 12,
  storageUsed: 256,
  totalAssets: 18,
};
```

### Mock Data — MOCK_THUMBNAILS (12 items)

Use picsum.photos seed URLs: `https://picsum.photos/seed/thumb{id}/960/540`

Each entry:
```typescript
{
  id: "gen-001",
  prompt: "Dark cinematic gaming thumbnail with RGB lighting and dramatic shadows",
  style: "Cinematic",
  imageUrl: "https://picsum.photos/seed/thumb1/960/540",
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  isFavorite: true,
  aspectRatio: "16:9",
}
```

Vary across all 10 StylePreset values. Spread dates across the past 30 days. Make about 4 of them favorites. Use realistic creator-style prompts:
- "Minimal tech review thumbnail with product shot"
- "Bold gaming montage with orange and cyan accents"
- "Neon synthwave thumbnail with retro grid background"
- "Vintage film-style travel vlog thumbnail"
- "Clean makeup tutorial thumbnail with soft pink theme"
- "Dark horror game thumbnail with fog and shadows"
- "Vibrant food review with overhead flat lay composition"
- "Retro 80s style fitness challenge thumbnail"
- "Gaming highlight reel thumbnail with motion blur effects"
- "Cinematic movie review with dramatic lighting"
- "Minimal productivity setup with clean composition"
- "Bold sports commentary with action freeze frame"

### Mock Data — MOCK_ASSETS (6 items)

Use `https://picsum.photos/seed/asset{id}/200/200`

```typescript
export const MOCK_ASSETS: BrandAsset[] = [
  { id: "asset-001", name: "Primary Logo", type: "logo", imageUrl: "https://picsum.photos/seed/asset1/200/200", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), fileSize: 245 },
  { id: "asset-002", name: "Channel Icon", type: "icon", imageUrl: "https://picsum.photos/seed/asset2/200/200", createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), fileSize: 128 },
  { id: "asset-003", name: "Brand Kit 2024", type: "brand-kit", imageUrl: "https://picsum.photos/seed/asset3/200/200", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), fileSize: 2048 },
  { id: "asset-004", name: "Gradient Overlay", type: "overlay", imageUrl: "https://picsum.photos/seed/asset4/200/200", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), fileSize: 512 },
  { id: "asset-005", name: "Custom Frame", type: "overlay", imageUrl: "https://picsum.photos/seed/asset5/200/200", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), fileSize: 380 },
  { id: "asset-006", name: "Starter Pack", type: "graphic", imageUrl: "https://picsum.photos/seed/asset6/200/200", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), fileSize: 1024 },
];
```

### Mock Data — MOCK_AVATARS (4 items)

```typescript
export const MOCK_AVATARS: CreatorAvatar[] = [
  { id: "avatar-001", name: "Main Avatar", imageUrl: "https://picsum.photos/seed/avatar1/200/200", isDefault: true, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
  { id: "avatar-002", name: "Gaming Profile", imageUrl: "https://picsum.photos/seed/avatar2/200/200", isDefault: false, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
  { id: "avatar-003", name: "Vlog Persona", imageUrl: "https://picsum.photos/seed/avatar3/200/200", isDefault: false, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  { id: "avatar-004", name: "Tech Setup", imageUrl: "https://picsum.photos/seed/avatar4/200/200", isDefault: false, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
];
```

## Acceptance Criteria

- [ ] All types are exported and usable by other dashboard components
- [ ] Mock data arrays have correct types and reasonable placeholder content
- [ ] No external dependencies beyond what's already in the project (no new npm packages)
- [ ] File is well-formed TypeScript with no type errors
