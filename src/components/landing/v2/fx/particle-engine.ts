/**
 * @file src/components/landing/v2/fx/particle-engine.ts
 * @updated 2026-08-19
 * @summary Motor del camp de particules: creacio, fisica amb repulsio de cursor i dibuix.
 * @scope Calcul de presentacio pur; sense dependencies de React ni de negoci.
 */

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  spin: number;
  /** Profunditat 0.35..1 per al parallax d'scroll. */
  depth: number;
};

export type PointerInput = { x: number; y: number; active: boolean };

export const PARTICLE_COLORS = ['#8052ff', '#ffb829', '#15846e', '#a855f7', '#6366f1', '#3b82f6', '#ec4899'];

const LINK_RADIUS = 190;
const PUSH_RADIUS = 150;

export function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    size: Math.random() * 2.6 + 0.7,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    opacity: Math.random() * 0.32 + 0.06,
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 0.35,
    depth: Math.random() * 0.65 + 0.35,
  }));
}

export function stepParticles(particles: Particle[], width: number, height: number, pointer: PointerInput, dt: number) {
  const step = Math.min(dt, 34) / 16.67;

  for (const p of particles) {
    if (pointer.active) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < PUSH_RADIUS && distance > 0.01) {
        const force = (1 - distance / PUSH_RADIUS) * 0.55 * step;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;
      }
    }

    p.vx *= 0.972;
    p.vy *= 0.972;
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.rotation += p.spin * step;

    if (p.x < -12) p.x = width + 12;
    if (p.x > width + 12) p.x = -12;
    if (p.y < -12) p.y = height + 12;
    if (p.y > height + 12) p.y = -12;
  }
}

function traceTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const points: Array<[number, number]> = [
    [0, -size],
    [-size * 0.866, size * 0.5],
    [size * 0.866, size * 0.5],
  ];
  ctx.beginPath();
  points.forEach(([px, py], index) => {
    const rx = x + px * cos - py * sin;
    const ry = y + px * sin + py * cos;
    if (index === 0) ctx.moveTo(rx, ry);
    else ctx.lineTo(rx, ry);
  });
  ctx.closePath();
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  pointer: PointerInput,
  parallax: number,
) {
  const near: Array<{ x: number; y: number; distance: number; color: string }> = [];

  for (const p of particles) {
    const y = p.y - parallax * p.depth;
    let alpha = p.opacity;
    let scale = 1;

    if (pointer.active) {
      const distance = Math.hypot(p.x - pointer.x, y - pointer.y);
      if (distance < LINK_RADIUS) {
        const proximity = 1 - distance / LINK_RADIUS;
        alpha = Math.min(0.95, p.opacity + proximity * 0.75);
        scale = 1 + proximity * 0.9;
        near.push({ x: p.x, y, distance, color: p.color });
      }
    }

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 0.9;
    traceTriangle(ctx, p.x, y, p.size * scale, p.rotation);
    ctx.stroke();
  }

  if (!pointer.active) return;

  for (const node of near) {
    ctx.globalAlpha = (1 - node.distance / LINK_RADIUS) * 0.28;
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(pointer.x, pointer.y);
    ctx.lineTo(node.x, node.y);
    ctx.stroke();
  }

  for (let i = 0; i < near.length; i += 1) {
    for (let j = i + 1; j < near.length; j += 1) {
      const gap = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
      if (gap > 120) continue;
      ctx.globalAlpha = (1 - gap / 120) * 0.16;
      ctx.strokeStyle = '#8052ff';
      ctx.beginPath();
      ctx.moveTo(near[i].x, near[i].y);
      ctx.lineTo(near[j].x, near[j].y);
      ctx.stroke();
    }
  }
}
