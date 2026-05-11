"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const styles = [
  { name: "Cinematic", seed: "cinema1" },
  { name: "Minimal", seed: "minimal2" },
  { name: "Bold", seed: "bold3" },
  { name: "Neon", seed: "neon4" },
  { name: "Vintage", seed: "vintage5" },
  { name: "Clean", seed: "clean6" },
  { name: "Dark", seed: "dark7" },
  { name: "Vibrant", seed: "vibrant8" },
];

export function StyleGallery() {
  return (
    <section id="gallery" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-2">Style presets</h2>
          <p className="text-muted-foreground">
            Pick a style or blend multiple to match your channel aesthetic.
          </p>
        </motion.div>

        {/* Scrollable row */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
          {styles.map((style) => (
            <div
              key={style.name}
              className="group relative flex-none w-72 aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border cursor-pointer ring-0 hover:ring-1 hover:ring-primary/40 transition-all duration-200"
            >
              <Image
                src={`https://picsum.photos/seed/${style.seed}/576/324`}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="288px"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                <span className="text-sm font-medium text-foreground">Use {style.name} style →</span>
              </div>
              {/* Style name badge */}
              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded text-xs font-medium text-foreground border border-border">
                {style.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
