/**
 * @file src/components/landing/v2/ServiceImpactDemo.tsx
 * @updated 2026-08-20
 * @summary Microdemostracions animades del resultat de cada servei del carrusel.
 * @scope Presentacio visual sense dades reals ni logica de negoci.
 */
"use client";

import { motion } from "framer-motion";

type Props = {
  variant: 0 | 1 | 2;
  value: string;
  label: string;
  steps: string[];
};

const transition = {
  duration: 2.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function ServiceImpactDemo({ variant, value, label, steps }: Props) {
  return (
    <div className="mt-5 grid grid-cols-[0.64fr_1.36fr] gap-4 border-t border-[var(--dala-border)] pt-5 md:mt-10 md:grid-cols-[0.72fr_1.28fr] md:gap-7 md:pt-7">
      <div>
        <motion.strong
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.8 }}
          className="block text-[clamp(32px,5vh,46px)] font-normal leading-none tracking-[-0.04em] text-[var(--dala-text)] md:text-[clamp(46px,5vw,72px)]"
        >
          {value}
        </motion.strong>
        <span className="mt-2 block max-w-40 text-[12px] font-normal leading-snug text-[var(--dala-muted)] md:mt-3 md:text-[14px]">
          {label}
        </span>
      </div>

      <div className="relative min-h-28 overflow-hidden rounded-[14px] bg-[var(--dala-demo)] p-3 md:min-h-32 md:rounded-[18px] md:p-4">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            animate={
              variant === 0
                ? { x: [0, 8, 0], opacity: [0.45, 1, 0.45] }
                : variant === 1
                  ? { scaleX: [0.28, 1, 0.28] }
                  : { y: [0, -4, 0], opacity: [0.5, 1, 0.5] }
            }
            transition={{ ...transition, delay: index * 0.46 }}
            className={[
              "relative mb-2 flex min-h-6 origin-left items-center text-[11px] font-normal leading-tight text-[var(--dala-muted)] last:mb-0 md:mb-2.5 md:min-h-7 md:text-[13px]",
              variant === 1
                ? "rounded-[4px] bg-[#8052ff]/20 px-3"
                : "border-b border-[var(--dala-border)] px-1 pb-2.5",
            ].join(" ")}
          >
            <motion.span
              animate={{ scale: [0.7, 1.25, 0.7], opacity: [0.45, 1, 0.45] }}
              transition={{ ...transition, delay: index * 0.46 }}
              className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8052ff]"
            />
            {step}
          </motion.div>
        ))}
        {variant === 0 && (
          <motion.span
            animate={{ top: [16, 104, 16] }}
            transition={transition}
            className="absolute right-3 h-2 w-2 rounded-full bg-[#ffb829] shadow-[0_0_18px_rgba(255,184,41,0.7)]"
          />
        )}
      </div>
    </div>
  );
}
