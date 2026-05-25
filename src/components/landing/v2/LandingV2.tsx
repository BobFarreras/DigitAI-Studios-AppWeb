/**
 * @file src/components/landing/v2/LandingV2.tsx
 * @updated 2026-05-25
 * @summary Landing principal estil Linear amb narrativa compacta. Dynamic imports below-fold.
 * @scope Orquestrar seccions de marketing i contacte final.
 */
import dynamic from 'next/dynamic';
import { HeroLinear } from '@/components/landing/v2/HeroV2';
import { HeroAmbientBackground } from './HeroAmbientBackground';
import { AutomationSection } from './AutomationSection';

const CustomSoftwareSection = dynamic(() => import('./CustomSoftwareSection').then((m) => ({ default: m.CustomSoftwareSection })), { ssr: false });
const TrainingSection = dynamic(() => import('./TrainingSection').then((m) => ({ default: m.TrainingSection })), { ssr: false });
const ContactSectionV2 = dynamic(() => import('./ContactSectionV2').then((m) => ({ default: m.ContactSectionV2 })), { ssr: false });

export function LandingV2() {
  return (
    <div className="linear-shell relative isolate overflow-hidden">
      <HeroAmbientBackground className="fixed inset-0" />
      <HeroLinear />
      <AutomationSection />
      <CustomSoftwareSection />
      <TrainingSection />
      <ContactSectionV2 />
    </div>
  );
}
