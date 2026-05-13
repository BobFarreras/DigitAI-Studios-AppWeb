/**
 * @file src/components/landing/v2/custom-software/CrmView.tsx
 * @updated 2026-05-13
 * @summary CRM interactiu amb taula, kanban i panell de detall.
 * @scope Operacions client-side per entendre i simular el flux comercial.
 */
'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, LayoutGrid, PieChart, Table2, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Client, LeadStage } from './model';

type Props = { clients: Client[]; query: string; clientName: string; onSetClientName: (v: string) => void; onAddClient: () => void; onMoveStage: (id: number) => void };
const stages: LeadStage[] = ['Nou', 'Qualificat', 'Proposta', 'Tancat'];

export function CrmView({ clients, query, clientName, onSetClientName, onAddClient, onMoveStage }: Props) {
  const [mode, setMode] = useState<'table' | 'board'>('table');
  const [stageFilter, setStageFilter] = useState<'all' | LeadStage>('all');
  const [selected, setSelected] = useState<number | null>(clients[0]?.id ?? null);
  const filtered = useMemo(() => clients.filter((c) => (`${c.name} ${c.segment} ${c.owner}`.toLowerCase().includes(query.trim().toLowerCase())) && (stageFilter === 'all' || c.stage === stageFilter)), [clients, query, stageFilter]);
  const selectedClient = clients.find((c) => c.id === selected) ?? filtered[0] ?? null;
  const wonRate = clients.length ? Math.round((clients.filter((c) => c.stage === 'Tancat').length / clients.length) * 100) : 0;
  const dueToday = Math.max(1, clients.filter((c) => c.stage !== 'Tancat').length - 1);

  return (
    <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid h-full gap-4 lg:grid-cols-12">
      <section className="space-y-4 lg:col-span-8">
        <div className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all duration-500 dark:border-[#23252a] dark:bg-[#161718]/88">
          <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Kpi label="Leads actius" value={String(clients.filter((c) => c.stage !== 'Tancat').length)} icon={<Users className="h-4 w-4 text-[#8a8cff]" />} />
            <Kpi label="Propostes obertes" value={String(clients.filter((c) => c.stage === 'Proposta').length)} icon={<PieChart className="h-4 w-4 text-[#87f1c9]" />} />
            <Kpi label="Win rate" value={`${wonRate}%`} icon={<CheckCircle2 className="h-4 w-4 text-[#27a644]" />} />
            <Kpi label="Seguiment avui" value={String(dueToday)} icon={<Clock3 className="h-4 w-4 text-[#5e6ad2]" />} />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input value={clientName} onChange={(e) => onSetClientName(e.target.value)} placeholder="Nom empresa" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
            <button onClick={onAddClient} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[12px] font-semibold text-[#383b3f] transition dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0] group-hover:bg-[#e4f222] group-hover:text-[#08090a]">Afegir client</button>
            <div className="flex items-center gap-1 rounded-[6px] border border-[#c0c8d5] bg-white p-1 dark:border-[#323334] dark:bg-[#08090a]">
              <button onClick={() => setMode('table')} className={`rounded-[5px] px-2 py-1 text-[12px] ${mode === 'table' ? 'bg-[#eceff4] dark:bg-[#161718]' : ''}`}><Table2 className="h-4 w-4" /></button>
              <button onClick={() => setMode('board')} className={`rounded-[5px] px-2 py-1 text-[12px] ${mode === 'board' ? 'bg-[#eceff4] dark:bg-[#161718]' : ''}`}><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterChip active={stageFilter === 'all'} onClick={() => setStageFilter('all')} label="Tot" />
            {stages.map((s) => <FilterChip key={s} active={stageFilter === s} onClick={() => setStageFilter(s)} label={s} />)}
          </div>
        </div>

        {mode === 'table' ? (
          <div className="group overflow-hidden rounded-[8px] border border-[#d0d6e0] transition-all duration-500 dark:border-[#23252a]">
            <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#eceff4] text-[#8a8f98] dark:bg-[#161718]"><tr><th className="px-3 py-2">Client</th><th className="px-3 py-2">Segment</th><th className="px-3 py-2">Owner</th><th className="px-3 py-2">Fase</th><th className="px-3 py-2">Acció</th></tr></thead>
              <tbody>{filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c.id)} className={`cursor-pointer border-t border-[#d0d6e0] dark:border-[#23252a] ${selectedClient?.id === c.id ? 'bg-[#eef1f6] dark:bg-[#121314]' : 'bg-white dark:bg-[#0f1011]'}`}>
                  <td className="px-3 py-2 font-[560]">{c.name}</td><td className="px-3 py-2 text-[#62666d]">{c.segment}</td><td className="px-3 py-2">{c.owner}</td>
                  <td className="px-3 py-2"><StagePill stage={c.stage} /></td>
                  <td className="px-3 py-2"><button onClick={(e) => { e.stopPropagation(); onMoveStage(c.id); }} className="text-[11px] text-[#5e6ad2]">Moure fase</button></td>
                </tr>
              ))}</tbody>
            </table>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => (
              <article key={stage} className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-2 dark:border-[#23252a] dark:bg-[#161718]/88">
                <div className="mb-2 flex items-center justify-between"><StagePill stage={stage} /><span className="text-[11px] text-[#8a8f98]">{filtered.filter((c) => c.stage === stage).length}</span></div>
                <div className="space-y-2">
                  {filtered.filter((c) => c.stage === stage).map((c) => <button key={c.id} onClick={() => setSelected(c.id)} className="w-full rounded-[6px] border border-[#c0c8d5] bg-white p-2 text-left text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><p className="font-[560]">{c.name}</p><p className="text-[11px] text-[#62666d]">{c.segment} · {c.owner}</p></button>)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="group rounded-[8px] border border-[#d0d6e0] bg-[#eceff4]/82 p-3 transition-all duration-500 dark:border-[#23252a] dark:bg-[#161718]/88 lg:col-span-4">
        <h4 className="text-[15px] font-semibold">{selectedClient?.name ?? 'Sense client seleccionat'}</h4>
        <p className="mt-1 text-[12px] text-[#62666d]">{selectedClient ? `${selectedClient.segment} · ${selectedClient.owner}` : 'Selecciona un client per veure detall.'}</p>
        {selectedClient ? (
          <div className="mt-3 space-y-2">
            <InfoRow label="Fase actual" value={selectedClient.stage} />
            <InfoRow label="Prioritat" value={selectedClient.stage === 'Proposta' ? 'Alta' : 'Mitja'} />
            <InfoRow label="Últim contacte" value="Avui · 10:42" />
            <InfoRow label="Pròxim pas" value={selectedClient.stage === 'Tancat' ? 'Upsell Q3' : 'Trucada comercial'} />
            <button onClick={() => onMoveStage(selectedClient.id)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] font-semibold text-[#383b3f] transition dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0] group-hover:bg-[#e4f222] group-hover:text-[#08090a]"><Clock3 className="h-4 w-4" />Avançar fase</button>
          </div>
        ) : null}
      </aside>
    </motion.div>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-1 flex items-center justify-between"><p className="text-[11px] text-[#8a8f98]">{label}</p>{icon}</div><p className="text-[22px] font-semibold leading-none">{value}</p><div className="mt-1 h-1.5 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className="h-1.5 w-[68%] rounded-full bg-gradient-to-r from-[#5e6ad2] via-[#a855f7] to-[#27a644]" /></div></div>;
}
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-full border px-2.5 py-1 text-[11px] ${active ? 'border-[#5e6ad2] text-[#5e6ad2]' : 'border-[#c0c8d5] text-[#8a8f98]'}`}>{label}</button>; }
function StagePill({ stage }: { stage: LeadStage }) {
  const cls =
    stage === 'Nou'
      ? 'border-[#5e6ad2]/40 bg-[#5e6ad2]/12 text-[#5e6ad2]'
      : stage === 'Qualificat'
        ? 'border-[#35b8e8]/40 bg-[#35b8e8]/12 text-[#35b8e8]'
        : stage === 'Proposta'
          ? 'border-[#a855f7]/40 bg-[#a855f7]/12 text-[#a855f7]'
          : 'border-[#27a644]/40 bg-[#27a644]/12 text-[#27a644]';
  return <span className={`rounded-[4px] border px-2 py-0.5 text-[11px] ${cls}`}>{stage}</span>;
}
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="rounded-[6px] border border-[#c0c8d5] bg-white px-2.5 py-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[#8a8f98]">{label}</p><p className="font-[560]">{value}</p></div>; }
