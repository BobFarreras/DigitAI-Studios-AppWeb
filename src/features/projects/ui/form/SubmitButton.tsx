'use client';

import { Loader2, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  isPending: boolean;
}

export function SubmitButton({ isPending }: Props) {
  return (
    <div className="mt-8 pt-4"> {/* Marge superior en lloc de posició fixa */}
      <motion.button 
        type="submit" 
        disabled={isPending}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`
            w-full py-4 px-8 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all
            ${isPending 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:shadow-2xl hover:shadow-blue-500/20'
            }
        `}
      >
        {isPending ? (
            <>
                <Loader2 className="animate-spin w-5 h-5" /> 
                <span>Processant...</span>
            </>
        ) : (
            <>
                <span>Llançar Coet</span>
                <Rocket className="w-5 h-5 fill-current" />
            </>
        )}
      </motion.button>
    </div>
  );
}