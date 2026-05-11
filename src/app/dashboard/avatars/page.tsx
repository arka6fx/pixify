"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";

export default function AvatarsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);

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

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <motion.div variants={staggerChild} className="max-w-xl mx-auto text-center py-24">
        <UserCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">Avatars</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal avatars and reference images for AI-generated thumbnails.
        </p>
      </motion.div>
    </motion.div>
  );
}
