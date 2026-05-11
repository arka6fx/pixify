# Task 01: Dashboard Layout & Collapsible Sidebar

## Status

complete

## Wave

1

## Description

Create the dashboard app shell with a collapsible sidebar navigation. This is the foundation all dashboard pages live inside. The sidebar is inspired by Linear and Framer — minimal, dark, with clean typography. On desktop it's a fixed column that can collapse to icon-only mode. On mobile it renders as a drawer overlay.

## Dependencies

**Depends on:** None (Wave 1)
**Blocks:** task-03, task-04, task-05, task-06

**Context from dependencies:** This is the first task. No prior work needed. It uses existing UI primitives from the codebase (`@/components/ui/button`, `@/components/ui/separator`, `@/components/ui/avatar`, `@/components/ui/mode-toggle`, `@/components/auth/user-profile`, `@/lib/auth-client`, `@/lib/utils`).

## Files to Create

- `src/app/dashboard/layout.tsx` — Server component layout importing DashboardLayout
- `src/components/dashboard/dashboard-layout.tsx` — Client component: flex row with sidebar + main content area, owns collapse state
- `src/components/dashboard/dashboard-sidebar.tsx` — Collapsible nav sidebar with navigation items, user section, collapse toggle

## Files to Modify

- None (all new)

## Technical Details

### Sidebar Structure

Collapsible sidebar with states:
- **Expanded** (default): 260px wide (`w-[260px]`), shows icon + label for each nav item, logo text visible
- **Collapsed**: ~64px wide (`w-[64px]`), shows icon only for nav items, logo text hidden, labels hidden
- **Mobile** (< 1024px): sidebar hidden by default, shown as an overlay/sheet when toggled via hamburger button

State management:
- `const [collapsed, setCollapsed] = useState(false)` in `dashboard-layout.tsx`
- Pass `collapsed` and `onToggle` as props to `DashboardSidebar`
- Collapse state NOT persisted (resets on page load)

### Animation

Use Framer Motion for collapse/expand:
```tsx
<motion.aside
  animate={{ width: collapsed ? 64 : 260 }}
  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
  className="bg-sidebar border-r border-sidebar-border flex flex-col h-svh overflow-hidden shrink-0"
>
```

When collapsed, hide text labels with `opacity-0 overflow-hidden` via a conditional class or AnimatePresence.

### Nav Items

```tsx
import { LayoutDashboard, Image, Sparkles, UserCircle, Briefcase, SwatchBook, Heart, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  highlighted?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generations", href: "/dashboard/generations", icon: Image },
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles, highlighted: true },
  { label: "Avatars", href: "/dashboard/avatars", icon: UserCircle },
  { label: "Brand Assets", href: "/dashboard/assets", icon: Briefcase },
  { label: "Templates", href: "/dashboard/templates", icon: SwatchBook },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
];

const SETTINGS_ITEM: NavItem = { label: "Settings", href: "/dashboard/settings", icon: Settings };
```

### Active State

```tsx
"use client";
import { usePathname } from "next/navigation";

const pathname = usePathname();
const isActive = (href: string) =>
  href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
```

### Styling

- **Active nav item**: `bg-sidebar-accent text-sidebar-accent-foreground font-medium rounded-lg`
- **Inactive**: `text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors duration-150`
- **Generate item (highlighted)**: When active, use `text-primary` + subtle left border accent; when inactive, the icon shows `text-primary` to distinguish it
- **Logo**: `flex items-center gap-2 text-foreground font-semibold text-sm`, icon in `text-primary`
- **Bottom section**: `<Separator className="bg-sidebar-border" />`, then user avatar + name (hidden when collapsed), `mode-toggle`, sign out
- **Nav item size**: `flex items-center gap-3 px-3 py-2 text-sm`, icon `h-4 w-4 shrink-0`
- **Sidebar overflow**: `overflow-y-auto scrollbar-hide`
- **Collapse toggle button**: variant="ghost" size="icon" h-8 w-8 at the bottom of the nav section, before the user section

### Layout Structure

```tsx
// src/app/dashboard/layout.tsx — Server Component
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

```tsx
// src/components/dashboard/dashboard-layout.tsx — Client Component
"use client";
import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

### Responsive Behavior

- On `lg:` screens and above: sidebar is a fixed inline column with collapsible toggle
- Below `lg:`: sidebar is hidden off-screen. Show a hamburger button (PanelLeft icon) in a thin top bar inside the main area. Clicking opens the sidebar as a fixed overlay (no collapse mode on mobile — just open/close)

### dashboard-layout.tsx mobile adaptation

```tsx
// Below lg, render a simple top header bar with hamburger + "Pixify" brand
// The sidebar becomes an overlay when toggled
```

### Important Imports

```tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "@/lib/auth-client";
```

### User Section

Use `useSession()` to get the current user. Show:
```tsx
<div className="flex items-center gap-3 px-3">
  <Avatar className="h-8 w-8">
    <AvatarImage src={session?.user.image ?? undefined} />
    <AvatarFallback className="text-xs">{session?.user.name?.charAt(0) ?? "U"}</AvatarFallback>
  </Avatar>
  {!collapsed && (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{session?.user.name ?? "User"}</p>
      <p className="text-xs text-muted-foreground truncate">{session?.user.email ?? ""}</p>
    </div>
  )}
</div>
```

### Scrollbar

Import and use `scrollbar-hide` on the sidebar.

## Acceptance Criteria

- [ ] Sidebar renders on `/dashboard`, `/dashboard/generations`, `/dashboard/generate` — all dashboard routes
- [ ] Clicking a nav item navigates to the correct route and highlights that item
- [ ] Collapse toggle smoothly animates sidebar between 260px and 64px widths
- [ ] In collapsed mode, labels and logo text hide, icons remain visible
- [ ] Generate nav item is visually distinct (primary color accent on its icon)
- [ ] User section at bottom shows avatar + name + email + mode toggle + sign out
- [ ] Below 1024px: sidebar hidden, hamburger button opens it as overlay
- [ ] No layout shift during collapse/expand animation
- [ ] All icons have `aria-hidden="true"`, icon-only buttons have `aria-label`
