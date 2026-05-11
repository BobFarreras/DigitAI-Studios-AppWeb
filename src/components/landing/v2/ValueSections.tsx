/**
 * @file src/components/landing/v2/ValueSections.tsx
 * @updated 2026-05-11
 * @summary Seccions de dolor i metode en format compacte i clar.
 * @scope Reforcar necessitat i metodologia de forma visual.
 */
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Rocket, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

const icons = [CircleDashed, Rocket, ShieldCheck];

export function ValueSections() {
  const t = useTranslations('LandingV2');

  return (
    <section id="process" className="linear-shell px-6 py-12 md:px-10 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="linear-surface-2 rounded-[6px] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">{t('pain.badge')}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.22px] text-[#f7f8f8] md:text-4xl">{t('pain.title')}</h3>
          <p className="linear-muted mt-3 text-[14px]">{t('pain.description')}</p>
          <div className="mt-4 space-y-2">
            {['pain1', 'pain2', 'pain3'].map((item, idx) => (
              <motion.div key={item} className="rounded-[6px] border border-[#323334] bg-[#08090a] px-3 py-2 text-[13px] text-[#d0d6e0]" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                <CheckCircle2 className="mr-2 inline h-4 w-4 text-[#e4f222]" />
                {t(`pain.${item}`)}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">{t('process.title')}</p>
          {[0, 1, 2].map((index) => {
            const Icon = icons[index];
            return (
              <motion.article key={index} className="linear-surface-1 rounded-[6px] p-4" initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="mb-2 flex items-center gap-2 text-[#d0d6e0]"><Icon className="h-4 w-4" /><span className="text-[11px]">0{index + 1}</span></div>
                <h4 className="text-[16px] font-medium text-[#f7f8f8]">{t(`process.steps.${index}.title`)}</h4>
                <p className="linear-muted mt-1 text-[13px]">{t(`process.steps.${index}.description`)}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
