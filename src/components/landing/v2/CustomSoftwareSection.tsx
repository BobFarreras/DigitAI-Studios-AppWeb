/**
 * @file src/components/landing/v2/CustomSoftwareSection.tsx
 * @updated 2026-08-19
 * @summary Seccio de software a mida: text a l'esquerra i maqueta amb inclinacio 3D a la dreta.
 * @scope Composicio visual de seccio; sense logica de negoci.
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SectionIntro } from './SectionIntro';
import { SoftwareMock } from './SoftwareMock';
import { TiltCard } from './fx/TiltCard';

export function CustomSoftwareSection() {
  const t = useTranslations('LandingV2.software');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section
      id="software-a-mida"
      ref={ref}
      className="relative z-10 overflow-hidden bg-[#000000] px-4 py-[clamp(96px,12vh,140px)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <SectionIntro
          index="02"
          eyebrow={t('eyebrow')}
          title={t('titleStrong')}
          description={t('description')}
        />

        <motion.div style={{ y }} data-cursor-label={t('eyebrow')} className="[perspective:1400px]">
          <TiltCard className="rounded-[24px]">
            <SoftwareMock />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
