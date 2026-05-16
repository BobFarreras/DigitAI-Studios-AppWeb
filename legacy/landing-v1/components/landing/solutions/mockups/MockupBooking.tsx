'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, MessageSquare, Clock, ChevronRight, CheckCircle2, User, Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function MockupBooking() {
  const t = useTranslations('Solutions.booking');
  const [step, setStep] = useState(0);

  // Array de dies de la setmana traduïts o abreujats
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; 

  useEffect(() => {
    const cycle = async () => {
      setStep(0);
      setTimeout(() => setStep(1), 1000); // Pas 1: Sol·licitud
      setTimeout(() => setStep(2), 3000); // Pas 2: Processant
      setTimeout(() => setStep(3), 5000); // Pas 3: Èxit
      setTimeout(() => setStep(0), 8000); // Reset
    };
    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-75 flex flex-col items-center justify-center p-6 overflow-visible">
       
       {/* Fons Ambient */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />

       {/* =================================================================================
           📱 VERSIÓ MÒBIL: WIDGET D'ESTAT
           md:hidden
       ================================================================================= */}
       <div className="md:hidden w-full max-w-70 h-55 flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
             
             {/* ESTAT 0: IDLE */}
             {step === 0 && (
                <motion.div
                   key="idle"
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.8, opacity: 0 }}
                   className="flex flex-col items-center gap-3 text-center"
                >
                   <div className="w-16 h-16 bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg relative">
                      <CalendarCheck className="w-8 h-8 text-slate-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                   </div>
                   <p className="text-sm text-slate-400 font-medium">{t('status_idle')}</p>
                </motion.div>
             )}

             {/* ESTAT 1: SOL·LICITUD */}
             {step === 1 && (
                <motion.div
                   key="request"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: -20, opacity: 0 }}
                   className="w-full bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-xl"
                >
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                         <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                         <div className="text-xs text-slate-400 uppercase font-bold">{t('new_message_label')}</div>
                         <div className="text-sm font-bold text-white">{t('mock_user_name')}</div>
                      </div>
                   </div>
                   <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-200 italic">
                      "{t('chat_user_1')}"
                   </div>
                </motion.div>
             )}

             {/* ESTAT 2: IA */}
             {step === 2 && (
                <motion.div
                   key="ai"
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 1.1, opacity: 0 }}
                   className="w-full bg-linear-to-br from-purple-900 to-slate-900 border border-purple-500/30 p-5 rounded-2xl shadow-xl flex flex-col items-center text-center"
                >
                   <div className="relative mb-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center z-10 relative">
                         <Bot className="w-6 h-6 text-white" />
                      </div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute -inset-1 border-2 border-dashed border-purple-400/50 rounded-xl z-0"
                      />
                   </div>
                   <h4 className="text-white font-bold text-sm">{t('agent_name')}</h4>
                   <p className="text-xs text-purple-300 mt-1">{t('status_processing')}</p>
                </motion.div>
             )}

             {/* ESTAT 3: ÈXIT */}
             {step === 3 && (
                <motion.div
                   key="done"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="w-full bg-white dark:bg-slate-900 border border-green-500/50 p-0 rounded-2xl shadow-2xl overflow-hidden"
                >
                   <div className="bg-green-500 p-3 flex justify-between items-center">
                      <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4" /> {t('status_confirmed')}
                      </span>
                      <span className="text-[10px] text-green-100 bg-green-600 px-2 py-0.5 rounded-full">{t('tag_auto')}</span>
                   </div>
                   <div className="p-5 flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg w-14 h-14 border border-slate-200 dark:border-slate-700">
                         <span className="text-[10px] text-slate-400 uppercase font-bold">{t('month_short')}</span>
                         <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">15</span>
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-800 dark:text-white">{t('mock_user_name')}</div>
                         <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> 10:00 AM
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}

          </AnimatePresence>
       </div>

       {/* =================================================================================
           💻 VERSIÓ ESCRIPTORI: CALENDARI + XAT BUBBLE
           hidden md:flex
       ================================================================================= */}
       <div className="hidden md:flex relative w-full h-full items-center justify-center perspective-1000">
          
          {/* 1. Calendari Central */}
          <motion.div 
            initial={{ rotateX: 10, scale: 0.95 }}
            whileInView={{ rotateX: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute w-125 h-80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col z-0 overflow-hidden"
          >
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-500/10 rounded-lg">
                      <CalendarCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                   </div>
                   <div className="font-bold text-lg text-foreground">{t('month_year')}</div>
                </div>
                <div className="flex gap-1">
                   <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><ChevronRight className="w-4 h-4 rotate-180" /></div>
                   <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><ChevronRight className="w-4 h-4" /></div>
                </div>
             </div>

             <div className="grid grid-cols-7 gap-2 flex-1">
                {weekDays.map((d, i) => (
                   <div key={`h-${i}`} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
                ))}
                {[...Array(31)].map((_, i) => {
                   const day = i + 1;
                   const isSelected = day === 15;
                   const isPast = day < 15;
                   
                   return (
                      <div key={`d-${day}`} className="relative group">
                         <div className={`
                            h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all
                            ${isSelected && step >= 3 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110' : 
                              isPast ? 'text-muted-foreground opacity-50' : 'text-foreground hover:bg-muted'}
                         `}>
                            {day}
                         </div>
                      </div>
                   )
                })}
             </div>
          </motion.div>

          {/* 2. Targeta Notificació (Dreta) */}
          <motion.div 
             initial={{ y: 20, opacity: 0, x: 50 }}
             animate={{ 
                y: step >= 3 ? 0 : 20, 
                opacity: step >= 3 ? 1 : 0,
                x: step >= 3 ? 0 : 50
             }}
             transition={{ type: "spring", stiffness: 50 }}
             className="absolute bottom-10 right-0 z-20 w-72 bg-slate-950/90 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 shadow-[0_20px_50px_-10px_rgba(168,85,247,0.4)] flex items-start gap-4"
          >
             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-white" />
             </div>
             <div>
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">{t('new_booking')}</div>
                <div className="text-sm font-bold text-white">{t('mock_user_name')}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                   <Clock className="w-3 h-3" /> {t('date_long')}
                </div>
             </div>
          </motion.div>

          {/* 3. MISSATGE FLOTANT (Esquerra) */}
          <motion.div
             initial={{ opacity: 0, scale: 0.8, x: -100, y: -20 }}
             animate={{ 
                opacity: step >= 1 ? 1 : 0, 
                scale: step >= 1 ? 1 : 0.8, 
                x: step >= 1 ? -140 : -100, 
                y: step >= 1 ? -30 : -20 
             }}
             transition={{ type: "spring", stiffness: 100, damping: 15 }}
             className="absolute left-1/2 bottom-1/2 z-30 bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-br-none shadow-2xl border border-border max-w-55"
          >
             <div className="flex items-center gap-2 mb-2 opacity-50">
                <MessageSquare className="w-3 h-3" /> <span className="text-[10px] uppercase font-bold">{t('platform_whatsapp')}</span>
             </div>
             <p className="text-sm text-foreground italic">"{t('chat_user_1')}"</p>
          </motion.div>

       </div>
    </div>
  )
}