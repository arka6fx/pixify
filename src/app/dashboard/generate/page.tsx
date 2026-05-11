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
import { toast } from "sonner";
import type { StylePreset } from "@/lib/types";

interface ThumbnailResult {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
}

export default function GeneratePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [assetPreview, setAssetPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [thumbnails, setThumbnails] = useState<ThumbnailResult[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMounted(true);
    }
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("type", "avatar");
    formData.set("name", file.name);
    try {
      const res = await fetch("/api/avatars", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { id } = await res.json();
      setAvatarId(id);
      setAvatarPreview(URL.createObjectURL(file));
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  }, []);

  const handleAssetUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("type", "asset");
    formData.set("name", file.name);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      setAssetPreview(URL.createObjectURL(file));
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || !selectedStyle || isGenerating) return;

    setIsGenerating(true);
    setPreviewUrl(null);
    setVariations([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          avatarId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Generation failed. Please try again.");
        setIsGenerating(false);
        return;
      }

      const data = await res.json();
      const results: ThumbnailResult[] = data.thumbnails;

      setThumbnails(results);
      if (results.length > 0) {
        const first = results[0]!;
        setPreviewUrl(first.imageUrl);
        setVariations(results.map((t: ThumbnailResult) => t.imageUrl));
      }
      setSelectedVariation(0);
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, avatarId, isGenerating]);

  const handleVariationSelect = useCallback((index: number) => {
    setSelectedVariation(index);
    setPreviewUrl(thumbnails[index]?.imageUrl ?? null);
  }, [thumbnails]);

  const handleRegenerate = useCallback(async () => {
    await handleGenerate();
  }, [handleGenerate]);

  const handleDownload = useCallback(async () => {
    if (!previewUrl) return;
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thumbnail-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed.");
    }
  }, [previewUrl]);

  const handleShare = useCallback(async () => {
    if (previewUrl) {
      await navigator.clipboard.writeText(previewUrl);
      toast.success("Image URL copied to clipboard!");
    }
  }, [previewUrl]);

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
          onUpload={handleAvatarUpload}
          previewUrl={avatarPreview}
          onRemove={() => { setAvatarPreview(null); setAvatarId(null); }}
        />
        <UploadDropzone
          label="Brand Assets"
          accept="image/*"
          onUpload={handleAssetUpload}
          previewUrl={assetPreview}
          onRemove={() => setAssetPreview(null)}
        />
        <StyleSelector
          selected={selectedStyle}
          onChange={setSelectedStyle}
        />
        <Button
          className="w-full gap-2"
          disabled={!prompt.trim() || !selectedStyle || isGenerating}
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
          onDownload={handleDownload}
          onShare={handleShare}
        />
        {variations.length > 0 && (
          <GenerationVariations
            variations={variations}
            selectedIndex={selectedVariation}
            onSelect={handleVariationSelect}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </motion.div>
  );
}
