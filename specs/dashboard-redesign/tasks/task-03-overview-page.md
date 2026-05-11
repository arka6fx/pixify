# Task 03: Overview/Home Page

## Status

pending

## Wave

2

## Description

Build the overview/home page for the dashboard. This is the first page users see after logging in — it shows key metrics (via stat cards), a horizontal strip of recent generations, and quick action cards linking to other dashboard sections.

## Dependencies

**Depends on:** task-01-dashboard-layout-and-sidebar.md (dashboard layout shell exists), task-02-shared-types-and-mock-data.md (types + mock data exist)
**Blocks:** None

**Context from dependencies:** Task 01 creates the dashboard layout (sidebar + main area). This task creates content for the main area of `/dashboard`. Task 02 provides `DashboardStats`, `Thumbnail`, `MOCK_STATS`, and `MOCK_THUMBNAILS` from `@/lib/types`.

## Files to Create

- `src/components/dashboard/stat-card.tsx` — Metric display card with icon and optional trend
- `src/components/dashboard/welcome-header.tsx` — User greeting + stats row

## Files to Modify

- `src/app/dashboard/page.tsx` — Complete rewrite as the overview page

## Technical Details

### stat-card.tsx

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
}
```

Renders as:
```tsx
<div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-1 relative">
  <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
    {label}
  </span>
  <div className="flex items-center gap-2">
    <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
    {trend && (
      <span className={cn(
        "text-xs font-medium",
        trend.direction === "up" ? "text-green-500" : "text-red-500"
      )}>
        {trend.direction === "up" ? "↑" : "↓"} {trend.percentage}%
      </span>
    )}
  </div>
  <div className="absolute top-6 right-6 text-muted-foreground/10">
    {icon}
  </div>
</div>
```

### welcome-header.tsx

```tsx
"use client";
import { useSession } from "@/lib/auth-client";
import { MOCK_STATS } from "@/lib/types";
import { StatCard } from "./stat-card";
import { Image as ImageIcon, Sparkles, HardDrive, Briefcase } from "lucide-react";

export function WelcomeHeader() {
  const { data: session } = useSession();
  const stats = MOCK_STATS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {session?.user.name ?? "Creator"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your thumbnails today.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Thumbnails" value={stats.totalThumbnails} icon={<ImageIcon className="h-8 w-8" />} trend={{ direction: "up", percentage: 12 }} />
        <StatCard label="This Week" value={stats.weeklyGenerations} icon={<Sparkles className="h-8 w-8" />} trend={{ direction: "up", percentage: 8 }} />
        <StatCard label="Storage Used" value={`${stats.storageUsed} MB`} icon={<HardDrive className="h-8 w-8" />} />
        <StatCard label="Brand Assets" value={stats.totalAssets} icon={<Briefcase className="h-8 w-8" />} trend={{ direction: "up", percentage: 3 }} />
      </div>
    </div>
  );
}
```

### dashboard/page.tsx

Auth-gated client component. Use the same pattern as the existing dashboard page (useSession + Spinner + redirect). Structure:

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Upload, SwatchBook } from "lucide-react";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { Spinner } from "@/components/ui/spinner";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { ThumbnailCard } from "@/components/dashboard/thumbnail-card";
import { MOCK_THUMBNAILS } from "@/lib/types";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

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
      className="p-6 space-y-8"
    >
      <motion.div variants={staggerChild}>
        <WelcomeHeader />
      </motion.div>

      {/* Recent Generations */}
      <motion.section variants={staggerChild}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Generations</h2>
          <Link
            href="/dashboard/generations"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {MOCK_THUMBNAILS.slice(0, 4).map((thumb) => (
            <div key={thumb.id} className="shrink-0 w-64">
              <ThumbnailCard thumbnail={thumb} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={staggerChild}>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/generate"
            className="bg-card border border-border rounded-xl p-6 hover:border-border/60 transition-colors duration-200 space-y-3 group"
          >
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-sm">New Generation</h3>
              <p className="text-xs text-muted-foreground">Create a new AI thumbnail</p>
            </div>
          </Link>
          <Link
            href="/dashboard/assets"
            className="bg-card border border-border rounded-xl p-6 hover:border-border/60 transition-colors duration-200 space-y-3 group"
          >
            <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-sm">Upload Asset</h3>
              <p className="text-xs text-muted-foreground">Add brand assets or avatars</p>
            </div>
          </Link>
          <Link
            href="/dashboard/templates"
            className="bg-card border border-border rounded-xl p-6 hover:border-border/60 transition-colors duration-200 space-y-3 group"
          >
            <SwatchBook className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-sm">Browse Templates</h3>
              <p className="text-xs text-muted-foreground">Explore style presets</p>
            </div>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
```

**Note:** `ThumbnailCard` is created by Task 05 (same wave). It imports from `@/components/dashboard/thumbnail-card`. Since both tasks run in parallel, the import will resolve when both are done. The page won't compile until both tasks complete, which is expected — the review gate runs after the wave.

## Acceptance Criteria

- [ ] `/dashboard` shows welcome message with user name from session
- [ ] Four stat cards display in a responsive grid (2-col mobile, 4-col desktop)
- [ ] Stat cards have label, value, icon, and optional trend indicator
- [ ] Recent generations section shows horizontal scroll of 4 thumbnails
- [ ] "View all" link points to `/dashboard/generations`
- [ ] Three quick action cards link to `/dashboard/generate`, `/dashboard/assets`, `/dashboard/templates`
- [ ] Framer Motion stagger animation on load
- [ ] Auth gate: shows spinner while loading, redirects to `/login` if not authenticated
- [ ] All DESIGN.md rules followed (no shadows on cards, violet accent only on icons, muted foreground for secondary text)
