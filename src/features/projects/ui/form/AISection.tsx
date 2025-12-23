'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  defaultValue?: string;
}

export function AISection({ defaultValue }: Props) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden bg-linear-to-br from-indigo-600 to-purple-700 p-1 rounded-2xl shadow-lg"
    >
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[14px]">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg animate-pulse">
                <Sparkles className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Generador de Contingut</h3>
                <p className="text-xs text-slate-500">Gemini escriurà els textos per tu.</p>
            </div>
        </div>

        <div className="space-y-2">
            <textarea 
                name="description" 
                rows={3} 
                defaultValue={defaultValue}
                className="w-full p-4 border border-indigo-100 dark:border-indigo-900 rounded-xl bg-indigo-50/30 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" 
                placeholder="Ex: Som una clínica dental familiar especialitzada en ortodòncia invisible. Volem transmetre confiança i modernitat..." 
                required
            />
            <p className="text-xs text-indigo-600/70 dark:text-indigo-400 text-right">✨ La IA detectarà el to i l'estil automàticament.</p>
        </div>
      </div>
    </motion.section>
  );
}