/**
 * @file src/components/landing/v2/WhatWeBuild.tsx
 * @updated 2026-05-11
 * @summary Seccio de capacitats en estil Linear amb flux operatiu.
 * @scope Explicar serveis principals i pipeline de projecte.
 */
'use client';

import { motion } from 'framer-motion';
import { Bot, Database, LayoutDashboard, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';

const icons = [Bot, LayoutDashboard, UserCog, Database];

export function WhatWeBuild() {
  const t = useTranslations('LandingV2.whatWeBuild');

  return (
    <section className="linear-shell px-6 py-14 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <p className="linear-accent text-[11px] font-semibold uppercase tracking-[0.16em]">{t('badge')}</p>
        <h2 className="mt-3 max-w-5xl text-balance text-3xl font-semibold tracking-[-0.22px] text-[#f7f8f8] md:text-5xl">{t('title')}</h2>
        <p className="linear-muted mt-3 max-w-3xl text-[15px]">{t('description')}</p>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((idx) => {
            const Icon = icons[idx];
            return (
              <motion.article
                key={idx}
                className="linear-surface-1 rounded-[6px] p-4"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
              >
                <div className="mb-3 inline-flex rounded-[4px] border border-[#323334] bg-[#08090a] p-2"><Icon className="h-4.5 w-4.5 text-[#d0d6e0]" /></div>
                <h3 className="text-[17px] font-medium text-[#f7f8f8]">{t(`items.${idx}.title`)}</h3>
                <p className="linear-muted mt-2 text-[13px] leading-[1.4]">{t(`items.${idx}.description`)}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="linear-surface-2 mt-8 rounded-[6px] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">{t('flow.label')}</p>
          <div className="mt-4 grid gap-2 md:grid-cols-4">
            {[0, 1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                className="relative rounded-[6px] border border-[#323334] bg-[#08090a] px-3 py-2 text-[12px] text-[#d0d6e0]"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: idx * 0.09 }}
              >
                {t(`flow.steps.${idx}`)}
                {idx < 3 ? <span className="absolute -right-1.5 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#e4f222] md:block" /> : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
