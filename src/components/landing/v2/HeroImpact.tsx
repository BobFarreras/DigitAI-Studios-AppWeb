/**
 * @file src/components/landing/v2/HeroImpact.tsx
 * @updated 2026-05-11
 * @summary Hero A: Product Console amb proposta de valor clara i demo operativa animada.
 * @scope Primera seccio de landing per explicar valor en 5-10 segons.
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const rows = [
  { key: 'leadCapture', status: 'captured', latency: '2s' },
  { key: 'crmSync', status: 'synced', latency: '4s' },
  { key: 'followUp', status: 'processing', latency: '12s' },
  { key: 'bookingUpdate', status: 'completed', latency: '6s' }
] as const;

export function HeroImpact() {
  const t = useTranslations('LandingV2.hero');

  return (
    <section className="linear-shell relative overflow-hidden px-6 pb-16 pt-28 md:px-10 lg:px-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_14%,rgba(94,106,210,0.18),transparent_34%)]" />

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="mb-4 inline-flex items-center gap-2 rounded-[6px] border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[#5e6ad2]" /> {t('badge')}
          </p>

          <h1 className="max-w-4xl text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.22px] text-foreground sm:text-[52px] lg:text-[68px]">
            {t('title')}
          </h1>

          <p className="linear-muted mt-5 max-w-2xl text-[16px] leading-[1.5] sm:text-[18px]">{t('subtitle')}</p>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="linear-surface-1 rounded-[6px] px-3 py-2">
                <p className="text-[12px] font-medium text-foreground">{t(`outcome${i}.title`)}</p>
                <p className="linear-meta mt-0.5 text-[11px]">{t(`outcome${i}.desc`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#contact">
              <Button size="lg" className="linear-cta w-full rounded-[6px] px-6 py-3 text-[15px] font-semibold sm:w-auto">
                {t('primaryCta')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#services">
              <Button size="lg" variant="ghost" className="w-full rounded-[6px] border border-border bg-card px-6 py-3 text-foreground hover:bg-accent sm:w-auto">
                {t('secondaryCta')}
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }} className="linear-surface-1 relative rounded-[6px] p-3">
          <div className="mb-2 flex items-center justify-between rounded-[4px] border border-border bg-background px-3 py-2">
            <p className="text-[11px] text-muted-foreground">{t('console.title')}</p>
            <p className="text-[11px] text-[#5e6ad2]">{t('console.live')}</p>
          </div>

          <div className="rounded-[6px] border border-border bg-background p-2.5">
            <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2 px-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span>{t('console.columns.step')}</span>
              <span>{t('console.columns.status')}</span>
              <span>{t('console.columns.latency')}</span>
            </div>
            <div className="space-y-1.5">
              {rows.map((row, i) => (
                <motion.div
                  key={row.key}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-[4px] border border-border bg-card px-2.5 py-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="text-[12px] text-foreground">{t(`console.rows.${row.key}`)}</span>
                  <span
                    className={`rounded-[4px] px-1.5 py-0.5 text-[10px] uppercase ${
                      row.status === 'processing' ? 'bg-blue-500/12 text-blue-500' : 'bg-emerald-500/12 text-emerald-500'
                    }`}
                  >
                    {t(`console.status.${row.status}`)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{row.latency}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {['kpi1', 'kpi2', 'kpi3'].map((key) => (
              <div key={key} className="linear-surface-2 rounded-[6px] p-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t(`${key}.label`)}</p>
                <p className="mt-1 text-[18px] font-semibold text-foreground">{t(`${key}.value`)}</p>
              </div>
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute inset-x-2 top-[46px] h-px bg-gradient-to-r from-transparent via-[#5e6ad2]/45 to-transparent"
            animate={{ x: ['-18%', '18%', '-18%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="mt-3 flex items-center gap-2 rounded-[4px] border border-border bg-card px-2.5 py-2 text-[11px] text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {t('proofLine')}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
