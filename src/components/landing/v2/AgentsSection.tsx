/**
 * @file src/components/landing/v2/AgentsSection.tsx
 * @updated 2026-08-19
 * @summary Seccio d'agents IA: orbites reactives al cursor i capacitats amb revelat esglaonat.
 * @scope Composicio visual de seccio; sense logica de negoci.
 */
'use client';

import { motion } from 'framer-motion';
import { MessagesSquare, Bot, Workflow } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionIntro } from './SectionIntro';
import { AgentsOrbit } from './AgentsOrbit';

const capabilities = [
  { key: 'chatbot', Icon: MessagesSquare },
  { key: 'agents', Icon: Bot },
  { key: 'integration', Icon: Workflow },
] as const;

export function AgentsSection() {
  const t = useTranslations('LandingV2.agents');

  return (
    <section
      id="agents-ia"
      className="relative z-10 overflow-hidden bg-[#000000] px-4 py-[clamp(96px,12vh,140px)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          data-cursor-label={t('eyebrow')}
          className="order-2 lg:order-1"
        >
          <AgentsOrbit />
        </motion.div>

        <div className="order-1 lg:order-2">
          <SectionIntro
            index="03"
            eyebrow={t('eyebrow')}
            title={t('titleStrong')}
            description={t('description')}
          />

          <div className="mt-12 space-y-px">
            {capabilities.map(({ key, Icon }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-start gap-5 border-t border-white/[0.08] py-6 last:border-b"
              >
                <span className="mt-1 text-[#8052ff] transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <div>
                  <h3 className="text-[18px] font-normal tracking-[-0.01em] text-white">
                    {t(`capabilities.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] font-extralight leading-relaxed text-[#9a9a9a]">
                    {t(`capabilities.${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
