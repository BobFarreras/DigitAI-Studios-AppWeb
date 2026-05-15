/**
 * @file src/components/landing/v2/TrainingSection.tsx
 * @updated 2026-05-14
 * @summary Seccio minimalista de formacio per a la landing V2.
 * @scope Presentar formats formatius i CTA de registre.
 */
'use client';

import { motion, type Variants } from 'framer-motion';
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
const trainingReveal: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const titleReveal: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] } },
};
const formatReveal: Variants = {
  hidden: { opacity: 0, y: 42, rotateX: 8, transformPerspective: 900 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.86, ease: [0.22, 1, 0.36, 1] } },
};

export function TrainingSection() {
  const t = useTranslations('LandingV2.training');

  return (
    <section id="formacio" className="relative isolate flex min-h-[100svh] overflow-visible bg-transparent px-4 py-[76px] pb-[92px] text-[#08090a] dark:text-[#f7f8f8] sm:px-6 sm:pb-[76px] lg:overflow-hidden lg:px-8">
      <motion.div variants={trainingReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.28, margin: '-4% 0px -20% 0px' }} className="mx-auto flex w-full max-w-7xl flex-col justify-center">
        <motion.div variants={titleReveal} className="flex flex-col items-center gap-5 text-center">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
              {t('titleStrong')}
              <BrandRevealText className="block text-[#383b3f] dark:text-[#8a8f98] md:!inline-grid">
                {' '}{t('titleMuted')}
              </BrandRevealText>
            </h2>
          </div>
        </motion.div>

        <motion.div variants={trainingReveal} className="mt-5 grid min-h-0 gap-2 overflow-visible bg-white/48 backdrop-blur-[2px] dark:bg-[#111315]/36 sm:mt-10 lg:h-[clamp(340px,48svh,470px)] lg:grid-cols-3 lg:gap-0">
          {formats.map((item, index) => {
            return (
              <motion.div key={item.key} variants={formatReveal} className="min-h-0">
                <motion.article initial="rest" animate="rest" whileHover="hover" className="linear-panel group grid h-full min-h-[136px] grid-cols-[82px_1fr] items-center gap-3 px-3 py-3 [filter:grayscale(.82)_saturate(.18)_contrast(.94)_brightness(1.02)] transition-[filter,border-color] duration-300 dark:[filter:grayscale(1)_saturate(.18)_contrast(.9)_brightness(1.22)] sm:min-h-[132px] sm:grid-cols-[104px_1fr] sm:px-5 lg:min-h-0 lg:grid-cols-none lg:grid-rows-[minmax(130px,1fr)_154px] lg:gap-0 lg:px-6 lg:py-7">
                  <div className="flex h-20 min-h-0 items-center justify-center overflow-hidden sm:h-24 lg:h-auto lg:pb-4">
                    <TrainingFigure variant={item.figure} index={index} />
                  </div>
                  <div className="flex min-w-0 flex-col rounded-[6px] px-1 py-1 sm:px-2 lg:items-center lg:px-0 lg:py-0 lg:text-center">
                    <h3 className="text-[14px] font-[650] leading-tight text-[#08090a] dark:text-[#d0d6e0] sm:text-[15px] lg:text-[20px]">{t(`formats.${item.key}.title`)}</h3>
                    <p className="mt-1.5 text-[13px] font-[540] leading-[1.55] text-[#383b3f] dark:text-[#d0d6e0] sm:text-[13px] lg:mx-auto lg:mt-2 lg:line-clamp-3 lg:min-h-[64px] lg:max-w-[340px] lg:text-[15px] lg:text-[#62666d] lg:dark:text-[#8a8f98]">{t(`formats.${item.key}.desc`)}</p>
                    {item.figure === 'grid' ? <div className="mt-2 inline-flex justify-start lg:mt-4 lg:justify-center"><BrandRevealButton href="/#contacte" label={t('registerCta')} /></div> : <div className="hidden lg:mt-4 lg:block lg:h-9" />}
                  </div>
                </motion.article>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
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
