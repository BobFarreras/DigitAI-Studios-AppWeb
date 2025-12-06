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
    <div className="lg:hidden w-full flex justify-center mt-6">
      <div className="flex items-center gap-2 p-2 bg-slate-900/80 dark:bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl relative z-20">
        {solutions.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
            >
              {/* Fons actiu (Píndola brillant) */}
              {isActive && (
                <motion.div
                  layoutId="activeDock"
                  className={`absolute inset-0 rounded-full bg-linear-to-br ${item.color} opacity-20`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icona */}
              <div className={cn(
                "relative z-10 transition-all duration-300",
                isActive 
                  ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  : "text-slate-400 hover:text-slate-200"
              )}>
                <item.icon className="w-6 h-6" />
              </div>

              {/* Punt indicador sota la icona */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className={`absolute bottom-2 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}