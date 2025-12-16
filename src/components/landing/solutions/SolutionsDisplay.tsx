'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SolutionItem } from './data';
import { MockupIoT } from './mockups/MockupIoT';
import { MockupFinance } from './mockups/MockupFinance';
import { MockupBooking } from './mockups/MockupBooking';
import { MockupGrowth } from './mockups/MockupGrowth';
import { useTranslations } from 'next-intl';

export function SolutionsDisplay({ solution }: { solution: SolutionItem }) {
  const t = useTranslations('Solutions');
  
  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 🚀 OPTIMITZACIÓ: Fons sòlid a mòbil, Vidre a Desktop */}
      <div className="absolute inset-0 
                      bg-card border border-border/50 
                      md:bg-linear-to-br md:from-white/40 md:to-white/10 md:dark:from-slate-900/80 md:dark:to-slate-900/40 
                      md:backdrop-blur-xl md:border-white/20 
                      rounded-3xl md:rounded-4xl shadow-xl overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, x: 10 }} // Animació lateral simple és més lleugera que scale
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }} // Més ràpid (snappy)
            className="w-full h-full p-6 md:p-10 lg:p-12 flex flex-col will-change-transform"
          >
            {/* Header Text */}
            <div className="mb-4 md:mb-6 shrink-0 relative z-10">
              <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                <solution.icon className={`w-5 h-5 md:w-8 md:h-8 text-transparent bg-clip-text bg-linear-to-r ${solution.color}`} />
                {t(`${solution.id}.title`)}
              </h3>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed md:max-w-2xl line-clamp-3 md:line-clamp-none">
                {t(`${solution.id}.description`)}
              </p>
            </div>

            {/* Mockup Area */}
            {/* Donem espai abaix pel Dock mòbil (pb-20) */}
            <div className="flex-1 relative flex items-center justify-center 
                          bg-muted/30 dark:bg-black/20 
                          rounded-2xl border border-dashed border-border/50 
                          overflow-hidden min-h-0 pb-20 lg:pb-0">
              
              {/* 🚀 OPTIMITZACIÓ: Escala reduïda en mòbil per evitar layout thrashing */}
              <div className="w-full h-full relative scale-[0.85] md:scale-[0.85] lg:scale-100 origin-center transition-transform duration-500">
                {/* Lazy loading conceptual dels mockups (dependrà de com estiguin fets els components interns) */}
                {solution.id === 'iot' && <MockupIoT />}
                {solution.id === 'finance' && <MockupFinance />}
                {solution.id === 'booking' && <MockupBooking />}
                {solution.id === 'growth' && <MockupGrowth />}
              </div>
            </div>

            {/* Tags Footer - Només Desktop */}
            <div className="hidden lg:flex mt-4 md:mt-8 flex-wrap gap-2">
              {solution.tagKeys.map(tagKey => (
                <span key={tagKey} className="px-3 py-1 rounded-full bg-background/50 border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t(`tags.${tagKey}`)}
                </span>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}