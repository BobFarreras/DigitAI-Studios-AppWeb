/**
 * @file src/components/landing/v2/TrainingSection.tsx
 * @updated 2026-05-14
 * @summary Seccio minimalista de formacio per a la landing V2.
 * @scope Presentar formats formatius i CTA de registre.
 */
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BrandRevealButton, BrandRevealText } from '@/components/ui/brand-reveal';

const formats = [
  {
    key: 'teams',
    figure: 'path',
  },
  {
    key: 'private',
    figure: 'focus',
  },
  {
    key: 'academy',
    figure: 'grid',
  },
] as const;

export function TrainingSection() {
  const t = useTranslations('LandingV2.training');

  return (
    <section id="formacio" className="relative isolate min-h-[100svh] overflow-hidden bg-transparent px-4 py-[76px] text-[#08090a] dark:text-[#f7f8f8] sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
              {t('titleStrong')}
              <BrandRevealText className="max-md:!hidden text-[#383b3f] dark:text-[#8a8f98] md:!inline-grid">
                {' '}{t('titleMuted')}
              </BrandRevealText>
            </h2>
          </div>
        </div>

        <div className="mt-9 grid min-h-0 overflow-visible bg-white/34 backdrop-blur-[2px] dark:bg-[#08090a]/34 sm:mt-10 lg:h-[clamp(340px,48svh,470px)] lg:grid-cols-3">
          {formats.map((item, index) => {
            return (
              <motion.article
                key={item.key}
                initial="rest"
                animate="rest"
                whileHover="hover"
                className="linear-panel group grid min-h-0 grid-rows-[minmax(130px,1fr)_154px] px-4 py-4 transition-colors duration-300 hover:bg-white/84 dark:hover:bg-[#161718] sm:min-h-[300px] sm:px-5 lg:min-h-0 lg:px-6 lg:py-7"
              >
                <div className="flex min-h-0 items-center justify-center overflow-hidden pb-4">
                  <TrainingFigure variant={item.figure} index={index} />
                </div>
                <div className="flex min-w-0 flex-col items-center rounded-[6px] px-1 py-1 text-center sm:px-2 lg:px-0 lg:py-0">
                  <h3 className="text-[18px] font-[590] leading-tight text-[#08090a] dark:text-[#d0d6e0] sm:text-[20px]">{t(`formats.${item.key}.title`)}</h3>
                  <p className="mx-auto mt-2 min-h-[64px] max-w-[340px] text-[14px] leading-[1.45] text-[#62666d] dark:text-[#8a8f98] lg:text-[15px]">{t(`formats.${item.key}.desc`)}</p>
                  {item.figure === 'grid' ? (
                    <div className="mt-4 inline-flex justify-center">
                      <BrandRevealButton href="/#contacte" label={t('registerCta')} />
                    </div>
                  ) : <div className="mt-4 h-9" />}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrainingFigure({ variant, index }: { variant: string; index: number }) {
  if (variant === 'focus') return <FocusFigure index={index} />;
  if (variant === 'grid') return <GridFigure index={index} />;
  return <PathFigure index={index} />;
}

function PathFigure({ index }: { index: number }) {
  return (
    <motion.svg viewBox="-24 -24 308 268" className="h-full max-h-[250px] w-full max-w-[300px] overflow-visible drop-shadow-[0_14px_24px_rgba(8,9,10,0.18)]" variants={{ hover: { scale: 1.08, rotateZ: -2 } }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} aria-hidden>
      {[0, 1, 2, 3].map((step) => (
        <motion.path key={step} className={step <= index ? 'linear-figure-accent' : 'linear-figure-line'} d={`M54 ${166 - step * 34} L116 ${132 - step * 20} L176 ${156 - step * 26} L224 ${112 - step * 22}`} variants={{ rest: { opacity: 0.55 + step * 0.08, pathLength: 1 }, hover: { pathLength: [0.35, 1, 0.35], opacity: 0.95, transition: { duration: 1.6, delay: step * 0.08, repeat: Infinity } } }} />
      ))}
      {[54, 116, 176, 224].map((x, step) => <motion.circle key={x} cx={x} cy={166 - step * 26} r="12" className={step <= index ? 'linear-figure-accent' : 'linear-figure-line'} variants={{ hover: { scale: [1, 1.15, 1], transition: { duration: 1.4, delay: step * 0.1, repeat: Infinity } } }} />)}
    </motion.svg>
  );
}

function FocusFigure({ index }: { index: number }) {
  return (
    <motion.svg viewBox="-24 -24 308 268" className="h-full max-h-[250px] w-full max-w-[300px] overflow-visible drop-shadow-[0_14px_24px_rgba(8,9,10,0.18)]" variants={{ hover: { scale: 1.08, rotateZ: 2 } }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} aria-hidden>
      {[0, 1, 2].map((ring) => <motion.circle key={ring} cx="130" cy="112" r={42 + ring * 30} className={ring === index ? 'linear-figure-accent' : 'linear-figure-line'} variants={{ rest: { opacity: 0.35 + ring * 0.18 }, hover: { r: [42 + ring * 30, 48 + ring * 32, 42 + ring * 30], opacity: [0.35, 0.9, 0.35], transition: { duration: 1.8, delay: ring * 0.12, repeat: Infinity } } }} />)}
      <motion.path className="linear-figure-accent" d="M102 112 H158 M130 84 V140" variants={{ hover: { rotate: [0, 90, 180], transition: { duration: 2.2, repeat: Infinity, ease: 'linear' } } }} style={{ transformOrigin: '130px 112px' }} />
    </motion.svg>
  );
}

function GridFigure({ index }: { index: number }) {
  return (
    <motion.svg viewBox="0 0 260 220" className="h-full max-h-[230px] w-full max-w-[260px] overflow-visible drop-shadow-[0_14px_24px_rgba(8,9,10,0.18)]" variants={{ hover: { scale: 1.04, rotateZ: -2 } }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} aria-hidden>
      {Array.from({ length: 9 }).map((_, cell) => {
        const x = 47 + (cell % 3) * 56, y = 38 + Math.floor(cell / 3) * 50;
        return <motion.rect key={cell} x={x} y={y} width="38" height="34" rx="5" className={(cell + index) % 4 === 0 ? 'linear-figure-accent' : 'linear-figure-line'} variants={{ hover: { y: [y, y - 8, y], opacity: [0.45, 0.95, 0.45], transition: { duration: 1.5, delay: cell * 0.04, repeat: Infinity } } }} />;
      })}
      <motion.path className="linear-figure-line" d="M66 72 V92 M122 72 V92 M178 72 V92 M85 55 H105 M141 55 H161 M85 105 H105 M141 105 H161" variants={{ hover: { opacity: [0.25, 0.9, 0.25], transition: { duration: 1.7, repeat: Infinity } } }} />
    </motion.svg>
  );
}
