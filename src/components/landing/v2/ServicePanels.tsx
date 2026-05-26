/**
 * @file src/components/landing/v2/ServicePanels.tsx
 * @updated 2026-05-11
 * @summary Panell de serveis en format command-center compact.
 * @scope Mostrar oferta comercial amb punts clau i CTA.
 */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, MonitorSmartphone, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const icons = [Bot, MonitorSmartphone, Wrench];

export function ServicePanels() {
  const t = useTranslations('LandingV2.services');

  return (
    <section id="services" className="linear-shell px-6 py-12 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a8f98]">{t('badge')}</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.22px] text-[#f7f8f8] md:text-5xl">{t('title')}</h3>
            <p className="linear-muted mt-2 max-w-3xl text-[14px]">{t('subtitle')}</p>
          </div>
          <Link href="#contact">
            <Button className="linear-cta rounded-[6px] px-5 py-2.5 text-[14px] font-semibold">{t('cta')}</Button>
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const Icon = icons[index];
            return (
              <motion.article
                key={index}
                className="linear-surface-1 rounded-[6px] p-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="mb-2 inline-flex rounded-[4px] border border-[#323334] bg-[#08090a] p-2"><Icon className="h-4 w-4 text-[#d0d6e0]" /></div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a8f98]">{t(`items.${index}.tag`)}</p>
                <h4 className="mt-2 text-[20px] font-medium text-[#f7f8f8]">{t(`items.${index}.title`)}</h4>
                <p className="linear-muted mt-2 text-[13px]">{t(`items.${index}.description`)}</p>
                <ul className="mt-4 space-y-1.5">
                  {[0, 1, 2].map((point) => (
                    <li key={point} className="rounded-[4px] border border-[#323334] bg-[#08090a] px-2.5 py-1.5 text-[12px] text-[#d0d6e0]">
                      {t(`items.${index}.points.${point}`)}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
