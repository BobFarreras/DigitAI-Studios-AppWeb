/**
 * @file src/components/landing/v2/TrainingSection.tsx
 * @updated 2026-08-19
 * @summary Seccio de formacio: capcalera i targetes que s'omplen de violeta amb el cursor.
 * @scope Composicio visual de seccio; sense logica de negoci.
 */
'use client';

import { motion } from 'framer-motion';
import { Users, Target, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionIntro } from './SectionIntro';

const formats = [
  { key: 'teams', Icon: Users },
  { key: 'private', Icon: Target },
  { key: 'academy', Icon: GraduationCap },
] as const;

export function TrainingSection() {
  const t = useTranslations('LandingV2.training');

  return (
    <section
      id="formacio"
      className="relative z-10 overflow-hidden bg-[#000000] px-4 py-[clamp(96px,12vh,140px)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          index="04"
          eyebrow={t('eyebrow')}
          title={t('titleStrong')}
          description={t('description')}
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {formats.map(({ key, Icon }, index) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.85, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] p-7 transition-colors duration-500 hover:border-[#8052ff]/40"
            >
              <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-[#8052ff]/[0.18] to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <div className="relative">
                <span className="text-[11px] tabular-nums tracking-[0.2em] text-[#3f3f3f]">0{index + 1}</span>
                <Icon className="mt-6 h-6 w-6 text-[#8052ff] transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.3} />
                <h3 className="mt-6 text-[clamp(20px,2.2vw,26px)] font-normal tracking-[-0.02em] text-white">
                  {t(`formats.${key}.title`)}
                </h3>
                <p className="mt-3 text-[15px] font-extralight leading-relaxed text-[#9a9a9a]">
                  {t(`formats.${key}.desc`)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
