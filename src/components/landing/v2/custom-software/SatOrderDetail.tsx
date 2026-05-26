/**
 * @file src/components/landing/v2/custom-software/SatOrderDetail.tsx
 * @updated 2026-05-13
 * @summary Fitxa minimalista d'una ordre SAT de lampisteria.
 * @scope Presentacio de detall tecnic i operatiu d'una ordre seleccionada.
 */
'use client';
import { useState, type ReactNode } from 'react';
import { ArrowLeft, Camera, Check, ChevronDown, Clock3, ClipboardCheck, Droplets, Hammer, MapPin, Package, SearchCheck, SignalHigh, SignalLow, SignalMedium, UserRound, Wrench, X, Zap } from 'lucide-react';
import { FloatingTip } from './FloatingTip';
import type { Job, JobPriority, JobSla, JobState, JobType } from './model';
import { useSoftwareText } from './software-i18n';

type Props = { job: Job; onBack: () => void; onSetState: (state: JobState) => void };
const states: JobState[] = ['Pendent', 'En curs', 'Blocat', 'Completat'];

export function SatOrderDetail({ job, onBack, onSetState }: Props) {
  const ui = useSoftwareText();
  return (
    <div className="h-full overflow-auto rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] font-[560] text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"><ArrowLeft className="h-4 w-4" />{ui.t('orders')}</button>
        <StateMenu value={job.state} onChange={onSetState} />
      </div>

      <section className="border-b border-[#d0d6e0] px-4 py-4 dark:border-[#23252a]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[12px] text-[#8a8f98]">{job.id} · {ui.type(job.type)}</p>
            <h4 className="mt-1 text-[24px] font-semibold leading-tight">{job.title}</h4>
            <p className="mt-2 text-[13px] leading-5 text-[#62666d] dark:text-[#8a8f98]">{job.description}</p>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <Metric label={ui.t('type')}><TypeIcon value={job.type} /></Metric>
            <Metric label={ui.t('status')}><StateIcon value={job.state} /></Metric>
            <Metric label={ui.t('priority')}><PriorityIcon value={job.priority} /></Metric>
            <Metric label="SLA"><SlaIcon value={job.sla} /></Metric>
          </div>
        </div>
      </section>

      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <main className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a] lg:border-b-0 lg:border-r">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={<Droplets className="h-4 w-4" />} tone="text-[#35b8e8]" label={ui.t('client')} value={job.client} />
            <Info icon={<UserRound className="h-4 w-4" />} tone="text-[#8b5cf6]" label={ui.t('technician')} value={job.technician} />
            <Info icon={<MapPin className="h-4 w-4" />} tone="text-[#f59e0b]" label={ui.t('location')} value={job.location} />
            <Info icon={<Wrench className="h-4 w-4" />} tone="text-[#6366f1]" label={ui.t('asset')} value={job.asset} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Block title={ui.t('diagnosis')} text={job.diagnosis} />
            <Block title={job.state === 'Completat' ? ui.t('applied') : ui.t('resolution')} text={job.resolution} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Info icon={<Clock3 className="h-4 w-4" />} tone="text-[#35b8e8]" label={ui.t('eta')} value={job.eta} />
            <Info icon={<Check className="h-4 w-4" />} tone="text-[#22c55e]" label={ui.t('close')} value={job.finishedAt ?? ui.t('pending')} />
            <Info icon={<UserRound className="h-4 w-4" />} tone="text-[#8b5cf6]" label={ui.t('contact')} value={job.contact} />
          </div>
        </main>

        <aside className="space-y-4 p-4">
          <Section title={ui.t('materials')}>
            {job.materials.length ? job.materials.map((item) => <MaterialRow key={item.name} name={item.name} qty={item.qty} state={item.state} />) : <Empty text={ui.t('noReserved')} />}
          </Section>
          <Section title={ui.t('evidence')}>
            <div className="grid grid-cols-2 gap-2">
              {(job.photos.length ? job.photos : [{ label: ui.t('pending'), tone: 'blue' as const }]).map((photo) => (
                <div key={photo.label} className="overflow-hidden rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] dark:border-[#323334] dark:bg-[#08090a]">
                  <div className={`relative aspect-square ${photoTone(photo.tone)}`}><Camera className="absolute left-2 top-2 h-4 w-4" /><span className="absolute inset-x-3 bottom-3 h-3 rounded-full bg-black/12 blur-sm" /></div>
                  <div className="px-2 py-1.5 text-[11px] font-semibold">{photo.label}</div>
                </div>
              ))}
            </div>
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, children }: { label: string; children: ReactNode }) { return <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] dark:border-[#323334] dark:bg-[#08090a]"><span className="mb-1 text-[10px] text-[#8a8f98]">{label}</span>{children}</div>; }
function StateMenu({ value, onChange }: { value: JobState; onChange: (state: JobState) => void }) {
  const ui = useSoftwareText();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((current) => !current)} className="flex h-8 items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]">
        <span className="text-[#8a8f98]">{ui.t('status')}</span><StateIcon value={value} /><span className="font-semibold">{ui.state(value)}</span><ChevronDown className="h-3.5 w-3.5 text-[#8a8f98]" />
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-40 w-40 overflow-hidden rounded-[7px] border border-[#c0c8d5] bg-white p-1 shadow-[0_16px_42px_rgba(8,9,10,0.16)] dark:border-[#323334] dark:bg-[#08090a]">
          {states.map((state) => (
            <button key={state} onClick={() => { onChange(state); setOpen(false); }} className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[12px] ${value === state ? 'bg-[#eceff4] dark:bg-[#161718]' : 'text-[#62666d] hover:bg-[#f4f6fa] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}>
              <StateIcon value={state} /><span>{ui.state(state)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
function Info({ icon, label, value, tone = 'text-[#8a8f98]' }: { icon: ReactNode; label: string; value: string; tone?: string }) { return <div className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-1 flex items-center gap-2 text-[#8a8f98]"><span className={tone}>{icon}</span>{label}</div><p className="font-[560]">{value}</p></div>; }
function Block({ title, text }: { title: string; text: string }) { return <section className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><h5 className="mb-1 text-[13px] font-semibold">{title}</h5><p className="leading-5 text-[#62666d] dark:text-[#8a8f98]">{text}</p></section>; }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h5 className="mb-2 text-[13px] font-semibold">{title}</h5><div className="space-y-2">{children}</div></section>; }
function Empty({ text }: { text: string }) { return <p className="text-[12px] text-[#8a8f98]">{text}</p>; }
function MaterialRow({ name, qty, state }: { name: string; qty: number; state: string }) { const ui = useSoftwareText(); return <div className="flex items-center justify-between rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><span className="inline-flex items-center gap-2"><Package className="h-4 w-4 text-[#6b7cff]" />{name}</span><span className="text-[#8a8f98]">{qty} · {materialState(state, ui.locale)}</span></div>; }
function TipIcon({ text, children }: { text: string; children: ReactNode }) { return <FloatingTip text={text} className="inline-flex items-center justify-center outline-none">{children}</FloatingTip>; }
function TypeIcon({ value }: { value: JobType }) { const ui = useSoftwareText(); const icon = value === 'Reparacio' ? <Wrench className="h-5 w-5" /> : value === 'Manteniment' ? <ClipboardCheck className="h-5 w-5" /> : value === 'Muntatge' ? <Hammer className="h-5 w-5" /> : <SearchCheck className="h-5 w-5" />; const c = value === 'Reparacio' ? 'text-[#00c2d7]' : value === 'Manteniment' ? 'text-[#22c55e]' : value === 'Muntatge' ? 'text-[#6b7cff]' : 'text-[#facc15]'; return <TipIcon text={`${ui.t('type')}: ${ui.type(value)}`}><span className={c}>{icon}</span></TipIcon>; }
function StateIcon({ value }: { value: JobState }) { const ui = useSoftwareText(); const icon = value === 'Completat' ? <Check className="h-5 w-5" /> : value === 'Blocat' ? <X className="h-5 w-5" /> : value === 'En curs' ? <Zap className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />; const c = value === 'Completat' ? 'text-[#22c55e]' : value === 'Blocat' ? 'text-[#ff5c5c]' : value === 'En curs' ? 'text-[#00c2d7]' : 'text-[#8a8f98]'; return <TipIcon text={`${ui.t('status')}: ${ui.state(value)}`}><span className={c}>{icon}</span></TipIcon>; }
function PriorityIcon({ value }: { value: JobPriority }) { const ui = useSoftwareText(); const icon = value === 'Alta' ? <SignalHigh className="h-6 w-6" /> : value === 'Mitja' ? <SignalMedium className="h-6 w-6" /> : <SignalLow className="h-6 w-6" />; const c = value === 'Alta' ? 'text-[#ff5c5c]' : value === 'Mitja' ? 'text-[#facc15]' : 'text-[#6b7cff]'; return <TipIcon text={`${ui.t('priority')}: ${ui.priority(value)}`}><span className={c}>{icon}</span></TipIcon>; }
function SlaIcon({ value }: { value: JobSla }) { const ui = useSoftwareText(); const c = value === 'OK' ? 'bg-[#22c55e]' : value === 'Risc' ? 'bg-[#facc15]' : 'bg-[#ff5c5c]'; return <TipIcon text={`SLA: ${ui.sla(value)}`}><span className={`h-3 w-3 rounded-full ${c}`} /></TipIcon>; }
function materialState(value: string, locale: string) {
  if (locale === 'en') return value === 'Instal·lat' ? 'Installed' : value === 'Reservat' ? 'Reserved' : 'Pending';
  if (locale === 'es') return value === 'Instal·lat' ? 'Instalado' : value === 'Reservat' ? 'Reservado' : 'Pendiente';
  if (locale === 'it') return value === 'Instal·lat' ? 'Installato' : value === 'Reservat' ? 'Riservato' : 'In attesa';
  return value;
}
function photoTone(value: 'blue' | 'green' | 'amber') { return value === 'green' ? 'bg-[radial-gradient(circle_at_32%_28%,#e8fff2_0_12%,transparent_13%),linear-gradient(135deg,#d8f5e4,#6dbb83)] text-[#15803d]' : value === 'amber' ? 'bg-[radial-gradient(circle_at_30%_24%,#fff5cf_0_12%,transparent_13%),linear-gradient(135deg,#f2d7a0,#9a6b2f)] text-[#92400e]' : 'bg-[radial-gradient(circle_at_30%_24%,#dff7ff_0_12%,transparent_13%),linear-gradient(135deg,#b7d7e8,#476f8d)] text-[#2563eb]'; }
