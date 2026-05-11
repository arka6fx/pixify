"use client";

import { motion } from "framer-motion";
import { Copy, Layers, Palette, Sparkles, type LucideIcon } from "lucide-react";
import { staggerChild, staggerContainer } from "@/lib/motion";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  // On `lg` breakpoints the grid expands to three columns and `wide`
  // features span two columns to create the bento arrangement.
  wide: boolean;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Prompt-to-Thumbnail",
    description:
      "Describe your thumbnail in plain text and watch AI bring it to life instantly.",
    wide: true,
  },
  {
    icon: Palette,
    title: "Style Presets",
    description:
      "Choose from dozens of proven thumbnail styles used by top creators.",
    wide: false,
  },
  {
    icon: Copy,
    title: "One-Click Variations",
    description:
      "Generate multiple variations of any thumbnail with a single click.",
    wide: false,
  },
  {
    icon: Layers,
    title: "Custom Branding",
    description:
      "Add your logo, fonts and colors to keep every thumbnail on-brand.",
    wide: true,
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Built for creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to make thumbnails that get clicks.
          </p>
        </div>

        {/* Bento grid: 1 col on sm, 2 cols on md, 3 cols on lg with wide
            features spanning two columns to break the visual rhythm. */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          // `margin: "-80px"` slightly delays the reveal until the section
          // is meaningfully in view; `once: true` avoids re-triggering on
          // scroll-up which would feel distracting after the first reveal.
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={staggerChild}
                className={`bg-card border border-border rounded-xl p-6 hover:border-border/60 transition-colors duration-200 ${
                  feature.wide ? "lg:col-span-2" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-primary mb-4" aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
