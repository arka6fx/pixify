"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudioCanvas } from "@/components/studio-canvas";
import { StudioSidebar } from "@/components/studio-sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";

// Studio is the authenticated workspace shell: a fixed-width sidebar (prompt
// controls) paired with a flexible canvas region. The route is fully
// client-rendered because session state lives in better-auth's React hook
// and we must gate access before mounting the workspace.
export default function StudioPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect unauthenticated visitors once the session check resolves.
  // We use `replace` instead of `push` so the protected route never lands
  // in browser history — back navigation should not return here without auth.
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // While better-auth is still resolving the session, render a centered
  // spinner on a full-viewport surface. `h-svh` tracks the small viewport
  // height to avoid jumpiness on mobile when the URL bar collapses.
  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-background">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  // Session resolved as null — the effect above is dispatching the redirect.
  // Render nothing in the interim to avoid a flash of the workspace shell.
  if (!session) {
    return null;
  }

  // App-shell layout: no global navbar/footer here. The sidebar owns the
  // fixed 320px column inside its own component; the canvas fills the rest.
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <StudioSidebar />
      <StudioCanvas />
    </div>
  );
}
