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
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-4xl shadow-2xl overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full p-6 md:p-10 lg:p-12 flex flex-col"
          >
            {/* Header Text */}
            <div className="mb-4 md:mb-6 shrink-0 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
                <solution.icon className={`w-6 h-6 md:w-8 md:h-8 text-transparent bg-clip-text bg-gradient-to-r ${solution.color}`} />
                {t(`${solution.id}.title`)}
              </h3>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed md:max-w-2xl line-clamp-3 md:line-clamp-none">
                {t(`${solution.id}.description`)}
              </p>
            </div>

            {/* Mockup Area */}
            {/* FIX: padding bottom extra en mòbil/tablet per deixar espai al Dock flotant */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-50/50 dark:bg-black/20 rounded-2xl border border-dashed border-border/50 overflow-hidden min-h-0 pb-16 lg:pb-0">
              {/* FIX: Escala lleugerament reduïda en Tablet (md) per evitar talls laterals */}
              <div className="w-full h-full relative scale-90 md:scale-[0.85] lg:scale-100 origin-center transition-transform duration-500">
                {solution.id === 'iot' && <MockupIoT />}
                {solution.id === 'finance' && <MockupFinance />}
                {solution.id === 'booking' && <MockupBooking />}
                {solution.id === 'growth' && <MockupGrowth />}
              </div>
            </div>

            {/* Tags Footer - Visible només en Desktop per no saturar tablet */}
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