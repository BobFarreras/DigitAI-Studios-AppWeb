/**
 * @file src/components/landing/v2/fx/constellation-shapes.ts
 * @updated 2026-08-20
 * @summary Generadors deterministes de siluetes per a la constel·lacio narrativa.
 * @scope Geometria pura de presentacio.
 */
import type { Node3D } from "./constellation";

export type ConstellationShape =
  | "brain"
  | "bulb"
  | "gear"
  | "dashboard"
  | "agent";

type Point3D = Pick<Node3D, "x" | "y" | "z">;

function brain(index: number, count: number, radius: number): Point3D {
  if (index < count * 0.4) {
    const angle = (index / (count * 0.4)) * Math.PI * 2;
    const ripple =
      0.78 + Math.sin(angle * 6) * 0.075 + Math.sin(angle * 11) * 0.035;
    return {
      x: Math.cos(angle) * radius * ripple,
      y: Math.sin(angle) * radius * ripple * 0.78,
      z: Math.sin(angle * 3) * radius * 0.12,
    };
  }
  const random = (seed: number) => {
    const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  let x = 0;
  let y = 0;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    x = random(attempt * 2) * 2 - 1;
    y = random(attempt * 2 + 1) * 1.75 - 0.88;
    const lobe = x < 0 ? -0.28 : 0.28;
    const inside = ((x - lobe) / 0.72) ** 2 + (y / 0.86) ** 2 < 1;
    const notch = Math.abs(x) < 0.075 && y < -0.48;
    if (inside && !notch) break;
  }
  const depth =
    (random(count + 2) * 2 - 1) * Math.sqrt(Math.max(0, 1 - x * x)) * 0.36;
  return { x: x * radius, y: y * radius, z: depth * radius };
}

function bulb(index: number, count: number, radius: number): Point3D {
  const ratio = index / count;
  if (ratio < 0.38) {
    const angle = (ratio / 0.38) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius * 0.62,
      y: Math.sin(angle) * radius * 0.62 - radius * 0.2,
      z: Math.sin(angle * 2) * 18,
    };
  }
  if (ratio > 0.78) {
    const stem = (ratio - 0.78) / 0.22;
    return {
      x: (index % 2 ? -1 : 1) * radius * (0.22 - stem * 0.08),
      y: radius * (0.48 + stem * 0.45),
      z: Math.cos(index) * 24,
    };
  }
  const angle = index * 2.399;
  const ring = Math.sqrt(ratio / 0.78) * radius * 0.62;
  return {
    x: Math.cos(angle) * ring,
    y: Math.sin(angle) * ring - radius * 0.18,
    z: Math.sin(index * 0.7) * radius * 0.22,
  };
}

function gear(index: number, count: number, radius: number): Point3D {
  const angle = (index / count) * Math.PI * 2;
  const tooth = index % 16 < 8 ? 0.68 : 0.92;
  const depth = ((index % 7) / 7 - 0.5) * radius * 0.35;
  return {
    x: Math.cos(angle) * radius * tooth,
    y: Math.sin(angle) * radius * tooth,
    z: depth,
  };
}

function dashboard(index: number, count: number, radius: number): Point3D {
  const columns = 20;
  const row = Math.floor(index / columns);
  const column = index % columns;
  return {
    x: (column / 19 - 0.5) * radius * 1.5,
    y: (row / Math.ceil(count / columns) - 0.5) * radius * 1.15,
    z: Math.sin(column * 0.8 + row) * 32,
  };
}

function agent(index: number, count: number, radius: number): Point3D {
  const ratio = index / count;
  if (ratio < 0.42) {
    const perimeter = ratio / 0.42;
    const side = Math.floor(perimeter * 4);
    const offset = (perimeter * 4) % 1;
    const points = [
      { x: -0.64 + offset * 1.28, y: -0.55 },
      { x: 0.64, y: -0.55 + offset * 1.1 },
      { x: 0.64 - offset * 1.28, y: 0.55 },
      { x: -0.64, y: 0.55 - offset * 1.1 },
    ];
    return {
      x: points[side].x * radius,
      y: points[side].y * radius,
      z: Math.sin(index) * 20,
    };
  }
  if (ratio < 0.5) {
    const antenna = (ratio - 0.42) / 0.08;
    return {
      x: 0,
      y: radius * (-0.55 - antenna * 0.3),
      z: Math.sin(index) * 12,
    };
  }
  const local = (ratio - 0.5) / 0.5;
  const eye = local < 0.55 ? (index % 2 ? -0.27 : 0.27) : 0;
  return {
    x: (eye + Math.sin(index * 1.9) * 0.1) * radius,
    y: (local < 0.55 ? -0.12 : 0.22 + Math.sin(index) * 0.05) * radius,
    z: Math.cos(index * 0.7) * radius * 0.16,
  };
}

export function getShapePoint(
  shape: ConstellationShape,
  index: number,
  count: number,
  radius: number,
): Point3D {
  if (shape === "brain") return brain(index, count, radius);
  if (shape === "bulb") return bulb(index, count, radius);
  if (shape === "gear") return gear(index, count, radius);
  if (shape === "dashboard") return dashboard(index, count, radius);
  return agent(index, count, radius);
}
