/**
 * @file src/components/landing/v2/fx/TiltCard.tsx
 * @updated 2026-08-19
 * @summary Contenidor amb inclinacio 3D i reflex especular que segueixen el cursor.
 * @scope Efecte visual client-side; sense logica de negoci.
 */
'use client';

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Graus maxims d'inclinacio. */
  tilt?: number;
  /** Mostra el reflex que segueix el cursor. */
  glare?: boolean;
};

export function TiltCard({ children, className = '', tilt = 9, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 18, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 18, mass: 0.6 });
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(128,82,255,0.20), rgba(255,184,41,0.06) 35%, transparent 62%)`;

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * tilt * 2);
    rawRotateX.set((0.5 - py) * tilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
    </motion.div>
  );
}
