/**
 * @file src/components/landing/v2/fx/ScrollProgress.tsx
 * @updated 2026-08-19
 * @summary Linia de progres d'scroll fixa a dalt de tot de la landing.
 * @scope Indicador visual client-side; sense logica de negoci.
 */
'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#8052ff] via-[#a855f7] to-[#ffb829]"
    />
  );
}
