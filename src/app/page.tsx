import { FeaturesGrid } from "@/components/features-grid";
import { GenerationsGrid } from "@/components/generations-grid";
import { Hero } from "@/components/hero";
import { LandingCta } from "@/components/landing-cta";
import { LandingFooter } from "@/components/landing-footer";
import { Navbar } from "@/components/navbar";
import { SocialProofStrip } from "@/components/social-proof-strip";
import { StyleGallery } from "@/components/style-gallery";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProofStrip />
      <FeaturesGrid />
      <StyleGallery />
      <GenerationsGrid />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
