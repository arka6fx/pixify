"use client";

import { motion } from "framer-motion";
import { ThumbnailCard } from "@/components/dashboard/thumbnail-card";
import { staggerContainer } from "@/lib/motion";
import type { Thumbnail } from "@/lib/types";

export function ThumbnailGrid({ thumbnails, onUpdate }: { thumbnails: Thumbnail[]; onUpdate?: () => void }) {
  const handleUpdate = onUpdate ?? (() => {});
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {thumbnails.map((item) => (
        <ThumbnailCard key={item.id} thumbnail={item} onUpdate={handleUpdate} />
      ))}
    </motion.div>
  );
}
