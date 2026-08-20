/**
 * @file src/components/landing/v2/HeroConstellation.tsx
 * @updated 2026-08-19
 * @summary Constel·lacio 3D de l'hero: gira amb el cursor i es dispersa a mesura que baixes.
 * @scope Imatge de marca de la landing; sense logica de negoci.
 */
'use client';

import { useEffect, useRef } from 'react';
import { getPointer, prefersMotion } from './fx/pointer-store';
import { createEdges, createSphere, renderConstellation, type Edge, type Node3D } from './fx/constellation';

export function HeroConstellation({ className = '' }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node3D[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionOk = prefersMotion();
    const size = { width: 0, height: 0 };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.width = rect.width;
      size.height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const radius = Math.min(rect.width, rect.height) * 0.36;
      const count = rect.width < 640 ? 190 : 320;
      nodesRef.current = createSphere(count, radius);
      edgesRef.current = createEdges(nodesRef.current, radius * 0.42);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    let frame = 0;

    const render = (time: number) => {
      const rect = wrapper.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, window.innerHeight * 0.9)));
      const pointer = getPointer();

      const targetY = motionOk && pointer.active ? pointer.nx * 0.6 : 0;
      const targetX = motionOk && pointer.active ? pointer.ny * 0.4 : 0;
      rotationRef.current.y += (targetY - rotationRef.current.y) * 0.045;
      rotationRef.current.x += (targetX - rotationRef.current.x) * 0.045;

      renderConstellation(ctx, nodesRef.current, edgesRef.current, {
        width: size.width,
        height: size.height,
        rotationY: rotationRef.current.y + (motionOk ? time * 0.00012 : 0),
        rotationX: rotationRef.current.x,
        spread: progress,
        alpha: 1 - progress * 0.92,
        time,
      });

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(128,82,255,0.16),transparent_68%)] blur-2xl" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  );
}
