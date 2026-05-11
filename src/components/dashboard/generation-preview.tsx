"use client";

import Image from "next/image";
import { Download, ImageIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenerationPreview({
  imageUrl,
  isLoading,
  onDownload,
  onShare,
}: {
  imageUrl: string | null;
  isLoading: boolean;
  onDownload?: () => void | Promise<void>;
  onShare?: () => void | Promise<void>;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="aspect-[16/9] w-full max-w-3xl bg-card border border-border rounded-xl overflow-hidden relative">
        {isLoading && <div className="absolute inset-0 shimmer z-10" />}
        {imageUrl && !isLoading && (
          <Image
            src={imageUrl}
            alt="Generated thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
        {!imageUrl && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-sm text-muted-foreground/60">
              Your thumbnail will appear here
            </p>
          </div>
        )}
      </div>
      {(onDownload || onShare) && (
        <div className="flex items-center gap-2">
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onDownload}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download
            </Button>
          )}
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onShare}
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
