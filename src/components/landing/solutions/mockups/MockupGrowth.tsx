'use client';
import { motion } from 'framer-motion';

export function MockupGrowth() {
   return (
      <div className="flex items-end justify-center gap-4 h-48 w-full px-10">
         {[40, 70, 50, 90, 65, 85].map((height, i) => (
            <motion.div
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${height}%` }}
               transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
               className="w-12 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg relative group shadow-lg"
            >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                  {height}% ROI
               </div>
            </motion.div>
         ))}
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <motion.path
               d="M 40 140 L 100 80 L 160 110 L 220 50 L 280 90 L 340 60"
               fill="none"
               stroke="#10b981"
               strokeWidth="4"
               strokeLinecap="round"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.5 }}
               style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
            />
         </svg>
      </div>
   )
}