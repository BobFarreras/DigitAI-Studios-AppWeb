/**
 * @file src/components/landing/v2/custom-software/DashboardView.tsx
 * @updated 2026-05-13
 * @summary Vista dashboard del simulador SAT.
 * @scope KPI, tendències i accions ràpides del producte.
 */
'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus, UserPlus } from 'lucide-react';
import type { SoftwareCopy } from './copy';
import { IncidentDualChart, RevenueSpark, SlaRadar, WorkloadBars } from './FuturisticCharts';
import { useSoftwareText } from './software-i18n';

type Props = { copy: SoftwareCopy; onOpenCrm: () => void; onAddJob: () => void; onAddClient: () => void };
const quotes = { sent: 42, accepted: 27, rejected: 8, pending: 7 };

export function DashboardView({ copy, onOpenCrm, onAddJob, onAddClient }: Props) {
  const ui = useSoftwareText();
  const [trendFocus, setTrendFocus] = useState<'all' | 'inc' | 'avg'>('all');
  const conversion = Math.round((quotes.accepted / quotes.sent) * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid h-full grid-cols-12 gap-3 overflow-auto pr-1">
      <article className="group col-span-12 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all dark:border-[#23252a] dark:bg-[#161718]/88">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.title}</h4>
          <span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.subtitle}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-[11px] lg:grid-cols-3">
          <MetricCard label={copy.revenue} value="€ 128.4k" sub={ui.locale === 'en' ? '+8.4% monthly' : ui.locale === 'es' ? '+8.4% mensual' : ui.locale === 'it' ? '+8.4% mensile' : '+8.4% mensual'} chart={<RevenueSpark />} />
          <MetricCard label={copy.sla} value="97.2%" sub={ui.locale === 'en' ? '31 / 34 within SLA' : ui.locale === 'it' ? '31 / 34 entro SLA' : '31 / 34 dins SLA'} chart={<SlaRadar />} />
          <MetricCard label={copy.workload} value="84%" sub={ui.locale === 'en' ? '22 / 26 active' : ui.locale === 'es' ? '22 / 26 activas' : ui.locale === 'it' ? '22 / 26 attive' : '22 / 26 actives'} chart={<WorkloadBars />} />
        </div>
      </article>

      <div className="col-span-12 grid gap-3 lg:col-span-8">
        <article className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.quotes}</h4>
            <span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.conversion}: {conversion}%</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[13px]">
            <SmallCard label={copy.sent} value={quotes.sent} pct={100} />
            <SmallCard label={copy.accepted} value={quotes.accepted} pct={64} />
            <SmallCard label={copy.rejected} value={quotes.rejected} pct={19} />
            <SmallCard label={copy.pending} value={quotes.pending} pct={17} />
          </div>
        </article>

        <article className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.incidentTrend}</h4>
            <div className="flex items-center gap-2 text-[12px]">
              <button onMouseEnter={() => setTrendFocus('inc')} onMouseLeave={() => setTrendFocus('all')} className={`inline-flex items-center gap-2 rounded-[5px] border px-2 py-1 ${trendFocus === 'inc' ? 'border-[#8a8cff] text-[#8a8cff]' : 'border-[#c0c8d5] text-[#8a8f98]'}`}><span className="h-1.5 w-4 rounded-full bg-[#8a8cff]" />{copy.incidents}</button>
              <button onMouseEnter={() => setTrendFocus('avg')} onMouseLeave={() => setTrendFocus('all')} className={`inline-flex items-center gap-2 rounded-[5px] border px-2 py-1 ${trendFocus === 'avg' ? 'border-[#87f1c9] text-[#87f1c9]' : 'border-[#c0c8d5] text-[#8a8f98]'}`}><span className="h-1.5 w-4 rounded-full bg-[#87f1c9]" />{copy.avgTime}</button>
            </div>
          </div>
          <div className="h-[250px] transition-all duration-500">
            <IncidentDualChart focus={trendFocus} />
          </div>
        </article>
      </div>

      <div className="col-span-12 flex flex-col gap-3 lg:col-span-4">
        <article className="group flex-1 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.crmHealth}</h4>
            <button onClick={onOpenCrm} className="rounded-[5px] border border-[#c0c8d5] bg-white px-2 py-1 text-[11px] dark:border-[#323334] dark:bg-[#08090a]">{copy.crmCta}</button>
          </div>
          <div className="grid h-[calc(100%-28px)] grid-cols-2 gap-2">
            <CrmMetric title={ui.locale === 'en' ? 'Active alerts' : ui.locale === 'es' ? 'Avisos activos' : ui.locale === 'it' ? 'Avvisi attivi' : 'Avisos actius'} value="18" tone="violet" />
            <CrmMetric title={ui.locale === 'en' ? 'Communities' : ui.locale === 'es' ? 'Comunidades' : ui.locale === 'it' ? 'Condomini' : 'Comunitats'} value="34" tone="blue" />
            <CrmMetric title={ui.locale === 'en' ? 'Daily visits' : ui.locale === 'es' ? 'Visitas al día' : ui.locale === 'it' ? 'Visite al giorno' : 'Visites al dia'} value="76%" tone="green" />
            <CrmMetric title={ui.locale === 'en' ? 'Complete records' : ui.locale === 'es' ? 'Fichas completas' : ui.locale === 'it' ? 'Schede complete' : 'Fitxes completes'} value="91%" tone="cyan" />
          </div>
        </article>

        <article className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all dark:border-[#23252a] dark:bg-[#161718]/88">
          <h4 className="mb-2 text-[15px] font-semibold text-[#383b3f] dark:text-[#d0d6e0]">{copy.quick}</h4>
          <button onClick={onAddJob} className="mb-2 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#e4f222] px-3 py-2 text-[12px] font-semibold text-[#08090a]"><PackagePlus className="h-4 w-4" />{ui.t('createSatOrder')}</button>
          <button onClick={onAddClient} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><UserPlus className="h-4 w-4" />{ui.t('addClient')}</button>
        </article>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, sub, chart }: { label: string; value: string; sub: string; chart: ReactNode }) {
  return (
    <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 transition-all duration-500 dark:border-[#323334] dark:bg-[#08090a]">
      <div className="grid grid-cols-[minmax(108px,130px)_1fr] gap-2">
        <div><p className="text-[12px] text-[#8a8f98]">{label}</p><p className="text-2xl font-semibold">{value}</p><p className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{sub}</p></div>
        <div className="h-[120px] min-w-0">{chart}</div>
      </div>
    </div>
  );
}
function SmallCard({ label, value, pct }: { label: string; value: number; pct: number }) {
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 transition-all duration-500 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[#62666d] dark:text-[#8a8f98]">{label}</p><p className="text-[30px] font-semibold leading-none">{value}</p><p className="text-[12px] text-[#8a8f98]">{pct}% del total</p><div className="h-1.5 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#5e6ad2] to-[#a855f7]" style={{ width: `${pct}%` }} /></div></div>;
}
function CrmMetric({ title, value, tone }: { title: string; value: string; tone: 'violet' | 'blue' | 'green' | 'cyan' }) {
  const grad = tone === 'violet' ? 'from-[#8a8cff] to-[#a855f7]' : tone === 'blue' ? 'from-[#5e6ad2] to-[#7db4ff]' : tone === 'green' ? 'from-[#27a644] to-[#87f1c9]' : 'from-[#35b8e8] to-[#87f1c9]';
  const pct = parseInt(value.replace('%', ''), 10) || 0;
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 transition-all duration-500 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[12px] text-[#8a8f98]">{title}</p><p className="text-2xl font-semibold">{value}</p><div className="mt-1 h-2 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className={`h-2 rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${Math.max(28, Math.min(100, pct))}%` }} /></div></div>;
}
