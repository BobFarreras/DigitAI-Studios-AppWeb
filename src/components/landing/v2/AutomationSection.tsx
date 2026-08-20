/**
 * @file src/components/landing/v2/AutomationSection.tsx
 * @updated 2026-08-19
 * @summary Seccio d'automatitzacions: capcalera fixa a l'esquerra i llista expansible a la dreta.
 * @scope Composicio visual de seccio; sense logica de negoci.
 */
'use client';

import { useTranslations } from 'next-intl';
import { SectionIntro } from './SectionIntro';
import { FlowRow } from './FlowRow';
import { CursorSpotlight } from './fx/CursorSpotlight';

const flows = ['leads', 'quotes', 'social', 'support'] as const;

export function AutomationSection() {
  const t = useTranslations('LandingV2.automation');

  return (
    <section
      id="automatitzacions"
      className="relative z-10 overflow-x-clip bg-[#000000] px-4 py-[clamp(96px,12vh,140px)] sm:px-6 lg:px-8"
    >
      <CursorSpotlight size={620} color="rgba(128,82,255,0.09)" />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionIntro
            index="01"
            eyebrow={t('eyebrow')}
            title={t('titleStrong')}
            description={t('description')}
          />
        </div>

        <div>
          {flows.map((flow, index) => (
            <FlowRow
              key={flow}
              index={index}
              title={t(`flows.${flow}.name`)}
              summary={t(`flows.${flow}.summary`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
