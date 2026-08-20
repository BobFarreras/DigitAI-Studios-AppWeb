/**
 * @file src/components/landing/v2/HeroStats.tsx
 * @updated 2026-08-19
 * @summary Franja de metriques de l'hero amb revelat esglaonat.
 * @scope Presentacio de dades ja tradudes; sense logica de negoci.
 */
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const kpis = ['kpi1', 'kpi2', 'kpi3'] as const;

export function HeroStats() {
  const t = useTranslations('LandingV2.hero');

  return (
    <div className="flex flex-wrap gap-x-12 gap-y-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.45 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[clamp(24px,3vw,34px)] font-normal leading-none tracking-[-0.03em] text-white">
            {t(`${kpi}.value`)}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#5f5f5f]">{t(`${kpi}.label`)}</p>
        </motion.div>
      ))}
    </div>
  );
}
