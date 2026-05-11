"use client";

import { ImageIcon, Sparkles, HardDrive, Briefcase } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useSession } from "@/lib/auth-client";
import { MOCK_STATS } from "@/lib/types";

export function WelcomeHeader() {
  const { data: session } = useSession();

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
          value={MOCK_STATS.totalThumbnails}
          icon={<ImageIcon className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 12 }}
        />
        <StatCard
          label="This Week"
          value={MOCK_STATS.weeklyGenerations}
          icon={<Sparkles className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 8 }}
        />
        <StatCard
          label="Storage Used"
          value={`${MOCK_STATS.storageUsed} MB`}
          icon={<HardDrive className="h-8 w-8" aria-hidden="true" />}
        />
        <StatCard
          label="Brand Assets"
          value={MOCK_STATS.totalAssets}
          icon={<Briefcase className="h-8 w-8" aria-hidden="true" />}
          trend={{ direction: "up", percentage: 5 }}
        />
      </div>
    </div>
  );
}
