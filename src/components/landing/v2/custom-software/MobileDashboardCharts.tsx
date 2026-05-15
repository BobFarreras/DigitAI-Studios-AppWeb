/**
 * @file src/components/landing/v2/custom-software/MobileDashboardCharts.tsx
 * @updated 2026-05-15
 * @summary Grafiques compactes pel dashboard mobil del simulador.
 * @scope Renderitzar tendencies i conversio sense gestionar estat global.
 */
'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Euro, ShieldCheck, Users } from 'lucide-react';
import { IncidentDualChart } from './FuturisticCharts';
import { useSoftwareText } from './software-i18n';

const quotes = { sent: 42, accepted: 27, rejected: 8, pending: 7 };
const phrase = (locale: string, ca: string, es: string, en: string, it: string) => locale === 'en' ? en : locale === 'es' ? es : locale === 'it' ? it : ca;

export function MobileDashboardCharts() {
  const ui = useSoftwareText();
  const [focus, setFocus] = useState<'all' | 'inc' | 'avg'>('all');
  const conversion = Math.round((quotes.accepted / quotes.sent) * 100);
  return (
    <div className="mt-2.5 grid gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        <Metric icon={<Euro className="h-3.5 w-3.5" />} label={phrase(ui.locale, 'Ingressos', 'Ingresos', 'Revenue', 'Ricavi')} value="128k" tone="text-[#27a644]" />
        <Metric icon={<ShieldCheck className="h-3.5 w-3.5" />} label="SLA" value="97%" tone="text-[#35b8e8]" />
        <Metric icon={<Users className="h-3.5 w-3.5" />} label={phrase(ui.locale, 'Càrrega', 'Carga', 'Load', 'Carico')} value="84%" tone="text-[#8a8cff]" />
      </div>
      <section className="rounded-[9px] border border-[#d0d6e0] bg-white p-2 dark:border-[#23252a] dark:bg-[#101112]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-[11px] font-[760]">{phrase(ui.locale, 'Tendència SAT', 'Tendencia SAT', 'SAT trend', 'Trend SAT')}</h4>
          <div className="flex gap-1">
            <Legend active={focus !== 'avg'} color="bg-[#8a8cff]" label={phrase(ui.locale, 'Inc.', 'Inc.', 'Inc.', 'Inc.')} onDown={() => setFocus('inc')} onUp={() => setFocus('all')} />
            <Legend active={focus !== 'inc'} color="bg-[#12a87b]" label={phrase(ui.locale, 'Temps', 'Tiempo', 'Time', 'Tempo')} onDown={() => setFocus('avg')} onUp={() => setFocus('all')} />
          </div>
        </div>
        <div className="h-[132px]"><IncidentDualChart focus={focus} /></div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <Insight label={phrase(ui.locale, 'Pic', 'Pico', 'Peak', 'Picco')} value="Dc · 14" />
          <Insight label={phrase(ui.locale, 'Millor', 'Mejor', 'Best', 'Migliore')} value="58m" />
          <Insight label={phrase(ui.locale, 'Risc', 'Riesgo', 'Risk', 'Rischio')} value="2 SLA" />
        </div>
      </section>
      <section className="rounded-[9px] border border-[#d0d6e0] bg-white p-2 dark:border-[#23252a] dark:bg-[#101112]">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[11px] font-[760]">{ui.t('quote')}</h4>
          <span className="rounded-[5px] bg-[#e4f222] px-2 py-0.5 text-[10px] font-[780] text-[#08090a]">{conversion}%</span>
        </div>
        <div className="grid grid-cols-[64px_1fr] gap-2">
          <div className="rounded-[7px] bg-[#eef1f6] p-2 dark:bg-[#161718]"><span className="text-[9px] text-[#62666d] dark:text-[#8a8f98]">{phrase(ui.locale, 'Enviats', 'Enviados', 'Sent', 'Inviati')}</span><strong className="block text-[24px] leading-none">{quotes.sent}</strong></div>
          <div className="grid gap-1">{[
            [phrase(ui.locale, 'Acceptats', 'Aceptados', 'Accepted', 'Accettati'), quotes.accepted, 64, 'bg-[#27a644]'],
            [ui.t('pending'), quotes.pending, 17, 'bg-[#f59e0b]'],
            [phrase(ui.locale, 'Rebutjats', 'Rechazados', 'Rejected', 'Rifiutati'), quotes.rejected, 19, 'bg-[#eb5757]'],
          ].map(([label, value, pct, tone]) => <Quote key={String(label)} label={String(label)} value={Number(value)} pct={Number(pct)} tone={String(tone)} />)}</div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: string }) { return <div className="rounded-[8px] border border-[#d0d6e0] bg-white p-2 dark:border-[#23252a] dark:bg-[#101112]"><div className={`mb-1 ${tone}`}>{icon}</div><p className="truncate text-[9px] text-[#62666d] dark:text-[#8a8f98]">{label}</p><strong className="text-[15px]">{value}</strong></div>; }
function Legend({ active, color, label, onDown, onUp }: { active: boolean; color: string; label: string; onDown: () => void; onUp: () => void }) { return <button onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} className={`inline-flex items-center gap-1 rounded-[5px] border px-1.5 py-1 text-[9px] ${active ? 'border-[#c0c8d5]' : 'border-[#d0d6e0] opacity-45 dark:border-[#323334]'}`}><span className={`h-1.5 w-3 rounded-full ${color}`} />{label}</button>; }
function Insight({ label, value }: { label: string; value: string }) { return <div className="rounded-[6px] bg-[#eef1f6] px-2 py-1.5 dark:bg-[#161718]"><p className="text-[9px] text-[#62666d] dark:text-[#8a8f98]">{label}</p><strong className="text-[11px]">{value}</strong></div>; }
function Quote({ label, value, pct, tone }: { label: string; value: number; pct: number; tone: string }) { return <div className="rounded-[6px] bg-[#eef1f6] px-2 py-1.5 dark:bg-[#161718]"><div className="mb-1 flex justify-between gap-2 text-[10px]"><span>{label}</span><strong>{value}</strong></div><div className="h-1 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className={`h-1 rounded-full ${tone}`} style={{ width: `${pct}%` }} /></div></div>; }
