"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronUp,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  useEffect(() => {
    if (mobileOpen) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  const nav = (
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
  );

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() ?? "U";

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
        <div className="flex items-center h-14 shrink-0 px-4">
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mx-auto"
              onClick={onToggle}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
                <Layers className="size-5 text-primary shrink-0" aria-hidden="true" />
                <span className="font-semibold text-sm text-foreground truncate">
                  Pixify
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-auto shrink-0"
                onClick={onToggle}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>

        {nav}

        <div className="px-2 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full rounded-lg transition-colors duration-150 hover:bg-sidebar-accent/50 px-3 py-2",
                  collapsed && "justify-center px-2"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={session?.user?.image ?? undefined} />
                  <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {session?.user?.name ?? "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user?.email ?? ""}
                      </p>
                    </div>
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align={collapsed ? "center" : "start"}
              className={cn("min-w-56", collapsed && "min-w-48")}
            >
              <DropdownMenuLabel>
                <p className="font-medium">{session?.user?.name ?? "User"}</p>
                <p className="text-xs text-muted-foreground font-normal">
                  {session?.user?.email ?? ""}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-y-0 left-0 w-[260px] bg-sidebar border-r border-sidebar-border overflow-y-auto z-50"
            >
              <div className="flex items-center justify-between gap-2 px-4 h-14 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
                  <Layers className="size-5 text-primary shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-sm text-foreground truncate">
                    Pixify
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={onMobileClose}
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {nav}

              <div className="px-2 pb-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full rounded-lg transition-colors duration-150 hover:bg-sidebar-accent/50 px-3 py-2">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={session?.user?.image ?? undefined} />
                        <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium truncate text-foreground">
                          {session?.user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session?.user?.email ?? ""}
                        </p>
                      </div>
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="min-w-56">
                    <DropdownMenuLabel>
                      <p className="font-medium">{session?.user?.name ?? "User"}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {session?.user?.email ?? ""}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
