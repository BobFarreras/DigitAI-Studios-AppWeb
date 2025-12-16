'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SOLUTIONS } from './data';
import { SolutionsNavigation } from './SolutionsNavigation';
import { SolutionsDisplay } from './SolutionsDisplay';
import { MobileSolutionsDock } from './MobileSolutionsDock';
import { Reveal } from '@/components/animations/Reveal';

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;
  const t = useTranslations('SolutionsSection');

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden transition-colors duration-500">
      
      {/* 🚀 OPTIMITZACIÓ: Blob només visible a partir de Tablet (md). A mòbil és massa pesat. */}
      <div 
        className={`hidden md:block absolute inset-0 opacity-10 bg-linear-to-br ${activeSolution.color} blur-[150px] transition-all duration-700 will-change-[background-color]`} 
      />
      
      {/* Pattern lleuger per a mòbil en lloc del blob */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-16 text-center">
          <Reveal direction="up" width="100%">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t('title_prefix')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">{t('title_highlight')}</span>.
            </h2>
          </Reveal>
          
          <Reveal direction="up" delay={0.1} width="100%">
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('description')}
            </p>
          </Reveal>
        </div>

        {/* --- ESTRUCTURA RESPONSIVE --- */}
        <Reveal delay={0.2} width="100%" direction="up">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch lg:h-162.5">
            
            {/* 1. NAVEGACIÓ D'ESCRIPTORI */}
            <SolutionsNavigation 
              solutions={SOLUTIONS} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            
            {/* 2. VISUALITZACIÓ */}
            <div className="lg:col-span-8 flex flex-col h-[500px] md:h-162.5 lg:h-auto relative z-10">
               <SolutionsDisplay solution={activeSolution} />
               
               {/* 3. DOCK MÒBIL - Dins el mateix bloc per context */}
               <div className="absolute -bottom-4 left-0 right-0 z-50 flex justify-center lg:hidden pointer-events-none">
                  <div className="pointer-events-auto">
                    <MobileSolutionsDock 
                        solutions={SOLUTIONS} 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                  </div>
               </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}