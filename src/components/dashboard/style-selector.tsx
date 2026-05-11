"use client";

import type { StylePreset } from "@/lib/types";
import { cn } from "@/lib/utils";

const GROUPS: { label: string; styles: StylePreset[] }[] = [
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

export function StyleSelector({
  selected,
  onChange,
}: {
  selected: StylePreset | null;
  onChange: (style: StylePreset) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        Style
      </label>
      <div className="space-y-3">
        {GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.styles.map((style) => {
                const isActive = selected === style;
                return (
                  <button
                    key={style}
                    onClick={() => onChange(style)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground"
                    )}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
