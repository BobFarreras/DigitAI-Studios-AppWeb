'use client';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export function MockupBooking() {
   return (
     <div className="relative w-full h-full p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border overflow-hidden">
           <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-primary/10">
              <span className="font-bold text-primary">Agenda Intel·ligent</span>
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-red-400" />
                 <div className="w-2 h-2 rounded-full bg-yellow-400" />
                 <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
           </div>
           <div className="p-4 grid grid-cols-7 gap-2">
              {[...Array(14)].map((_, i) => (
                 <div key={i} className="aspect-square rounded-md bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-xs text-muted-foreground opacity-50">
                    {i + 1}
                 </div>
              ))}
              <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.5, type: "spring" }}
                 className="aspect-square rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-lg shadow-primary/30 col-span-2 w-full"
              >
                 RESERVAT
              </motion.div>
           </div>
        </div>

        <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: -20, opacity: 1 }}
           transition={{ delay: 1 }}
           className="absolute bottom-0 bg-black/80 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 w-64 border border-white/10"
        >
           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
           </div>
           <div className="text-xs">
              <div className="font-bold">Nova Reserva WhatsApp</div>
              <div className="opacity-80">Joan ha reservat per demà.</div>
           </div>
        </motion.div>
     </div>
   )
}