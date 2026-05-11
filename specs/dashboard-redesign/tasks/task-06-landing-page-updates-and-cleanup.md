# Task 06: Landing Page Updates & Cleanup

## Status

pending

## Wave

2

## Description

Update the landing page CTAs that previously linked to `/studio` to now link to `/dashboard/generate`. Replace `/studio/page.tsx` with a permanent redirect. Delete the old studio components that are no longer used.

## Dependencies

**Depends on:** task-01-dashboard-layout-and-sidebar.md (new generator route exists at /dashboard/generate)
**Blocks:** None

**Context from dependencies:** Task 01 creates the dashboard layout. The `/dashboard/generate` route will exist (created by Task 04 in the same wave). This task updates the old `/studio` route to redirect and updates all references.

## Files to Modify

- `src/app/studio/page.tsx` — Replace with Next.js redirect (server component)
- `src/components/navbar.tsx` — Change line 79: `/studio` → `/dashboard/generate`
- `src/components/hero.tsx` — Change line 88: `/studio` → `/dashboard/generate`

## Files to Delete

- `src/components/studio-sidebar.tsx` — No longer used after /studio redirects
- `src/components/studio-canvas.tsx` — No longer used after /studio redirects

## Technical Details

### studio/page.tsx

Replace the existing content (52-line auth-gated page with StudioSidebar + StudioCanvas) with a simple server component redirect:

```tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "AI thumbnail generator",
};

export default function StudioPage() {
  redirect("/dashboard/generate");
}
```

### navbar.tsx

Find the "Start Creating" button link and change the href:
```tsx
// Before (line 79):
<Link href="/studio">Start Creating</Link>
// After:
<Link href="/dashboard/generate">Start Creating</Link>
```

### hero.tsx

Find the "Start Creating" CTA link and change the href:
```tsx
// Before (line 88):
<Link href="/studio">Start Creating</Link>
// After:
<Link href="/dashboard/generate">Start Creating</Link>
```

### Cleanup — Delete files

After making the above changes, the following files are no longer imported anywhere:
- `src/components/studio-sidebar.tsx`
- `src/components/studio-canvas.tsx`

Delete them with `rm`:
```bash
rm src/components/studio-sidebar.tsx
rm src/components/studio-canvas.tsx
```

Also check if `src/app/studio/loading.tsx` exists and if it should be removed (it's no longer needed since the redirect is instant).

## Acceptance Criteria

- [ ] `/studio` redirects to `/dashboard/generate` — verify by visiting `/studio`
- [ ] Landing page navbar "Start Creating" links to `/dashboard/generate`
- [ ] Hero section primary CTA "Start Creating" links to `/dashboard/generate`
- [ ] `studio-sidebar.tsx` and `studio-canvas.tsx` are deleted from the filesystem
- [ ] No broken imports remain after deletion
- [ ] TypeScript compilation succeeds (`pnpm typecheck` or `npx tsc --noEmit`)
