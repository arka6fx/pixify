"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  Sparkles,
  UserCircle,
  Briefcase,
  SwatchBook,
  Heart,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  highlighted?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generations", href: "/dashboard/generations", icon: Image },
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles, highlighted: true },
  { label: "Avatars", href: "/dashboard/avatars", icon: UserCircle },
  { label: "Brand Assets", href: "/dashboard/assets", icon: Briefcase },
  { label: "Templates", href: "/dashboard/templates", icon: SwatchBook },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
];

const SETTINGS_ITEM: NavItem = { label: "Settings", href: "/dashboard/settings", icon: Settings };

export function DashboardSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 h-14 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <Layers className="size-5 text-primary shrink-0" aria-hidden="true" />
          {!collapsed && (
            <motion.span
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-sm text-foreground truncate"
            >
              Pixify
            </motion.span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-150 group",
                active
                  ? item.highlighted
                    ? "bg-sidebar-accent text-primary font-medium border-l-2 border-primary"
                    : "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                collapsed && "justify-center px-2 border-l-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  !active && item.highlighted && "text-primary"
                )}
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div className="px-2 pb-2">
        <Link
          href={SETTINGS_ITEM.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-150 group",
            isActive(SETTINGS_ITEM.href)
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? SETTINGS_ITEM.label : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="truncate">{SETTINGS_ITEM.label}</span>
          )}
        </Link>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className={cn("flex items-center gap-3 px-3 py-3", collapsed && "justify-center px-2")}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback className="text-xs">
            {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>
        )}
      </div>

      <div className={cn("flex items-center px-3 pb-3", collapsed ? "flex-col gap-2" : "justify-between gap-2")}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleSignOut}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "hidden lg:flex flex-col h-svh overflow-hidden shrink-0",
          "bg-sidebar border-r border-sidebar-border"
        )}
      >
        {sidebarContent}
      </motion.aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-[260px] bg-sidebar border-r border-sidebar-border overflow-y-auto z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
