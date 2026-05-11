/**
 * @file src/components/landing/v2/ExplainerFlows.tsx
 * @updated 2026-05-11
 * @summary Explica de forma visual i clara l impacte de l automatitzacio i software a mida.
 * @scope Seccio educativa de valor amb animacions funcionals.
 */
'use client';

import { motion } from 'framer-motion';
import { Clock3, Cog, Database, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

const flowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } })
};

export function ExplainerFlows() {
  const t = useTranslations('LandingV2.explainer');

  return (
    <section className="linear-shell px-6 py-12 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">{t('badge')}</p>
        <h3 className="mt-2 max-w-5xl text-balance text-3xl font-semibold tracking-[-0.22px] text-[#f7f8f8] md:text-5xl">{t('title')}</h3>
        <p className="linear-muted mt-3 max-w-3xl text-[14px]">{t('subtitle')}</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="linear-surface-2 rounded-[6px] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#d0d6e0]"><Clock3 className="h-4 w-4" /><h4 className="text-[17px] font-medium">{t('automation.title')}</h4></div>
            <p className="linear-muted text-[13px]">{t('automation.description')}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[6px] border border-[#323334] bg-[#08090a] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#62666d]">{t('automation.beforeLabel')}</p>
                <p className="mt-1 text-2xl font-semibold text-[#eb5757]">12h</p>
                <p className="linear-meta text-[12px]">{t('automation.beforeText')}</p>
              </div>
              <div className="rounded-[6px] border border-[#323334] bg-[#08090a] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#62666d]">{t('automation.afterLabel')}</p>
                <motion.p className="mt-1 text-2xl font-semibold text-[#27a644]" initial={{ opacity: 0.3 }} animate={{ opacity: [0.4, 1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }}>3h</motion.p>
                <p className="linear-meta text-[12px]">{t('automation.afterText')}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} custom={i} variants={flowVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-[4px] border border-[#323334] bg-[#0f1011] px-3 py-2 text-[12px] text-[#d0d6e0]">
                  {t(`automation.points.${i}`)}
                </motion.div>
              ))}
            </div>
          </article>

          <article className="linear-surface-1 rounded-[6px] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#d0d6e0]"><Cog className="h-4 w-4" /><h4 className="text-[17px] font-medium">{t('software.title')}</h4></div>
            <p className="linear-muted text-[13px]">{t('software.description')}</p>

            <div className="mt-4 grid gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} custom={i} variants={flowVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-2 rounded-[6px] border border-[#323334] bg-[#08090a] px-3 py-2">
                  {i === 0 ? <Database className="h-4 w-4 text-[#5e6ad2]" /> : i === 1 ? <Users className="h-4 w-4 text-[#02b8cc]" /> : i === 2 ? <Clock3 className="h-4 w-4 text-[#5e6ad2]" /> : <Cog className="h-4 w-4 text-[#27a644]" />}
                  <span className="text-[12px] text-[#d0d6e0]">{t(`software.cases.${i}`)}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 rounded-[6px] border border-[#323334] bg-[#08090a] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#62666d]">{t('software.flowLabel')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#d0d6e0]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="rounded-[4px] border border-[#323334] bg-[#0f1011] px-2 py-1">{t(`software.flow.${i}`)}</span>
                    {i < 3 ? <span className="text-[#5e6ad2]">→</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
