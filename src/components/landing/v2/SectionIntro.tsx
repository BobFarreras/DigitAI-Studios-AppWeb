/**
 * @file src/components/landing/v2/SectionIntro.tsx
 * @updated 2026-08-19
 * @summary Capcalera de seccio reutilitzable: index, eyebrow ambre, titol gran i cos ultralleuger.
 * @scope Composicio tipografica de la landing; sense logica de negoci.
 */
"use client";

import { motion } from "framer-motion";
import { ScrollRevealText } from "./ScrollRevealText";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  size?: "heading-lg" | "heading";
};

export function SectionIntro({
  index,
  eyebrow,
  title,
  description,
  className = "",
  size = "heading-lg",
}: Props) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-7 flex items-center gap-4"
      >
        {index && (
          <span className="text-[11px] tabular-nums tracking-[0.2em] text-[#3f3f3f]">
            {index}
          </span>
        )}
        <span className="h-px w-10 bg-[#ffb829]/50" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-[#ffb829] sm:text-[12px]">
          {eyebrow}
        </span>
      </motion.div>

      <ScrollRevealText
        as="h2"
        size={size}
        weight={400}
        color="var(--dala-text)"
      >
        {title}
      </ScrollRevealText>

      {description && (
        <ScrollRevealText
          as="p"
          size="body"
          weight={200}
          color="var(--dala-muted)"
          delay={0.28}
          className="mt-7 max-w-xl"
        >
          {description}
        </ScrollRevealText>
      )}
    </div>
  );
}
