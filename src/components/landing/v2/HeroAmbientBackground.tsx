/**
 * @file src/components/landing/v2/HeroAmbientBackground.tsx
 * @updated 2026-05-25
 * @summary Fons canvas subtil amb xarxa de dades per a la landing v2. Pausa quan offscreen/tab hidden.
 * @scope Renderitzar textura animada decorativa sense afectar contingut.
 */
'use client';

import { useEffect, useRef } from 'react';

const NODE_COUNT = 86;
const MOBILE_NODE_COUNT = 48;
const LINK_DISTANCE = 172;
const MOBILE_LINK_DISTANCE = 118;
const SPEED = 0.32;

class AmbientNode {
  x: number; y: number; vx: number; vy: number; size: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * SPEED; this.vy = (Math.random() - 0.5) * SPEED;
    this.size = Math.random() * 1.2 + 0.35;
  }
  update(w: number, h: number) {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
}

export function HeroAmbientBackground({ className = 'absolute inset-0' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !wrapper) return;

    const nodes: AmbientNode[] = [];
    let frameId = 0;
    let pixelRatio = 1;
    let isVisible = true;
    let isTabVisible = true;
    let isDark = document.documentElement.classList.contains('dark');

    const darkObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (nodes.length === 0) {
        const nc = rect.width < 640 ? MOBILE_NODE_COUNT : NODE_COUNT;
        for (let i = 0; i < nc; i += 1) nodes.push(new AmbientNode(rect.width, rect.height));
      }
    };

    const draw = () => {
      if (!isVisible || !isTabVisible) { frameId = 0; return; }

      const width = canvas.width / pixelRatio;
      const height = canvas.height / pixelRatio;
      const linkDist = width < 640 ? MOBILE_LINK_DISTANCE : LINK_DISTANCE;
      const linkDistSq = linkDist * linkDist;

      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = isDark ? 0 : 10;
      ctx.shadowColor = 'rgba(8, 9, 10, 0.22)';

      const nodeColor = isDark ? 'rgba(138, 143, 152, 0.36)' : 'rgba(35, 37, 42, 0.34)';
      const lineColor = (a: number) => isDark ? `rgba(138,143,152,${a * 0.72})` : `rgba(8,9,10,${a * 0.78})`;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        node.update(width, height);
        ctx.beginPath(); ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor; ctx.fill();

        for (let j = i + 1; j < nodes.length; j += 1) {
          const peer = nodes[j];
          const dx = node.x - peer.x; const dy = node.y - peer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > linkDistSq) continue;
          const distance = Math.sqrt(distSq);
          const alpha = (1 - distance / linkDist) * 0.28;
          ctx.beginPath(); ctx.strokeStyle = lineColor(alpha); ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y); ctx.lineTo(peer.x, peer.y); ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    const startLoop = () => { if (frameId === 0 && isVisible && isTabVisible) frameId = requestAnimationFrame(draw); };

    const io = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; if (isVisible) startLoop(); }, { threshold: 0 });
    io.observe(wrapper);

    const onVis = () => { isTabVisible = !document.hidden; if (isTabVisible) startLoop(); };
    document.addEventListener('visibilitychange', onVis);

    resize();
    window.addEventListener('resize', resize);
    startLoop();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect(); darkObserver.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`pointer-events-none z-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,9,10,0.06),transparent_40%,rgba(35,37,42,0.08))] dark:bg-[linear-gradient(135deg,rgba(138,143,152,0.08),transparent_42%,rgba(98,102,109,0.06))]" />
      <div className="absolute left-[-12%] top-[12%] h-[70vh] w-[44vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/8" />
      <div className="absolute right-[-14%] top-[22%] h-[70vh] w-[46vw] rounded-full bg-[#08090a]/10 blur-[110px] dark:bg-[#8a8f98]/7" />
      <div className="absolute left-[50%] top-[48%] h-[58vh] w-[68vw] -translate-x-1/2 rounded-full bg-[#62666d]/6 blur-[120px] dark:bg-[#62666d]/8" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-100 dark:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(247,248,248,0.18)_92%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,9,10,0.46)_92%)]" />
    </div>
  );
}
