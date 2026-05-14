/**
 * @file src/components/landing/v2/HeroV2.tsx
 * @updated 2026-05-13
 * @summary Hero Linear amb headline superior i tres pilars visuals.
 * @scope Presentar automatitzacions, software i formacio com a portes d'entrada.
 */
'use client';

import { motion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BrandRevealText } from '@/components/ui/brand-reveal';
import { HeroPillarGrid } from './HeroCommandScene';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroLinear() {
  const t = useTranslations('LandingV2.hero');

  return (
    <section
      id="inici"
      className="relative isolate h-[100svh] overflow-hidden bg-transparent px-4 pb-4 pt-[92px] text-[#08090a] dark:text-[#f7f8f8] sm:px-6 sm:pb-5 sm:pt-[96px] lg:px-8 lg:pb-7 lg:pt-[104px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(8,9,10,0.78),transparent)]" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-start"
      >
        <motion.div variants={itemVariants} className="mx-auto max-w-6xl text-center">
          <h1 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] tracking-normal text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
            {t('titleStrong')}
            <BrandRevealText className="max-md:!hidden text-[#383b3f] dark:text-[#8a8f98] md:!inline-grid">
              {' '}{t('titleMuted')}
            </BrandRevealText>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 min-h-0 sm:mt-7 lg:mt-8">
          <HeroPillarGrid />
        </motion.div>
      </motion.div>
    </section>
  );
}
