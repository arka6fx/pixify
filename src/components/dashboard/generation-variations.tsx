"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GenerationVariations({
  variations,
  selectedIndex,
  onSelect,
  onRegenerate,
}: {
  variations: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onRegenerate?: () => void;
}) {
  return (
    <div className="w-full max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Variations
        </span>
        {onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs h-7"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Regenerate all
          </Button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {variations.map((url, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={url}
              onClick={() => onSelect(index)}
              className={cn(
                "relative aspect-[16/9] w-36 shrink-0 rounded-lg overflow-hidden transition-all duration-150",
                isSelected
                  ? "border-2 border-primary ring-1 ring-primary/30"
                  : "border-2 border-border hover:border-border/60"
              )}
            >
              <Image
                src={url}
                alt={`Variation ${index + 1}`}
                fill
                className="object-cover"
                sizes="144px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
