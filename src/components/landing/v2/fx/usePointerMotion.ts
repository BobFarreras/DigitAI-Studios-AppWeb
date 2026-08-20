/**
 * @file src/components/landing/v2/fx/usePointerMotion.ts
 * @updated 2026-08-19
 * @summary Hooks de moviment lligats al punter i a la velocitat d'scroll.
 * @scope Utilitats client-side de presentacio; sense logica de negoci.
 */
'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useScroll, useVelocity, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { subscribePointer, prefersMotion } from './pointer-store';

type SpringOptions = { stiffness?: number; damping?: number; mass?: number };

/** Posicio normalitzada del punter (-1..1) suavitzada amb molla. */
export function usePointerMotion(options: SpringOptions = {}): { x: MotionValue<number>; y: MotionValue<number> } {
  const { stiffness = 80, damping = 22, mass = 0.7 } = options;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping, mass });
  const y = useSpring(rawY, { stiffness, damping, mass });

  useEffect(() => {
    if (!prefersMotion()) return;
    return subscribePointer((pointer) => {
      rawX.set(pointer.nx);
      rawY.set(pointer.ny);
    });
  }, [rawX, rawY]);

  return { x, y };
}

/** Direccio d'scroll: 1 avall, -1 amunt. Util per invertir marquees. */
export function useScrollDirection(): MotionValue<number> {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const direction = useMotionValue(1);

  useMotionValueEvent(velocity, 'change', (value) => {
    if (value > 24) direction.set(1);
    else if (value < -24) direction.set(-1);
  });

  return direction;
}

/** Velocitat d'scroll normalitzada (-1..1) suavitzada, per skew i estirament. */
export function useScrollBoost(max = 2400): MotionValue<number> {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const raw = useMotionValue(0);
  const boost = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.5 });

  useMotionValueEvent(velocity, 'change', (value) => {
    raw.set(Math.max(-1, Math.min(1, value / max)));
  });

  return boost;
}

/** True nomes quan el dispositiu te punter fi i l'usuari no ha demanat menys moviment. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (!prefersMotion()) return;
    const query = window.matchMedia('(pointer: fine)');
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return fine;
}
