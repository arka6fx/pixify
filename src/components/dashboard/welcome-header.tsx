"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Sparkles, HardDrive, Briefcase } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useSession } from "@/lib/auth-client";

export function WelcomeHeader() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalThumbnails: 0, weeklyGenerations: 0, storageUsed: 0, totalAssets: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [thumbnailsRes, assetsRes] = await Promise.all([
          fetch("/api/thumbnails"),
          fetch("/api/assets"),
        ]);
        const thumbnails = await thumbnailsRes.json();
        const assets = await assetsRes.json();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        setStats({
          totalThumbnails: thumbnails.length,
          weeklyGenerations: thumbnails.filter((t: { createdAt: string }) => new Date(t.createdAt).getTime() > oneWeekAgo).length,
          storageUsed: Math.round(assets.reduce((acc: number, a: { fileSize: number }) => acc + a.fileSize, 0) / 1024),
          totalAssets: assets.length,
        });
      } catch {
        // keep defaults
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {session?.user?.name ?? "Creator"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your thumbnails.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Thumbnails"
          value={stats.totalThumbnails}
          icon={<ImageIcon className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 12 }}
        />
        <StatCard
          label="This Week"
          value={stats.weeklyGenerations}
          icon={<Sparkles className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 8 }}
        />
        <StatCard
          label="Storage Used"
          value={`${stats.storageUsed} MB`}
          icon={<HardDrive className="h-8 w-8" aria-hidden="true" />}
        />
        <StatCard
          label="Brand Assets"
          value={stats.totalAssets}
          icon={<Briefcase className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 5 }}
        />
      </div>
    </div>
  );
}
