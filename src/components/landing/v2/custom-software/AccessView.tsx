/**
 * @file src/components/landing/v2/custom-software/AccessView.tsx
 * @updated 2026-05-14
 * @summary Control horari SAT amb taula, detall, alta i calendari.
 * @scope Demo client-side de jornada, planificacio i rendiment d'equip.
 */
'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Lock, Package, Plus, Search, Timer, Unlock, Wrench, X } from 'lucide-react';
import type { Job, Member, Role } from './model';
import { useSoftwareText } from './software-i18n';

type Props = { team: Member[]; jobs: Job[]; userName: string; onSetUserName: (value: string) => void; onAddUser: (name?: string) => void; onToggle: (id: string) => void; onOpenSat: (id?: string) => void; onOpenCrm: (name?: string) => void; onOpenMaterial: (name?: string) => void };
type Screen = 'table' | 'detail' | 'calendar';
type Period = 'day' | 'week' | 'month';
type Stats = { hours: number; extra: number; done: number; active: number; avg: number };
const durationByType = { Reparacio: 2.1, Manteniment: 1.4, Muntatge: 3.2, Auditoria: 1.8 } as const;
const periodOptions: { id: Period; label: string; baseHours: number; multiplier: number }[] = [
  { id: 'day', label: 'Dia', baseHours: 8, multiplier: 1 },
  { id: 'week', label: 'Setmana', baseHours: 40, multiplier: 5 },
  { id: 'month', label: 'Mes', baseHours: 168, multiplier: 21 },
];
const calendarEvents = [
  { day: 'Dl', time: '07:00', title: 'Obertura magatzem', meta: 'Marta · preparacio ruta', kind: 'team', memberId: 'USR-01' },
  { day: 'Dl', time: '08:00', title: 'SAT-914', meta: 'Finques Tramuntana · revisio', kind: 'sat', memberId: 'USR-01', target: 'SAT-914' },
  { day: 'Dl', time: '11:00', title: 'CRM proposta', meta: 'Hotel Costa Brava · calderes', kind: 'crm', memberId: 'USR-02', target: 'Hotel Costa Brava' },
  { day: 'Dl', time: '16:00', title: 'SAT-916', meta: 'Gimnas Activa · bomba pressio', kind: 'sat', memberId: 'USR-02', target: 'SAT-916' },
  { day: 'Dt', time: '08:00', title: 'SAT-915', meta: 'Restaurant Sa Riera · embus', kind: 'sat', memberId: 'USR-03', target: 'SAT-915' },
  { day: 'Dt', time: '12:00', title: 'Reposicio material', meta: 'Valvules i sondes NTC', kind: 'team', memberId: 'USR-02' },
  { day: 'Dt', time: '15:00', title: 'Vacances', meta: 'Nil Ruiz · tarda aprovada', kind: 'off', memberId: 'USR-02' },
  { day: 'Dc', time: '07:00', title: 'Guardia activa', meta: 'Julia · urgencies 24/7', kind: 'team', memberId: 'USR-03' },
  { day: 'Dc', time: '10:00', title: 'SAT-912', meta: 'Comunitat Mar Blava · fuita', kind: 'sat', memberId: 'USR-03', target: 'SAT-912' },
  { day: 'Dc', time: '17:00', title: 'Tancament jornada', meta: 'Fotos i materials imputats', kind: 'team', memberId: 'USR-03' },
  { day: 'Dj', time: '09:00', title: 'Reunio client', meta: 'Campus EduNova · manteniment', kind: 'crm', memberId: 'USR-01', target: 'Campus EduNova' },
  { day: 'Dj', time: '12:00', title: 'SAT-913', meta: 'Hotel Costa Brava · bloquejat', kind: 'sat', memberId: 'USR-02', target: 'SAT-913' },
  { day: 'Dv', time: '08:00', title: 'SAT-917', meta: 'Apartaments Nord · tancament', kind: 'sat', memberId: 'USR-01', target: 'SAT-917' },
  { day: 'Dv', time: '13:00', title: 'Seguiment CRM', meta: 'UrbanFoods BCN · gas', kind: 'crm', memberId: 'USR-03', target: 'UrbanFoods BCN' },
  { day: 'Dv', time: '16:00', title: 'Planificacio setmana', meta: 'Coordinacio equip SAT', kind: 'team', memberId: 'USR-02' },
];

export function AccessView({ team, jobs, userName, onSetUserName, onAddUser, onToggle, onOpenSat, onOpenCrm, onOpenMaterial }: Props) {
  const ui = useSoftwareText();
  const [screen, setScreen] = useState<Screen>('table');
  const [period, setPeriod] = useState<Period>('day');
  const [selectedId, setSelectedId] = useState(team[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState(false);
  const selectedPeriod = periodOptions.find((item) => item.id === period) ?? periodOptions[0];
  const rows = useMemo(() => team.map((member, index) => ({ member, stats: getStats(member, jobs, index, selectedPeriod), jobs: jobsFor(member, jobs) })), [team, jobs, selectedPeriod]);
  const filtered = rows.filter(({ member }) => `${member.name} ${member.role} ${member.zone}`.toLowerCase().includes(query.toLowerCase()));
  const current = rows.find((row) => row.member.id === selectedId) ?? rows[0];
  if (screen === 'calendar') return <CalendarView onBack={() => setScreen('table')} onOpenSat={onOpenSat} onOpenCrm={onOpenCrm} onOpenWorker={(id) => { setSelectedId(id); setScreen('detail'); }} />;
  if (screen === 'detail' && current) return <WorkerDetail row={current} period={ui.text(selectedPeriod.label)} onBack={() => setScreen('table')} onOpenSat={onOpenSat} onOpenMaterial={onOpenMaterial} />;
  return (
    <motion.div key="access" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative h-full overflow-hidden rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <div className="flex min-h-14 flex-col gap-3 border-b border-[#d0d6e0] px-4 py-3 dark:border-[#23252a] lg:flex-row lg:items-center lg:justify-between">
        <div><h3 className="text-[20px] font-semibold leading-tight">{ui.text('Control horari i equip SAT')}</h3><p className="mt-1 text-[14px] text-[#62666d] dark:text-[#8a8f98]">{ui.text('Treballadors, hores, extres, SATs, permisos i planificacio.')}</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-1 dark:border-[#323334] dark:bg-[#08090a]">
            {periodOptions.map((item) => <button key={item.id} onClick={() => setPeriod(item.id)} className={`rounded-[5px] px-3 py-1.5 text-[13px] font-semibold ${period === item.id ? 'bg-[#08090a] text-white dark:bg-[#f7f8f8] dark:text-[#08090a]' : 'text-[#62666d] dark:text-[#8a8f98]'}`}>{ui.text(item.label)}</button>)}
          </div>
          <label className="flex h-9 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 dark:border-[#323334] dark:bg-[#08090a]"><Search className="h-4 w-4 text-[#8a8f98]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.t('search')} className="w-36 bg-transparent text-[14px] outline-none placeholder:text-[#8a8f98]" /></label>
          <button onClick={() => setScreen('calendar')} className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] font-semibold dark:border-[#323334] dark:bg-[#08090a]"><CalendarDays className="h-4 w-4" />{ui.text('Calendari')}</button>
          <button onClick={() => setDialog(true)} className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#e4f222] px-3 text-[13px] font-semibold text-[#08090a]"><Plus className="h-4 w-4" />{ui.text('Afegir')}</button>
        </div>
      </div>
      <div className="min-h-0 overflow-auto">
        <table className="w-full min-w-[860px] text-left text-[14px]">
          <thead className="sticky top-0 z-10 border-b border-[#d0d6e0] bg-white/95 text-[12px] uppercase tracking-[0.08em] text-[#8a8f98] backdrop-blur dark:border-[#23252a] dark:bg-[#111213]/95">
            <tr><Th>{ui.text('Treballador')}</Th><Th>{ui.text('Hores')} {ui.text(selectedPeriod.label).toLowerCase()}</Th><Th>{ui.text('Extres')}</Th><Th>SATs</Th><Th>{ui.text('Mitjana SAT')}</Th><Th>{ui.text('Permis')}</Th><Th>{ui.t('detail')}</Th></tr>
          </thead>
          <tbody>{filtered.map(({ member, stats }) => (
            <tr key={member.id} onClick={() => { setSelectedId(member.id); setScreen('detail'); }} className="cursor-pointer border-b border-[#d0d6e0]/70 transition hover:bg-[#f4f6fa] dark:border-[#23252a]/80 dark:hover:bg-[#171819]">
              <td className="px-4 py-4"><div className="font-semibold">{member.name}</div><div className="mt-1 text-[13px] text-[#62666d] dark:text-[#8a8f98]">{ui.text(member.role)} · {member.zone}</div></td>
              <td className="px-4 py-4 font-semibold">{stats.hours.toFixed(1)}h</td><td className={`px-4 py-4 font-semibold ${stats.extra > 0 ? 'text-[#f59e0b]' : 'text-[#62666d] dark:text-[#8a8f98]'}`}>{stats.extra.toFixed(1)}h</td>
              <td className="px-4 py-4"><span className="font-semibold">{stats.done}</span><span className="text-[#8a8f98]"> {ui.text('fetes')}</span><span className="ml-2 text-[#8a8f98]">{stats.active} {ui.text('obertes')}</span></td>
              <td className="px-4 py-4 font-semibold">{stats.avg.toFixed(1)}h</td>
              <td className="px-4 py-4"><button onClick={(e) => { e.stopPropagation(); onToggle(member.id); }} className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[12px] font-semibold ${member.enabled ? 'bg-[#27a644]/18 text-[#27a644]' : 'bg-[#eb5757]/18 text-[#eb5757]'}`}>{member.enabled ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}{member.enabled ? ui.t('active') : ui.t('blocked')}</button></td>
              <td className="px-4 py-4"><button onClick={(e) => { e.stopPropagation(); setSelectedId(member.id); setScreen('detail'); }} className="inline-flex items-center gap-1 rounded-[6px] border border-[#c0c8d5] bg-white px-2.5 py-1.5 text-[12px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{ui.t('detail')}<ArrowUpRight className="h-3.5 w-3.5" /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {dialog ? <AddWorkerDialog userName={userName} onSetUserName={onSetUserName} onClose={() => setDialog(false)} onSubmit={(name) => { onAddUser(name); setDialog(false); }} /> : null}
    </motion.div>
  );
}

function WorkerDetail({ row, period, onBack, onOpenSat, onOpenMaterial }: { row: { member: Member; stats: Stats; jobs: Job[] }; period: string; onBack: () => void; onOpenSat: (id?: string) => void; onOpenMaterial: (name?: string) => void }) {
  const ui = useSoftwareText();
  const visibleJobs = row.jobs.length ? row.jobs : fallbackJobs(row.member);
  const materials = visibleJobs.flatMap((job) => job.materials.map((item) => `${item.qty}x ${item.name}`)).slice(0, 5);
  return <motion.div key="worker-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full overflow-auto rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
    <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]"><button onClick={onBack} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"><ArrowLeft className="h-4 w-4" />{ui.text('Equip')}</button><span className="rounded-[6px] bg-[#e4f222] px-2.5 py-1 text-[12px] font-bold text-[#08090a]">{period}</span></div>
    <section className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a]"><h4 className="text-[26px] font-semibold leading-tight">{row.member.name}</h4><p className="mt-1 text-[14px] text-[#62666d] dark:text-[#8a8f98]">{ui.text(row.member.role)} · {ui.text('Zona')} {row.member.zone}</p><div className="mt-4 grid gap-2 sm:grid-cols-4"><Card icon={<Clock3 className="h-4 w-4" />} label={ui.text('Hores generals')} value={`${row.stats.hours.toFixed(1)}h`} /><Card icon={<Timer className="h-4 w-4" />} label={ui.text('Hores extres')} value={`${row.stats.extra.toFixed(1)}h`} warn={row.stats.extra > 0} /><Card icon={<CheckCircle2 className="h-4 w-4" />} label={ui.text('SATs completats')} value={`${row.stats.done}`} ok /><Card icon={<Wrench className="h-4 w-4" />} label={ui.text('Mitjana SAT')} value={`${row.stats.avg.toFixed(1)}h`} /></div></section>
    <div className="grid gap-0 lg:grid-cols-[1fr_300px]"><main className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a] lg:border-b-0 lg:border-r"><h5 className="text-[16px] font-semibold">{ui.text('SATs i hores imputades')}</h5><p className="mt-1 text-[13px] text-[#62666d] dark:text-[#8a8f98]">{ui.text('Clica qualsevol SAT per obrir la fitxa operativa concreta.')}</p><div className="mt-3 space-y-2">{visibleJobs.slice(0, 6).map((job, index) => <JobRow key={job.id} job={job} hours={(durationByType[job.type] + index * 0.35).toFixed(1)} onOpenSat={onOpenSat} />)}</div></main><aside className="p-4"><h5 className="text-[16px] font-semibold">{ui.text('Material imputat')}</h5><div className="mt-3 grid gap-2">{(materials.length ? materials : ['2x Junta 22 mm', '1x Tefló professional']).map((item) => <button key={item} onClick={() => onOpenMaterial(item.replace(/^\d+x\s/, ''))} className="flex items-center gap-2 rounded-[7px] bg-[#f7f8f8] px-3 py-2 text-left text-[14px] transition hover:bg-[#eceff4] dark:bg-[#08090a] dark:hover:bg-[#161718]"><Package className="h-4 w-4 text-[#6b7cff]" />{item}</button>)}</div></aside></div>
  </motion.div>;
}

function CalendarView({ onBack, onOpenSat, onOpenCrm, onOpenWorker }: { onBack: () => void; onOpenSat: (id?: string) => void; onOpenCrm: (name?: string) => void; onOpenWorker: (id: string) => void }) {
  const ui = useSoftwareText();
  const days = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv'], slots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const openEvent = (event: typeof calendarEvents[number]) => {
    if (event.kind === 'sat') onOpenSat(event.target);
    else if (event.kind === 'crm') onOpenCrm(event.target);
    else onOpenWorker(event.memberId);
  };
  return <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full overflow-hidden rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]"><div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]"><button onClick={onBack} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#62666d]"><ArrowLeft className="h-4 w-4" />{ui.text('Control horari')}</button><h4 className="text-[17px] font-semibold">{ui.text('Calendari operatiu 07:00-18:00')}</h4></div><div className="h-[calc(100%-48px)] overflow-auto"><div className="grid min-w-[980px] grid-cols-[72px_repeat(5,1fr)] text-[13px]"><div className="sticky left-0 top-0 z-20 border-r border-b border-[#d0d6e0] bg-white dark:border-[#23252a] dark:bg-[#111213]" />{days.map((day) => <div key={day} className="sticky top-0 z-10 border-r border-b border-[#d0d6e0] bg-white/95 p-3 text-center font-semibold backdrop-blur dark:border-[#23252a] dark:bg-[#111213]/95">{ui.text(day)}</div>)}{slots.map((slot) => [<div key={slot} className="sticky left-0 z-10 border-r border-b border-[#d0d6e0] bg-white p-3 text-[#8a8f98] dark:border-[#23252a] dark:bg-[#111213]">{slot}</div>, ...days.map((day) => <div key={`${day}-${slot}`} className="min-h-[82px] border-r border-b border-[#d0d6e0] p-2 dark:border-[#23252a]">{calendarEvents.filter((event) => event.day === day && event.time === slot).map((event) => <Event key={`${event.day}-${event.title}`} event={event} onClick={() => openEvent(event)} />)}</div>)]).flat()}</div></div></motion.div>;
}

function AddWorkerDialog({ userName, onSetUserName, onClose, onSubmit }: { userName: string; onSetUserName: (v: string) => void; onClose: () => void; onSubmit: (name: string) => void }) {
  const [draft, setDraft] = useState({ name: userName, role: 'Tècnic' as Role, zone: 'Girona', contract: '40h/setmana', pin: 'Auto' });
  const ui = useSoftwareText();
  return <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/64 p-4 backdrop-blur-md dark:bg-[#08090a]/72"><div className="w-full max-w-xl rounded-[10px] border border-[#d0d6e0] bg-[#f7f8f8] p-4 shadow-[0_24px_80px_rgba(8,9,10,0.22)] dark:border-[#323334] dark:bg-[#0f1011]"><div className="mb-4 flex items-start justify-between border-b border-[#d0d6e0] pb-3 dark:border-[#23252a]"><div><h4 className="text-[18px] font-semibold">{ui.text('Alta de treballador')}</h4><p className="mt-1 text-[13px] text-[#62666d] dark:text-[#8a8f98]">{ui.text('Crea la fitxa base, permisos i condicions de jornada.')}</p></div><button onClick={onClose} className="rounded-[6px] border border-[#c0c8d5] bg-white p-1 dark:border-[#323334] dark:bg-[#08090a]"><X className="h-4 w-4" /></button></div><div className="grid gap-3 sm:grid-cols-2"><Field label={ui.text('Nom complet')} value={draft.name} onChange={(name) => { setDraft((d) => ({ ...d, name })); onSetUserName(name); }} /><Select label={ui.text('Rol')} value={draft.role} onChange={(role) => setDraft((d) => ({ ...d, role: role as Role }))} values={['Tècnic', 'Coordinador', 'Admin']} /><Field label={ui.text('Zona')} value={draft.zone} onChange={(zone) => setDraft((d) => ({ ...d, zone }))} /><Field label={ui.text('Contracte')} value={draft.contract} onChange={(contract) => setDraft((d) => ({ ...d, contract }))} /><Field label={ui.text('PIN / QR')} value={draft.pin} onChange={(pin) => setDraft((d) => ({ ...d, pin }))} /><Field label={ui.text('Calendari')} value={ui.text('Laborable + guardies')} onChange={() => undefined} /></div><div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="h-10 rounded-[6px] border border-[#c0c8d5] bg-white px-4 text-[13px] font-semibold dark:border-[#323334] dark:bg-[#08090a]">{ui.t('cancel')}</button><button onClick={() => draft.name.trim() && onSubmit(draft.name)} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[13px] font-semibold text-[#08090a]">{ui.text('Crear fitxa')}</button></div></div></div>;
}

function jobsFor(member: Member, jobs: Job[]) { const firstName = member.name.split(' ')[0]; return jobs.filter((job) => job.technician.includes(firstName) || job.technician === member.name); }
function getStats(member: Member, jobs: Job[], index: number, period: { baseHours: number; multiplier: number }): Stats {
  const memberJobs = jobsFor(member, jobs);
  const active = memberJobs.filter((job) => job.state !== 'Completat').length;
  const completed = memberJobs.filter((job) => job.state === 'Completat').length;
  const done = member.enabled ? Math.max(completed + 1 + index, 1) * period.multiplier : 0;
  const realWork = memberJobs.reduce((sum, job) => sum + durationByType[job.type], 0);
  const dailyHours = member.enabled ? Math.min(8.9, 7.2 + realWork * 0.22 + index * 0.35) : 0;
  const rawHours = dailyHours * period.multiplier;
  const hours = Math.min(rawHours, period.baseHours + 12);
  const extra = Math.max(0, hours - period.baseHours);
  return { hours, extra, done, active, avg: done ? hours / done : 0 };
}
function fallbackJobs(member: Member): Job[] { return [{ id: 'SAT-PLAN', title: 'Planificacio pendent', client: 'Ruta', state: 'Pendent', priority: 'Mitja', sla: 'OK', technician: member.name, eta: 'Proper torn', type: 'Manteniment', contact: 'Coordinacio', location: member.zone, asset: 'Ruta SAT', description: '', diagnosis: '', resolution: '', materials: [], photos: [] }]; }
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 font-semibold">{children}</th>; }
function Card({ icon, label, value, ok, warn }: { icon: React.ReactNode; label: string; value: string; ok?: boolean; warn?: boolean }) { return <div className="rounded-[8px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 dark:border-[#323334] dark:bg-[#08090a]"><div className={ok ? 'text-[#27a644]' : warn ? 'text-[#f59e0b]' : 'text-[#62666d]'}>{icon}</div><div className="mt-2 text-[13px] text-[#62666d] dark:text-[#8a8f98]">{label}</div><div className="text-[20px] font-semibold">{value}</div></div>; }
function JobRow({ job, hours, onOpenSat }: { job: Job; hours: string; onOpenSat: (id?: string) => void }) { const ui = useSoftwareText(); return <button onClick={() => onOpenSat(job.id)} className="w-full rounded-[8px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 text-left transition hover:border-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a]"><div className="flex items-start justify-between gap-3"><div><p className="text-[14px] font-semibold">{job.id} · {ui.text(job.title)}</p><p className="mt-1 text-[13px] text-[#62666d] dark:text-[#8a8f98]">{ui.text(job.client)} · {job.location}</p></div><span className="rounded-[5px] bg-[#eceff4] px-2 py-1 text-[12px] font-semibold dark:bg-[#161718]">{hours}h</span></div></button>; }
function Event({ event, onClick }: { event: typeof calendarEvents[number]; onClick: () => void }) { const ui = useSoftwareText(); const c = event.kind === 'sat' ? 'border-[#00c2d7]/40 bg-[#00c2d7]/12 text-[#00a7bd]' : event.kind === 'crm' ? 'border-[#8b5cf6]/40 bg-[#8b5cf6]/12 text-[#8b5cf6]' : event.kind === 'off' ? 'border-[#f59e0b]/40 bg-[#f59e0b]/12 text-[#b7791f]' : 'border-[#27a644]/40 bg-[#27a644]/12 text-[#27a644]'; return <button onClick={onClick} className={`w-full rounded-[8px] border p-2 text-left transition hover:scale-[1.01] ${c}`}><div className="text-[12px] font-semibold">{event.time} · {ui.text(event.title)}</div><div className="mt-1 text-[11px] opacity-80">{ui.text(event.meta)}</div></button>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="text-[13px]"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[14px] outline-none dark:border-[#323334] dark:bg-[#08090a]" /></label>; }
function Select({ label, value, onChange, values }: { label: string; value: string; onChange: (v: string) => void; values: string[] }) { const ui = useSoftwareText(); return <label className="text-[13px]"><span className="mb-1 block text-[#62666d] dark:text-[#8a8f98]">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[14px] outline-none dark:border-[#323334] dark:bg-[#08090a]">{values.map((v) => <option key={v} value={v}>{ui.text(v)}</option>)}</select></label>; }
