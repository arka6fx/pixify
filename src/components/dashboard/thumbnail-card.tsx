"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { staggerChild } from "@/lib/motion";
import { toast } from "sonner";
import type { Thumbnail } from "@/lib/types";

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function ThumbnailCard({ thumbnail, onUpdate }: { thumbnail: Thumbnail; onUpdate: () => void; }) {
  const handleFavorite = async () => {
    try {
      const res = await fetch(`/api/thumbnails/${thumbnail.id}/favorite`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      onUpdate?.();
    } catch {
      toast.error("Failed to toggle favorite.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(thumbnail.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thumbnail-${thumbnail.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/thumbnails/${thumbnail.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      onUpdate?.();
      toast.success("Thumbnail deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <motion.div
      variants={staggerChild}
      className="group relative bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={thumbnail.imageUrl}
          alt={thumbnail.prompt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
          <Button variant="ghost" size="icon" className="text-white hover:text-white" aria-label="Favorite" onClick={handleFavorite}>
            <Heart className={`h-4 w-4 ${thumbnail.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-white" aria-label="Download" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-white" aria-label="Delete" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-foreground truncate">{thumbnail.prompt}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px]">{thumbnail.style}</Badge>
          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(thumbnail.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}
