interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { direction: "up" | "down"; percentage: number };
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-1 relative">
      <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.direction === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.direction === "up" ? "\u2191" : "\u2193"} {trend.percentage}%
          </span>
        )}
      </div>
      <div className="absolute top-6 right-6 text-muted-foreground/10">{icon}</div>
    </div>
  );
}
