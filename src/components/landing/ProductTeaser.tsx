'use client';

import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function ProductTeaser() {
  return (
    <section className="py-24 container mx-auto px-4">
      
      {/* CONTENIDOR PRINCIPAL: Adaptable Light/Dark */}
      <div className="rounded-3xl bg-linear-to-br from-slate-50 via-white to-blue-50 dark:from-primary/10 dark:via-background dark:to-background border border-slate-200 dark:border-primary/20 p-8 md:p-12 overflow-hidden relative transition-colors duration-300 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        
        {/* Efecte de fons (Glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-primary/20 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
           
           {/* TEXT CONTENT */}
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-primary/10 border border-blue-200 dark:border-primary/20 text-blue-700 dark:text-primary text-xs font-bold mb-6">
                 🚀 INNOVATION LAB
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                 No només venem software. <br/>
                 <span className="gradient-text">Creem Productes.</span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                 Descobreix <strong>SalutFlow</strong> i <strong>RibotFlow</strong>, les nostres plataformes SaaS pròpies que estan revolucionant la gestió clínica i empresarial.
                 <br/><br/>
                 Utilitzem la mateixa tecnologia punta, seguretat i escalabilitat per als teus projectes que la que fem servir per als nostres negocis.
              </p>
              
              <Link href="/projectes" className="inline-flex items-center font-bold text-foreground hover:text-primary transition-colors group">
                 Explorar Productes 
                 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           
           {/* MOCKUP VISUAL: DUES FINESTRES FLOTANTS */}
           <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000">
              
              {/* CARD 1: RIBOTFLOW (Al fons, esquerra) */}
              <motion.div 
                initial={{ opacity: 0, x: -20, rotate: -5 }}
                whileInView={{ opacity: 1, x: 0, rotate: -6 }}
                viewport={{ once: true }}
                className="absolute left-4 top-10 w-3/4 h-64 bg-white dark:bg-[#0f111a] rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-10 overflow-hidden"
              >
                 {/* Header RibotFlow */}
                 <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-white/5">
                    <div className="relative h-6 w-24"> 
                        {/* LOGO RIBOTFLOW: Assegura't que el fitxer existeix a public/images/ribotflow.png */}
                        <Image src="/images/ribotflow.png" alt="RibotFlow Logo" fill className="object-contain object-left" /> 
                    </div>
                    <div className="flex gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                       <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                    </div>
                 </div>
                 {/* Body RibotFlow (Skeleton) */}
                 <div className="p-4 space-y-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex gap-4">
                       <div className="w-1/3 h-20 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"></div>
                       <div className="w-2/3 h-20 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"></div>
                    </div>
                    <div className="h-16 w-full rounded-lg bg-slate-50 dark:bg-white/5"></div>
                 </div>
              </motion.div>

              {/* CARD 2: SALUTFLOW (Al davant, dreta) */}
              <motion.div 
                initial={{ opacity: 0, x: 20, rotate: 5, y: 20 }}
                whileInView={{ opacity: 1, x: 20, rotate: 3, y: 40 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute right-4 top-24 w-3/4 h-64 bg-white dark:bg-[#0f111a] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl z-20 overflow-hidden backdrop-blur-sm"
              >
                 {/* Header SalutFlow */}
                 <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-white/5">
                    <div className="relative h-8 w-28"> 
                        {/* LOGO SALUTFLOW */}
                        <Image src="/images/salutflow.png" alt="SalutFlow Logo" fill className="object-contain object-left" /> 
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                 </div>
                 {/* Body SalutFlow (Skeleton: Llistat pacients/agenda) */}
                 <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                       <div className="h-4 w-1/3 bg-blue-100 dark:bg-primary/20 rounded"></div>
                       <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10"></div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-10 w-full rounded border-l-4 border-blue-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                          <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/20 rounded"></div>
                       </div>
                       <div className="h-10 w-full rounded border-l-4 border-green-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                          <div className="h-2 w-2/3 bg-slate-200 dark:bg-white/20 rounded"></div>
                       </div>
                       <div className="h-10 w-full rounded border-l-4 border-purple-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                          <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/20 rounded"></div>
                       </div>
                    </div>
                 </div>
              </motion.div>

           </div>
        </div>
      </div>
    </section>
  );
}