"use client";
import { useState } from "react";
import Image from "next/image";
import { Download, LayoutGrid, Share2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder generation variations. Swapped with real assets once the
// generation pipeline is wired up; kept as a module-level constant so the
// array identity is stable across renders.
const VARIATIONS = [
  "https://picsum.photos/seed/var1/960/540",
  "https://picsum.photos/seed/var2/960/540",
  "https://picsum.photos/seed/var3/960/540",
] as const;

// Safe fallback for the main preview. `noUncheckedIndexedAccess` widens any
// tuple index to `T | undefined`, so we keep a non-empty guarantee with a
// constant fallback rather than asserting non-null at the call site.
const FALLBACK_SRC = VARIATIONS[0];

export function StudioCanvas() {
  const [selectedVariation, setSelectedVariation] = useState(0);
  // Wired to a future generation lifecycle; the setter is intentionally
  // unused until that lands, so we destructure only the value.
  const [isLoading] = useState(false);

  // Resolve the active source defensively. With strict index access the
  // tuple lookup can be undefined if `selectedVariation` ever drifts out of
  // bounds, so fall back to the first variation to keep the preview filled.
  const activeSrc = VARIATIONS[selectedVariation] ?? FALLBACK_SRC;

  return (
    <div className="bg-background flex flex-1 flex-col overflow-hidden">
      {/* Top bar */}
      <div className="border-border flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-sm font-semibold">Studio</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Single view">
            <Square className="h-4 w-4" />
          </Button>
          <div className="bg-border mx-1 h-4 w-px" />
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-auto p-8">
        {/* Main canvas */}
        <div className="w-full max-w-3xl">
          <div className="bg-card border-border relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
            {isLoading ? (
              <div className="shimmer absolute inset-0" />
            ) : (
              <Image
                src={activeSrc}
                alt="Generated thumbnail"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 90vw, 768px"
                priority
              />
            )}
          </div>
        </div>

        {/* Variations row */}
        <div className="flex gap-3">
          {VARIATIONS.map((src, i) => {
            const isSelected = selectedVariation === i;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedVariation(i)}
                aria-pressed={isSelected}
                aria-label={`Select variation ${i + 1}`}
                className={`relative aspect-[16/9] w-36 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-primary ring-primary/30 ring-1"
                    : "border-border hover:border-border/60"
                }`}
              >
                <Image
                  src={src}
                  alt={`Variation ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
