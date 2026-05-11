"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Distance (in px) the user must scroll before the glass effect activates.
// Kept small so the transition feels responsive on short hero sections.
const SCROLL_THRESHOLD = 60;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Sync state on mount in case the page is rendered already scrolled
    // (e.g. after a refresh that preserves scroll position).
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();

    // `passive: true` lets the browser skip waiting on preventDefault,
    // keeping scroll smooth on touch devices.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border"
          : "border-b border-transparent bg-transparent",
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Pixify - Go to homepage"
        >
          <Layers className="size-5 text-primary" aria-hidden="true" />
          <span className="font-semibold text-foreground">Pixify</span>
        </Link>

        {/* Center: Nav links (hidden on mobile) */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#gallery"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Gallery
          </a>
          <a
            href="#generate"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Examples
          </a>
        </div>

        {/* Right: User profile + primary CTA */}
        <div className="flex items-center gap-3">
          <UserProfile />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard/generate">Start Creating</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
