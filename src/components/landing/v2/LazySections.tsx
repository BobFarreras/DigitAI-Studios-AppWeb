/**
 * @file src/components/landing/v2/LazySections.tsx
 * @updated 2026-05-25
 * @summary Client boundary per dynamic imports de seccions below-fold.
 * @scope Code splitting sense bloquejar SSR del Server Component pare.
 */
'use client';

import dynamic from 'next/dynamic';

const CustomSoftwareSection = dynamic(() => import('./CustomSoftwareSection').then((m) => ({ default: m.CustomSoftwareSection })), { ssr: false });
const TrainingSection = dynamic(() => import('./TrainingSection').then((m) => ({ default: m.TrainingSection })), { ssr: false });
const ContactSectionV2 = dynamic(() => import('./ContactSectionV2').then((m) => ({ default: m.ContactSectionV2 })), { ssr: false });

export function LazySections() {
  return (
    <>
      <CustomSoftwareSection />
      <TrainingSection />
      <ContactSectionV2 />
    </>
  );
}
