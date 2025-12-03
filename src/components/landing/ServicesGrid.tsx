'use client';

import { motion } from 'framer-motion';
import { Smartphone, Globe, BrainCircuit, Users, ArrowUpRight, Code } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ServicesGrid() {
  const t = useTranslations('Services'); // Namespace 'Services'

  return (
    <section id="serveis" className="py-20 bg-background relative overflow-hidden transition-colors duration-300">
      
      <div className="container mx-auto px-4">
        
        {/* CAPÇALERA */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-4">
              {t('badge')}
           </div>
           <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
             {t('title_prefix')} <span className="gradient-text">{t('title_highlight')}</span>
           </h2>
           <p className="text-lg text-muted-foreground">
             {t('subtitle')}
           </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(240px,auto)]">
           
           {/* CARD 1: APPWEBS */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 flex flex-col md:flex-row"
           >
              <div className="p-6 flex-1 z-10">
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-500/20">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-2">{t('cards.appwebs.title')}</h3>
                 <p className="text-sx text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('cards.appwebs.description')}
                 </p>
              </div>

              {/* UI REALISTA WEB (Sense canvis, només visual) */}
              <div className="relative w-full md:w-1/2 h-48 md:h-auto mt-4 md:mt-0 md:mr-6 self-end overflow-hidden">
                 <div className="w-full h-full bg-slate-50 dark:bg-[#0f111a] rounded-t-lg md:rounded-t-xl border-t border-l border-r border-slate-200 dark:border-white/10 shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex text-[30px]">
                    <div className="w-16 border-r border-slate-200 dark:border-white/5 p-3 flex flex-col gap-3 items-center bg-white dark:bg-black/20">
                       <div className="w-6 h-6 rounded bg-primary/20 mb-2"></div>
                       <div className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-white/10"></div>
                       <div className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-white/10"></div>
                       <div className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-white/10"></div>
                    </div>
                    <div className="flex-1 p-3">
                       <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-foreground">Dashboard</span>
                          <div className="w-16 h-4 rounded bg-slate-200 dark:bg-white/10"></div>
                       </div>
                       <div className="h-16 w-full bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 mb-2 relative overflow-hidden">
                          <svg viewBox="0 0 100 40" className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
                             <path d="M0 30 Q 20 10, 40 25 T 100 10" fill="none" stroke="#a855f7" strokeWidth="2" />
                             <path d="M0 30 Q 20 10, 40 25 T 100 10 V 40 H 0 Z" fill="url(#gradientGraph)" opacity="0.3" />
                             <defs>
                                <linearGradient id="gradientGraph" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="#a855f7" />
                                   <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                             </defs>
                          </svg>
                       </div>
                       <div className="space-y-1">
                          <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded"></div>
                          <div className="h-2 w-3/4 bg-slate-200 dark:bg-white/10 rounded"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* CARD 2: APPS */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-cyan-500/30 transition-all duration-500"
           >
              <div className="p-6 h-full flex flex-col">
                 <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-200 dark:border-cyan-500/20">
                    <Smartphone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                 </div>
                 <h3 className="text-lg font-bold text-foreground mb-1">{t('cards.apps.title')}</h3>
                 <p className="text-sx text-slate-600 dark:text-slate-400 mb-6">
                    {t('cards.apps.description')}
                 </p>
                 
                 {/* UI Mòbil */}
                 <div className="grow relative flex justify-center">
                    <div className="w-32 bg-white dark:bg-black border-x-4 border-t-4 border-slate-300 dark:border-slate-800 rounded-t-2xl relative top-2 group-hover:top-0 transition-all duration-500 overflow-hidden shadow-lg">
                       <div className="h-8 bg-cyan-500/10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-2">
                          <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/20"></div>
                          <div className="w-8 h-1 rounded-full bg-slate-200 dark:bg-white/20"></div>
                       </div>
                       <div className="p-2 space-y-2">
                          <div className="flex gap-2 items-center">
                             <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 shrink-0"></div>
                             <div className="h-2 w-16 bg-slate-100 dark:bg-white/10 rounded"></div>
                          </div>
                          <div className="flex gap-2 items-center flex-row-reverse">
                             <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 shrink-0"></div>
                             <div className="h-6 w-14 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20"></div>
                          </div>
                          <div className="flex gap-2 items-center">
                             <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 shrink-0"></div>
                             <div className="h-8 w-full bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* CARD 3: AUTOMATITZACIÓ */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-purple-500/30 transition-all duration-500"
           >
              <div className="p-6 h-full flex flex-col">
                 <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-500/20">
                    <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <h3 className="text-lg font-bold text-foreground mb-1">{t('cards.automation.title')}</h3>
                 <p className="text-sx text-slate-600 dark:text-slate-400 mb-6">
                    {t('cards.automation.description')}
                 </p>

                 {/* UI Nodes */}
                 <div className="grow relative bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 p-2 group-hover:bg-slate-100 dark:group-hover:bg-white/[0.07] transition-colors">
                    <div className="relative w-full h-full flex items-center justify-center">
                       <div className="absolute top-2 left-2 w-8 h-8 rounded bg-white dark:bg-black border border-purple-200 dark:border-purple-500/30 shadow-sm flex items-center justify-center z-10">
                          <Users className="w-4 h-4 text-purple-500" />
                       </div>
                       <div className="absolute bottom-2 right-2 w-8 h-8 rounded bg-white dark:bg-black border border-green-200 dark:border-green-500/30 shadow-sm flex items-center justify-center z-10">
                          <Code className="w-4 h-4 text-green-500" />
                       </div>
                       <svg className="absolute inset-0 w-full h-full">
                          <path d="M30 25 C 60 25, 60 75, 90 75" stroke="currentColor" className="text-slate-300 dark:text-white/20" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                       </svg>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* CARD 4: FORMACIÓ */}
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-green-500/30 transition-all duration-500 flex flex-col md:flex-row"
           >
              <div className="p-6 flex-1 z-10">
                 <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center mb-4 border border-green-200 dark:border-green-500/20">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-2">{t('cards.training.title')}</h3>
                 <p className="text-sx text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {t('cards.training.description')}
                 </p>
                 <button className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 hover:gap-2 transition-all">
                    {t('cards.training.cta')} <ArrowUpRight className="w-3 h-3" />
                 </button>
              </div>

              {/* UI Terminal (Sense canvis, només visual) */}
              <div className="relative w-full md:w-1/2 h-40 md:h-auto p-6 self-center">
                 <div className="w-full h-full bg-slate-100 dark:bg-[#1e1e1e] rounded-lg border border-slate-200 dark:border-slate-800 p-4 font-mono text-[15px] shadow-xl text-slate-600 dark:text-slate-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1.5 mb-3 opacity-50">
                       <div className="w-2 h-2 rounded-full bg-red-500"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                       <p><span className="text-purple-600 dark:text-purple-400">import</span> {'{ AI }'} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-green-600 dark:text-green-400">'digitai'</span>;</p>
                       <p className="mt-2"><span className="text-blue-600 dark:text-blue-400">const</span> equip = <span className="text-yellow-600 dark:text-yellow-400">await</span> AI.train();</p>
                       <p className="mt-2"><span className="text-slate-400 dark:text-slate-500">Resultat: +Productivitat</span></p>
                       <motion.div 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="h-3 w-1.5 bg-green-500 mt-1 inline-block"
                       />
                    </div>
                 </div>
              </div>
           </motion.div>

        </div>
      </div>
    </section>
  );
}