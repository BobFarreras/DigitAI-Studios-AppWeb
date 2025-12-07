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
      
      <div className="container mx-auto px-4">
        
        {/* CAPÇALERA */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
              {t('badge')}
           </div>
           <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-foreground leading-tight tracking-tight">
             {t('title_prefix')} <span className="gradient-text">{t('title_highlight')}</span>
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
             wrapperClass="md:col-span-2 flex-row md:flex-row" // Flex row per posar text i imatge costat a costat
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