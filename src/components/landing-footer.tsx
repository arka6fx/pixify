import Link from "next/link";
import { Layers } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo + tagline */}
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Pixify</span>
          <span className="text-muted-foreground text-sm ml-2">
            Create stunning thumbnails with AI.
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#gallery" className="hover:text-foreground transition-colors">
            Gallery
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/register" className="hover:text-foreground transition-colors">
            Sign up
          </Link>
        </nav>

        {/* Legal */}
        <div className="text-xs text-muted-foreground">
          © 2026 Pixify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
