'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SolutionItem } from './data';

interface Props {
  solutions: SolutionItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function MobileSolutionsDock({ solutions, activeTab, setActiveTab }: Props) {
  return (
    <div className="lg:hidden w-full flex justify-center mt-0">
      {/* 🚀 Fons sòlid en mòbil per evitar càrrega de GPU, amb ombra forta */}
      <div className="flex items-center gap-1.5 p-1.5 
                      bg-slate-900 border border-white/10 
                      rounded-full shadow-xl shadow-black/20 relative z-20">
        {solutions.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300"
              aria-label={item.id}
            >
              {/* Fons actiu (Píndola brillant) */}
              {isActive && (
                <motion.div
                  layoutId="activeDock"
                  className={`absolute inset-0 rounded-full bg-linear-to-br ${item.color} opacity-20`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} // Animació més curta
                />
              )}

              {/* Icona */}
              <div className={cn(
                "relative z-10 transition-all duration-300",
                isActive 
                  ? "text-white scale-110" // Treta l'ombra brillant drop-shadow
                  : "text-slate-400"
              )}>
                <item.icon className="w-5 h-5" />
              </div>

              {/* Punt indicador */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className={`absolute bottom-2 w-1 h-1 rounded-full bg-white`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}