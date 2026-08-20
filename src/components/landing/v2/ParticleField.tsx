/**
 * @file src/components/landing/v2/ParticleField.tsx
 * @updated 2026-08-19
 * @summary Camp ambient de triangles que teixeix una xarxa al voltant del cursor i fa parallax amb l'scroll.
 * @scope Fons visual de la landing; sense logica de negoci.
 */
'use client';

import { useEffect, useRef } from 'react';
import { getPointer, prefersMotion } from './fx/pointer-store';
import { createParticles, drawParticles, stepParticles, type Particle } from './fx/particle-engine';

export function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionOk = prefersMotion();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height };
      const density = width < 768 ? 26000 : 13000;
      const count = Math.min(Math.floor((width * height) / density), width < 768 ? 45 : 130);
      particlesRef.current = createParticles(count, width, height);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };

    resize();
    onScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;
    let last = performance.now();

    const render = (now: number) => {
      const delta = now - last;
      last = now;
      const { width, height } = sizeRef.current;
      const raw = getPointer();
      const pointer = { x: raw.x, y: raw.y, active: raw.active && motionOk };

      ctx.clearRect(0, 0, width, height);
      if (motionOk) stepParticles(particlesRef.current, width, height, pointer, delta);
      drawParticles(ctx, particlesRef.current, pointer, (scrollRef.current % (height * 3)) * 0.12);
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
