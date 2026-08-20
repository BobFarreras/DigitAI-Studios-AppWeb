/**
 * @file src/components/landing/v2/fx/ScrollCue.tsx
 * @updated 2026-08-19
 * @summary Indicador vertical d'scroll amb pols descendent.
 * @scope Element visual client-side; sense logica de negoci.
 */
'use client';

import { motion } from 'framer-motion';

export function ScrollCue({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-14 w-px overflow-hidden bg-white/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-transparent via-[#8052ff] to-transparent"
          animate={{ y: ['-120%', '340%'] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className="text-[11px] uppercase tracking-[0.3em] text-[#5f5f5f]">{label}</span>
    </div>
  );
}
