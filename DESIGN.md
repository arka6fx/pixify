# Pixify Design System

> Dark-first, creator-focused UI for the Pixify AI thumbnail platform. Tagline: "Create stunning thumbnails with AI."

---

## 1. Design Principles

Six rules that define the aesthetic:

1. **Background is never pure black.** Use `bg-background` (`oklch(0.09 0.008 270)`) — a barely-perceptible violet tint signals intentionality over generic darkness.
2. **Borders are barely visible.** Always `border-border` (8% white-alpha). Anything stronger than 12% looks like Bootstrap.
3. **One accent color, used sparingly.** Violet (`--primary`) appears in ≤4 places per screen. Never on headings or icons.
4. **No decorative shadows on cards.** The border defines the edge. Box-shadows are reserved for floating or modal elements.
5. **Spacing is always grid-aligned.** 8px base grid — all padding/margin in multiples of Tailwind's `2` unit (8px). Section padding: `py-24` or `py-32`. Never odd numbers like `py-7` or `p-5`.
6. **Typography contrast is extreme.** Hero headline vs body text should feel like a jump cut — not a gradient. Different size, different weight, different color (`text-foreground` vs `text-muted-foreground`).

---

## 2. Color System

All tokens use OKLCH. The app is **dark-only** — `ThemeProvider` forces `.dark`, so no light-mode variants are needed.

### Semantic Tokens

| Token | OKLCH Value | Tailwind Class | Usage |
|-------|------------|----------------|-------|
| `--background` | `oklch(0.09 0.008 270)` | `bg-background` | Page background |
| `--foreground` | `oklch(0.97 0 0)` | `text-foreground` | Primary text, headings |
| `--card` | `oklch(0.12 0.008 270)` | `bg-card` / `bg-surface-1` | Cards, panels, containers |
| `--surface-2` | `oklch(0.15 0.007 270)` | `bg-surface-2` | Hover states, active chips |
| `--primary` | `oklch(0.60 0.22 270)` | `bg-primary` / `text-primary` | Violet accent |
| `--primary-foreground` | `oklch(0.99 0 0)` | `text-primary-foreground` | Text on violet backgrounds |
| `--muted` | `oklch(0.14 0.006 270)` | `bg-muted` | Muted container backgrounds |
| `--muted-foreground` | `oklch(0.60 0.01 270)` | `text-muted-foreground` | Secondary/body text, labels |
| `--accent` | `oklch(0.17 0.012 270)` | `bg-accent` | Ghost button hover, subtle highlights |
| `--accent-foreground` | `oklch(0.97 0 0)` | `text-accent-foreground` | Text on accent backgrounds |
| `--border` | `oklch(1 0 0 / 8%)` | `border-border` | All borders |
| `--input` | `oklch(1 0 0 / 10%)` | `bg-input` | Input field backgrounds |
| `--ring` | `oklch(0.60 0.22 270 / 60%)` | `ring-ring` | Focus rings |
| `--sidebar` | `oklch(0.10 0.008 270)` | `bg-sidebar` | Studio sidebar |
| `--sidebar-border` | `oklch(1 0 0 / 6%)` | `border-sidebar-border` | Sidebar internal borders |
| `--destructive` | `oklch(0.65 0.22 25)` | `text-destructive` / `bg-destructive` | Errors, destructive actions |

### Accent Color Rule

`text-primary` / `bg-primary` appears **only on**:
- Primary CTA buttons (`<Button>` default variant)
- Focus rings (`:focus-visible` — automatic via `--ring`)
- Active/selected chip and toggle states
- Icon accents in the logo/brand mark
- Subtle hero radial glow (≤15% opacity via inline style)

**Never use** `text-primary` on headings, body copy, navigation links, card text, or section labels.

---

## 3. Typography

Font: **Geist Sans** via `next/font/google`, CSS variable `--font-geist-sans`. Applied via `font-sans` (or the `${geistSans.variable}` body class).

### Scale

| Role | Tailwind Classes | Notes |
|------|-----------------|-------|
| Hero headline | `text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05]` | Landing page H1 only |
| Section heading | `text-4xl font-bold tracking-tight` | H2 on marketing sections |
| Subsection heading | `text-2xl font-bold tracking-tight` | H2/H3 in content areas |
| Card heading | `text-lg font-semibold` | Feature/card titles |
| Body — primary | `text-base` or `text-lg text-foreground` | Main content |
| Body — secondary | `text-sm text-muted-foreground` | Descriptions, supporting text |
| Label / eyebrow | `text-xs font-medium tracking-widest uppercase text-muted-foreground` | Section labels, chip text |
| Caption | `text-xs text-muted-foreground` | Timestamps, metadata |

### Rules

- **Never** use the same font weight for two consecutive hierarchy levels.
- `tracking-tighter` is reserved for display/hero text (72px+). Use `tracking-tight` for section headings.
- Weight palette: **400** (normal), **500** (medium), **700** (bold). Avoid 600 (`font-semibold`) for anything larger than 24px.

---

## 4. Spacing & Layout

8px base grid. All spacing values must be multiples of `2` (8px).

| Context | Class |
|---------|-------|
| Full-page section (marketing) | `py-24` or `py-32` |
| Page section with title | `py-24 px-6` |
| Card inner padding | `p-6` |
| Small card / compact | `p-4` |
| Max content width | `max-w-7xl mx-auto` |
| Narrow content (text blocks, forms) | `max-w-xl` or `max-w-2xl` |
| Stack gap (vertical) | `space-y-4` or `space-y-6` |
| Row gap (horizontal) | `gap-3` or `gap-4` |
| Navbar height | `h-16` (64px) — add `pt-16` to first section below fixed nav |

---

## 5. Component Patterns

Copy-pasteable patterns for every common component type.

### 5.1 Cards

**Standard card:**
```tsx
<div className="bg-card border border-border rounded-xl p-6">
  {/* content */}
</div>
```

**Hoverable feature card:**
```tsx
<div className="bg-card border border-border rounded-xl p-6 hover:border-border/60 transition-colors duration-200">
  {/* content */}
</div>
```

**Auth / modal card (with glow):**
```tsx
<div className="bg-card border border-border rounded-2xl p-6 shadow-[0_0_30px_oklch(0.60_0.22_270_/_12%)] ring-1 ring-primary/20">
  {/* form content */}
</div>
```

**Stat/highlight card:**
```tsx
<div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-1">
  <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Label</span>
  <span className="text-3xl font-bold tracking-tight">Value</span>
  <span className="text-sm text-muted-foreground">Supporting text</span>
</div>
```

**Rule:** No `shadow-*` on regular cards. The border defines the edge.

---

### 5.2 Buttons

Uses shadcn `<Button>` from `@/components/ui/button`. Default variant is the violet primary.

```tsx
import { Button } from "@/components/ui/button";

// Primary (violet filled)
<Button>Generate</Button>

// Primary with icon
<Button className="gap-2">
  <Sparkles className="h-4 w-4" />
  Generate
</Button>

// Large CTA
<Button size="lg" className="text-base px-8">Start Creating</Button>

// Ghost (transparent, hover accent)
<Button variant="ghost">Cancel</Button>

// Outline
<Button variant="outline">Download</Button>

// Outline with icon, small
<Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
  <Download className="h-3.5 w-3.5" />
  Download
</Button>

// Icon-only button
<Button variant="ghost" size="icon" className="h-8 w-8">
  <Share2 className="h-4 w-4" />
</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// As link
<Button asChild>
  <Link href="/dashboard/generate">Open Generator</Link>
</Button>
```

**Rules:**
- Never add extra `shadow-*` to buttons.
- Use `gap-2` for standard icon+text buttons, `gap-1.5` for small buttons.
- Icon size: `h-4 w-4` for default, `h-3.5 w-3.5` for `size="sm"`.

---

### 5.3 Form Inputs

```tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Labeled input
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// Section label (eyebrow style, not a form label)
<label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
  Describe your thumbnail
</label>
<Textarea
  placeholder="A dark cinematic gaming thumbnail..."
  className="min-h-32 resize-none bg-background/50"
/>
```

---

### 5.4 Badges

```tsx
import { Badge } from "@/components/ui/badge";

// Default (subtle)
<Badge variant="outline">New</Badge>

// Eyebrow/section label badge
<Badge variant="outline" className="text-xs font-medium tracking-widest uppercase border-primary/30 text-primary bg-primary/5 px-3 py-1">
  AI-Powered
</Badge>

// Status badge
<Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Active</Badge>
```

---

### 5.5 Chips / Toggle Groups

For style selectors, filter tabs, and toggle buttons:

```tsx
// Active chip
<button className="px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 bg-primary text-primary-foreground border-primary">
  Cinematic
</button>

// Inactive chip
<button className="px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground">
  Minimal
</button>

// Two-way toggle (e.g., aspect ratio)
<button className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors duration-150 bg-primary text-primary-foreground border-primary">
  16:9
</button>
<button className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors duration-150 bg-transparent text-muted-foreground border-border hover:text-foreground">
  9:16
</button>
```

---

### 5.6 Separator / Divider

```tsx
import { Separator } from "@/components/ui/separator";

<Separator className="bg-border" />          // horizontal
<Separator orientation="vertical" className="bg-border h-4" />  // vertical (in toolbars)

// Manual inline divider (in toolbars)
<div className="w-px h-4 bg-border mx-1" />
```

---

### 5.7 Loading States

**Shimmer skeleton** (uses `.shimmer` CSS utility from globals.css):
```tsx
// Full-width block skeleton
<div className="shimmer h-4 rounded w-3/4" />
<div className="shimmer h-4 rounded w-1/2 mt-2" />

// Image placeholder (e.g., canvas)
<div className="absolute inset-0 shimmer" />

// Card skeleton
<div className="bg-card border border-border rounded-xl p-6 space-y-3">
  <div className="shimmer h-4 rounded w-24" />
  <div className="shimmer h-8 rounded w-full" />
  <div className="shimmer h-4 rounded w-2/3" />
</div>
```

**Spinner:**
```tsx
import { Spinner } from "@/components/ui/spinner";

<Spinner className="h-5 w-5 text-primary" />

// Full-screen loading
<div className="h-svh flex items-center justify-center bg-background">
  <Spinner className="h-6 w-6 text-primary" />
</div>
```

---

### 5.8 Images (next/image)

```tsx
import Image from "next/image";

// Fill parent (parent must be relative + sized)
<div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border">
  <Image src={src} alt="" fill className="object-cover" sizes="..." />
</div>

// Fixed size
<Image src={src} alt="..." width={480} height={270} className="rounded-lg" />

// With hover zoom
<div className="group relative aspect-[16/9] overflow-hidden rounded-xl">
  <Image src={src} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="..." />
</div>
```

`sizes` should reflect actual rendered width at each breakpoint, not `100vw`.

---

### 5.9 Navbar

The navbar at `src/components/navbar.tsx` is reused across all landing/marketing pages. It is **not** used in the studio (app shell) or auth pages.

To include it on a page:
```tsx
import { Navbar } from "@/components/navbar";
// Place it as the first element in the page's <main> or before it.
// Add pt-16 to the first section beneath it to avoid overlap.
<Navbar />
```

---

### 5.10 Icons

Use **Lucide React** exclusively. Import by name:
```tsx
import { Sparkles, Download, ArrowRight, Layers } from "lucide-react";
```

Standard sizes:
- `h-4 w-4` — inline with text (most common)
- `h-5 w-5` — feature card icons, prominent actions
- `h-3.5 w-3.5` — small button icons (`size="sm"`)

Icon color:
- In buttons: inherits from button text color (do not set explicitly)
- Feature card icon: `text-primary` (the only place icons get accent color)
- Navigation/UI icons: `text-muted-foreground` or `text-foreground`
- `aria-hidden="true"` on all decorative icons

---

## 6. Page Layout Patterns

### 6.1 Marketing / Landing Page

```tsx
// src/app/some-marketing-page/page.tsx
import { Navbar } from "@/components/navbar";
import { LandingFooter } from "@/components/landing-footer";

export default function SomePage() {
  return (
    <main>
      <Navbar />
      <section className="py-24 px-6 pt-32"> {/* pt-32 on first section = py-24 + pt-16 navbar */}
        <div className="max-w-7xl mx-auto">
          {/* page content */}
        </div>
      </section>
      {/* more sections */}
      <LandingFooter />
    </main>
  );
}
```

### 6.2 App Shell (Two-Panel)

```tsx
// src/app/some-tool/page.tsx
"use client";
export default function ToolPage() {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <aside className="w-80 h-full flex flex-col bg-sidebar border-r border-sidebar-border overflow-y-auto scrollbar-hide">
        {/* Sidebar content */}
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
      </div>
    </div>
  );
}
```

### 6.3 Auth Page

Each auth page lives in `src/app/(auth)/[route]/page.tsx`. The `(auth)/layout.tsx` handles the full-screen dark centering. Pages only render a card:

```tsx
// src/app/(auth)/some-page/page.tsx
import Link from "next/link";
import { Layers } from "lucide-react";
import { SomeForm } from "@/components/auth/some-form";

export default function SomePage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Pixify</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Page Title</h1>
        <p className="text-sm text-muted-foreground">Supporting subtitle</p>
      </div>
      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_0_30px_oklch(0.60_0.22_270_/_12%)]">
        <SomeForm />
      </div>
      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
```

### 6.4 Protected Page (Auth Guard)

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
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
    <main className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* content */}
      </div>
    </main>
  );
}
```

---

## 7. Animation Patterns

Uses **Framer Motion v12**. Import variants from `@/lib/motion`.

### Import

```tsx
"use client"; // required for Framer Motion
import { motion } from "framer-motion";
import { fadeUp, fadeIn, scaleIn, staggerContainer, staggerChild } from "@/lib/motion";
```

### Simple entrance (single element)

```tsx
<motion.div variants={fadeUp} initial="hidden" animate="visible">
  {/* content */}
</motion.div>
```

### Staggered entrance (hero, feature grids)

```tsx
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.h1 variants={staggerChild}>Headline</motion.h1>
  <motion.p variants={staggerChild}>Subtitle</motion.p>
  <motion.div variants={staggerChild}>{/* CTAs */}</motion.div>
</motion.div>
```

### Viewport-triggered (below-fold sections)

```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerChild}>
      {/* item */}
    </motion.div>
  ))}
</motion.div>
```

### Hover effects (inline, no named variants)

```tsx
<motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.15 }}>
  {/* card or image */}
</motion.div>
```

### Rules

- `animate="visible"` for above-fold (hero); `whileInView="visible"` for everything else.
- `viewport={{ once: true }}` always — animations fire once on scroll in, not on scroll back.
- Hover scale: `1.02` for cards, `1.03–1.04` for thumbnail previews. Never more than `1.05`.
- Duration: 150–200ms for hover, 350–500ms for entrance.
- Easing: `[0.25, 0.46, 0.45, 0.94]` (easeOutQuart) for entrance — feels deliberate, not bouncy.
- **No** looping/idle animations. Only entrance (once) and interaction (hover/focus/click).

---

## 8. Custom CSS Utilities

Defined in `src/app/globals.css`, available as Tailwind classes:

| Class | Description | When to use |
|-------|-------------|-------------|
| `.glass` | `backdrop-filter: blur(12px)` + semi-transparent bg | Navbar (scroll state), overlays over imagery |
| `.scrollbar-hide` | Hides scrollbar cross-browser | Horizontal scroll strips, sidebars |
| `.glow-violet` | `box-shadow: 0 0 60px oklch(0.60 0.22 270 / 20%)` | Hero decorative elements only |
| `.shimmer` | Animated shimmer gradient | Loading skeleton placeholders |
| `.marquee-track` | `animation: marquee 40s linear infinite` | Social proof / ticker strips |

**Glassmorphism rule:** `.glass` is only for elements that float over content (navbar after scroll, modal overlays, tooltip-style panels). Cards and sidebars use solid `bg-card` / `bg-sidebar`.

---

## 9. Responsive Breakpoints

| Prefix | Min-width | Target |
|--------|----------|--------|
| (none) | 0px | Mobile (375px+) |
| `sm:` | 640px | Large mobile / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop |

Common responsive patterns in this codebase:

```
// Hero text scales up
text-6xl md:text-7xl

// Grid columns
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Masonry columns
columns-2 md:columns-3 lg:columns-4

// Hide on mobile
hidden md:flex

// Stack to row
flex-col sm:flex-row

// Full width on mobile, fixed on desktop
w-full sm:w-auto
```

---

## 10. File & Component Conventions

- **Server components** by default. Add `"use client"` only when using hooks, event handlers, or Framer Motion.
- **Named exports** for all components (`export function Navbar()`, not `export default`). Exception: pages must use `export default`.
- **Import alias**: always use `@/*` → `src/*`. Never relative paths between `src/` subdirectories.
- **No comments** unless the WHY is non-obvious. Component intent comes from naming and structure.
- **Icons**: always `aria-hidden="true"` on decorative icons. Provide `aria-label` on icon-only buttons.
- **Lucide only** — no other icon libraries. Import by name, not as a namespace.
- **cn() helper** for conditional classes: `import { cn } from "@/lib/utils"`.

---

## 11. Do / Don't Quick Reference

| ✅ Do | ❌ Don't |
|-------|---------|
| `bg-card border border-border rounded-xl` | Add `shadow-md` to cards |
| `text-muted-foreground` for body copy | Use `text-foreground` for everything |
| `tracking-tighter` only on hero/display text | Use tight tracking on body text |
| `py-24` for section spacing | Use `py-10` or `py-14` |
| One violet element per card at most | Add violet to headings or icons |
| Use `bg-accent` for subtle hover backgrounds | Use `bg-primary/20` for hover backgrounds |
| `border-border` (8% alpha) | `border-border/50` or stronger |
| `gap-3` or `gap-4` for layouts | `gap-5` or `gap-7` |
| Solid `bg-card` for sidebars/panels | Apply `.glass` to sidebars |
| `whileInView` + `once: true` for animations | Loop animations or animate on scroll-out |
