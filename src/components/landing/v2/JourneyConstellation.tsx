/**
 * @file src/components/landing/v2/JourneyConstellation.tsx
 * @updated 2026-08-20
 * @summary Visual sticky compartit que transforma la constel·lacio durant les tres primeres escenes.
 * @scope Animacio ambiental canvas; sense contingut ni logica de negoci.
 */
"use client";

import { useEffect, useRef } from "react";
import {
  createSphere,
  renderConstellation,
  type Node3D,
} from "./fx/constellation";
import { getPointer, prefersMotion } from "./fx/pointer-store";
import {
  getShapePoint,
  type ConstellationShape,
} from "./fx/constellation-shapes";

type Scene = {
  from: ConstellationShape;
  to: ConstellationShape;
  morph: number;
  x: number;
  y: number;
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) =>
  value * value * value * (value * (value * 6 - 15) + 10);

function morphNode(
  node: Node3D,
  index: number,
  scene: Scene,
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
  const t = scene.morph;
  const release = smooth(clamp(t / 0.32));
  const stagger = ((Math.sin(node.phase * 4.73) + 1) / 2) * 0.24;
  const gatherStart = 0.5 + stagger;
  const gather = smooth(clamp((t - gatherStart) / (1 - gatherStart)));
  const orbit =
    t > 0.32 && t < 0.62
      ? Math.sin((t - 0.32) * Math.PI * 3.33) * radius * 0.08
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

function getScene(height: number): Scene {
  const impact = document
    .querySelector<HTMLElement>("#impacte")
    ?.getBoundingClientRect();
  const services = document
    .querySelector<HTMLElement>("#serveis")
    ?.getBoundingClientRect();
  const service = services
    ? clamp(-services.top / Math.max(1, services.height - height))
    : 0;
  if (services && services.top <= 0) {
    if (service < 0.14)
      return { from: "gear", to: "gear", morph: 0, x: 0.24, y: 0.5 };
    if (service < 0.42)
      return {
        from: "gear",
        to: "dashboard",
        morph: (service - 0.14) / 0.28,
        x: 0.24,
        y: 0.5,
      };
    if (service < 0.58)
      return { from: "dashboard", to: "dashboard", morph: 0, x: 0.24, y: 0.5 };
    if (service < 0.86)
      return {
        from: "dashboard",
        to: "agent",
        morph: (service - 0.58) / 0.28,
        x: 0.24,
        y: 0.5,
      };
    return { from: "agent", to: "agent", morph: 0, x: 0.24, y: 0.5 };
  }
  if (services && services.top < height * 0.82) {
    const morph = clamp((height * 0.82 - services.top) / (height * 0.82));
    const travel = smooth(morph);
    return {
      from: "bulb",
      to: "gear",
      morph,
      x: -0.22 + travel * 0.46,
      y: 0.55 - travel * 0.05,
    };
  }
  if (impact) {
    const morph = clamp((height * 1.02 - impact.top) / (height * 1.04));
    if (morph < 1) {
      const travel = smooth(morph);
      return {
        from: "brain",
        to: "bulb",
        morph,
        x: 0.22 - travel * 0.44,
        y: 0.48 + travel * 0.07,
      };
    }
    return {
      from: "bulb",
      to: "bulb",
      morph: 0,
      x: -0.22,
      y: 0.55,
    };
  }
  return {
    from: "brain",
    to: "brain",
    morph: 0,
    x: 0.22,
    y: 0.48,
  };
}

export function JourneyConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const journey = document.querySelector<HTMLElement>("#visual-journey");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !journey || !ctx) return;
    let width = 0;
    let height = 0;
    let radius = 0;
    let nodes: Node3D[] = [];
    let frame = 0;
    const motionOk = prefersMotion();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      radius = Math.min(width, height) * (width < 768 ? 0.42 : 0.39);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createSphere(width < 768 ? 360 : 680, radius);
    };

    const render = (time: number) => {
      const scene = getScene(height);
      const pointer = getPointer();
      const shaped = nodes.map((node, index) =>
        morphNode(node, index, scene, radius, nodes.length),
      );
      const servicesTop = document
        .querySelector<HTMLElement>("#serveis")
        ?.getBoundingClientRect().top;
      const mobileService =
        width < 768 && servicesTop !== undefined && servicesTop < height * 0.82;
      const mobileY = mobileService ? -height * 0.24 : height * scene.x * 0.82;
      const scale = mobileService ? 0.72 : 1;
      const translateX = width < 768 ? 0 : width * scene.x;
      const translateY = width < 768 ? mobileY : height * (scene.y - 0.5);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2 + translateX, height / 2 + translateY);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      renderConstellation(ctx, shaped, [], {
        width,
        height,
        spread: 0,
        alpha: 0.92,
        time,
        rotationX:
          (motionOk ? Math.sin(time * 0.000055) * 0.035 : 0) +
          (motionOk && pointer.active ? pointer.ny * 0.055 : 0),
        rotationY:
          (motionOk ? Math.sin(time * 0.00007) * 0.11 : 0) +
          (motionOk && pointer.active ? pointer.nx * 0.075 : 0),
      });
      ctx.restore();
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-[100svh] w-full opacity-90"
      aria-hidden="true"
    />
  );
}
