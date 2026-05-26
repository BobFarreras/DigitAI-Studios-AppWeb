/**
 * @file src/components/landing/v2/LandingV2.tsx
 * @updated 2026-05-25
 * @summary Landing principal estil Linear amb narrativa compacta.
 * @scope Orquestrar seccions de marketing i contacte final.
 */
import { HeroLinear } from '@/components/landing/v2/HeroV2';
import { HeroAmbientBackground } from './HeroAmbientBackground';
import { AutomationSection } from './AutomationSection';
import { LazySections } from './LazySections';

export function LandingV2() {
  return (
    <div className="linear-shell relative isolate overflow-hidden">
      <HeroAmbientBackground className="fixed inset-0" />
      <HeroLinear />
      <AutomationSection />
      <LazySections />
    </div>
  );
}
