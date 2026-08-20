/**
 * @file src/components/landing/v2/fx/Marquee.tsx
 * @updated 2026-08-19
 * @summary Cinta infinita que accelera i canvia de sentit segons la velocitat d'scroll.
 * @scope Efecte visual client-side; sense logica de negoci.
 */
'use client';

import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { useScrollBoost } from './usePointerMotion';

type Props = {
  items: readonly string[];
  /** Percentatge de recorregut per segon en repos. */
  speed?: number;
  className?: string;
};

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export function Marquee({ items, speed = 3.2, className = '' }: Props) {
  const base = useMotionValue(0);
  const boost = useScrollBoost();
  const x = useTransform(base, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    const velocity = boost.get();
    const direction = velocity < -0.015 ? -1 : 1;
    const acceleration = 1 + Math.abs(velocity) * 6;
    base.set(base.get() - (direction * speed * acceleration * delta) / 1000);
  });

  return (
    <div className={`relative flex overflow-hidden ${className}`} aria-hidden="true">
      <motion.div style={{ x }} className="flex shrink-0 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <span key={`${copy}-${item}-${index}`} className="flex shrink-0 items-center">
                <span className="px-8 text-[clamp(28px,5vw,64px)] font-extralight tracking-[-0.03em] text-white/70">
                  {item}
                </span>
                <span className="h-[6px] w-[6px] rotate-45 bg-[#8052ff]" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
