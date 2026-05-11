"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { MOCK_ASSETS, type AssetType } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterTab = "all" | AssetType;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Logos", value: "logo" },
  { label: "Icons", value: "icon" },
  { label: "Brand Kits", value: "brand-kit" },
  { label: "Overlays", value: "overlay" },
  { label: "Graphics", value: "graphic" },
];

function formatFileSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function formatDate(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function AssetsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const [filter, setFilter] = useState<FilterTab>("all");

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

  const assets = filter === "all"
    ? MOCK_ASSETS
    : MOCK_ASSETS.filter((a) => a.type === filter);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={staggerChild} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Assets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logos, icons, overlays, and brand kits for your thumbnails.
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload Asset
        </Button>
      </motion.div>

      <motion.div variants={staggerChild} className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            aria-pressed={filter === tab.value}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150",
              filter === tab.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {assets.length === 0 ? (
        <motion.div variants={staggerChild} className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-muted-foreground">No assets in this category yet.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerChild}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              variants={staggerChild}
              className="group relative bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                <Image
                  src={asset.imageUrl}
                  alt={asset.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20" aria-label="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-sm font-medium truncate">{asset.name}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                    {asset.type.replace("-", " ")}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatFileSize(asset.fileSize)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {formatDate(asset.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
