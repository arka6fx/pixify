"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";
import { MOCK_AVATARS } from "@/lib/types";

export default function AvatarsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const [avatars, setAvatars] = useState(MOCK_AVATARS);

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

  const handleSetDefault = (id: string) => {
    setAvatars((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setAvatars((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={staggerChild} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Avatars</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal avatars and reference images.
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload Avatar
        </Button>
      </motion.div>

      {avatars.length === 0 ? (
        <motion.div variants={staggerChild} className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-muted-foreground">No avatars yet. Upload one to get started.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerChild}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              variants={staggerChild}
              className="group relative bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={avatar.imageUrl}
                  alt={avatar.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleSetDefault(avatar.id)}
                    aria-label="Set as default"
                  >
                    <Star className={`h-4 w-4 ${avatar.isDefault ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleDelete(avatar.id)}
                    aria-label="Delete avatar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium truncate">{avatar.name}</span>
                {avatar.isDefault && (
                  <Badge variant="outline" className="text-[10px] ml-2 shrink-0">
                    Default
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
