/**
 * @file src/components/landing/v2/fx/contact-shape.ts
 * @updated 2026-08-20
 * @summary Geometria d'una bustia/sobre per al final del recorregut visual.
 * @scope Calcul pur de punts 3D.
 */
import type { Node3D } from "./constellation";

type Point3D = Pick<Node3D, "x" | "y" | "z">;

export function contactShape(
  index: number,
  count: number,
  radius: number,
): Point3D {
  const ratio = index / count;
  const width = radius * 1.45;
  const height = radius * 0.92;
  if (ratio < 0.56) {
    const perimeter = ratio / 0.56;
    const side = Math.floor(perimeter * 4);
    const offset = (perimeter * 4) % 1;
    const corners = [
      { x: -width / 2, y: -height / 2 },
      { x: width / 2, y: -height / 2 },
      { x: width / 2, y: height / 2 },
      { x: -width / 2, y: height / 2 },
    ];
    const from = corners[side];
    const to = corners[(side + 1) % 4];
    return {
      x: from.x + (to.x - from.x) * offset,
      y: from.y + (to.y - from.y) * offset,
      z: Math.sin(index * 0.8) * radius * 0.08,
    };
  }
  const fold = (ratio - 0.56) / 0.44;
  const left = fold < 0.5;
  const local = (fold % 0.5) * 2;
  return {
    x: left ? -width / 2 + local * width / 2 : local * width / 2,
    y: height / 2 - local * height * 0.72,
    z: Math.cos(index * 0.65) * radius * 0.1,
  };
}
