'use client';

import { useState } from 'react';
import { SOLUTIONS } from './data';
import { SolutionsNavigation } from './SolutionsNavigation';
import { SolutionsDisplay } from './SolutionsDisplay';
import { MobileSolutionsDock } from './MobileSolutionsDock';
import { useTranslations } from 'next-intl';

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;
  const t = useTranslations('SolutionsSection'); // Assegura't del namespace correcte

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-black/50 relative overflow-hidden transition-colors duration-500">
      
      {/* Fons Ambient */}
      <div className={`absolute inset-0 opacity-10 bg-linear-to-br ${activeSolution.color} blur-[150px] transition-all duration-700`} />

      <div className="container mx-auto px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Més enllà d'una <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">Simple Web</span>.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Creem ecosistemes digitals que connecten programari, maquinari i intel·ligència artificial.
          </p>
        </div>

        {/* --- ESTRUCTURA RESPONSIVE --- */}
        {/* FIX: Assegurem alçada mínima en LG */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-stretch lg:h-[650px]">
          
          {/* 1. NAVEGACIÓ D'ESCRIPTORI (s'amaga en mòbil i tablet) */}
          <SolutionsNavigation 
            solutions={SOLUTIONS} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* 2. VISUALITZACIÓ */}
          {/* FIX CRÍTIC: 
              - h-[550px] en mòbil
              - md:h-[650px] en tablet (iPad) <--- AQUI ESTAVA EL PROBLEMA (h-auto feia col·lapsar)
              - lg:h-auto en escriptori (s'adapta al grid pare)
          */}
          <div className="lg:col-span-8 flex flex-col h-[550px] md:h-[650px] lg:h-auto relative z-10">
             <SolutionsDisplay solution={activeSolution} />
             
             {/* 3. DOCK MÒBIL/TABLET (S'amaga en escriptori LG+) */}
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
      </div>
    </section>
  );
}