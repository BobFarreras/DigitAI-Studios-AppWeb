'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Send, Download, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AppMockup() {
  const t = useTranslations('Solutions.app_mockup');
  const [step, setStep] = useState(0);

  // Cicle d'animació: Instal·lació (3s) -> Xat (5s) -> Èxit (3s)
  useEffect(() => {
    const times = [3000, 5000, 3000];
    let currentStep = 0;

    const cycle = () => {
      setTimeout(() => {
        currentStep = (currentStep + 1) % 3;
        setStep(currentStep);
        cycle();
      }, times[currentStep]);
    };

    cycle();
    return () => {}; 
  }, []);

  return (
    <div className="grow relative flex justify-center mt-6 items-end h-80">
      
      {/* 📱 MARC DEL MÒBIL (Més gran: w-48) */}
      <div className="w-48 bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl h-full flex flex-col">
        
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-40 flex items-center justify-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse"></div>
        </div>

        {/* Pantalla (Contingut Canviant) */}
        <div className="flex-1 bg-slate-50 dark:bg-[#0f111a] relative overflow-hidden flex flex-col">
            
            {/* 🔔 PUSH NOTIFICATION (Integrada dins la pantalla per evitar talls) */}
            <AnimatePresence>
                {step === 1 && (
                    <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="absolute top-8 inset-x-2 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                    >
                        <div className="bg-green-500 w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0">
                            <Send className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[10px] leading-tight overflow-hidden">
                            <div className="font-bold text-slate-800 dark:text-white truncate">{t('notif_title')}</div>
                            <div className="text-slate-500 truncate">{t('notif_msg')}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                
                {/* --- FASE 1: INSTAL·LACIÓ PWA --- */}
                {step === 0 && (
                    <motion.div 
                        key="install"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="h-full flex flex-col items-center justify-center p-4 text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-white">Go</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t('app_name')}</h4>
                            <p className="text-[10px] text-slate-500">{t('app_category')}</p>
                        </div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-blue-500/30 shadow-lg"
                        >
                            <Download className="w-3 h-3" /> {t('btn_install')}
                        </motion.div>
                        
                        {/* Cursor simulat */}
                        <motion.div 
                            initial={{ x: 20, y: 20, opacity: 0 }}
                            animate={{ x: 0, y: -15, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute pointer-events-none"
                        >
                            <div className="w-4 h-4 bg-slate-400/50 rounded-full border border-white shadow-sm"></div>
                        </motion.div>
                    </motion.div>
                )}

                {/* --- FASE 2: XAT INTERACTIU --- */}
                {step === 1 && (
                    <motion.div 
                        key="chat"
                        className="h-full flex flex-col pt-8" // pt-8 per deixar espai a la dynamic island
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header Xat */}
                        <div className="h-10 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-[10px]">🤖</div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{t('chat_header')}</span>
                            </div>
                        </div>

                        {/* Missatges */}
                        <div className="flex-1 p-3 space-y-3 overflow-hidden flex flex-col justify-end pb-4">
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-slate-200 dark:bg-slate-800 self-start rounded-2xl rounded-bl-none px-3 py-2 text-[10px] max-w-[85%] text-slate-700 dark:text-slate-300"
                            >
                                {t('chat_msg_bot')}
                            </motion.div>

                            <motion.div 
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-blue-600 text-white self-end rounded-2xl rounded-br-none px-3 py-2 text-[10px] max-w-[85%] shadow-md"
                            >
                                {t('chat_msg_user')}
                            </motion.div>

                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="bg-slate-200 dark:bg-slate-800 self-start rounded-2xl rounded-bl-none px-3 py-2 text-[10px] max-w-[85%] text-slate-700 dark:text-slate-300"
                            >
                                <div className="flex gap-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce delay-75">.</span>
                                    <span className="animate-bounce delay-150">.</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* --- FASE 3: ÈXIT / CONFIRMACIÓ --- */}
                {step === 2 && (
                    <motion.div 
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center bg-green-500 text-white p-6 text-center"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="w-16 h-16 bg-white text-green-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
                        >
                            <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                        </motion.div>
                        <h4 className="font-bold text-lg mb-1">{t('success_title')}</h4>
                        <p className="text-xs opacity-90">{t('success_msg')}</p>
                        
                        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-2 w-full flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px] font-mono">ID: #8392A</span>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>

        {/* Navigation Bar (Fals) */}
        <div className="h-1 bg-black w-1/3 mx-auto rounded-full mb-2 opacity-50 absolute bottom-1 left-1/2 -translate-x-1/2 z-50"></div>
      </div>
    </div>
  );
}