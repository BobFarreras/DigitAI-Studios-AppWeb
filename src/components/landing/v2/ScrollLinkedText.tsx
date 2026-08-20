/**
 * @file src/components/landing/v2/ScrollLinkedText.tsx
 * @updated 2026-08-19
 * @summary Paragraf gran que s'il·lumina paraula a paraula lligat al progres d'scroll.
 * @scope Tipografia animada de la landing; sense logica de negoci.
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

type Props = {
  children: string;
  className?: string;
  /** Color de les paraules ja revelades. */
  bright?: string;
  /** Paraules que es pinten amb l'accent ambre. */
  highlight?: readonly string[];
};

type WordProps = {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  bright: string;
};

function Word({ word, range, progress, bright }: WordProps) {
  const color = useTransform(progress, range, ['rgba(255,255,255,0.16)', bright]);
  const filter = useTransform(progress, range, ['blur(4px)', 'blur(0px)']);
  const y = useTransform(progress, range, ['0.1em', '0em']);

  return (
    <motion.span style={{ color, filter, y }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

export function ScrollLinkedText({ children, className = '', bright = '#ffffff', highlight = [] }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.25'] });
  const words = children.split(' ');
  const normalized = highlight.map((item) => item.toLowerCase());

  return (
    <p
      ref={ref}
      className={`text-[clamp(26px,4.4vw,60px)] font-extralight leading-[1.15] tracking-[-0.03em] ${className}`}
    >
      {words.map((word, index) => {
        const start = index / words.length;
        const end = Math.min(1, start + 1.7 / words.length);
        const isHighlight = normalized.includes(word.toLowerCase().replace(/[.,;:!?]/g, ''));
        return (
          <Word
            key={`${word}-${index}`}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
            bright={isHighlight ? '#ffb829' : bright}
          />
        );
      })}
    </p>
  );
}
