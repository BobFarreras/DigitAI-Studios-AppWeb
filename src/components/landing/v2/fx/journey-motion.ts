/**
 * @file src/components/landing/v2/fx/journey-motion.ts
 * @updated 2026-08-20
 * @summary Calcula les escenes i el morph de la constel·lacio narrativa.
 * @scope Logica pura de moviment vinculada al scroll.
 */
import type { Node3D } from "./constellation";
import { getShapePoint, type ConstellationShape } from "./constellation-shapes";

export type JourneyScene = {
  from: ConstellationShape;
  to: ConstellationShape;
  morph: number;
  x: number;
  y: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) =>
  value * value * value * (value * (value * 6 - 15) + 10);

export function morphJourneyNode(
  node: Node3D,
  index: number,
  scene: JourneyScene,
  radius: number,
  count: number,
): Node3D {
  const source = getShapePoint(scene.from, index, count, radius);
  const target = getShapePoint(scene.to, index, count, radius);
  const direction = {
    x: Math.cos(node.phase * 2.3),
    y: Math.sin(node.phase * 1.7),
    z: Math.sin(node.phase),
  };
  const dispersed = {
    x: source.x * 0.35 + direction.x * radius * 1.08,
    y: source.y * 0.35 + direction.y * radius * 1.08,
    z: source.z * 0.2 + direction.z * radius * 0.62,
  };
  const release = smooth(clamp(scene.morph / 0.32));
  const stagger = ((Math.sin(node.phase * 4.73) + 1) / 2) * 0.24;
  const gatherStart = 0.5 + stagger;
  const gather = smooth(clamp((scene.morph - gatherStart) / (1 - gatherStart)));
  const orbit =
    scene.morph > 0.32 && scene.morph < 0.62
      ? Math.sin((scene.morph - 0.32) * Math.PI * 3.33) * radius * 0.08
      : 0;
  const released = {
    x: source.x + (dispersed.x - source.x) * release + direction.y * orbit,
    y: source.y + (dispersed.y - source.y) * release - direction.x * orbit,
    z: source.z + (dispersed.z - source.z) * release,
  };
  return {
    ...node,
    x: released.x + (target.x - released.x) * gather,
    y: released.y + (target.y - released.y) * gather,
    z: released.z + (target.z - released.z) * gather,
  };
}

export function getJourneyScene(height: number): JourneyScene {
  const contact = document.querySelector<HTMLElement>("#contacte")?.getBoundingClientRect();
  const impact = document.querySelector<HTMLElement>("#impacte")?.getBoundingClientRect();
  const services = document.querySelector<HTMLElement>("#serveis")?.getBoundingClientRect();
  if (contact && contact.top < height * 0.98) {
    const morph = clamp((height * 0.98 - contact.top) / (height * 0.92));
    if (morph < 1) {
      const travel = smooth(morph);
      return {
        from: "agent",
        to: "contact",
        morph,
        x: 0.24 - travel * 0.46,
        y: 0.5 + travel * 0.04,
      };
    }
    return { from: "contact", to: "contact", morph: 0, x: -0.22, y: 0.54 };
  }
  const service = services
    ? clamp(-services.top / Math.max(1, services.height - height))
    : 0;
  if (services && services.top <= 0) {
    if (service < 0.14) return { from: "gear", to: "gear", morph: 0, x: 0.24, y: 0.5 };
    if (service < 0.42) {
      return { from: "gear", to: "dashboard", morph: (service - 0.14) / 0.28, x: 0.24, y: 0.5 };
    }
    if (service < 0.52) return { from: "dashboard", to: "dashboard", morph: 0, x: 0.24, y: 0.5 };
    if (service < 0.72) {
      return { from: "dashboard", to: "agent", morph: (service - 0.52) / 0.2, x: 0.24, y: 0.5 };
    }
    return { from: "agent", to: "agent", morph: 0, x: 0.24, y: 0.5 };
  }
  if (services && services.top < height * 0.82) {
    const morph = clamp((height * 0.82 - services.top) / (height * 0.82));
    const travel = smooth(morph);
    return { from: "bulb", to: "gear", morph, x: -0.22 + travel * 0.46, y: 0.55 - travel * 0.05 };
  }
  if (impact) {
    const morph = clamp((height * 1.02 - impact.top) / (height * 1.04));
    if (morph < 1) {
      const travel = smooth(morph);
      return { from: "brain", to: "bulb", morph, x: 0.22 - travel * 0.44, y: 0.48 + travel * 0.07 };
    }
    return { from: "bulb", to: "bulb", morph: 0, x: -0.22, y: 0.55 };
  }
  return { from: "brain", to: "brain", morph: 0, x: 0.22, y: 0.48 };
}
