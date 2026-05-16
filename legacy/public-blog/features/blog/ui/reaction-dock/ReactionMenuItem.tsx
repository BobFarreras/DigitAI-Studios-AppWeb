/**
 * @file src/features/blog/ui/reaction-dock/ReactionMenuItem.tsx
 * @updated 2026-05-09
 * @summary Item visual del menú desplegable de reaccions.
 * @scope Render del botó de reacció i etiqueta contextual.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactionButtonProps } from './types';

export function ReactionMenuItem({ reaction: r, count, isActive, onReact }: ReactionButtonProps) {
  return (
    <div className="relative">
      <AnimatePresence>
        {(count || 0) > 0 && (
          <motion.div
            key="count"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -left-2 z-20 font-bold text-white bg-cyan-600 px-1.5 py-0.5 min-w-[20px] text-center rounded-full text-[10px] border border-cyan-400 shadow-lg pointer-events-none"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onReact(r.id)}
        className={cn(
          'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 relative overflow-hidden',
          isActive ? 'bg-slate-800 border-cyan-500/50 shadow-cyan-500/20' : 'bg-slate-900/90 border-slate-700 hover:bg-slate-800',
        )}
      >
        <span className="filter drop-shadow-md select-none relative z-10">{r.emoji}</span>
        {isActive && <motion.div layoutId={`glow-${r.id}`} className="absolute inset-0 bg-cyan-500/20 blur-md" />}
      </motion.button>
    </div>
  );
}
