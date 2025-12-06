'use client';
import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';

export function MockupFinance() {
  return (
    <div className="w-full max-w-md space-y-4 px-6">
       <motion.div 
         initial={{ y: -50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden"
       >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <div className="flex justify-between items-start mb-8">
             <div className="text-xl font-bold">Stripe</div>
             <Wifi className="w-6 h-6 rotate-90" />
          </div>
          <div className="text-lg font-mono tracking-widest mb-4">**** **** **** 4242</div>
          <div className="flex justify-between text-xs opacity-70">
             <span>DigitAI Client</span>
             <span>09/28</span>
          </div>
       </motion.div>

       <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
             <motion.div
               key={i}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: i * 0.3 }}
               className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-border shadow-sm flex flex-col items-center gap-2"
             >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">€</div>
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
             </motion.div>
          ))}
       </div>
    </div>
  )
}