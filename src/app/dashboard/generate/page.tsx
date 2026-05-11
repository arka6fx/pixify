"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GenerationPreview } from "@/components/dashboard/generation-preview";
import { GenerationVariations } from "@/components/dashboard/generation-variations";
import { PromptInput } from "@/components/dashboard/prompt-input";
import { StyleSelector } from "@/components/dashboard/style-selector";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import type { StylePreset } from "@/lib/types";

const MOCK_VARIATIONS = [
  "https://picsum.photos/seed/var1/960/540",
  "https://picsum.photos/seed/var2/960/540",
  "https://picsum.photos/seed/var3/960/540",
  "https://picsum.photos/seed/var4/960/540",
];

export default function GeneratePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [assetPreview, setAssetPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMounted(true);
    }
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setPreviewUrl(null);
    setVariations([]);

    setTimeout(() => {
      setPreviewUrl("https://picsum.photos/seed/generated/960/540");
      setVariations(MOCK_VARIATIONS);
      setSelectedVariation(0);
      setIsGenerating(false);
    }, 2000);
  }, [prompt, isGenerating]);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 overflow-hidden"
    >
      <aside className="w-[380px] shrink-0 border-r border-border overflow-y-auto scrollbar-hide bg-card p-6 space-y-6">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          disabled={isGenerating}
        />
        <UploadDropzone
          label="Avatar/Reference"
          accept="image/*"
          onUpload={(file) => setAvatarPreview(URL.createObjectURL(file))}
          previewUrl={avatarPreview}
          onRemove={() => setAvatarPreview(null)}
        />
        <UploadDropzone
          label="Brand Assets"
          accept="image/*"
          onUpload={(file) => setAssetPreview(URL.createObjectURL(file))}
          previewUrl={assetPreview}
          onRemove={() => setAssetPreview(null)}
        />
        <StyleSelector
          selected={selectedStyle}
          onChange={setSelectedStyle}
        />
        <Button
          className="w-full gap-2"
          disabled={!prompt.trim() || isGenerating}
          onClick={handleGenerate}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </aside>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <GenerationPreview
          imageUrl={previewUrl}
          isLoading={isGenerating}
        />
        {variations.length > 0 && (
          <GenerationVariations
            variations={variations}
            selectedIndex={selectedVariation}
            onSelect={setSelectedVariation}
          />
        )}
      </div>
    </motion.div>
  );
}
