"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, SwatchBook } from "lucide-react";
import { ThumbnailCard } from "@/components/dashboard/thumbnail-card";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import type { Thumbnail } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const [recentThumbnails, setRecentThumbnails] = useState<Thumbnail[]>([]);

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
    async function fetchRecent() {
      try {
        const res = await fetch("/api/thumbnails");
        const data = await res.json();
        setRecentThumbnails(data.slice(0, 4));
      } catch {
        // keep empty
      }
    }
    if (session) fetchRecent();
  }, [session]);

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
      className="p-6 space-y-8"
    >
      <motion.div variants={staggerChild}>
        <WelcomeHeader />
      </motion.div>

      <motion.div variants={staggerChild} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Generations</h2>
          <Link
            href="/dashboard/generations"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            View all
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {recentThumbnails.map((thumbnail) => (
            <ThumbnailCard key={thumbnail.id} thumbnail={thumbnail} onUpdate={() => {}} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerChild} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/generate"
            className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-border/60 transition-colors duration-200 group"
          >
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                New Generation
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Create a new AI thumbnail
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/assets"
            className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-border/60 transition-colors duration-200 group"
          >
            <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                Brand Assets
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Manage logos and overlays
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/templates"
            className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-border/60 transition-colors duration-200 group"
          >
            <SwatchBook className="h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                Templates
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Browse starter layouts
              </p>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
