/**
 * @file src/components/landing/v2/fx/pointer-store.ts
 * @updated 2026-08-19
 * @summary Store global del punter: un unic listener compartit per tots els efectes de la landing.
 * @scope Utilitat client-side de presentacio; sense logica de negoci.
 */
'use client';

export type PointerState = {
  /** Posicio en pixels dins del viewport. */
  x: number;
  y: number;
  /** Posicio normalitzada -1..1 respecte el centre del viewport. */
  nx: number;
  ny: number;
  /** El punter s'ha mogut alguna vegada i encara es dins del document. */
  active: boolean;
};

type Listener = (state: PointerState) => void;

const state: PointerState = { x: 0, y: 0, nx: 0, ny: 0, active: false };
const listeners = new Set<Listener>();
let frame = 0;

function flush() {
  frame = 0;
  for (const listener of listeners) listener(state);
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function handleMove(event: PointerEvent) {
  state.x = event.clientX;
  state.y = event.clientY;
  state.nx = (event.clientX / window.innerWidth) * 2 - 1;
  state.ny = (event.clientY / window.innerHeight) * 2 - 1;
  state.active = true;
  schedule();
}

function handleLeave() {
  state.active = false;
  state.nx = 0;
  state.ny = 0;
  schedule();
}

function bind() {
  window.addEventListener('pointermove', handleMove, { passive: true });
  document.addEventListener('pointerleave', handleLeave);
  window.addEventListener('blur', handleLeave);
}

function unbind() {
  window.removeEventListener('pointermove', handleMove);
  document.removeEventListener('pointerleave', handleLeave);
  window.removeEventListener('blur', handleLeave);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/** Subscriu un listener al punter global. Retorna la funcio per desubscriure. */
export function subscribePointer(listener: Listener): () => void {
  if (typeof window === 'undefined') return () => {};
  if (listeners.size === 0) bind();
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) unbind();
  };
}

/** Lectura sincrona de l'estat actual (per bucles de canvas). */
export function getPointer(): PointerState {
  return state;
}

/** True si el dispositiu te punter fi (ratoli/trackpad) i l'usuari accepta moviment. */
export function prefersMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
