"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { staggerChild, staggerContainer } from "@/lib/motion";

// Number of placeholder thumbnails rendered in the showcase grid.
// Kept as a named constant so designers can tune the density without
// hunting through JSX, and so it stays in sync with the radial mask sizing.
const THUMBNAIL_COUNT = 12;

// Inline gradient styles are declared once at module scope rather than
// re-allocated on every render. They use OKLCH tokens that match the
// app's violet primary so the glow stays visually consistent across themes.
const HERO_BACKGROUND_STYLE = {
  background:
    "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.60 0.22 270 / 12%), transparent)",
} as const;

const THUMBNAIL_MASK_STYLE = {
  maskImage:
    "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
} as const;

const THUMBNAIL_GLOW_STYLE = {
  background:
    "radial-gradient(ellipse at center, oklch(0.60 0.22 270 / 40%), transparent 70%)",
} as const;

export function Hero() {
  return (
    <section
      // `min-h-svh` uses the small viewport unit so mobile browser chrome
      // doesn't push the CTA below the fold. `pt-16` reserves space for the
      // fixed navbar so the headline isn't visually clipped on first paint.
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden pt-16"
      style={HERO_BACKGROUND_STYLE}
      aria-labelledby="hero-headline"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-col items-center gap-6 px-6 text-center"
      >
        {/* Eyebrow badge — positions the product as AI-driven before the headline lands. */}
        <motion.div variants={staggerChild}>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary"
          >
            AI-Powered Thumbnail Generation
          </Badge>
        </motion.div>

        {/* Two-line headline. The second line is colored with `text-primary`
            to anchor the eye on the value proposition ("already made"). */}
        <motion.h1
          id="hero-headline"
          variants={staggerChild}
          className="max-w-4xl text-center text-6xl font-bold leading-[1.05] tracking-tighter md:text-7xl"
        >
          Your next viral thumbnail,
          <br />
          <span className="text-primary">already made.</span>
        </motion.h1>

        <motion.p
          variants={staggerChild}
          className="max-w-lg text-center text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          Create stunning thumbnails with AI. Describe your idea and get
          professional results in seconds.
        </motion.p>

        {/* CTA row. Primary action routes into the studio; the secondary
            ghost link anchors to the gallery section on the same page. */}
        <motion.div
          variants={staggerChild}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="px-8 text-base">
            <Link href="/studio">Start Creating</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="px-8 text-base text-muted-foreground hover:text-foreground"
          >
            <a href="#gallery">See examples</a>
          </Button>
        </motion.div>

        {/* Thumbnail showcase grid. The radial mask fades the edges into the
            background so the grid feels like a "preview window" rather than a
            hard rectangular block, and the violet glow beneath reinforces the
            product's signature color. */}
        <motion.div
          variants={staggerChild}
          className="relative mx-auto mt-8 w-full max-w-5xl"
        >
          <div
            className="grid grid-cols-4 gap-2 md:gap-3"
            style={THUMBNAIL_MASK_STYLE}
          >
            {Array.from({ length: THUMBNAIL_COUNT }).map((_, index) => (
              <div
                key={index}
                className="bg-surface-1 relative aspect-[16/9] overflow-hidden rounded-lg"
              >
                <Image
                  // Deterministic seed per tile keeps the visual stable across
                  // renders/SSR and avoids hydration mismatches.
                  src={`https://picsum.photos/seed/thumb${index + 1}/480/270`}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
          {/* Decorative violet glow sits behind the grid via negative z-index. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-30 blur-3xl"
            style={THUMBNAIL_GLOW_STYLE}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
