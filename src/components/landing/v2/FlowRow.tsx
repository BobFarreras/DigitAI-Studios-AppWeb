/**
 * @file src/components/landing/v2/FlowRow.tsx
 * @updated 2026-08-19
 * @summary Fila expansible d'una llista: s'obre amb hover o focus i pinta una franja violeta.
 * @scope Interaccio visual de la landing; sense logica de negoci.
 */
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  index: number;
  title: string;
  summary: string;
};

export function FlowRow({ index, title, summary }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group relative border-t border-white/[0.09] last:border-b"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      data-cursor="action"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-bottom bg-gradient-to-t from-[#8052ff]/[0.16] to-transparent"
        initial={false}
        animate={{ scaleY: open ? 1 : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative flex items-baseline gap-5 py-7 sm:gap-8">
        <span className="text-[11px] tabular-nums tracking-[0.2em] text-[#3f3f3f]">0{index + 1}</span>
        <motion.h3
          animate={{ x: open ? 12 : 0, color: open ? '#ffffff' : '#e6e6e6' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 text-[clamp(22px,3.2vw,36px)] font-normal tracking-[-0.03em]"
        >
          {title}
        </motion.h3>
        <motion.span
          animate={{ opacity: open ? 1 : 0.25, x: open ? 0 : -10, rotate: open ? 0 : -45 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[18px] text-[#8052ff]"
        >
          →
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="summary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden"
          >
            <p className="max-w-lg pb-8 pl-[52px] text-[15px] font-extralight leading-relaxed text-[#9a9a9a] sm:pl-[64px]">
              {summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
