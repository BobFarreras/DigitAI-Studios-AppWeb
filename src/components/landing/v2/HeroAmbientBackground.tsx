/**
 * @file src/components/landing/v2/HeroAmbientBackground.tsx
 * @updated 2026-05-12
 * @summary Fons canvas subtil amb xarxa de dades per al Hero.
 * @scope Renderitzar textura animada decorativa sense afectar contingut.
 */
'use client';

import { useEffect, useRef } from 'react';

const NODE_COUNT = 86;
const LINK_DISTANCE = 172;
const SPEED = 0.32;

class AmbientNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.size = Math.random() * 1.2 + 0.35;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
}

export function HeroAmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const nodes: AmbientNode[] = [];
    let frameId = 0;
    let pixelRatio = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (nodes.length === 0) {
        for (let i = 0; i < NODE_COUNT; i += 1) nodes.push(new AmbientNode(rect.width, rect.height));
      }
    };

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const width = canvas.width / pixelRatio;
      const height = canvas.height / pixelRatio;
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = isDark ? 0 : 10;
      ctx.shadowColor = 'rgba(8, 9, 10, 0.22)';

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        node.update(width, height);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(138, 143, 152, 0.36)' : 'rgba(35, 37, 42, 0.34)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j += 1) {
          const peer = nodes[j];
          const dx = node.x - peer.x;
          const dy = node.y - peer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;

          ctx.beginPath();
          const alpha = (1 - distance / LINK_DISTANCE) * 0.28;
          ctx.strokeStyle = isDark ? `rgba(138, 143, 152, ${alpha * 0.72})` : `rgba(8, 9, 10, ${alpha * 0.78})`;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(peer.x, peer.y);
          ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,9,10,0.06),transparent_40%,rgba(35,37,42,0.08))] dark:bg-[linear-gradient(135deg,rgba(138,143,152,0.08),transparent_42%,rgba(98,102,109,0.06))]" />
      <div className="absolute left-[-12%] top-[12%] h-[70vh] w-[44vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/8" />
      <div className="absolute right-[-14%] top-[22%] h-[70vh] w-[46vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/7" />
      <div className="absolute left-[50%] top-[48%] h-[58vh] w-[68vw] -translate-x-1/2 rounded-full bg-[#62666d]/6 blur-[120px] dark:bg-[#62666d]/8" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-100 dark:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(247,248,248,0.18)_92%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,9,10,0.46)_92%)]" />
    </div>
  );
}
