'use client';

import { useTranslations } from 'next-intl';
import { Globe, Smartphone, BrainCircuit, Users } from 'lucide-react';
import { ServiceCard } from './services/ServiceCard'; // Importa els nous components
import { WebMockup } from './services/mockups/WebMockup';
import { AppMockup } from './services/mockups/AppMockup';
import { AutomationFlow } from './services/mockups/AutomationFlow';
import { TerminalMockup } from './services/mockups/TerminalMockup';

export function ServicesGrid() {
  const t = useTranslations('Services');

  return (
    <section id="serveis" className="bg-background relative overflow-hidden py-24 transition-colors duration-300">

      {/* ✅ CORRECCIÓ APLICADA AQUÍ: Padding responsiu */}
      <div className="container mx-auto px-6 md:px-10 lg:px-14">

        {/* CAPÇALERA */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
     
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-foreground leading-tight tracking-tight">
            {t('title_prefix')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500 pb-2">
              {t('title_highlight')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. APPWEBS (Ample) */}
          <ServiceCard
            title={t('cards.appwebs.title')}
            description={t('cards.appwebs.description')}
            icon={Globe}
            iconColorClass="text-blue-500"
            wrapperClass="md:col-span-2 flex-row md:flex-row"
          >
            <WebMockup />
          </ServiceCard>

          {/* 2. APPS (Vertical) */}
          <ServiceCard
            title={t('cards.apps.title')}
            description={t('cards.apps.description')}
            icon={Smartphone}
            iconColorClass="text-cyan-500"
            delay={0.1}
          >
            <AppMockup />
          </ServiceCard>

          {/* 3. AUTOMATITZACIÓ (Vertical) */}
          <ServiceCard
            title={t('cards.automation.title')}
            description={t('cards.automation.description')}
            icon={BrainCircuit}
            iconColorClass="text-purple-500"
            delay={0.2}
          >
            <AutomationFlow />
          </ServiceCard>

          {/* 4. FORMACIÓ (Ample + CTA) */}
          <ServiceCard
            title={t('cards.training.title')}
            description={t('cards.training.description')}
            icon={Users}
            iconColorClass="text-green-500"
            wrapperClass="md:col-span-2 flex-col md:flex-row"
            cta={t('cards.training.cta')}
            delay={0.3}
          >
            <TerminalMockup />
          </ServiceCard>

        </div>
      </div>
    </section>
  );
}