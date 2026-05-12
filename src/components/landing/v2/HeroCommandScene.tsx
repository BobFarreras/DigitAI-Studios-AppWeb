/**
 * @file src/components/landing/v2/HeroCommandScene.tsx
 * @updated 2026-05-12
 * @summary Tres panells visuals minimalistes inspirats en Linear.
 * @scope Renderitzar figures SVG animades i copy dels pilars del Hero.
 */
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const variants = ['stack', 'nodes', 'ramp'] as const;

export function HeroPillarGrid() {
  const t = useTranslations('LandingV2.hero');

  return (
    <div className="grid min-h-0 overflow-hidden border-y border-[#d0d6e0] bg-white/34 backdrop-blur-[2px] dark:border-[#23252a] dark:bg-[#08090a]/34 lg:h-[clamp(340px,48svh,470px)] lg:grid-cols-3">
      {variants.map((variant, index) => (
        <motion.article
          key={variant}
          initial="rest"
          animate="rest"
          whileHover="hover"
          className="linear-panel group grid min-h-0 grid-rows-[minmax(120px,1fr)_auto] border-b border-[#d0d6e0] px-4 py-4 transition-colors duration-300 hover:bg-white/84 dark:border-[#23252a] dark:hover:bg-[#161718] sm:min-h-[300px] sm:px-5 lg:min-h-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-7 lg:last:border-r-0"
        >
          <div className="flex min-h-0 items-center justify-center pb-4">
            <PillarFigure variant={variant} />
          </div>
          <div className="min-w-0 rounded-[6px] px-1 py-1 sm:px-2 lg:px-0 lg:py-0">
            <h2 className="text-[14px] font-[590] leading-tight text-[#08090a] dark:text-[#d0d6e0] sm:text-[15px]">
              {t(`pillars.${index}.title`)}
            </h2>
            <p className="mt-2 line-clamp-2 text-[12px] leading-[1.45] text-[#62666d] dark:text-[#8a8f98] sm:text-[13px] lg:line-clamp-3 lg:max-w-[320px] lg:text-[14px]">
              {t(`pillars.${index}.desc`)}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function PillarFigure({ variant }: { variant: (typeof variants)[number] }) {
  if (variant === 'nodes') return <NodesFigure />;
  if (variant === 'ramp') return <RampFigure />;
  return <StackFigure />;
}

function StackFigure() {
  return (
    <motion.svg
      viewBox="0 0 260 220"
      className="h-full max-h-[250px] w-full max-w-[300px] drop-shadow-[0_14px_24px_rgba(8,9,10,0.22)]"
      variants={{ hover: { rotateX: 10, rotateZ: -2, scale: 1.08 } }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((layer) => (
        <motion.path
          key={layer}
          className="linear-figure-line"
          d={`M40 ${88 + layer * 18} L130 ${42 + layer * 18} L220 ${88 + layer * 18} L130 ${134 + layer * 18} Z`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1 - layer * 0.12, y: [0, -3 - layer * 0.8, 0] }}
          variants={{ hover: { y: -layer * 7, opacity: 0.95 } }}
          transition={{ duration: 2.4, delay: layer * 0.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.path
        className="linear-figure-accent"
        d="M88 76 C96 54 164 54 172 76 M76 86 H184 M92 96 H168 M106 106 H154"
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </motion.svg>
  );
}

function NodesFigure() {
  const cubes = [
    'M78 62 L120 40 L162 62 L162 112 L120 136 L78 112 Z',
    'M38 106 L80 84 L122 106 L122 156 L80 180 L38 156 Z',
    'M138 108 L180 86 L222 108 L222 158 L180 182 L138 158 Z',
    'M92 152 L130 132 L168 152 L168 194 L130 214 L92 194 Z',
  ];

  return (
    <motion.svg
      viewBox="0 0 260 220"
      className="h-full max-h-[250px] w-full max-w-[300px] drop-shadow-[0_14px_24px_rgba(8,9,10,0.22)]"
      variants={{ hover: { scale: 1.08, rotateZ: 2 } }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      aria-hidden
    >
      {cubes.map((cube, index) => (
        <motion.path
          key={cube}
          className={index === 0 ? 'linear-figure-accent' : 'linear-figure-line'}
          d={cube}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{
            opacity: index === 0 ? 0.85 : 0.55,
            scale: [1, 1.025, 1],
            x: index % 2 === 0 ? [0, 3, 0] : [0, -3, 0],
            y: index % 2 === 0 ? [0, -3, 0] : [0, 3, 0],
          }}
          variants={{ hover: { scale: 1.1, opacity: 0.95 } }}
          transition={{ duration: 2.2, delay: index * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.path
        className="linear-figure-line"
        d="M120 136 V160 M122 130 L148 144 M112 138 L92 150"
        animate={{ pathLength: [0.35, 1, 0.35], opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

function RampFigure() {
  return (
    <motion.svg
      viewBox="0 0 260 220"
      className="h-full max-h-[250px] w-full max-w-[300px] drop-shadow-[0_14px_24px_rgba(8,9,10,0.22)]"
      variants={{ hover: { scale: 1.08, rotateZ: -4 } }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      aria-hidden
    >
      {Array.from({ length: 13 }).map((_, index) => (
        <motion.path
          key={index}
          className={index > 9 ? 'linear-figure-accent' : 'linear-figure-line'}
          d={`M46 ${168 - index * 6} L160 ${108 - index * 8} L214 ${136 - index * 4} L100 ${196 - index * 2} Z`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.25 + index * 0.045, x: [0, index * 0.55, 0], y: [0, -index * 0.18, 0] }}
          variants={{ hover: { x: index * 1.4, y: -index * 0.65, opacity: 0.92 } }}
          transition={{ duration: 2.1, delay: index * 0.055, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.svg>
  );
}
