"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Fixed catalog of style presets surfaced as selectable chips. Defined as a
// module-level constant so the array identity is stable across renders and the
// values stay in sync with the design system.
const STYLE_PRESETS = ["Cinematic", "Minimal", "Bold", "Neon", "Vintage", "Clean"] as const;
type StylePreset = (typeof STYLE_PRESETS)[number];

// Mock latency for the placeholder generate handler. Replace with a real
// request lifecycle (mutation, streaming, etc.) when wiring up generation.
const MOCK_GENERATE_DELAY_MS = 2000;

const ASPECT_RATIOS = ["16:9", "9:16"] as const;
type AspectRatio = (typeof ASPECT_RATIOS)[number];

export function StudioSidebar() {
  const [prompt, setPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState<StylePreset>("Cinematic");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isGenerating, setIsGenerating] = useState(false);

  // Placeholder generation handler. Bails out on empty prompts so the loading
  // state cannot be triggered without input, mirroring the disabled button
  // semantics for users that bypass the UI (e.g. keyboard submit later).
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), MOCK_GENERATE_DELAY_MS);
  };

  return (
    <aside className="bg-sidebar border-sidebar-border scrollbar-hide flex h-full w-80 flex-col overflow-y-auto border-r">
      {/* Header: back navigation + product mark */}
      <div className="border-sidebar-border flex items-center gap-3 border-b p-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground h-8 w-8">
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Layers className="text-primary h-4 w-4" />
          <span className="text-sm font-semibold">Pixify</span>
        </div>
      </div>

      {/* Prompt section */}
      <div className="space-y-3 p-4">
        <label
          htmlFor="studio-prompt"
          className="text-muted-foreground text-xs font-medium tracking-widest uppercase"
        >
          Describe your thumbnail
        </label>
        <Textarea
          id="studio-prompt"
          placeholder="A dark cinematic gaming thumbnail with RGB lighting and dramatic shadows..."
          className="bg-background/50 border-border min-h-32 resize-none text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Style chips */}
      <div className="space-y-3 p-4">
        <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          Style
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((style) => {
            const isActive = activeStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => setActiveStyle(style)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:border-border/60 hover:text-foreground bg-transparent"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Aspect ratio */}
      <div className="space-y-3 p-4">
        <label className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ratio) => {
            const isActive = aspectRatio === ratio;
            return (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                aria-pressed={isActive}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:text-foreground bg-transparent"
                }`}
              >
                {ratio}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
