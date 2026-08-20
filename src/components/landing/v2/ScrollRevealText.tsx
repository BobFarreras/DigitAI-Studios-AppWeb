/**
 * @file src/components/landing/v2/ScrollRevealText.tsx
 * @updated 2026-08-19
 * @summary Titol que apareix paraula a paraula des de darrere d'una mascara quan entra a pantalla.
 * @scope Tipografia animada de la landing; sense logica de negoci.
 */
"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type Props = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  size?:
    | "display"
    | "heading-lg"
    | "heading"
    | "heading-sm"
    | "subheading"
    | "body"
    | "label";
  weight?: 200 | 400 | 600;
  color?: string;
  delay?: number;
  stagger?: number;
  viewportMargin?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  display: "text-[clamp(36px,6.4vw,96px)] leading-[0.98] tracking-[-0.045em]",
  "heading-lg":
    "text-[clamp(32px,4.8vw,66px)] leading-[1.02] tracking-[-0.04em]",
  heading: "text-[clamp(32px,5vw,48px)] leading-[1.05] tracking-[-0.035em]",
  "heading-sm": "text-[clamp(26px,4vw,42px)] leading-[1.15] tracking-[-0.03em]",
  subheading: "text-[clamp(22px,3vw,36px)] leading-[1.2] tracking-[-0.02em]",
  body: "text-[clamp(16px,1.4vw,18px)] leading-[1.6]",
  label: "text-[12px] leading-[1.2] tracking-[0.22em] uppercase sm:text-[13px]",
};

const weightClasses: Record<NonNullable<Props["weight"]>, string> = {
  200: "font-extralight",
  400: "font-normal",
  600: "font-semibold",
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, rotate: 2.5, filter: "blur(6px)" },
  show: {
    y: "0%",
    opacity: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ScrollRevealText({
  children,
  className = "",
  as = "h2",
  size = "heading",
  weight = 400,
  color = "#ffffff",
  delay = 0,
  stagger = 0.045,
  viewportMargin = "-8% 0px -12% 0px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: viewportMargin as `${number}px ${number}px ${number}px ${number}px`,
  });
  const Tag = as;
  const words = children.split(" ");

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      <Tag
        className={`${sizeClasses[size]} ${weightClasses[weight]}`}
        style={{ color }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-flex overflow-hidden pb-[0.12em] pr-[0.24em] align-bottom"
          >
            <motion.span
              variants={wordVariants}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
