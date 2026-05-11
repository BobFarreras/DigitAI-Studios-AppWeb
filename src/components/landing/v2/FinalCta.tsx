/**
 * @file src/components/landing/v2/FinalCta.tsx
 * @updated 2026-05-11
 * @summary CTA final amb estetic Linear i crida de conversio.
 * @scope Tancar narrativa i portar a contacte.
 */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function FinalCta() {
  const t = useTranslations('LandingV2.finalCta');

  return (
    <section id="contact" className="linear-shell px-6 pb-20 pt-10 md:px-10 lg:px-14">
      <motion.div className="mx-auto max-w-7xl rounded-[6px] border border-[#23252a] bg-[#0f1011] p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3 className="max-w-4xl text-balance text-3xl font-semibold tracking-[-0.22px] text-[#f7f8f8] md:text-5xl">{t('title')}</h3>
        <p className="linear-muted mt-3 max-w-3xl text-[15px]">{t('description')}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="#contacte">
            <Button className="linear-cta w-full rounded-[6px] px-5 py-3 text-[15px] font-semibold sm:w-auto">{t('primaryCta')}</Button>
          </Link>
          <Link href="#services">
            <Button variant="ghost" className="w-full rounded-[6px] border border-[#23252a] bg-[#161718] px-5 py-3 text-[#d0d6e0] hover:bg-[#23252a] sm:w-auto">{t('secondaryCta')}</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
