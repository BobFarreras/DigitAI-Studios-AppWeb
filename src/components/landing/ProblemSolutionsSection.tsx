'use client';

import { motion } from 'framer-motion';
import { Calendar, BarChart3, Smartphone, X, Store, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProblemSolutionSection() {
  const t = useTranslations('ProblemSolution');

  return (
    <section className="py-24 container mx-auto px-4 relative overflow-hidden transition-colors duration-300">
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* 1. TEXT NARRATIU */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-6 uppercase tracking-wider">
             {t('badge')}
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
            {t('title_prefix')} <span className="gradient-text">{t('title_highlight')}</span>, <br />
            {t('title_suffix')}
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {t('description_problem')}
            <br /><br />
            {t.rich('description_solution', {
              strong: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
            })}
          </p>

          <ul className="space-y-4 mb-8">
            {[
              t('benefits.appointments'),
              t('benefits.ecommerce'),
              t('benefits.pwa')
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* 2. COMPARATIVA VISUAL (Adaptada Light/Dark) - Només canvis visuals, textos hardcoded a la UI visual es mantenen per simplicitat o es poden traduir igual */}
        <div className="relative h-[500px] flex items-center justify-center perspective-1000">
          
          {/* --- CARD 1: EL PROBLEMA ("Web Aparador") --- */}
          <motion.div 
            initial={{ opacity: 0, rotate: -6, x: -35 }}
            whileInView={{ opacity: 1, rotate: -6, x: -35 }}
            viewport={{ once: true }}
            className="absolute left-0 w-[280px] p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-[#0f111a]/80 backdrop-blur-sm z-0 grayscale opacity-70"
          >
             <div className="flex items-center gap-2 mb-4 text-slate-500">
                <Store className="w-5 h-5" />
                <span className="font-bold text-sm">{t('visual.problem_card.title')}</span>
             </div>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">{t('visual.problem_card.item1')}</span>
                   <X className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">{t('visual.problem_card.item2')}</span>
                   <X className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">{t('visual.problem_card.item3')}</span>
                   <X className="w-4 h-4 text-red-500" />
                </div>
             </div>
          </motion.div>

          {/* --- CARD 2: LA SOLUCIÓ (Ecosistema DigitAI) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative z-20 w-[340px] bg-[#1a1d2d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-2 w-full bg-linear-to-r from-[#06b6d4] via-[#3b82f6] to-[#a855f7]"></div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">{t('visual.solution_card.title')}</h3>
              <p className="text-xs text-slate-400 mb-6">{t('visual.solution_card.subtitle')}</p>

              <div className="space-y-4">

                <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t('visual.solution_card.widget1_title')}</div>
                    <div className="text-xs text-slate-400">{t('visual.solution_card.widget1_desc')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t('visual.solution_card.widget2_title')}</div>
                    <div className="text-xs text-slate-400">{t('visual.solution_card.widget2_desc')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t('visual.solution_card.widget3_title')}</div>
                    <div className="text-xs text-slate-400">{t('visual.solution_card.widget3_desc')}</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}