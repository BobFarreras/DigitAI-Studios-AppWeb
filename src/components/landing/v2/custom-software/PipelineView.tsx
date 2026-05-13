/**
 * @file src/components/landing/v2/custom-software/PipelineView.tsx
 * @updated 2026-05-13
 * @summary Vista SAT professional per gestionar ordres i SLA.
 * @scope Simulacio operativa client-side amb cua, detall i accions.
 */
'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock3, ShieldCheck } from 'lucide-react';
import type { Job, JobPriority, JobSla, JobState } from './model';

type Props = { jobs: Job[]; jobTitle: string; onSetJobTitle: (v: string) => void; onAddJob: () => void; onAdvance: (id: string) => void };
const states: JobState[] = ['Pendent', 'En curs', 'Blocat', 'Completat'];

export function PipelineView({ jobs, jobTitle, onSetJobTitle, onAddJob, onAdvance }: Props) {
  const [selected, setSelected] = useState<string | null>(jobs[0]?.id ?? null);
  const [stateFilter, setStateFilter] = useState<'all' | JobState>('all');
  const filtered = useMemo(() => jobs.filter((j) => stateFilter === 'all' || j.state === stateFilter), [jobs, stateFilter]);
  const current = jobs.find((j) => j.id === selected) ?? filtered[0] ?? null;
  const kpis = { open: jobs.filter((j) => j.state !== 'Completat').length, risk: jobs.filter((j) => j.sla !== 'OK').length, high: jobs.filter((j) => j.priority === 'Alta').length, done: jobs.filter((j) => j.state === 'Completat').length };

  return (
    <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid h-full gap-4 overflow-auto pr-1 lg:grid-cols-12">
      <section className="space-y-4 lg:col-span-8">
        <div className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 [filter:saturate(.4)_grayscale(.35)] transition-all duration-500 hover:[filter:saturate(1)_grayscale(0)] dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Kpi label="Ordres obertes" value={String(kpis.open)} />
            <Kpi label="SLA en risc" value={String(kpis.risk)} />
            <Kpi label="Alta prioritat" value={String(kpis.high)} />
            <Kpi label="Completades avui" value={String(kpis.done)} />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input value={jobTitle} onChange={(e) => onSetJobTitle(e.target.value)} placeholder="Nova ordre SAT" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
            <button onClick={onAddJob} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[12px] font-semibold text-[#383b3f] transition dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0] group-hover:bg-[#e4f222] group-hover:text-[#08090a]">Crear ordre</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip active={stateFilter === 'all'} onClick={() => setStateFilter('all')} label="Tot" />
            {states.map((s) => <Chip key={s} active={stateFilter === s} onClick={() => setStateFilter(s)} label={s} />)}
          </div>
        </div>

        <div className="group overflow-hidden rounded-[8px] border border-[#d0d6e0] [filter:saturate(.4)_grayscale(.35)] transition-all duration-500 hover:[filter:saturate(1)_grayscale(0)] dark:border-[#23252a]">
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#eceff4] text-[#8a8f98] dark:bg-[#161718]"><tr><th className="px-3 py-2">Ordre</th><th className="px-3 py-2">Client</th><th className="px-3 py-2">Tècnic</th><th className="px-3 py-2">Prioritat</th><th className="px-3 py-2">SLA</th><th className="px-3 py-2">Estat</th></tr></thead>
              <tbody>{filtered.map((j) => (
                <tr key={j.id} onClick={() => setSelected(j.id)} className={`cursor-pointer border-t border-[#d0d6e0] dark:border-[#23252a] ${current?.id === j.id ? 'bg-[#eef1f6] dark:bg-[#121314]' : 'bg-white dark:bg-[#0f1011]'}`}>
                  <td className="px-3 py-2 font-[560]">{j.id}<p className="text-[11px] text-[#62666d]">{j.title}</p></td>
                  <td className="px-3 py-2">{j.client}</td><td className="px-3 py-2">{j.technician}</td>
                  <td className="px-3 py-2"><PriorityPill value={j.priority} /></td>
                  <td className="px-3 py-2"><SlaPill value={j.sla} /></td>
                  <td className="px-3 py-2"><StatePill value={j.state} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>

      <aside className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 [filter:saturate(.4)_grayscale(.35)] transition-all duration-500 hover:[filter:saturate(1)_grayscale(0)] dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-4">
        <h4 className="text-[15px] font-semibold">{current?.id ?? 'Sense ordre seleccionada'}</h4>
        <p className="mt-1 text-[12px] text-[#62666d]">{current ? current.title : 'Selecciona una ordre per veure detall.'}</p>
        {current ? (
          <div className="mt-3 space-y-2">
            <Info label="Client" value={current.client} />
            <Info label="Tècnic assignat" value={current.technician} />
            <Info label="ETA" value={current.eta} />
            <div className="grid grid-cols-2 gap-2"><PriorityPill value={current.priority} /><SlaPill value={current.sla} /></div>
            <button onClick={() => onAdvance(current.id)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] font-semibold text-[#383b3f] transition dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0] group-hover:bg-[#e4f222] group-hover:text-[#08090a]"><Clock3 className="h-4 w-4" />Avançar estat</button>
            <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]">
              <p className="mb-1 font-[560]">Alertes operatives</p>
              <p className="flex items-center gap-1 text-[#62666d]"><AlertTriangle className="h-3.5 w-3.5 text-[#f5a623]" /> Recanvi pendent en magatzem</p>
              <p className="mt-1 flex items-center gap-1 text-[#62666d]"><ShieldCheck className="h-3.5 w-3.5 text-[#27a644]" /> Client amb manteniment actiu</p>
            </div>
          </div>
        ) : null}
      </aside>
    </motion.div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) { return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[11px] text-[#8a8f98]">{label}</p><p className="text-[22px] font-semibold leading-none">{value}</p></div>; }
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-full border px-2.5 py-1 text-[11px] ${active ? 'border-[#5e6ad2] text-[#5e6ad2]' : 'border-[#c0c8d5] text-[#8a8f98]'}`}>{label}</button>; }
function StatePill({ value }: { value: JobState }) { const c = value === 'Pendent' ? 'text-[#5e6ad2] bg-[#5e6ad2]/12 border-[#5e6ad2]/35' : value === 'En curs' ? 'text-[#35b8e8] bg-[#35b8e8]/12 border-[#35b8e8]/35' : value === 'Blocat' ? 'text-[#eb5757] bg-[#eb5757]/12 border-[#eb5757]/35' : 'text-[#27a644] bg-[#27a644]/12 border-[#27a644]/35'; return <span className={`rounded-[4px] border px-2 py-0.5 text-[11px] ${c}`}>{value}</span>; }
function PriorityPill({ value }: { value: JobPriority }) { const c = value === 'Alta' ? 'text-[#eb5757] bg-[#eb5757]/12 border-[#eb5757]/35' : value === 'Mitja' ? 'text-[#f5a623] bg-[#f5a623]/12 border-[#f5a623]/35' : 'text-[#5e6ad2] bg-[#5e6ad2]/12 border-[#5e6ad2]/35'; return <span className={`rounded-[4px] border px-2 py-0.5 text-[11px] ${c}`}>{value}</span>; }
function SlaPill({ value }: { value: JobSla }) { const c = value === 'OK' ? 'text-[#27a644] bg-[#27a644]/12 border-[#27a644]/35' : value === 'Risc' ? 'text-[#f5a623] bg-[#f5a623]/12 border-[#f5a623]/35' : 'text-[#eb5757] bg-[#eb5757]/12 border-[#eb5757]/35'; return <span className={`rounded-[4px] border px-2 py-0.5 text-[11px] ${c}`}>{value}</span>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-[6px] border border-[#c0c8d5] bg-white px-2.5 py-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[#8a8f98]">{label}</p><p className="font-[560]">{value}</p></div>; }
