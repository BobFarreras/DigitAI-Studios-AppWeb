/**
 * @file src/components/landing/v2/SoftwareMock.tsx
 * @updated 2026-08-19
 * @summary Maqueta d'un panell a mida que s'anima quan entra a pantalla.
 * @scope Il·lustracio visual de seccio; sense dades reals ni logica de negoci.
 */
'use client';

import { motion } from 'framer-motion';

const bars = [38, 62, 45, 78, 54, 92, 70];
const tiles = ['#8052ff', '#ffb829', '#15846e'];

export function SoftwareMock() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#050505] p-5 shadow-[0_40px_120px_-40px_rgba(128,82,255,0.45)] sm:p-7">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-[9px] w-[9px] rounded-full bg-[#8052ff]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#ffb829]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#15846e]" />
        <span className="ml-auto h-[10px] w-24 rounded-full bg-white/[0.08]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {tiles.map((color, index) => (
          <motion.div
            key={color}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-4"
          >
            <span className="block h-[6px] w-6 rounded-full" style={{ background: color }} />
            <span className="mt-4 block h-[14px] w-16 rounded-full bg-white/[0.14]" />
            <span className="mt-2 block h-[8px] w-10 rounded-full bg-white/[0.06]" />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex h-[150px] items-end gap-2 rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-4 sm:h-[180px]">
        {bars.map((height, index) => (
          <motion.span
            key={height}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, delay: 0.3 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: `${height}%` }}
            className="flex-1 origin-bottom rounded-t-[4px] bg-gradient-to-t from-[#8052ff]/25 to-[#8052ff]"
          />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, delay: 0.5 + row * 0.1 }}
            className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-4 py-3"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[#15846e]" />
            <span className="h-[8px] flex-1 rounded-full bg-white/[0.09]" />
            <span className="h-[8px] w-12 rounded-full bg-white/[0.05]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
