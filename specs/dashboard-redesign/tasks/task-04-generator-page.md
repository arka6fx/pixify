# Task 04: Generator Page

## Status

complete

## Wave

2

## Description

Build the full AI thumbnail generator page within the dashboard. This replaces the old standalone `/studio` experience. It has a two-panel layout inside the dashboard main area: a control panel on the left (prompt input, upload dropzones, style selector, generate button) and a preview panel on the right (preview with toolbar, variations row).

## Dependencies

**Depends on:** task-01-dashboard-layout-and-sidebar.md (dashboard shell), task-02-shared-types-and-mock-data.md (types)
**Blocks:** None

**Context from dependencies:** Task 01 provides the dashboard layout (sidebar + main content area). Task 02 provides `StylePreset` type from `@/lib/types`. This task creates all generator-specific components and the page.

## Files to Create

- `src/components/dashboard/prompt-input.tsx` — Large prompt textarea with character count
- `src/components/dashboard/upload-dropzone.tsx` — Drag-and-drop file upload zone
- `src/components/dashboard/style-selector.tsx` — Style preset chip grid with category groups
- `src/components/dashboard/generation-preview.tsx` — Main preview panel with toolbar
- `src/components/dashboard/generation-variations.tsx` — Variation thumbnail row with regeneration
- `src/app/dashboard/generate/page.tsx` — Full generator page composition

## Files to Modify

- None

## Technical Details

### Layout

The generator page fills the dashboard main area. It's a flex row:
```
┌─ Left Panel (380px) ───────────────────┬─ Right Panel (flex-1) ──────────┐
│ Prompt Input (large textarea)           │ Preview (16:9 aspect ratio)     │
│ Upload Avatar / Reference               │ [Download] [Share] buttons      │
│ Upload Brand Assets                     │ Variations row (4 thumbnails)   │
│ Style Selector (chips in groups)        │                                 │
│ [✨ Generate] button                    │                                 │
└─────────────────────────────────────────┴─────────────────────────────────┘
```

### prompt-input.tsx

```tsx
"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Describe your thumbnail
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={500}
        placeholder="A dark cinematic gaming thumbnail with RGB lighting and dramatic shadows..."
        className="min-h-[140px] w-full resize-none rounded-lg border border-border bg-background/50 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">{value.length}/500</span>
      </div>
    </div>
  );
}
```

### upload-dropzone.tsx

```tsx
"use client";
import { useRef, useState, type DragEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  label: string;
  accept?: string;
  onUpload: (file: File) => void;
  previewUrl?: string | null;
  onRemove?: () => void;
}
```

States:
- **Empty**: Dashed border container
  ```tsx
  <div
    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
    onDragLeave={() => setIsDragging(false)}
    onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
    onClick={() => inputRef.current?.click()}
    className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 space-y-2"
  >
    <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
    <p className="text-sm text-muted-foreground">Drop {label.toLowerCase()} here or click to browse</p>
    <p className="text-xs text-muted-foreground/60">Supports PNG, JPG, WEBP — max 10MB</p>
  </div>
  ```
- **With preview**: Shows the uploaded image as a thumbnail with a remove button
  ```tsx
  <div className="relative rounded-xl overflow-hidden border border-border">
    <img src={previewUrl} alt={label} className="w-full h-24 object-cover" />
    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70" onClick={onRemove}>
      <X className="h-3 w-3 text-white" />
    </Button>
    <p className="text-xs text-muted-foreground px-3 py-1.5">{label} uploaded</p>
  </div>
  ```

Use a hidden `<input type="file" ref={inputRef} accept={accept ?? "image/png,image/jpeg,image/webp"} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])}" />.

### style-selector.tsx

```tsx
"use client";
import type { StylePreset } from "@/lib/types";

interface StyleSelectorProps {
  selected: StylePreset | null;
  onChange: (style: StylePreset) => void;
}
```

Organize 10 styles into groups:
- **Popular**: Cinematic, Minimal, Bold, Clean
- **Effects**: Neon, Vintage, Dark, Vibrant
- **Themed**: Retro, Gaming

Each group has a group label in eyebrow style. Chips follow the active/inactive pattern from DESIGN.md:
- Active: `bg-primary text-primary-foreground border-primary`
- Inactive: `bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground`

```tsx
// Example chip:
<button
  key={style}
  type="button"
  onClick={() => onChange(style)}
  aria-pressed={selected === style}
  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
    selected === style
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground"
  }`}
>
  {style}
</button>
```

Layout: `flex flex-wrap gap-2` for each group, `space-y-3` overall.

### generation-preview.tsx

```tsx
"use client";
import Image from "next/image";
import { Download, Share2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerationPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}
```

- Container: `aspect-[16/9] w-full max-w-3xl bg-card border border-border rounded-xl overflow-hidden relative`
- When `isLoading`: full shimmer overlay (`<div className="absolute inset-0 shimmer" />`)
- When `imageUrl` is set: `<Image src={imageUrl} alt="Generated thumbnail" fill className="object-cover" sizes="(max-width: 1200px) 90vw, 768px" priority />`
- When no image and not loading: centered placeholder
  ```tsx
  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
    <ImageIcon className="h-8 w-8" aria-hidden="true" />
    <p className="text-sm">Your thumbnail will appear here</p>
  </div>
  ```
- Toolbar below: `flex items-center justify-center gap-2 mt-4`
  - `<Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Download</Button>`
  - `<Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Share2 className="h-3.5 w-3.5" /> Share</Button>`
- Wrapper: `flex flex-col items-center justify-center gap-6 p-8`

### generation-variations.tsx

```tsx
"use client";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerationVariationsProps {
  variations: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onRegenerate?: () => void;
}
```

```tsx
export function GenerationVariations({ variations, selectedIndex, onSelect, onRegenerate }: GenerationVariationsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Variations</span>
        {onRegenerate && (
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={onRegenerate}>
            <RefreshCw className="h-3 w-3" />
            Regenerate all
          </Button>
        )}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {variations.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={selectedIndex === i}
            className={`relative aspect-[16/9] w-36 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
              selectedIndex === i
                ? "border-primary ring-primary/30 ring-1"
                : "border-border hover:border-border/60"
            }`}
          >
            <Image src={src} alt={`Variation ${i + 1}`} fill className="object-cover" sizes="144px" />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### generate/page.tsx

Auth-gated client component (same pattern as existing protected pages). Wire everything together:

```tsx
"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/dashboard/prompt-input";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import { StyleSelector } from "@/components/dashboard/style-selector";
import { GenerationPreview } from "@/components/dashboard/generation-preview";
import { GenerationVariations } from "@/components/dashboard/generation-variations";
import { useSession } from "@/lib/auth-client";
import type { StylePreset } from "@/lib/types";

const MOCK_VARIATIONS = [
  "https://picsum.photos/seed/genvar1/960/540",
  "https://picsum.photos/seed/genvar2/960/540",
  "https://picsum.photos/seed/genvar3/960/540",
  "https://picsum.photos/seed/genvar4/960/540",
];

export default function GeneratePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [assetPreview, setAssetPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPreviewUrl(null);
    setVariations([]);
    setTimeout(() => {
      setPreviewUrl(MOCK_VARIATIONS[0]);
      setVariations(MOCK_VARIATIONS);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUpload = (file: File) => {
    return URL.createObjectURL(file);
  };

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-background">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 overflow-hidden"
    >
      {/* Left Panel */}
      <aside className="w-[380px] shrink-0 border-r border-border overflow-y-auto scrollbar-hide bg-card">
        <div className="p-6 space-y-6">
          <PromptInput value={prompt} onChange={setPrompt} disabled={isGenerating} />
          <UploadDropzone
            label="Avatar / Reference"
            onUpload={(f) => setAvatarPreview(handleUpload(f))}
            previewUrl={avatarPreview}
            onRemove={() => setAvatarPreview(null)}
          />
          <UploadDropzone
            label="Brand Assets"
            onUpload={(f) => setAssetPreview(handleUpload(f))}
            previewUrl={assetPreview}
            onRemove={() => setAssetPreview(null)}
          />
          <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </aside>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 overflow-y-auto">
        <GenerationPreview
          imageUrl={previewUrl}
          isLoading={isGenerating}
          onDownload={() => {}}
          onShare={() => {}}
        />
        {variations.length > 0 && (
          <GenerationVariations
            variations={variations}
            selectedIndex={selectedVariation}
            onSelect={setSelectedVariation}
            onRegenerate={() => {
              setIsGenerating(true);
              setTimeout(() => {
                setIsGenerating(false);
              }, 2000);
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
```

## Acceptance Criteria

- [ ] `/dashboard/generate` shows two-panel layout inside the dashboard shell
- [ ] Prompt textarea accepts input and shows character count (0/500)
- [ ] Upload dropzones accept drag-and-drop and file picker clicks, show preview thumbnail with remove button
- [ ] Style selector shows 10 styles in 3 groups with labels, active state toggles correctly
- [ ] Generate button is disabled when prompt is empty or during generation
- [ ] Clicking Generate shows shimmer loading state for 2 seconds
- [ ] After generation, preview shows generated image and variations row appears with 4 thumbnails
- [ ] Selecting a variation highlights it with primary border + ring
- [ ] Regenerate all button triggers loading state
- [ ] Auth gate works correctly (spinner → redirect)
- [ ] All DESIGN.md rules followed
