/**
 * @file src/components/landing/v2/fx/Magnetic.tsx
 * @updated 2026-08-19
 * @summary Wrapper magnetic: l'element s'inclina cap al cursor quan aquest s'hi acosta.
 * @scope Efecte visual client-side; sense logica de negoci.
 */
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { subscribePointer } from './pointer-store';
import { useFinePointer } from './usePointerMotion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Radi d'atraccio en pixels. */
  radius?: number;
  /** Proporcio del desplacament respecte la distancia al centre. */
  strength?: number;
};

export function Magnetic({ children, className = '', radius = 150, strength = 0.32 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 210, damping: 17, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 210, damping: 17, mass: 0.5 });
  const fine = useFinePointer();

  useEffect(() => {
    if (!fine) return;
    const element = ref.current;
    if (!element) return;

    const measure = () => { rectRef.current = element.getBoundingClientRect(); };
    measure();

    const unsubscribe = subscribePointer((pointer) => {
      const rect = rectRef.current;
      if (!rect || !pointer.active) { rawX.set(0); rawY.set(0); return; }
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) > radius) { rawX.set(0); rawY.set(0); return; }
      rawX.set(dx * strength);
      rawY.set(dy * strength);
    });

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [fine, radius, strength, rawX, rawY]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
