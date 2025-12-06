'use client';
import { motion } from 'framer-motion';
import { QrCode, Lock } from 'lucide-react';

export function MockupIoT() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-10">
       <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="absolute left-10 bottom-10 w-32 md:w-40 h-56 md:h-64 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center z-20"
       >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg p-2 mb-4">
             <QrCode className="w-full h-full text-black" />
          </div>
          <span className="text-[10px] md:text-xs text-green-400 font-mono animate-pulse">Scanning...</span>
       </motion.div>

       <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute left-[100px] bottom-[140px] w-20 h-20 border-2 border-cyan-500 rounded-full z-10"
       />

       <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="w-56 md:w-64 h-72 md:h-80 bg-slate-100 dark:bg-slate-800 rounded-t-full border-8 border-slate-300 dark:border-slate-700 relative flex items-center justify-center shadow-inner"
       >
          <div className="absolute top-1/2 left-4 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
          <motion.div 
             animate={{ rotateY: -100 }}
             transition={{ delay: 1.5, duration: 1, type: "spring" }}
             className="w-full h-full bg-white dark:bg-slate-600 rounded-t-full origin-left border-r border-slate-200 dark:border-slate-500 flex items-center justify-center"
          >
             <div className="w-4 h-4 bg-slate-400 rounded-full absolute right-4 top-1/2" />
             <div className="bg-green-500/20 text-green-600 px-4 py-2 rounded-lg font-bold border border-green-500 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" /> UNLOCKED
             </div>
          </motion.div>
       </motion.div>
    </div>
  )
}