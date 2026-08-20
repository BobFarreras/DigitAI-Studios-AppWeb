/**
 * @file src/components/landing/v2/fx/CursorSpotlight.tsx
 * @updated 2026-08-19
 * @summary Halo violeta que segueix el cursor dins de la seccio que el conte.
 * @scope Efecte visual client-side; sense logica de negoci.
 */
'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { subscribePointer } from './pointer-store';
import { useFinePointer } from './usePointerMotion';

type Props = {
  /** Radi del halo en pixels. */
  size?: number;
  color?: string;
  className?: string;
};

export function CursorSpotlight({ size = 460, color = 'rgba(128,82,255,0.16)', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const x = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.6 });
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`;
  const fine = useFinePointer();

  useEffect(() => {
    if (!fine) return;
    const element = ref.current;
    if (!element) return;

    const measure = () => { rectRef.current = element.getBoundingClientRect(); };
    measure();

    const unsubscribe = subscribePointer((pointer) => {
      const rect = rectRef.current;
      if (!rect) return;
      rawX.set(pointer.x - rect.left);
      rawY.set(pointer.y - rect.top);
    });

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [fine, rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ background: fine ? background : 'none' }}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}
