'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, TrendingUp, ArrowDownLeft, ArrowUpRight, CreditCard, Layers, DollarSign, Wallet, Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function MockupFinance() {
  const t = useTranslations('Solutions.finance');
  const graphPath = "M0 80 C 40 80, 50 110, 90 60 S 150 40, 200 20 S 260 50, 320 10";

  // Estat per l'animació del Mòbil
  const [step, setStep] = useState(0); 

  useEffect(() => {
    const cycle = async () => {
      setStep(0);
      setTimeout(() => setStep(1), 1000); // 1. Notificació
      setTimeout(() => setStep(2), 3500); // 2. Expanded (Detall)
      setTimeout(() => setStep(3), 6500); // 3. Total Balance
      setTimeout(() => setStep(0), 10000); // Reset
    };
    cycle();
    const interval = setInterval(cycle, 11000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[250px] flex flex-col items-center justify-center p-4 overflow-visible">
       
       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

       {/* =================================================================================
           📱 VERSIÓ MÒBIL: LIVE TRANSACTION (Compacte)
           (md:hidden)
       ================================================================================= */}
       <div className="md:hidden w-full max-w-[260px] flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
             
             {/* ESTAT 0: ICONA FLOTANT (Wallet) */}
             {step === 0 && (
                <motion.div
                   key="idle"
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.5, opacity: 0 }}
                   className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl"
                >
                   <Wallet className="w-8 h-8 text-emerald-400" />
                </motion.div>
             )}

             {/* ESTAT 1: NOTIFICACIÓ REBUDA */}
             {step === 1 && (
                <motion.div
                   key="notification"
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: 20, opacity: 0 }}
                   className="w-full bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3"
                >
                   <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                      <DollarSign className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pagament Rebut</div>
                      <div className="text-sm font-bold text-white">Stripe Inc.</div>
                   </div>
                   <div className="ml-auto text-emerald-400 font-mono font-bold">+$125</div>
                </motion.div>
             )}

             {/* ESTAT 2: DETALL EXPANDIT (Ticket) */}
             {step === 2 && (
                <motion.div
                   key="detail"
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 1.1, opacity: 0 }}
                   className="w-full bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 p-5 rounded-2xl shadow-2xl"
                >
                   <div className="text-center mb-4">
                      <div className="text-3xl font-black text-white mb-1">$1,250.00</div>
                      <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-full inline-block">
                         Completed
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                         <span className="text-slate-400">Client</span>
                         <span className="text-white font-medium">Acme Corp</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                         <span className="text-slate-400">Mètode</span>
                         <span className="text-white font-medium flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> •••• 4242
                         </span>
                      </div>
                      <div className="flex justify-between text-xs">
                         <span className="text-slate-400">Data</span>
                         <span className="text-white font-medium">15 Gen, 10:42</span>
                      </div>
                   </div>
                </motion.div>
             )}

             {/* ESTAT 3: BALANÇ TOTAL (Dashboard Mini) */}
             {step === 3 && (
                <motion.div
                   key="balance"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="w-full bg-black border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between"
                >
                   <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{t('total_balance')}</div>
                      <div className="text-xl font-bold text-white">$24,500</div>
                   </div>
                   <div className="h-10 w-24">
                      {/* Mini Sparkline */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                         <path d="M0 40 L20 30 L40 35 L60 10 L80 20 L100 5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                   </div>
                </motion.div>
             )}

          </AnimatePresence>
       </div>

       {/* --- ESCRIPTORI (Mantiguda Igual) --- */}
       <div className="hidden md:flex relative w-full h-full items-center justify-center perspective-1000">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute w-[85%] h-[75%] top-[15%] bg-white/50 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col justify-end z-0"
          >
             <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div>
                   <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t('total_balance')}</div>
                   <div className="text-3xl font-black text-foreground flex items-center gap-2">
                      $24,500
                      <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full flex items-center">
                         <TrendingUp className="w-3 h-3 mr-1" /> +12%
                      </span>
                   </div>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-border">
                   <Layers className="w-5 h-5 text-muted-foreground" />
                </div>
             </div>

             <div className="relative h-24 w-full mb-6 mt-16">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 100">
                   <defs>
                      <linearGradient id="gradientGraph" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                         <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                   </defs>
                   <motion.path 
                      d={`${graphPath} V 120 H 0 Z`} 
                      fill="url(#gradientGraph)" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                   />
                   <motion.path
                      d={graphPath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                   />
                </svg>
             </div>

             <div className="space-y-3">
                {[1, 2].map((i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {i === 1 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">{i === 1 ? 'Stripe Inc.' : 'AWS EMEA'}</span>
                         </div>
                      </div>
                      <span className={`text-xs font-bold ${i === 1 ? 'text-green-600' : 'text-foreground'}`}>
                         {i === 1 ? '+$1,250.00' : '-$64.00'}
                      </span>
                   </div>
                ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ y: 0, opacity: 0, rotateX: 10 }}
            animate={{ y: -40, opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            whileHover={{ scale: 1.05, rotateY: 5, y: -50 }}
            className="absolute z-20 w-80 h-48 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black rounded-2xl p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700/50 flex flex-col justify-between group overflow-hidden"
          >
             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
             
             <motion.div 
                animate={{ x: ['-200%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 1 }}
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
             />

             <div className="flex justify-between items-start relative z-10">
                <div className="text-white/90 font-bold text-lg tracking-wider flex items-center gap-2">
                   <CreditCard className="w-5 h-5" /> DigitAI
                </div>
                <Wifi className="w-6 h-6 text-white/50 rotate-90" />
             </div>

             <div className="relative z-10">
                <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md mb-3 relative overflow-hidden shadow-inner border border-yellow-600/50">
                   <div className="absolute top-1/2 w-full h-px bg-yellow-700/50"></div>
                   <div className="absolute left-1/2 h-full w-px bg-yellow-700/50"></div>
                </div>
                <div className="text-white/90 font-mono text-lg tracking-widest shadow-black drop-shadow-md whitespace-nowrap">
                   •••• •••• •••• 4242
                </div>
             </div>

             <div className="flex justify-between items-end relative z-10">
                <div className="flex flex-col">
                   <span className="text-[8px] text-white/50 uppercase tracking-wider">{t('card_holder')}</span>
                   <span className="text-xs text-white font-medium tracking-wide">J. DOE</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] text-white/50 uppercase tracking-wider">EXP</span>
                   <span className="text-xs text-white font-medium tracking-wide">09/29</span>
                </div>
             </div>
          </motion.div>
       </div>

    </div>
  )
}