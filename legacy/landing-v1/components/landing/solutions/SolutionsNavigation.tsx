'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SolutionItem } from './data';
import { useTranslations } from 'next-intl';

interface Props {
  solutions: SolutionItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function SolutionsNavigation({ solutions, activeTab, setActiveTab }: Props) {
  const t = useTranslations('Solutions');

  return (
    <div className="hidden lg:flex col-span-4 flex-col gap-4">
      {solutions.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative group flex items-center gap-4 p-6 rounded-2xl text-left transition-all duration-300 border border-transparent outline-none focus:ring-2 focus:ring-primary/20",
              isActive 
                ? "bg-white dark:bg-slate-900 shadow-xl border-primary/20 scale-[1.02]" 
                : "hover:bg-white/50 dark:hover:bg-white/5 hover:border-border"
            )}
          >
            {/* 1. FONS ANIMAT (Posició absoluta, es queda al fons) */}
            {isActive && (
              <motion.div
                layoutId="activeGlow"
                className={`absolute inset-0 rounded-2xl bg-linear-to-r ${item.color} opacity-5 dark:opacity-10`}
              />
            )}

            {/* 2. CONTINGUT (Afegim 'relative z-10' per posar-ho a sobre del fons) */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0 relative z-10",
              isActive 
                ? `bg-linear-to-br ${item.color} text-white shadow-lg` 
                : "bg-muted text-muted-foreground group-hover:text-foreground"
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className={cn("font-bold text-lg", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                {t(`${item.id}.title`)}
              </h3>
              {isActive && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-muted-foreground mt-1"
                >
                  {item.tagKeys.map(key => t(`tags.${key}`)).join(' • ')}
                </motion.p>
              )}
            </div>
            
            {isActive && (
                <ArrowRight className="w-5 h-5 text-primary animate-pulse shrink-0 relative z-10" />
            )}
          </button>
        );
      })}
    </div>
  );
}