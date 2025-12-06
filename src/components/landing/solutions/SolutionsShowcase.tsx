'use client';

import { useState } from 'react';
import { SOLUTIONS } from './data';
import { SolutionsNavigation } from './SolutionsNavigation';
import { SolutionsDisplay } from './SolutionsDisplay';

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;

  return (
    <section className="py-24 bg-slate-50 dark:bg-black/50 relative overflow-hidden transition-colors duration-500">
      
      {/* Fons Ambient */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${activeSolution.color} blur-[150px] transition-all duration-700`} />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Més enllà d'una <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Simple Web</span>.
          </h2>
          <p className="text-xl text-muted-foreground">
            Creem ecosistemes digitals que connecten programari, maquinari i intel·ligència artificial.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch h-full min-h-[600px]">
          <SolutionsNavigation 
            solutions={SOLUTIONS} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <SolutionsDisplay 
            solution={activeSolution} 
          />
        </div>
      </div>
    </section>
  );
}