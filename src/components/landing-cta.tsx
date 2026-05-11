"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerChild } from "@/lib/motion";

export function LandingCta() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background violet glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.60 0.22 270 / 10%), transparent)",
        }}
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h2
          variants={staggerChild}
          className="text-5xl md:text-6xl font-bold tracking-tighter mb-6"
        >
          Ready to go viral?
        </motion.h2>
        <motion.p variants={staggerChild} className="text-xl text-muted-foreground mb-10">
          Join 10,000+ creators already using Pixify to make thumbnails that get clicks.
        </motion.p>
        <motion.div variants={staggerChild}>
          <Button asChild size="lg" className="text-base px-10 gap-2">
            <Link href="/register">
              Start Creating for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
