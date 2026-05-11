# Requirements: Dashboard Redesign

## Summary

Replace the current placeholder dashboard page and standalone `/studio` route with a full, modern creator dashboard. The dashboard is the authenticated core of Pixify — where users manage thumbnails, generate new ones, and organize their brand assets. The design follows Linear/Framer/Figma aesthetic principles: dark-first, minimal, strong typography, and deliberate spacing.

The existing `/studio` page (full-screen two-panel generator) is being absorbed into the dashboard as `/dashboard/generate`, with the old route redirecting. Landing page CTAs are updated to point to the new generator location.

## Goals

- Create a polished, premium-feeling dashboard with a collapsible sidebar navigation
- Provide an overview/home page with key metrics and quick actions
- Build a full thumbnail generator experience within the dashboard
- Create a thumbnail gallery for browsing past generations
- Follow the existing design system (DESIGN.md) — dark-only OKLCH colors, Geist typography, 8px grid, violet accent, no card shadows

## Non-Goals

- Backend integration — all data is mocked/placeholder
- Real AI generation or API calls — generation is simulated with setTimeout
- User settings functionality — just the UI shell
- Avatar, Assets, Templates, Favorites, Settings pages — only the sidebar nav items for these; their pages will be built later
- Search functionality
- Authentication changes — existing auth patterns remain untouched

## Acceptance Criteria

- [ ] `/dashboard` shows an overview with stats, recent generations strip, and quick action cards
- [ ] `/dashboard/generate` has a two-panel layout with prompt input, upload zones, style selector, preview panel, and variations
- [ ] `/dashboard/generations` shows a responsive grid of thumbnail cards with hover actions
- [ ] Sidebar is collapsible (expanded 260px, collapsed ~64px icon-only) with smooth animation
- [ ] Sidebar nav items highlight based on current route
- [ ] `/studio` redirects to `/dashboard/generate`
- [ ] Landing page "Start Creating" buttons link to `/dashboard/generate` instead of `/studio`
- [ ] Old `StudioSidebar` and `StudioCanvas` components are removed
- [ ] Dark mode only (matches existing design system)
- [ ] Framer Motion entrance animations on all sections
- [ ] All existing design system rules are followed (DESIGN.md)

## Assumptions

- The app is dark-only with forced `.dark` class via ThemeProvider
- All users are authenticated before reaching the dashboard (middleware + client gate)
- Mock data from picsum.photos is acceptable for placeholder imagery

## Technical Constraints

- Next.js 16 App Router with `src/` directory structure
- Tailwind CSS v4 with `@theme inline` CSS variables (no tailwind.config.* file)
- Framer Motion v12 for animations (variants imported from `@/lib/motion`)
- Lucide React for icons
- shadcn/ui New York style components already installed
- Path alias `@/*` → `src/*`
- Named exports for all components (except pages which use `export default`)
- `"use client"` only when hooks or browser APIs are needed
- All CSS variable tokens are defined in `globals.css` — use Tailwind classes like `bg-card`, `border-border`, `text-muted-foreground`, etc.
