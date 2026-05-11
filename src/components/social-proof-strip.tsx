// Server component — no "use client" needed.
// Renders a horizontal marquee strip of social-proof stats between the hero
// and features sections of the Pixify landing page.
export function SocialProofStrip() {
  const stats = [
    "10,000+ creators",
    "500k thumbnails generated",
    "Trusted by YouTubers",
    "16:9 optimized",
    "One-click export",
    "Instant AI generation",
  ];

  return (
    <section
      className="border-y border-border py-5 overflow-hidden"
      // Fade the marquee edges so items appear to slide in/out rather than
      // popping at the section boundaries. The mask is intentionally inlined
      // because mask-image utilities are not part of the current Tailwind
      // token set in this project.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
      aria-label="Pixify social proof"
    >
      {/* Two copies of the stats are rendered back-to-back so that the
          CSS `marquee` keyframes (translateX -50%) produce a seamless loop. */}
      <div className="flex whitespace-nowrap marquee-track" aria-hidden="true">
        {[...stats, ...stats].map((stat, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-sm text-muted-foreground font-medium"
          >
            {stat}
            <span className="text-border text-lg">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
