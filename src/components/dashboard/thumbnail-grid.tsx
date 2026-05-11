"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import type { Thumbnail } from "@/lib/types";
import { ThumbnailCard } from "./thumbnail-card";

export function ThumbnailGrid({ thumbnails }: { thumbnails: Thumbnail[] }) {
  if (thumbnails.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {thumbnails.map((thumbnail) => (
        <ThumbnailCard key={thumbnail.id} thumbnail={thumbnail} />
      ))}
    </motion.div>
  );
}
