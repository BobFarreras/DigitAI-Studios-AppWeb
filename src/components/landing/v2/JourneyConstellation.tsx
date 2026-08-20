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
import { getJourneyScene, morphJourneyNode } from "./fx/journey-motion";

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
      const scene = getJourneyScene(height);
      const pointer = getPointer();
      const shaped = nodes.map((node, index) =>
        morphJourneyNode(node, index, scene, radius, nodes.length),
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
