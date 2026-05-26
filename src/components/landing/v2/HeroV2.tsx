/**
 * @file src/components/landing/v2/HeroV2.tsx
 * @updated 2026-05-25
 * @summary Hero Linear amb headline immediat (LCP) i animacions nomes per below-fold.
 * @scope Presentar automatitzacions, software i formacio com a portes d'entrada.
 */
'use client';

import { motion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BrandRevealText } from '@/components/ui/brand-reveal';
import { HeroPillarGrid } from './HeroCommandScene';

const pillarVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroLinear() {
  const t = useTranslations('LandingV2.hero');

  return (
    <section
      id="inici"
      className="relative isolate overflow-visible bg-transparent px-4 pb-8 pt-[82px] text-[#08090a] dark:text-[#f7f8f8] sm:px-6 sm:pb-5 sm:pt-[96px] lg:h-[100svh] lg:overflow-hidden lg:px-8 lg:pb-7 lg:pt-[104px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(8,9,10,0.78),transparent)]" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-start">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] tracking-normal text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
            {t('titleStrong')}
            <BrandRevealText className="block text-[#383b3f] dark:text-[#8a8f98] md:!inline-grid">
              {' '}{t('titleMuted')}
            </BrandRevealText>
          </h1>
        </div>

        <motion.div
          variants={pillarVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-5 min-h-0 sm:mt-7 lg:mt-8"
        >
          <HeroPillarGrid />
        </motion.div>
      </div>
    </section>
  );
}
