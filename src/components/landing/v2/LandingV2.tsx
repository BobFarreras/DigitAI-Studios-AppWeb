/**
 * @file src/components/landing/v2/LandingV2.tsx
 * @updated 2026-08-19
 * @summary Composicio de la landing publica sobre fons negre amb efectes de cursor i scroll.
 * @scope Nomes composicio de seccions; sense logica de dades.
 */
import { HeroV2 } from "@/components/landing/v2/HeroV2";
import { JourneyConstellation } from "./JourneyConstellation";
import { ParticleField } from "./ParticleField";
import { ScrollProgress } from "./fx/ScrollProgress";
import { ManifestoSection } from "./ManifestoSection";
import { ServicesMarquee } from "./ServicesMarquee";
import { LazySections } from "./LazySections";

export function LandingV2() {
  return (
    <div className="dala-landing relative isolate overflow-x-clip bg-[var(--dala-bg)] text-[var(--dala-text)] transition-colors duration-500">
      <ScrollProgress />
      <ParticleField />
      <div id="visual-journey" className="relative isolate">
        <JourneyConstellation />
        <HeroV2 />
        <ManifestoSection />
        <ServicesMarquee />
      </div>
      <LazySections />
    </div>
  );
}
