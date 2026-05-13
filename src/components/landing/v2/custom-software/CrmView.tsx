/**
 * @file src/components/landing/v2/custom-software/CrmView.tsx
 * @updated 2026-05-13
 * @summary CRM minimalista amb taula, cercador i alta de clients.
 * @scope Operacions client-side per simular el flux comercial.
 */
'use client';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Circle, FileText, Info as InfoIcon, Plus, Search, Target, UserRound, X } from 'lucide-react';
import { FloatingTip } from './FloatingTip';
import { CrmClientDetail } from './CrmClientDetail';
import type { Client, LeadStage } from './model';
import { useSoftwareText } from './software-i18n';

type Props = { clients: Client[]; clientName: string; onSetClientName: (v: string) => void; onAddClient: () => void; onSetStage: (id: number, stage: LeadStage) => void };
const stages: LeadStage[] = ['Nou', 'Qualificat', 'Proposta', 'Tancat'];
export function CrmView({ clients, clientName, onSetClientName, onAddClient, onSetStage }: Props) {
  const ui = useSoftwareText();
  const columns = [[ui.t('client'), ui.tip('client')], [ui.t('segment'), ui.tip('segment')], [ui.t('owner'), ui.tip('owner')], [ui.t('phase'), ui.tip('phase')], [ui.t('action'), ui.tip('detail')]] as const;
  const [stageFilter, setStageFilter] = useState<'all' | LeadStage>('all');
  const [localQuery, setLocalQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(clients[0]?.id ?? null);
  const [openDialog, setOpenDialog] = useState(false);
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const filtered = useMemo(() => clients.filter((c) => (`${c.name} ${c.segment} ${c.owner}`.toLowerCase().includes(localQuery.trim().toLowerCase())) && (stageFilter === 'all' || c.stage === stageFilter)), [clients, localQuery, stageFilter]);
  const current = clients.find((c) => c.id === selected) ?? filtered[0] ?? null;
  const wonRate = clients.length ? Math.round((clients.filter((c) => c.stage === 'Tancat').length / clients.length) * 100) : 0;

  if (screen === 'detail' && current) {
    return <motion.div key="crm-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full"><CrmClientDetail client={current} onBack={() => setScreen('list')} onSetStage={(stage) => onSetStage(current.id, stage)} /></motion.div>;
  }

  const submitClient = () => { onAddClient(); setOpenDialog(false); };

  return (
    <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative h-full overflow-hidden rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <section className="flex h-full flex-col">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-[#d0d6e0] px-4 py-2 dark:border-[#23252a]">
          <div className="flex flex-wrap items-center gap-1 text-[12px] font-[560]"><Tab active={stageFilter === 'all'} onClick={() => setStageFilter('all')} label={ui.t('all')} />{stages.map((s) => <Tab key={s} active={stageFilter === s} onClick={() => setStageFilter(s)} label={ui.stage(s)} />)}</div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <MiniKpi label={ui.kpi('active')} value={String(clients.filter((c) => c.stage !== 'Tancat').length)} icon={<UserRound className="h-3.5 w-3.5 text-[#6b7cff]" />} />
            <MiniKpi label={ui.kpi('proposals')} value={String(clients.filter((c) => c.stage === 'Proposta').length)} icon={<FileText className="h-3.5 w-3.5 text-[#facc15]" />} />
            <MiniKpi label={ui.kpi('closed')} value={String(clients.filter((c) => c.stage === 'Tancat').length)} icon={<Check className="h-3.5 w-3.5 text-[#22c55e]" />} />
            <MiniKpi label={ui.kpi('win')} value={`${wonRate}%`} icon={<Target className="h-3.5 w-3.5 text-[#00c2d7]" />} />
            <label className="hidden h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a] md:flex"><Search className="h-3.5 w-3.5 text-[#8a8f98]" /><input value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} placeholder={ui.t('search')} className="w-36 bg-transparent outline-none placeholder:text-[#8a8f98]" /></label>
            <button onClick={() => setOpenDialog(true)} className="inline-flex h-8 items-center justify-center gap-2 rounded-[6px] bg-[#08090a] px-3 text-[12px] font-semibold text-white dark:bg-[#e4f222] dark:text-[#08090a]"><Plus className="h-4 w-4" />{ui.t('client')}</button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="sticky top-0 z-10 border-b border-[#d0d6e0] bg-white/96 text-[#8a8f98] backdrop-blur dark:border-[#23252a] dark:bg-[#111213]/96"><tr>{columns.map(([label, tip]) => <th key={label} className="px-4 py-3 font-[520]"><ColumnHint label={label} tip={tip} /></th>)}</tr></thead>
            <tbody>{filtered.map((c) => <tr key={c.id} onClick={() => setSelected(c.id)} className={`border-b border-[#d0d6e0]/70 bg-white transition hover:bg-[#f4f6fa] dark:border-[#23252a]/80 dark:bg-transparent dark:hover:bg-[#171819] ${current?.id === c.id ? 'bg-[#f4f6fa] dark:bg-[#151617]' : ''}`}>
              <td className="px-4 py-4"><div className="flex items-center gap-3"><StageDot stage={c.stage} /><span className="font-[590]">{c.name}</span></div></td><td className="px-4 py-4 text-[#62666d] dark:text-[#8a8f98]">{c.segment}</td><td className="px-4 py-4 text-[#62666d] dark:text-[#8a8f98]">{c.owner}</td>
              <td className="px-4 py-4"><StageMenu value={c.stage} onChange={(stage) => onSetStage(c.id, stage)} /></td>
              <td className="px-4 py-4"><button onClick={(e) => { e.stopPropagation(); setSelected(c.id); setScreen('detail'); }} className="inline-flex items-center gap-1 rounded-[6px] border border-[#c0c8d5] bg-white px-2 py-1 text-[11px] font-semibold text-[#383b3f] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]"><ArrowUpRight className="h-3.5 w-3.5" />{ui.t('detail')}</button></td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>
      {openDialog ? <ClientDialog ui={ui} clientName={clientName} onSetClientName={onSetClientName} onClose={() => setOpenDialog(false)} onSubmit={submitClient} /> : null}
    </motion.div>
  );
}

function ColumnHint({ label, tip }: { label: string; tip: string }) { return <FloatingTip text={tip} className="inline-flex cursor-help items-center gap-1.5 outline-none">{label}<InfoIcon className="h-3.5 w-3.5" /></FloatingTip>; }
function MiniKpi({ label, value, icon }: { label: string; value: string; icon: ReactNode }) { return <div className="hidden h-8 items-center gap-1.5 rounded-[6px] border border-[#d0d6e0] bg-[#f7f8f8] px-2 text-[11px] dark:border-[#323334] dark:bg-[#08090a] sm:flex">{icon}<span className="text-[#8a8f98]">{label}</span><strong className="text-[12px] font-semibold">{value}</strong></div>; }
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-[5px] px-2 py-1 transition ${active ? 'bg-[#eceff4] text-[#08090a] dark:bg-[#1a1b1d] dark:text-[#f7f8f8]' : 'text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]'}`}>{label}</button>; }
function StageDot({ stage }: { stage: LeadStage }) { const c = stage === 'Nou' ? 'border-[#6b7cff]/55 bg-[#6b7cff]/14' : stage === 'Qualificat' ? 'border-[#00c2d7]/55 bg-[#00c2d7]/14' : stage === 'Proposta' ? 'border-[#facc15]/55 bg-[#facc15]/14' : 'border-[#22c55e]/55 bg-[#22c55e]/14'; return <span className={`h-3 w-3 rounded-full border ${c}`} />; }
function StageIcon({ stage }: { stage: LeadStage }) { const c = stage === 'Nou' ? 'text-[#6b7cff]' : stage === 'Qualificat' ? 'text-[#00c2d7]' : stage === 'Proposta' ? 'text-[#facc15]' : 'text-[#22c55e]'; const icon = stage === 'Tancat' ? <Check className="h-4 w-4" /> : stage === 'Proposta' ? <FileText className="h-4 w-4" /> : stage === 'Qualificat' ? <Target className="h-4 w-4" /> : <Circle className="h-4 w-4" />; return <span className={c}>{icon}</span>; }
function StageMenu({ value, onChange }: { value: LeadStage; onChange: (stage: LeadStage) => void }) { const [open, setOpen] = useState(false); const ui = useSoftwareText(); return <div className="relative"><button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} className="inline-flex h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><StageIcon stage={value} /><span>{ui.stage(value)}</span></button>{open ? <div className="absolute left-0 top-10 z-40 w-40 rounded-[7px] border border-[#c0c8d5] bg-white p-1 shadow-[0_16px_42px_rgba(8,9,10,0.16)] dark:border-[#323334] dark:bg-[#08090a]">{stages.map((s) => <button key={s} onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }} className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[12px] ${value === s ? 'bg-[#eceff4] dark:bg-[#161718]' : 'text-[#62666d] hover:bg-[#f4f6fa] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}><StageIcon stage={s} />{ui.stage(s)}</button>)}</div> : null}</div>; }
function ClientDialog({ ui, clientName, onSetClientName, onClose, onSubmit }: { ui: ReturnType<typeof useSoftwareText>; clientName: string; onSetClientName: (v: string) => void; onClose: () => void; onSubmit: () => void }) { return <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[8px] bg-white/62 p-4 backdrop-blur-md dark:bg-[#08090a]/70"><div className="w-full max-w-md rounded-[10px] border border-[#d0d6e0] bg-[#f7f8f8] p-4 text-[#08090a] shadow-[0_24px_80px_rgba(8,9,10,0.22)] dark:border-[#323334] dark:bg-[#0f1011] dark:text-[#f7f8f8]"><div className="mb-3 flex items-start justify-between gap-3 border-b border-[#d0d6e0] pb-3 dark:border-[#23252a]"><div><h4 className="text-[16px] font-semibold">{ui.t('addClient')}</h4><p className="mt-1 text-[12px] text-[#62666d] dark:text-[#8a8f98]">{ui.t('createOpportunity')}</p></div><button onClick={onClose} className="rounded-[6px] border border-[#c0c8d5] bg-white p-1 text-[#62666d] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#8a8f98]"><X className="h-4 w-4" /></button></div><label className="text-[12px]"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{ui.t('companyName')}</span><input value={clientName} onChange={(e) => onSetClientName(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] outline-none dark:border-[#323334] dark:bg-[#08090a]" /></label><div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[12px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{ui.t('cancel')}</button><button onClick={onSubmit} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">{ui.t('create')}</button></div></div></div>; }
