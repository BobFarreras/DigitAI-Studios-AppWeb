'use client';

import { motion } from 'framer-motion';
import { QrCode, Lock, Unlock, ScanLine } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MockupIoT() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cycle = async () => {
      setIsOpen(false);
      const openTimer = setTimeout(() => setIsOpen(true), 2000);
      const closeTimer = setTimeout(() => setIsOpen(false), 6000);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    };
    cycle();
    const interval = setInterval(cycle, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden bg-slate-900/50 rounded-2xl">
       
       {/* --- FONS --- */}
       <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 flex flex-col items-center justify-center perspective-500">
             {/* Text reduït en mòbil */}
             <div className="text-[60px] md:text-[100px] font-black text-white/5 tracking-tighter animate-pulse">
                OFFICE
             </div>
             <div className={`w-32 h-1 bg-cyan-500 shadow-[0_0_20px_cyan] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-20'}`} />
          </div>
       </div>

       {/* --- PORTES --- */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-[15%] w-[90%] h-3 md:h-4 bg-slate-700 rounded-full border-b border-slate-500 z-20 shadow-lg" />

          {/* Ajustem el desplaçament x segons la pantalla */}
          <motion.div
            animate={{ x: isOpen ? '-85%' : 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="w-[35%] h-[60%] bg-blue-50/5 backdrop-blur-md border-l border-t border-b border-white/20 shadow-xl relative z-10 flex items-center justify-end"
          >
             <div className="w-1 h-12 md:h-16 bg-slate-400/50 rounded-full mr-2" />
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </motion.div>

          <motion.div
            animate={{ x: isOpen ? '85%' : 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="w-[35%] h-[60%] bg-blue-50/5 backdrop-blur-md border-r border-t border-b border-white/20 shadow-xl relative z-10 flex items-center justify-start"
          >
             <div className="w-1 h-12 md:h-16 bg-slate-400/50 rounded-full ml-2" />
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
          </motion.div>
       </div>

       {/* --- LECTOR (Més petit en mòbil) --- */}
       <div className="absolute right-[5%] top-[40%] w-6 h-10 md:w-10 md:h-16 bg-slate-800 rounded-md border border-slate-600 flex flex-col items-center justify-center shadow-lg z-0">
          <motion.div 
            animate={{ backgroundColor: isOpen ? '#22c55e' : '#ef4444' }}
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mb-1 shadow-[0_0_5px_currentColor]" 
          />
          <div className="w-3 h-4 md:w-4 md:h-6 bg-black/50 rounded-[2px]" />
       </div>

       {/* --- MÒBIL --- */}
       <motion.div 
         animate={{ 
            y: isOpen ? 100 : 0,
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.8 : 1
         }}
         transition={{ duration: 0.5 }}
         // Mida més continguda en mòbil
         className="absolute bottom-4 z-30"
       >
          <div className="relative w-24 h-40 md:w-32 md:h-56 bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border-4 border-slate-700 shadow-2xl flex flex-col items-center overflow-hidden">
             
             <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 text-[6px] md:text-[8px] text-slate-400 uppercase tracking-widest font-bold">DigitAI Access</div>

                <div className="bg-white p-1.5 md:p-2 rounded-lg relative overflow-hidden">
                   <QrCode className="w-12 h-12 md:w-16 md:h-16 text-black" />
                   <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_#22c55e] opacity-80"
                   />
                </div>

                <div className="mt-2 md:mt-4 flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                   <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <ScanLine className="w-2.5 h-2.5 md:w-3 md:h-3 text-cyan-400" />
                   </motion.div>
                   <span className="text-[6px] md:text-[8px] font-mono text-cyan-400">CONNECTING...</span>
                </div>
             </div>

             <div className="absolute top-2 w-8 md:w-10 h-2 md:h-3 bg-black rounded-full z-40" />
          </div>
       </motion.div>

       {/* --- ESTAT --- */}
       <motion.div
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10 }}
          className="absolute bottom-10 z-20 bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[10px] md:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
       >
          <Unlock className="w-3 h-3 md:w-4 md:h-4" /> ACCÉS AUTORITZAT
       </motion.div>

    </div>
  )
}