'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bell, Send, Download, CheckCircle2, MessageSquare } from 'lucide-react';

export function AppMockup() {
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
    return () => {}; // Cleanup si calgués
  }, []);

  return (
    <div className="grow relative flex justify-center mt-6 items-end h-[320px]">
      
      {/* 📱 MARC DEL MÒBIL (Més gran: w-48) */}
      <div className="w-48 bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl h-full flex flex-col">
        
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse"></div>
        </div>

        {/* Pantalla (Contingut Canviant) */}
        <div className="flex-1 bg-slate-50 dark:bg-[#0f111a] relative overflow-hidden flex flex-col">
            
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
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-white">Go</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Gym App</h4>
                            <p className="text-[10px] text-slate-500">Gestió Esportiva</p>
                        </div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-blue-500/30 shadow-lg"
                        >
                            <Download className="w-3 h-3" /> Instal·lar App
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
                        className="h-full flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header Xat */}
                        <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-end pb-2 px-4 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-[10px]">🤖</div>
                                <span className="text-xs font-bold">Assistent IA</span>
                            </div>
                        </div>

                        {/* Missatges */}
                        <div className="flex-1 p-3 space-y-3 overflow-hidden flex flex-col justify-end pb-12">
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-slate-200 dark:bg-slate-800 self-start rounded-2xl rounded-bl-none px-3 py-2 text-[10px] max-w-[85%]"
                            >
                                Hola! Vols reservar pista? 🎾
                            </motion.div>

                            <motion.div 
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="bg-blue-600 text-white self-end rounded-2xl rounded-br-none px-3 py-2 text-[10px] max-w-[85%] shadow-md"
                            >
                                Sí, demà a les 18h.
                            </motion.div>

                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="bg-slate-200 dark:bg-slate-800 self-start rounded-2xl rounded-bl-none px-3 py-2 text-[10px] max-w-[85%]"
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
                        <h4 className="font-bold text-lg mb-1">Reserva Confirmada!</h4>
                        <p className="text-xs opacity-90">T'hem enviat el tiquet al WhatsApp.</p>
                        
                        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-2 w-full flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px] font-mono">ID: #8392A</span>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>

        {/* Navigation Bar (Fals) */}
        <div className="h-1 bg-black w-1/3 mx-auto rounded-full mb-2 opacity-50"></div>
      </div>

      {/* NOTIFICACIÓ FLOTANT (Només en fase 2) */}
      <AnimatePresence>
        {step === 1 && (
            <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="absolute top-10 -right-12 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-0 flex items-center gap-2"
            >
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
                    <Send className="w-4 h-4" />
                </div>
                <div className="text-[10px] pr-2">
                    <div className="font-bold">WhatsApp API</div>
                    <div className="text-slate-500">Missatge enviat</div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}