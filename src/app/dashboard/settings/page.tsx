"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { staggerContainer, staggerChild } from "@/lib/motion";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

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
      className="p-6 space-y-8 max-w-2xl"
    >
      <motion.div variants={staggerChild}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </motion.div>

      <motion.section variants={staggerChild} className="space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          Account
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{session.user.name}</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              Edit
            </Button>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{session.user.email}</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              Edit
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerChild} className="space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          Appearance
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Always on for consistent experience</p>
              </div>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary flex items-center justify-start px-0.5 cursor-default">
              <div className="h-5 w-5 rounded-full bg-primary-foreground shadow-sm" />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerChild} className="space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          Notifications
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about your generations</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailNotifs}
              onClick={() => setEmailNotifs((prev) => !prev)}
              className={`h-6 w-11 rounded-full flex items-center transition-colors duration-150 ${
                emailNotifs ? "bg-primary" : "bg-border"
              } ${emailNotifs ? "justify-end" : "justify-start"} px-0.5`}
            >
              <div className="h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform duration-150" />
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
