/**
 * @file src/components/landing/v2/custom-software/DashboardView.tsx
 * @updated 2026-05-13
 * @summary Vista dashboard del simulador SAT.
 * @scope KPI, tendencies i accessos rapids.
 */
'use client';
import { motion } from 'framer-motion';
import { PackagePlus, UserPlus } from 'lucide-react';
import type { SoftwareCopy } from './copy';

type Props = {
  copy: SoftwareCopy;
  onOpenCrm: () => void;
  onAddJob: () => void;
  onAddClient: () => void;
};

const quotes = { sent: 42, accepted: 27, rejected: 8, pending: 7 };
export function DashboardView({ copy, onOpenCrm, onAddJob, onAddClient }: Props) {
  const conversion = Math.round((quotes.accepted / quotes.sent) * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid h-[clamp(520px,64svh,730px)] grid-cols-12 grid-rows-6 gap-3">
      <article className="group col-span-12 row-span-2 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 saturate-[0.65] transition-all hover:saturate-100 dark:border-[#23252a] dark:bg-[#161718]/88">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.title}</h4>
          <span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.subtitle}</span>
        </div>
        <div className="grid h-[calc(100%-24px)] grid-cols-3 gap-2 text-[11px]">
          <MetricCard label={copy.revenue} value="€ 128.4k" sub="+8.4% mensual · Q2" />
          <MetricCard label={copy.sla} value="97.2%" sub="31 / 34 tickets dins SLA" />
          <MetricCard label={copy.workload} value="84%" sub="22 / 26 tasques actives" />
        </div>
      </article>
      <article className="group col-span-12 row-span-2 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 saturate-[0.65] transition-all hover:saturate-100 dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-7">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.quotes}</h4>
          <span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.conversion}: {conversion}%</span>
        </div>
        <div className="grid h-[calc(100%-24px)] grid-cols-4 gap-2 text-[13px]">
          <SmallCard label={copy.sent} value={quotes.sent} pct={100} />
          <SmallCard label={copy.accepted} value={quotes.accepted} pct={64} />
          <SmallCard label={copy.rejected} value={quotes.rejected} pct={19} />
          <SmallCard label={copy.pending} value={quotes.pending} pct={17} />
        </div>
      </article>
      <article className="group col-span-12 row-span-2 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 saturate-[0.65] transition-all hover:saturate-100 dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-5">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.crmHealth}</h4>
          <button onClick={onOpenCrm} className="rounded-[5px] border border-[#c0c8d5] bg-white px-2 py-1 text-[11px] dark:border-[#323334] dark:bg-[#08090a]">{copy.crmCta}</button>
        </div>
        <div className="grid h-[calc(100%-24px)] grid-cols-2 gap-2">
          <SmallMetric title="Leads actius" value="18" />
          <SmallMetric title="Clients actius" value="34" />
          <SmallMetric title="Follow-up al dia" value="76%" />
          <SmallMetric title="Dades completes" value="91%" />
        </div>
      </article>
      <article className="group col-span-12 row-span-2 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 saturate-[0.65] transition-all hover:saturate-100 dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-8">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.incidentTrend}</h4>
          <span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.avgTime}: 72 min</span>
        </div>
        <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 text-[11px] dark:border-[#323334] dark:bg-[#08090a]">
          <p className="mb-1 text-[#8a8f98]">Dl 12 · Dt 9 · Dc 14 · Dj 8 · Dv 11 · Ds 7 · Dg 10</p>
          <p className="text-[#8a8f98]">84m · 73m · 96m · 62m · 70m · 58m · 64m</p>
          <div className="mt-2 h-2 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className="h-2 w-[69%] rounded-full bg-gradient-to-r from-[#5e6ad2] to-[#27a644]" /></div>
        </div>
      </article>
      <article className="group col-span-12 row-span-2 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 saturate-[0.65] transition-all hover:saturate-100 dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-4">
        <h4 className="mb-2 text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.quick}</h4>
        <button onClick={onAddJob} className="mb-2 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#e4f222] px-3 py-2 text-[12px] font-semibold text-[#08090a]"><PackagePlus className="h-4 w-4" />Crear ordre SAT</button>
        <button onClick={onAddClient} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><UserPlus className="h-4 w-4" />Afegir client</button>
      </article>
    </motion.div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[12px] text-[#8a8f98]">{label}</p><p className="text-xl font-semibold">{value}</p><p className="text-[11px] text-[#62666d] dark:text-[#8a8f98]">{sub}</p></div>;
}
function SmallMetric({ title, value }: { title: string; value: string }) {
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[12px] text-[#8a8f98]">{title}</p><p className="text-xl font-semibold">{value}</p></div>;
}
function SmallCard({ label, value, pct }: { label: string; value: number; pct: number }) {
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[#62666d] dark:text-[#8a8f98]">{label}</p><p className="text-2xl font-semibold">{value}</p><div className="h-1.5 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#5e6ad2] to-[#a855f7]" style={{ width: `${pct}%` }} /></div></div>;
}
