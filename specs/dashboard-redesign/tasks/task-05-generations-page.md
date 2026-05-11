# Task 05: Generations Gallery Page

## Status

pending

## Wave

2

## Description

Build the generations gallery page showing all previously generated thumbnails in a responsive grid. Includes thumbnail cards with hover overlay actions, filter toggle (All / Favorites), and an empty state component for when no thumbnails exist.

## Dependencies

**Depends on:** task-01-dashboard-layout-and-sidebar.md (dashboard shell), task-02-shared-types-and-mock-data.md (Thumbnail type + MOCK_THUMBNAILS)
**Blocks:** None (but task-03 imports ThumbnailCard from this task — both run in Wave 2)

**Context from dependencies:** Task 01 provides the dashboard layout (sidebar + main content area). Task 02 provides `Thumbnail` interface and `MOCK_THUMBNAILS` array from `@/lib/types`. This task's `ThumbnailCard` component is also imported by Task 03's overview page.

## Files to Create

- `src/components/dashboard/thumbnail-card.tsx` — Thumbnail grid card with image, info, hover actions
- `src/components/dashboard/thumbnail-grid.tsx` — Responsive grid wrapper with stagger animation
- `src/components/dashboard/empty-state.tsx` — Empty state with icon, title, description, CTA
- `src/app/dashboard/generations/page.tsx` — Generations page with filter and grid

## Files to Modify

- None

## Technical Details

### thumbnail-card.tsx

```tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerChild } from "@/lib/motion";
import type { Thumbnail } from "@/lib/types";

interface ThumbnailCardProps {
  thumbnail: Thumbnail;
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ThumbnailCard({ thumbnail }: ThumbnailCardProps) {
  return (
    <motion.div
      variants={staggerChild}
      className="group relative bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={thumbnail.imageUrl}
          alt={thumbnail.prompt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20" aria-label={thumbnail.isFavorite ? "Unfavorite" : "Favorite"}>
            <Heart className={`h-4 w-4 ${thumbnail.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20" aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-foreground truncate">{thumbnail.prompt}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
            {thumbnail.style}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(thumbnail.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

### thumbnail-grid.tsx

```tsx
"use client";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { ThumbnailCard } from "./thumbnail-card";
import type { Thumbnail } from "@/lib/types";

interface ThumbnailGridProps {
  thumbnails: Thumbnail[];
}

export function ThumbnailGrid({ thumbnails }: ThumbnailGridProps) {
  if (thumbnails.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {thumbnails.map((thumb) => (
        <ThumbnailCard key={thumb.id} thumbnail={thumb} />
      ))}
    </motion.div>
  );
}
```

### empty-state.tsx

```tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="text-muted-foreground/30 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
```

### generations/page.tsx

Auth-gated client component:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image } from "lucide-react";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { Spinner } from "@/components/ui/spinner";
import { ThumbnailGrid } from "@/components/dashboard/thumbnail-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MOCK_THUMBNAILS } from "@/lib/types";
import { useSession } from "@/lib/auth-client";

export default function GenerationsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filtered = filter === "all"
    ? MOCK_THUMBNAILS
    : MOCK_THUMBNAILS.filter((t) => t.isFavorite);

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-background">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={staggerChild}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generations</h1>
          <p className="text-sm text-muted-foreground">
            All your AI-generated thumbnails in one place.
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerChild} className="flex gap-2">
        {(["all", "favorites"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : "Favorites"}
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerChild}>
        {filtered.length > 0 ? (
          <ThumbnailGrid thumbnails={filtered} />
        ) : (
          <EmptyState
            icon={<Image className="h-16 w-16" />}
            title="No thumbnails yet"
            description="Generate your first AI thumbnail to see it here."
            action={{ label: "Create Thumbnail", href: "/dashboard/generate" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
```

### Important

- Make sure `Image` component from `next/image` is configured in `next.config.ts` to allow `picsum.photos` as a remote pattern. Check if it already is (from the existing studio-page usage). If not, add it.

Check existing `next.config.ts` for the remote patterns config. It should have:
```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "picsum.photos" },
  ],
},
```

## Acceptance Criteria

- [ ] `/dashboard/generations` shows a responsive grid of thumbnail cards (1-col mobile → 4-col desktop)
- [ ] Each card shows 16:9 thumbnail image, prompt text (truncated), style badge, and relative date
- [ ] Hover overlay shows favorite, download, and delete icon buttons with white icons on dark overlay
- [ ] Filter toggle (All / Favorites) works — favorites filter shows only thumbnails with `isFavorite: true`
- [ ] When filter results are empty, empty state renders with icon, message, and CTA button
- [ ] CTA in empty state links to `/dashboard/generate`
- [ ] Framer Motion stagger animation on grid items
- [ ] Auth gate works correctly
- [ ] All DESIGN.md rules followed
