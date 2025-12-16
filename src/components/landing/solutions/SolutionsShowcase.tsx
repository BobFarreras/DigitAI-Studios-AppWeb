'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SOLUTIONS } from './data';
import { SolutionsNavigation } from './SolutionsNavigation';
import { SolutionsDisplay } from './SolutionsDisplay';
import { MobileSolutionsDock } from './MobileSolutionsDock';
import { Reveal } from '@/components/animations/Reveal'; // ✅ IMPORTEM EL NOSTRE COMPONENT OPTIMITZAT

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;
  const t = useTranslations('SolutionsSection');

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-black/50 relative overflow-hidden transition-colors duration-500">
      
      {/* Fons Ambient (No el toquem, és pur CSS) */}
      <div 
        className={`absolute inset-0 opacity-10 bg-linear-to-br ${activeSolution.color} blur-[150px] transition-all duration-700 will-change-[background-color]`} 
      />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        
        {/* HEADER: Animació suau cap amunt */}
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
        {/* Animem tot el bloc principal amb un petit retard perquè la UI no es bloquegi al renderitzar-ho tot de cop */}
        <Reveal delay={0.2} width="100%" direction="up">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-stretch lg:h-162.5">
            
            {/* 1. NAVEGACIÓ D'ESCRIPTORI */}
            <SolutionsNavigation 
              solutions={SOLUTIONS} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            
            {/* 2. VISUALITZACIÓ */}
            <div className="lg:col-span-8 flex flex-col h-137.5 md:h-162.5 lg:h-auto relative z-10">
               <SolutionsDisplay solution={activeSolution} />
               
               {/* 3. DOCK MÒBIL/TABLET */}
               {/* El posem dins del Reveal perquè aparegui conjuntament */}
               <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center lg:hidden pointer-events-none">
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