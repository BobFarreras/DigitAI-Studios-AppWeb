/**
 * @file src/components/landing/v2/LandingV2.tsx
 * @updated 2026-05-11
 * @summary Landing principal estil Linear amb narrativa compacta.
 * @scope Orquestrar seccions de marketing i contacte final.
 */
import { HeroLinear } from '@/components/landing/v2/HeroV2';


import { ContactSection } from '@/components/landing/ContactSection';
import { AutomationSection } from './AutomationSection';
import { CustomSoftwareSection } from './CustomSoftwareSection';
import { TrainingSection } from './TrainingSection';

export function LandingV2() {
  return (
    <div className="linear-shell">
      <HeroLinear/>
      <AutomationSection/>
      <CustomSoftwareSection/>
      <TrainingSection/>
 
      
      <section id="contacte">
        <ContactSection />
      </section>
    </div>
  );
}
