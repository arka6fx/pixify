"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import type { StylePreset } from "@/lib/types";

const STYLE_GROUPS: { label: string; styles: StylePreset[] }[] = [
  {
    label: "Popular",
    styles: ["Cinematic", "Minimal", "Bold", "Clean"],
  },
  {
    label: "Effects",
    styles: ["Neon", "Vintage", "Dark", "Vibrant"],
  },
  {
    label: "Themed",
    styles: ["Retro", "Gaming"],
  },
];

const STYLE_COLORS: Record<StylePreset, { bg: string; gradient: string }> = {
  Cinematic: { bg: "bg-amber-950", gradient: "from-amber-900 via-amber-800 to-stone-900" },
  Minimal: { bg: "bg-stone-800", gradient: "from-stone-700 via-stone-600 to-stone-800" },
  Bold: { bg: "bg-red-950", gradient: "from-red-900 via-orange-800 to-red-950" },
  Neon: { bg: "bg-violet-950", gradient: "from-violet-900 via-pink-800 to-cyan-900" },
  Vintage: { bg: "bg-amber-900", gradient: "from-amber-800 via-yellow-700 to-orange-900" },
  Clean: { bg: "bg-emerald-950", gradient: "from-emerald-900 via-teal-800 to-emerald-950" },
  Dark: { bg: "bg-neutral-950", gradient: "from-neutral-900 via-zinc-800 to-neutral-950" },
  Vibrant: { bg: "bg-rose-950", gradient: "from-rose-900 via-pink-800 to-purple-900" },
  Retro: { bg: "bg-cyan-950", gradient: "from-cyan-900 via-teal-800 to-blue-900" },
  Gaming: { bg: "bg-indigo-950", gradient: "from-indigo-900 via-violet-800 to-purple-950" },
};

export default function TemplatesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMounted(true);
    }
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  if (!mounted || isPending) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
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
        <h1 className="text-2xl font-bold tracking-tight">Templates &amp; Styles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a style preset to start your thumbnail creation.
        </p>
      </motion.div>

      {STYLE_GROUPS.map((group) => (
        <motion.section key={group.label} variants={staggerChild} className="space-y-4">
          <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.styles.map((style) => {
              const colors = STYLE_COLORS[style];
              return (
                <motion.div
                  key={style}
                  variants={staggerChild}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-border/60 transition-colors duration-200"
                >
                  <div
                    className={`relative aspect-video bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}
                  >
                    <span className="text-white/20 text-4xl font-bold tracking-tight select-none">
                      {style.charAt(0)}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold">{style}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {style === "Cinematic" && "Dramatic lighting, deep shadows, film-like color grading."}
                      {style === "Minimal" && "Clean composition, plenty of whitespace, subtle accents."}
                      {style === "Bold" && "High contrast, saturated colors, punchy typography."}
                      {style === "Neon" && "Synthwave-inspired, glowing accents, cyberpunk vibes."}
                      {style === "Vintage" && "Warm tones, film grain, retro color palettes."}
                      {style === "Clean" && "Bright, crisp, professional look with soft tones."}
                      {style === "Dark" && "Moody, high-contrast, dramatic dark aesthetics."}
                      {style === "Vibrant" && "High-energy, colorful, eye-popping combinations."}
                      {style === "Retro" && "80s/90s inspired, nostalgic color schemes and effects."}
                      {style === "Gaming" && "Esports-ready, dynamic, with motion and energy."}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full gap-2 text-xs h-8">
                      <Link href={`/dashboard/generate`}>
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Use {style} style
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
}
