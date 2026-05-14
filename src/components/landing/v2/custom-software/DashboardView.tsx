/**
 * @file src/components/landing/v2/custom-software/DashboardView.tsx
 * @updated 2026-05-13
 * @summary Vista dashboard operativa del software de lampisteria.
 * @scope KPI, tendències i accions ràpides del producte.
 */
'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Euro, PackagePlus, ShieldCheck, UserPlus, Users } from 'lucide-react';
import type { SoftwareCopy } from './copy';
import { IncidentDualChart } from './FuturisticCharts';
import { useSoftwareText } from './software-i18n';

type Props = { copy: SoftwareCopy; onOpenCrm: () => void; onAddJob: () => void; onAddClient: () => void };
const quotes = { sent: 42, accepted: 27, rejected: 8, pending: 7 };
const phrase = (locale: string, ca: string, es: string, en: string, it: string) => locale === 'en' ? en : locale === 'es' ? es : locale === 'it' ? it : ca;

export function DashboardView({ copy, onAddJob, onAddClient }: Props) {
  const ui = useSoftwareText();
  const [trendFocus, setTrendFocus] = useState<'all' | 'inc' | 'avg'>('all');
  const conversion = Math.round((quotes.accepted / quotes.sent) * 100);
  const quoteRows = [
    { label: copy.accepted, value: quotes.accepted, pct: 64, tone: 'bg-[#27a644]' },
    { label: copy.pending, value: quotes.pending, pct: 17, tone: 'bg-[#f59e0b]' },
    { label: copy.rejected, value: quotes.rejected, pct: 19, tone: 'bg-[#eb5757]' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid h-full grid-cols-12 gap-3 overflow-auto pr-1 text-[#08090a] dark:text-[#f7f8f8]">
      <article className="col-span-12 rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 dark:border-[#23252a] dark:bg-[#161718]/88">
        <div className="grid gap-2 md:grid-cols-3">
          <MetricCard icon={<Euro className="h-4 w-4" />} label={copy.revenue} value="€128.4k" sub={phrase(ui.locale, '+8.4% mensual', '+8.4% mensual', '+8.4% monthly', '+8.4% mensile')} tone="green" />
          <MetricCard icon={<ShieldCheck className="h-4 w-4" />} label={copy.sla} value="97.2%" sub={phrase(ui.locale, '31 de 34 dins termini', '31 de 34 dentro de plazo', '31 of 34 on time', '31 di 34 nei tempi')} tone="blue" />
          <MetricCard icon={<Users className="h-4 w-4" />} label={copy.workload} value="84%" sub={phrase(ui.locale, '22 de 26 serveis actius', '22 de 26 servicios activos', '22 of 26 active jobs', '22 di 26 lavori attivi')} tone="violet" />
        </div>
      </article>

      <section className="col-span-12 grid gap-3 lg:col-span-8">
        <article className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-4 dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-[16px] font-semibold">{copy.incidentTrend}</h4>
            <div className="flex shrink-0 items-center gap-2 text-[12px]">
              <Legend active={trendFocus !== 'avg'} color="bg-[#8a8cff]" label={copy.incidents} onEnter={() => setTrendFocus('inc')} onLeave={() => setTrendFocus('all')} />
              <Legend active={trendFocus !== 'inc'} color="bg-[#12a87b]" label={copy.avgTime} onEnter={() => setTrendFocus('avg')} onLeave={() => setTrendFocus('all')} />
            </div>
          </div>
          <div className="h-[228px]"><IncidentDualChart focus={trendFocus} /></div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <Insight label={phrase(ui.locale, 'Pic de feina', 'Pico de trabajo', 'Workload peak', 'Picco lavoro')} value="Dc · 14" />
            <Insight label={phrase(ui.locale, 'Millor temps', 'Mejor tiempo', 'Best time', 'Tempo migliore')} value="58m" />
            <Insight label={phrase(ui.locale, 'Risc actual', 'Riesgo actual', 'Current risk', 'Rischio attuale')} value="2 SLA" />
          </div>
        </article>
        <article className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 dark:border-[#23252a] dark:bg-[#161718]/88">
          <h4 className="mb-2 text-[16px] font-semibold">{copy.crmHealth}</h4>
          <div className="grid gap-2 md:grid-cols-3">
            <HealthRow label={phrase(ui.locale, 'Avisos actius', 'Avisos activos', 'Active alerts', 'Avvisi attivi')} value="18" detail={phrase(ui.locale, '6 requereixen trucada avui', '6 requieren llamada hoy', '6 need a call today', '6 richiedono chiamata oggi')} />
            <HealthRow label={phrase(ui.locale, 'Fitxes completes', 'Fichas completas', 'Complete records', 'Schede complete')} value="91%" detail={phrase(ui.locale, 'Dades de contacte i historial al dia', 'Contacto e historial al día', 'Contact and history up to date', 'Contatti e storico aggiornati')} />
            <HealthRow label={phrase(ui.locale, 'Visites programades', 'Visitas programadas', 'Scheduled visits', 'Visite programmate')} value="34" detail={phrase(ui.locale, 'Comunitats i empreses recurrents', 'Comunidades y empresas recurrentes', 'Recurring communities and companies', 'Condomini e aziende ricorrenti')} />
          </div>
        </article>
      </section>

      <aside className="col-span-12 grid gap-3 lg:col-span-4">
        <article className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-4 dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-3 flex items-center justify-between gap-3"><h4 className="text-[16px] font-semibold">{copy.quotes}</h4><span className="rounded-[6px] bg-[#e4f222] px-2.5 py-1 text-[12px] font-bold text-[#08090a]">{copy.conversion} {conversion}%</span></div>
          <div className="grid grid-cols-[88px_1fr] gap-3">
            <div className="flex flex-col justify-between rounded-[7px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]"><span className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{copy.sent}</span><strong className="text-[34px] leading-none">{quotes.sent}</strong></div>
            <div className="grid gap-2">{quoteRows.map((row) => <QuoteRow key={row.label} {...row} />)}</div>
          </div>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#d8dde7] dark:bg-[#23252a]">{quoteRows.map((row) => <span key={row.label} className={row.tone} style={{ width: `${row.pct}%` }} />)}</div>
        </article>
        <article className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 dark:border-[#23252a] dark:bg-[#161718]/88">
          <h4 className="mb-2 text-[16px] font-semibold">{copy.quick}</h4>
          <div className="grid gap-2">
            <button onClick={onAddJob} className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#e4f222] px-3 py-2 text-[12px] font-semibold text-[#08090a]"><PackagePlus className="h-4 w-4" />{ui.t('createSatOrder')}</button>
            <button onClick={onAddClient} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] font-semibold dark:border-[#323334] dark:bg-[#08090a]"><UserPlus className="h-4 w-4" />{ui.t('addClient')}</button>
          </div>
        </article>
      </aside>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, sub, tone }: { icon: ReactNode; label: string; value: string; sub: string; tone: 'green' | 'blue' | 'violet' }) { const color = tone === 'green' ? 'text-[#27a644]' : tone === 'blue' ? 'text-[#35b8e8]' : 'text-[#8a8cff]'; return <div className="flex items-center gap-3 rounded-[7px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]"><div className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#f4f6fa] ${color} dark:bg-[#161718]`}>{icon}</div><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium text-[#62666d] dark:text-[#8a8f98]">{label}</p><div className="mt-0.5 flex items-baseline justify-between gap-2"><strong className="text-[22px] leading-none">{value}</strong><span className="text-right text-[11px] text-[#62666d] dark:text-[#8a8f98]">{sub}</span></div></div></div>; }
function Legend({ active, color, label, onEnter, onLeave }: { active: boolean; color: string; label: string; onEnter: () => void; onLeave: () => void }) { return <button onMouseEnter={onEnter} onMouseLeave={onLeave} className={`inline-flex items-center gap-2 rounded-[6px] border px-2.5 py-1.5 ${active ? 'border-[#8a8f98] text-[#d0d6e0]' : 'border-[#323334] text-[#62666d]'}`}><span className={`h-2 w-5 rounded-full ${color}`} />{label}</button>; }
function Insight({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-2 rounded-[7px] border border-[#c0c8d5] bg-white px-3 py-2 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{label}</p><p className="text-[16px] font-semibold">{value}</p></div>; }
function QuoteRow({ label, value, pct, tone }: { label: string; value: number; pct: number; tone: string }) { return <div className="rounded-[7px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-2 flex items-center justify-between"><span className="text-[13px] text-[#62666d] dark:text-[#8a8f98]">{label}</span><strong>{value}</strong></div><div className="h-1.5 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className={`h-1.5 rounded-full ${tone}`} style={{ width: `${pct}%` }} /></div></div>; }
function HealthRow({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="mb-1.5 flex items-start gap-2 rounded-[7px] border border-[#c0c8d5] bg-white px-3 py-2 last:mb-0 dark:border-[#323334] dark:bg-[#08090a]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#27a644]" /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-[13px] font-semibold">{label}</span><strong>{value}</strong></div><p className="truncate text-[12px] text-[#62666d] dark:text-[#8a8f98]">{detail}</p></div></div>; }
