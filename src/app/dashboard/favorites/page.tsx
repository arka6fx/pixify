"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ThumbnailGrid } from "@/components/dashboard/thumbnail-grid";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { MOCK_THUMBNAILS } from "@/lib/types";

export default function FavoritesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMounted(true);
    }
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  if (!mounted || isPending) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const favorites = MOCK_THUMBNAILS.filter((t) => t.isFavorite);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={staggerChild}>
        <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your favorite thumbnails, saved for quick access.
        </p>
      </motion.div>

      <motion.div variants={staggerChild}>
        {favorites.length > 0 ? (
          <ThumbnailGrid thumbnails={favorites} />
        ) : (
          <EmptyState
            icon={<Heart className="h-16 w-16" />}
            title="No favorites yet"
            description="Favorite a thumbnail from the generations page to see it here."
            action={{ label: "Browse Generations", href: "/dashboard/generations" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
