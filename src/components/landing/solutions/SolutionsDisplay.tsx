'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SolutionItem } from './data';
import { MockupIoT } from './mockups/MockupIoT';
import { MockupFinance } from './mockups/MockupFinance';
import { MockupBooking } from './mockups/MockupBooking';
import { MockupGrowth } from './mockups/MockupGrowth';

export function SolutionsDisplay({ solution }: { solution: SolutionItem }) {
  return (
    <div className="lg:col-span-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-4xl shadow-2xl overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full p-8 md:p-12 flex flex-col"
          >
            {/* Header Text */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                 <solution.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${solution.color}`} /> 
                 {solution.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {solution.description}
              </p>
            </div>

            {/* Mockup Area */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-50/50 dark:bg-black/20 rounded-2xl border border-dashed border-border/50 overflow-hidden min-h-[300px]">
               {solution.id === 'iot' && <MockupIoT />}
               {solution.id === 'finance' && <MockupFinance />}
               {solution.id === 'booking' && <MockupBooking />}
               {solution.id === 'growth' && <MockupGrowth />}
            </div>

            {/* Tags Footer */}
            <div className="mt-8 flex flex-wrap gap-2">
              {solution.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-background border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}