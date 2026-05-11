"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ThumbnailGrid } from "@/components/dashboard/thumbnail-grid";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Thumbnail } from "@/lib/types";

export default function GenerationsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMounted(true);
    }
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    async function fetchThumbnails() {
      try {
        const res = await fetch("/api/thumbnails");
        const data = await res.json();
        setThumbnails(data);
      } catch {
        // keep empty
      }
    }
    if (session) fetchThumbnails();
  }, [session]);

  const filtered = filter === "all"
    ? thumbnails
    : thumbnails.filter((t) => t.isFavorite);

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
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={staggerChild}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Generations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All your AI-generated thumbnails in one place
        </p>
      </motion.div>

      <motion.div variants={staggerChild} className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150",
            filter === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground"
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150",
            filter === "favorites"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-border/60 hover:text-foreground"
          )}
        >
          Favorites
        </button>
      </motion.div>

      <motion.div variants={staggerChild}>
        {filtered.length > 0 ? (
          <ThumbnailGrid thumbnails={filtered} onUpdate={() => {}} />
        ) : (
          <EmptyState
            icon={<ImageIcon className="h-12 w-12" aria-hidden="true" />}
            title="No thumbnails yet"
            action={{ label: "Create Thumbnail", href: "/dashboard/generate" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
