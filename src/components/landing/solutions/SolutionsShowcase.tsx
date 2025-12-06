'use client';

import { useState } from 'react';
import { SOLUTIONS } from './data';
import { SolutionsNavigation } from './SolutionsNavigation';
import { SolutionsDisplay } from './SolutionsDisplay';
// 👇 Importem el nou Dock
import { MobileSolutionsDock } from './MobileSolutionsDock';

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-black/50 relative overflow-hidden transition-colors duration-500">
      
      {/* Fons Ambient */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${activeSolution.color} blur-[150px] transition-all duration-700`} />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Més enllà d'una <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Simple Web</span>.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Creem ecosistemes digitals que connecten programari, maquinari i intel·ligència artificial.
          </p>
        </div>

        {/* --- ESTRUCTURA RESPONSIVE --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-stretch lg:h-[600px]">
          
          {/* 1. NAVEGACIÓ D'ESCRIPTORI (s'amaga en mòbil) */}
          <SolutionsNavigation 
            solutions={SOLUTIONS} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* 2. VISUALITZACIÓ (Ocupa tot en mòbil, 8 columnes en PC) */}
          <div className="lg:col-span-8 flex flex-col h-[550px] md:h-auto">
             <SolutionsDisplay solution={activeSolution} />
             
             {/* 3. DOCK MÒBIL (S'amaga en escriptori) */}
             <MobileSolutionsDock 
                solutions={SOLUTIONS} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
             />
          </div>

        </div>
      </div>
    </section>
  );
}