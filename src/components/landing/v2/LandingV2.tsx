/**
 * @file src/components/landing/v2/LandingV2.tsx
 * @updated 2026-05-11
 * @summary Landing principal estil Linear amb narrativa compacta.
 * @scope Orquestrar seccions de marketing i contacte final.
 */
import { HeroImpact } from '@/components/landing/v2/HeroImpact';
import { WhatWeBuild } from '@/components/landing/v2/WhatWeBuild';
import { ExplainerFlows } from '@/components/landing/v2/ExplainerFlows';
import { ServicePanels } from '@/components/landing/v2/ServicePanels';
import { ValueSections } from '@/components/landing/v2/ValueSections';
import { FinalCta } from '@/components/landing/v2/FinalCta';
import { ContactSection } from '@/components/landing/ContactSection';

export function LandingV2() {
  return (
    <div className="linear-shell">
      <HeroImpact />
      <WhatWeBuild />
      <ExplainerFlows />
      <ServicePanels />
      <ValueSections />
      <FinalCta />
      <section id="contacte">
        <ContactSection />
      </section>
    </div>
  );
}
