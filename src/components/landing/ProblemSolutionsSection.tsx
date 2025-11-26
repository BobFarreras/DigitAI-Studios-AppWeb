'use client';

import { motion } from 'framer-motion';
import { Calendar, BarChart3, Smartphone, X, Store, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ProblemSolutionSection() {
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
             Més que una pàgina web
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
            La teva web ha de <span className="gradient-text">Facturar</span>, <br />
            no només "ser-hi".
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            La majoria de negocis tenen una "Targeta de Visita" digital: bonica, però inútil.
            No permet reservar, no ven i no fidelitza.
            <br /><br />
            Nosaltres transformem la teva web en una **AppWeb (PWA)**: una eina potent on els teus clients poden comprar, reservar hora i interactuar amb tu des del seu mòbil, sense descarregar res.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              "Cites prèvies i reserves automàtiques.",
              "Botiga online i pagaments integrats.",
              "Instal·lable al mòbil (PWA) com una App nativa."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* 2. COMPARATIVA VISUAL (Adaptada Light/Dark) */}
        <div className="relative h-[500px] flex items-center justify-center perspective-1000">
          
          {/* --- CARD 1: EL PROBLEMA ("Web Aparador") --- */}
          <motion.div 
            initial={{ opacity: 0, rotate: -5, x: -20 }}
            whileInView={{ opacity: 1, rotate: -5, x: -20 }}
            viewport={{ once: true }}
            // LIGHT: bg-slate-100 (Gris clar) | DARK: bg-[#0f111a] (Negre)
            className="absolute left-0 w-[300px] p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/80 dark:bg-[#0f111a]/80 backdrop-blur-sm z-0 grayscale opacity-70"
          >
             <div className="flex items-center gap-2 mb-4 text-slate-500">
                <Store className="w-5 h-5" />
                <span className="font-bold text-sm">Web "Aparador"</span>
             </div>
             <div className="space-y-3">
                {/* ITEM: Fons blanc en Light, fons transparent en Dark */}
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">Reserves Online</span>
                   <X className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">Panell de Vendes</span>
                   <X className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                   <span className="text-xs text-slate-500">App Mòbil</span>
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
            {/* Capçalera Gradient */}
            <div className="h-2 w-full bg-linear-to-r from-[#06b6d4] via-[#3b82f6] to-[#a855f7]"></div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">Ecosistema DigitAI</h3>
              <p className="text-xs text-slate-400 mb-6">Tot connectat, tot automàtic.</p>

              <div className="space-y-4">

                {/* Widget 1: Reserves / Calendari */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Agenda Plena</div>
                    <div className="text-xs text-slate-400">Reserves 24/7 automàtiques</div>
                  </div>
                </div>

                {/* Widget 2: Mètriques */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">+150% Conversió</div>
                    <div className="text-xs text-slate-400">Analítica en temps real</div>
                  </div>
                </div>

                {/* Widget 3: PWA / Mòbil */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">App Instal·lable</div>
                    <div className="text-xs text-slate-400">Accés directe al mòbil (PWA)</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Glow de fons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}