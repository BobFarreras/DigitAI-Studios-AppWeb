/**
 * @file src/components/landing/v2/fx/constellation.ts
 * @updated 2026-08-19
 * @summary Nucli 3D de la constel·lacio de l'hero: esfera de nodes, arestes i projeccio en canvas.
 * @scope Calcul de presentacio pur; sense dependencies de React ni de negoci.
 */

import { PARTICLE_COLORS } from './particle-engine';

export type Node3D = { x: number; y: number; z: number; size: number; color: string; phase: number };
export type Edge = [number, number];

export type RenderOptions = {
  width: number;
  height: number;
  rotationX: number;
  rotationY: number;
  /** 0 compacte, 1 completament dispers. */
  spread: number;
  /** Opacitat global 0..1. */
  alpha: number;
  time: number;
};

/** Esfera de Fibonacci: distribucio uniforme de nodes sobre una closca. */
export function createSphere(count: number, radius: number): Node3D[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    const jitter = 0.86 + Math.random() * 0.28;
    return {
      x: Math.cos(theta) * ring * radius * jitter,
      y: y * radius * jitter,
      z: Math.sin(theta) * ring * radius * jitter,
      size: 1.4 + Math.random() * 2.2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      phase: Math.random() * Math.PI * 2,
    };
  });
}

/** Arestes entre nodes propers, calculades un sol cop perque la closca es rigida. */
export function createEdges(nodes: Node3D[], maxDistance: number, maxPerNode = 3): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    let linked = 0;
    for (let j = i + 1; j < nodes.length && linked < maxPerNode; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      if (Math.hypot(dx, dy, dz) > maxDistance) continue;
      edges.push([i, j]);
      linked += 1;
    }
  }
  return edges;
}

type Projected = { x: number; y: number; scale: number; depth: number };

function project(node: Node3D, options: RenderOptions): Projected {
  const { rotationX, rotationY, spread, width, height } = options;
  const push = 1 + spread * 1.35;
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);

  const x1 = node.x * cosY - node.z * sinY;
  const z1 = node.x * sinY + node.z * cosY;
  const y1 = node.y * cosX - z1 * sinX;
  const z2 = node.y * sinX + z1 * cosX;

  const focal = 620;
  const scale = focal / (focal + z2);
  return {
    x: width / 2 + x1 * scale * push,
    y: height / 2 + y1 * scale * push,
    scale,
    depth: (z2 + 260) / 520,
  };
}

export function renderConstellation(
  ctx: CanvasRenderingContext2D,
  nodes: Node3D[],
  edges: Edge[],
  options: RenderOptions,
) {
  const { width, height, alpha, time, spread } = options;
  ctx.clearRect(0, 0, width, height);
  if (alpha <= 0.01) return;

  const points = nodes.map((node) => project(node, options));

  ctx.lineWidth = 0.7;
  for (const [from, to] of edges) {
    const a = points[from];
    const b = points[to];
    const near = Math.max(0, 1 - (a.depth + b.depth) / 2);
    ctx.globalAlpha = near * 0.3 * alpha * (1 - spread * 0.85);
    ctx.strokeStyle = '#8052ff';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  nodes.forEach((node, index) => {
    const point = points[index];
    const pulse = 0.55 + 0.45 * Math.sin(time * 0.0016 + node.phase);
    const size = node.size * point.scale * (0.7 + pulse * 0.6);
    ctx.globalAlpha = Math.max(0, 1 - point.depth) * alpha * (0.4 + pulse * 0.6);
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - size);
    ctx.lineTo(point.x - size * 0.866, point.y + size * 0.5);
    ctx.lineTo(point.x + size * 0.866, point.y + size * 0.5);
    ctx.closePath();
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}
