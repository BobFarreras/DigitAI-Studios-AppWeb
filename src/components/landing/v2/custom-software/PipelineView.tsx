/**
 * @file src/components/landing/v2/custom-software/PipelineView.tsx
 * @updated 2026-05-13
 * @summary Vista SAT professional per gestionar ordres i SLA.
 * @scope Simulacio operativa client-side amb cua, detall i accions.
 */
'use client';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Circle, ClipboardCheck, Hammer, Info as InfoIcon, Minus, Plus, Search, SearchCheck, SignalHigh, SignalLow, SignalMedium, SlidersHorizontal, Wrench, X, Zap } from 'lucide-react';
import { FloatingTip } from './FloatingTip';
import type { Job, JobPriority, JobSla, JobState, JobType, NewSatOrder } from './model';
import { SatOrderDetail } from './SatOrderDetail';

type Props = { jobs: Job[]; jobTitle: string; onSetJobTitle: (v: string) => void; onAddJob: (input?: NewSatOrder) => void; onSetJobState: (id: string, state: JobState) => void };
const states: JobState[] = ['Pendent', 'En curs', 'Blocat', 'Completat'];
const initialForm: NewSatOrder = { title: '', client: '', technician: '', priority: 'Mitja', sla: 'OK', eta: '', type: 'Reparacio', contact: '', location: '', description: '' };
const columns = [
  ['Ordre', 'El color i la icona indiquen el tipus de treball.'],
  ['Client', 'Empresa o centre afectat per la incidencia.'],
  ['Tipus', 'Classifica si es reparacio, manteniment, muntatge o auditoria.'],
  ['Tecnic', 'Persona responsable de la intervencio.'],
  ['Prioritat', 'Insignia d impacte: una barra baixa, dues mitja, tres alta.'],
  ['SLA', 'Salut del compromis: verd dins termini, groc en risc, vermell vençut.'],
  ['Estat', 'Icona del flux operatiu de la ordre.'],
  ['Accio', 'Obre la fitxa completa amb diagnosi, materials, fotos i resolucio.'],
] as const;

export function PipelineView({ jobs, jobTitle, onSetJobTitle, onAddJob, onSetJobState }: Props) {
  const [selected, setSelected] = useState<string | null>(jobs[0]?.id ?? null);
  const [stateFilter, setStateFilter] = useState<'all' | JobState>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [form, setForm] = useState<NewSatOrder>(initialForm);
  const filtered = useMemo(() => jobs.filter((j) => (stateFilter === 'all' || j.state === stateFilter) && `${j.id} ${j.title} ${j.client} ${j.technician}`.toLowerCase().includes(jobTitle.toLowerCase())), [jobs, stateFilter, jobTitle]);
  const current = jobs.find((j) => j.id === selected) ?? filtered[0] ?? null;

  const submit = () => {
    if (!form.title.trim() || !form.client.trim() || !form.technician.trim() || !form.eta.trim() || !form.description.trim()) return;
    onAddJob(form);
    setForm(initialForm);
    setOpenDialog(false);
  };

  if (screen === 'detail' && current) {
    return <motion.div key="pipeline-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full"><SatOrderDetail job={current} onBack={() => setScreen('list')} onSetState={(state) => onSetJobState(current.id, state)} /></motion.div>;
  }

  return (
    <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative h-full overflow-hidden rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <section className="flex h-full flex-col">
        <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]">
          <div className="flex items-center gap-1 text-[12px] font-[560]">
            <Tab active={stateFilter === 'all'} onClick={() => setStateFilter('all')} label="Tot" />
            {states.map((s) => <Tab key={s} active={stateFilter === s} onClick={() => setStateFilter(s)} label={s} />)}
          </div>
          <div className="flex items-center gap-2">
            <label className="hidden h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a] md:flex">
              <Search className="h-3.5 w-3.5 text-[#8a8f98]" />
              <input value={jobTitle} onChange={(e) => onSetJobTitle(e.target.value)} placeholder="Cercar..." className="w-32 bg-transparent outline-none placeholder:text-[#8a8f98]" />
            </label>
            <SlidersHorizontal className="h-4 w-4 text-[#8a8f98]" />
            <button onClick={() => setOpenDialog(true)} className="inline-flex h-8 items-center justify-center gap-2 rounded-[6px] bg-[#08090a] px-3 text-[12px] font-semibold text-white dark:bg-[#e4f222] dark:text-[#08090a]"><Plus className="h-4 w-4" />Crear</button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead className="sticky top-0 z-10 border-b border-[#d0d6e0] bg-white/96 text-[#8a8f98] backdrop-blur dark:border-[#23252a] dark:bg-[#111213]/96"><tr>{columns.map(([label, tip]) => <th key={label} className="px-4 py-3 font-[520]"><ColumnHint label={label} tip={tip} /></th>)}</tr></thead>
              <tbody>{filtered.map((j) => (
                <tr key={j.id} onClick={() => setSelected(j.id)} className={`border-b border-[#d0d6e0]/70 bg-white transition-colors hover:bg-[#f4f6fa] dark:border-[#23252a]/80 dark:bg-transparent dark:hover:bg-[#171819] ${current?.id === j.id ? 'bg-[#f4f6fa] dark:bg-[#151617]' : ''}`}>
                  <td className="px-4 py-4"><div className="flex items-center gap-3"><OrderMarker job={j} /><div><p className="font-[590]">{j.id}</p><p className="text-[12px] text-[#62666d] dark:text-[#8a8f98]">{j.title}</p></div></div></td>
                  <td className="px-4 py-4 text-[#383b3f] dark:text-[#d0d6e0]">{j.client}</td><td className="px-4 py-4 text-[#62666d] dark:text-[#8a8f98]">{j.type}</td><td className="px-4 py-4 text-[#62666d] dark:text-[#8a8f98]">{j.technician}</td>
                  <td className="px-4 py-4"><PriorityPill value={j.priority} /></td><td className="px-4 py-4"><SlaPill value={j.sla} /></td><td className="px-4 py-4"><StatePill value={j.state} /></td>
                  <td className="px-4 py-4"><button onClick={(e) => { e.stopPropagation(); setSelected(j.id); setScreen('detail'); }} className="inline-flex items-center gap-1 rounded-[6px] border border-[#c0c8d5] bg-white px-2 py-1 text-[11px] font-semibold text-[#383b3f] transition hover:border-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]"><ArrowUpRight className="h-3.5 w-3.5" />Detall</button></td>
                </tr>
              ))}</tbody>
          </table>
        </div>
      </section>

      {openDialog ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[8px] bg-white/62 p-4 backdrop-blur-md dark:bg-[#08090a]/70">
          <div className="max-h-full w-full max-w-2xl overflow-auto rounded-[10px] border border-[#d0d6e0] bg-[#f7f8f8] p-4 text-[#08090a] shadow-[0_24px_80px_rgba(8,9,10,0.22)] dark:border-[#323334] dark:bg-[#0f1011] dark:text-[#f7f8f8]">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#d0d6e0] pb-3 dark:border-[#23252a]">
              <div><h4 className="text-[16px] font-semibold">Crear ordre SAT</h4><p className="mt-1 text-[12px] text-[#62666d] dark:text-[#8a8f98]">Registra la incidencia amb dades suficients per assignar, prioritzar i resoldre.</p></div>
              <button onClick={() => setOpenDialog(false)} className="rounded-[6px] border border-[#c0c8d5] bg-white p-1 text-[#62666d] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#8a8f98]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} label="Resum de l avaria" />
              <Field value={form.client} onChange={(v) => setForm((f) => ({ ...f, client: v }))} label="Client" />
              <Field value={form.technician} onChange={(v) => setForm((f) => ({ ...f, technician: v }))} label="Tècnic assignat" />
              <Field value={form.eta} onChange={(v) => setForm((f) => ({ ...f, eta: v }))} label="ETA" />
              <Field value={form.contact} onChange={(v) => setForm((f) => ({ ...f, contact: v }))} label="Contacte client" />
              <Field value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} label="Ubicacio" />
              <Select label="Tipus ordre" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v as JobType }))} values={['Reparacio', 'Manteniment', 'Muntatge', 'Auditoria']} />
              <Select label="Prioritat" value={form.priority} onChange={(v) => setForm((f) => ({ ...f, priority: v as JobPriority }))} values={['Alta', 'Mitja', 'Baixa']} />
              <Select label="SLA" value={form.sla} onChange={(v) => setForm((f) => ({ ...f, sla: v as JobSla }))} values={['OK', 'Risc', 'Fora SLA']} />
              <TextArea value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} label="Descripcio clara de l avaria" />
            </div>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setOpenDialog(false)} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[12px] font-semibold text-[#383b3f] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]">Cancel·lar</button>
              <button onClick={submit} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Crear ordre</button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

function ColumnHint({ label, tip }: { label: string; tip: string }) {
  return <FloatingTip text={tip} className="inline-flex cursor-help items-center gap-1.5 outline-none">{label}<InfoIcon className="h-3.5 w-3.5" /></FloatingTip>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="text-[12px]"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] outline-none transition focus:border-[#5e6ad2] dark:border-[#323334] dark:bg-[#08090a]" /></label>; }
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="text-[12px] sm:col-span-2"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-24 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[13px] outline-none transition focus:border-[#5e6ad2] dark:border-[#323334] dark:bg-[#08090a]" /></label>; }
function Select({ label, value, onChange, values }: { label: string; value: string; onChange: (v: string) => void; values: string[] }) { return <label className="text-[12px]"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] outline-none transition focus:border-[#5e6ad2] dark:border-[#323334] dark:bg-[#08090a]">{values.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>; }
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-[5px] px-2 py-1 transition ${active ? 'bg-[#eceff4] text-[#08090a] dark:bg-[#1a1b1d] dark:text-[#f7f8f8]' : 'text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]'}`}>{label}</button>; }
function Tip({ text, children }: { text: string; children: ReactNode }) { return <FloatingTip text={text} className="inline-flex items-center outline-none">{children}</FloatingTip>; }
function OrderMarker({ job }: { job: Job }) { const icon = job.type === 'Reparacio' ? <Wrench className="h-3 w-3" /> : job.type === 'Manteniment' ? <ClipboardCheck className="h-3 w-3" /> : job.type === 'Muntatge' ? <Hammer className="h-3 w-3" /> : <SearchCheck className="h-3 w-3" />; const c = job.type === 'Reparacio' ? 'border-[#00c2d7]/55 bg-[#00c2d7]/14 text-[#00c2d7]' : job.type === 'Manteniment' ? 'border-[#22c55e]/55 bg-[#22c55e]/12 text-[#22c55e]' : job.type === 'Muntatge' ? 'border-[#6b7cff]/55 bg-[#6b7cff]/14 text-[#6b7cff]' : 'border-[#facc15]/55 bg-[#facc15]/14 text-[#facc15]'; return <Tip text={`Tipus: ${job.type}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${c}`}>{icon}</span></Tip>; }
function StatePill({ value }: { value: JobState }) { const icon = value === 'Completat' ? <Check className="h-3.5 w-3.5" /> : value === 'Blocat' ? <X className="h-3.5 w-3.5" /> : value === 'En curs' ? <Zap className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />; const c = value === 'Completat' ? 'text-[#22c55e]' : value === 'Blocat' ? 'text-[#ff5c5c]' : value === 'En curs' ? 'text-[#00c2d7]' : 'text-[#8a8f98]'; return <Tip text={`Estat: ${value}`}><span className={c}>{icon}</span></Tip>; }
function PriorityPill({ value }: { value: JobPriority }) { const icon = value === 'Alta' ? <SignalHigh className="h-5 w-5" /> : value === 'Mitja' ? <SignalMedium className="h-5 w-5" /> : <SignalLow className="h-5 w-5" />; const c = value === 'Alta' ? 'text-[#ff5c5c]' : value === 'Mitja' ? 'text-[#facc15]' : 'text-[#6b7cff]'; return <Tip text={`Prioritat ${value}`}><span className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] ${c}`}>{icon}</span></Tip>; }
function SlaPill({ value }: { value: JobSla }) { const c = value === 'OK' ? 'bg-[#22c55e]' : value === 'Risc' ? 'bg-[#facc15]' : 'bg-[#ff5c5c]'; return <Tip text={`SLA: ${value}`}><span className="inline-flex items-center gap-1.5">{value === 'OK' ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : value === 'Risc' ? <Minus className="h-3.5 w-3.5 text-[#facc15]" /> : <X className="h-3.5 w-3.5 text-[#ff5c5c]" />}<span className={`h-1.5 w-1.5 rounded-full ${c}`} /></span></Tip>; }
