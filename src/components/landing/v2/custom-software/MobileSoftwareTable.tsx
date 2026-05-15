/**
 * @file src/components/landing/v2/custom-software/MobileSoftwareTable.tsx
 * @updated 2026-05-15
 * @summary Taules compactes per la demo mobil de software.
 * @scope Renderitzar dades tipus app amb scroll horitzontal i accions simples.
 */
'use client';

import { motion } from 'framer-motion';
import { Boxes, CalendarCheck, Camera, Check, Circle, CircleAlert, ClipboardCheck, Euro, FileText, Hammer, Mail, MapPin, Package, Phone, SearchCheck, SignalHigh, SignalLow, SignalMedium, Target, Truck, UserRound, Wrench, X, type LucideIcon } from 'lucide-react';
import type { Client, Job, JobState, LeadStage, Material, Member, ViewId } from './model';
import { nextJobState, nextLeadStage } from './model';
import { FloatingTip } from './FloatingTip';
import { getMaterialProfile } from './inventory-utils';
import { useSoftwareText } from './software-i18n';
import type { MobileDetailCell, MobileDetailGroup, MobileDetailRow } from './MobileSoftwareDetail';

type Props = {
  view: ViewId;
  clients: Client[];
  jobs: Job[];
  material: Material[];
  team: Member[];
  onSetStage: (id: number, stage: LeadStage) => void;
  onSetJobState: (id: string, state: JobState) => void;
  onIncrement: (id: string) => void;
  onToggle: (id: string) => void;
  onOpenDetail?: (selection: MobileSoftwareSelection) => void;
};

type Header = { label: string; tip: string };
type Cell = MobileDetailCell;
type Row = MobileDetailRow;
export type MobileSoftwareSelection = { view: ViewId; row: Row };

export function MobileSoftwareTable({ view, clients, jobs, material, team, onSetStage, onSetJobState, onIncrement, onToggle, onOpenDetail }: Props) {
  const ui = useSoftwareText();
  const table = getTable({ view, clients, jobs, material, team, onSetStage, onSetJobState, onIncrement, onToggle, ui });
  const openDetail = (row: Row) => {
    const selection = { view, row };
    onOpenDetail?.(selection);
  };
  return (
    <div className="relative mt-2.5 overflow-hidden rounded-[9px] border border-[#d0d6e0] bg-white dark:border-[#23252a] dark:bg-[#101112]">
      <div className="flex items-center justify-between border-b border-[#d0d6e0] px-2.5 py-2 dark:border-[#23252a]">
        <p className="text-[10px] font-[760] uppercase text-[#62666d] dark:text-[#8a8f98]">{table.title}</p>
        <p className="text-[10px] font-[620] text-[#8a8f98]">scroll</p>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${table.width} border-separate border-spacing-0 text-left`}>
          <thead>
            <tr>{table.headers.map((head) => <th key={head.label} className="border-b border-[#d0d6e0] px-2 py-1.5 text-[9px] font-[720] text-[#62666d] dark:border-[#23252a] dark:text-[#8a8f98]"><FloatingTip text={head.tip}>{head.label}</FloatingTip></th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <motion.tr key={row.id} onClick={() => openDetail(row)} className="cursor-pointer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                {row.cells.map((cell, cellIndex) => <td key={`${row.id}-${cellIndex}`} className="border-b border-[#eceff4] px-2 py-2 text-[10px] font-[590] text-[#383b3f] dark:border-[#23252a] dark:text-[#d0d6e0]"><CellView cell={cell} /></td>)}
                <td className="border-b border-[#eceff4] px-2 py-2 dark:border-[#23252a]"><span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8.5px] font-[780] ${row.tone}`}>{row.statusIcon ? <row.statusIcon className="h-3 w-3" /> : null}{row.badge}</span></td>
                <td className="border-b border-[#eceff4] px-2 py-2 dark:border-[#23252a]">{row.action ? <button onClick={() => row.onAction?.()} className="rounded-[5px] bg-[#08090a] px-1.5 py-1 text-[9px] font-[720] text-white dark:bg-[#f7f8f8] dark:text-[#08090a]">{row.action}</button> : null}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getTable(input: Props & { ui: ReturnType<typeof useSoftwareText> }) {
  const { view, clients, jobs, material, team, onSetStage, onSetJobState, onIncrement, onToggle, ui } = input;
  if (view === 'crm') return {
    title: ui.t('clients'), width: 'min-w-[520px]', headers: heads([[ui.t('client'), ui.tip('client')], [ui.t('segment'), ui.tip('segment')], [ui.t('owner'), ui.tip('owner')], [ui.t('phase'), ui.tip('phase')], [ui.t('action'), ui.tip('detail')]]),
    rows: clients.slice(0, 6).map((x) => row(String(x.id), [cell(x.name, UserRound, 'text-[#6b7cff]', ui.tip('client')), cell(x.segment, FileText, 'text-[#00c2d7]', ui.tip('segment')), cell(x.owner, UserRound, 'text-[#8b5cf6]', ui.tip('owner'))], ui.stage(x.stage), 'bg-[#8b5cf6]/12 text-[#6d3fd1]', [cell(x.segment, FileText, 'text-[#00c2d7]', ui.tip('segment')), cell(x.owner, UserRound, 'text-[#8b5cf6]', ui.tip('owner')), cell(ui.stage(x.stage), x.stage === 'Tancat' ? Check : Circle, 'text-[#6b7cff]', ui.tip('phase'))], x.stage === 'Tancat' ? Check : x.stage === 'Proposta' ? FileText : Circle, ui.t('phase'), () => onSetStage(x.id, nextLeadStage(x.stage)), clientDetail(x, ui))),
  };
  if (view === 'pipeline') return {
    title: ui.t('orders'), width: 'min-w-[700px]', headers: heads([[ui.t('order'), ui.tip('order')], [ui.t('client'), ui.tip('client')], [ui.t('type'), ui.tip('type')], [ui.t('technician'), ui.tip('technician')], [ui.t('priority'), ui.tip('priority')], ['SLA', ui.tip('sla')], [ui.t('status'), ui.tip('status')], [ui.t('action'), ui.tip('detail')]]),
    rows: jobs.slice(0, 6).map((x) => row(x.id, [cell(x.id, undefined, undefined, ui.tip('order')), cell(x.client, UserRound, 'text-[#8b5cf6]', ui.tip('client')), cell(ui.type(x.type), typeIcon(x.type), typeTone(x.type), ui.tip('type')), cell(x.technician, UserRound, 'text-[#6b7cff]', ui.tip('technician')), cell(ui.priority(x.priority), priorityIcon(x.priority), priorityTone(x.priority), ui.tip('priority')), cell(ui.sla(x.sla), slaIcon(x.sla), slaTone(x.sla), ui.tip('sla'))], ui.state(x.state), stateTone(x.state), [cell(x.title, FileText, 'text-[#8b5cf6]', ui.tip('order')), cell(x.location, Wrench, 'text-[#00c2d7]', ui.t('location')), cell(x.eta, Circle, 'text-[#facc15]', ui.t('eta')), cell(x.description, FileText, 'text-[#8a8f98]', ui.t('detail'))], stateIcon(x.state), ui.t('status'), () => onSetJobState(x.id, nextJobState(x.state)), jobDetail(x, ui))),
  };
  if (view === 'inventory') return {
    title: ui.t('materials'), width: 'min-w-[650px]', headers: heads([[ui.t('material'), ui.tip('material')], [ui.t('category'), ui.t('type')], [ui.t('stock'), ui.tip('stock')], [ui.t('minStock'), ui.tip('stock')], [ui.t('supplier'), ui.tip('supplier')], [ui.t('status'), ui.tip('status')], [ui.t('action'), ui.tip('detail')]]),
    rows: material.slice(0, 6).map((x) => { const p = getMaterialProfile(x, 0, false, ui.locale); return row(x.id, [cell(x.name, Boxes, stockIconTone(x.state), ui.tip('material')), cell(p.category, FileText, 'text-[#8b5cf6]', ui.tip('type')), cell(String(x.qty), Boxes, 'text-[#6b7cff]', ui.tip('stock')), cell(String(x.min), CircleAlert, 'text-[#facc15]', ui.tip('stock')), cell(p.supplier, Truck, 'text-[#00c2d7]', ui.tip('supplier'))], ui.stock(x.state), x.state === 'OK' ? 'bg-[#22c55e]/12 text-[#15803d]' : 'bg-[#ef4444]/12 text-[#b91c1c]', [cell(p.location, Boxes, 'text-[#6b7cff]', ui.t('location')), cell(p.leadTime, Truck, 'text-[#00c2d7]', ui.t('leadTime')), cell(String(p.available), Check, 'text-[#22c55e]', ui.t('available')), cell(p.recommendation, CircleAlert, 'text-[#facc15]', ui.t('automations'))], stockIcon(x.state), '+1', () => onIncrement(x.id), materialDetail(x, p, ui)); }),
  };
  if (view === 'access') return {
    title: ui.t('access'), width: 'min-w-[460px]', headers: heads([['Usuari', ui.tip('technician')], ['Rol', ui.t('access')], ['Zona', ui.t('location')], ['Estat', ui.t('status')], [ui.t('action'), ui.tip('detail')]]),
    rows: team.map((x) => row(x.id, [cell(x.name, UserRound, 'text-[#6b7cff]', ui.tip('technician')), cell(x.role, Wrench, 'text-[#00c2d7]', ui.t('access')), cell(x.zone, FileText, 'text-[#8b5cf6]', ui.t('location'))], x.enabled ? ui.t('active') : ui.t('blocked'), x.enabled ? 'bg-[#22c55e]/12 text-[#15803d]' : 'bg-[#ef4444]/12 text-[#b91c1c]', [cell(ui.text(x.role), Wrench, 'text-[#00c2d7]', ui.t('access')), cell(x.zone, FileText, 'text-[#8b5cf6]', ui.t('location')), cell(x.enabled ? ui.t('active') : ui.t('blocked'), x.enabled ? Check : X, x.enabled ? 'text-[#22c55e]' : 'text-[#ff5c5c]', ui.t('status'))], x.enabled ? Check : X, x.enabled ? ui.t('blocked') : ui.t('active'), () => onToggle(x.id), { groups: [{ title: ui.t('access'), cells: [cell(ui.text(x.role), Wrench, 'text-[#00c2d7]', 'Rol'), cell(x.zone, MapPin, 'text-[#8b5cf6]', ui.t('location')), cell(x.enabled ? ui.t('active') : ui.t('blocked'), x.enabled ? Check : X, x.enabled ? 'text-[#22c55e]' : 'text-[#ff5c5c]', ui.t('status'))] }] })),
  };
  return {
    title: 'Vista operativa', width: 'min-w-[500px]', headers: heads([['Tipus', ui.tip('type')], ['Element', ui.tip('detail')], ['Responsable', ui.tip('owner')], ['Estat', ui.tip('status')], ['', ui.tip('detail')]]),
    rows: [
      row('dash-sat', [cell('SAT', Wrench, 'text-[#00c2d7]'), cell(jobs[0]?.title ?? '-', FileText, 'text-[#8b5cf6]'), cell(jobs[0]?.technician ?? '-', UserRound, 'text-[#6b7cff]')], jobs[0]?.sla ?? 'OK', 'bg-[#f59e0b]/16 text-[#b45309]', [cell(jobs[0]?.description ?? '-', FileText, 'text-[#8a8f98]')], slaIcon(jobs[0]?.sla ?? 'OK')),
      row('dash-crm', [cell('CRM', Circle, 'text-[#6b7cff]'), cell(clients[0]?.name ?? '-', UserRound, 'text-[#8b5cf6]'), cell(clients[0]?.owner ?? '-', UserRound, 'text-[#6b7cff]')], ui.t('clients'), 'bg-[#8b5cf6]/12 text-[#6d3fd1]', [cell(clients[0]?.segment ?? '-', FileText, 'text-[#00c2d7]')], UserRound),
      row('dash-stock', [cell('Stock', Boxes, 'text-[#ff5c5c]'), cell(material.find((x) => x.state === 'Crític')?.name ?? '-', Boxes, 'text-[#ef4444]'), cell(ui.t('material'), FileText, 'text-[#8b5cf6]')], ui.t('alerts'), 'bg-[#ef4444]/12 text-[#b91c1c]', [cell(ui.t('materials'), Boxes, 'text-[#ff5c5c]')], CircleAlert),
    ],
  };
}

function row(id: string, cells: Cell[], badge: string, tone: string, detail: Cell[], statusIcon?: LucideIcon, action?: string, onAction?: () => void, options?: { groups?: MobileDetailGroup[]; summary?: string }): Row {
  return { id, cells, badge, tone, detail, statusIcon, action, onAction, groups: options?.groups, summary: options?.summary };
}

function heads(items: readonly [string, string][]): Header[] { return items.map(([label, tip]) => ({ label, tip })); }
function cell(text: string, icon?: LucideIcon, tone?: string, tip?: string): Cell { return { text, icon, tone, tip }; }
function CellView({ cell: item }: { cell: Cell }) { const Icon = item.icon; const body = <span className="flex items-center gap-1.5 whitespace-nowrap">{Icon ? <Icon className={`h-3.5 w-3.5 ${item.tone ?? 'text-[#8a8f98]'}`} /> : null}{item.text}</span>; return item.tip ? <FloatingTip text={item.tip}>{body}</FloatingTip> : body; }
function clientDetail(client: Client, ui: ReturnType<typeof useSoftwareText>) { const even = client.id % 2 === 0, proposal = client.stage === 'Proposta' || client.stage === 'Tancat'; return { summary: `${client.segment}. ${ui.t('owner')} ${client.owner}.`, groups: [{ title: ui.t('sourceQualification'), cells: [cell(even ? 'Google Business' : 'Web corporativa', Target, 'text-[#6b7cff]', ui.t('leadSource')), cell(proposal ? 'Alta intenció' : 'Validant abast', Circle, 'text-[#facc15]', ui.t('interest')), cell(client.segment.includes('comunitari') ? 'Administrador finques' : 'Gerència', UserRound, 'text-[#8b5cf6]', ui.t('decisionMaker'))] }, { title: ui.t('contact'), cells: [cell(even ? '972 418 206' : '972 000 148', Phone, 'text-[#22c55e]', ui.t('phone')), cell(`${client.name.toLowerCase().replaceAll(' ', '.')}@client.cat`, Mail, 'text-[#00c2d7]', ui.t('email')), cell(even ? 'Girona nord' : 'Girona centre', MapPin, 'text-[#f59e0b]', ui.t('location'))] }, { title: ui.t('closeForecast'), cells: [cell(client.segment.includes('Caldera') ? '1.850 €' : '3.600 €/any', Euro, 'text-[#22c55e]', ui.t('estimatedValue')), cell(proposal ? '72%' : '48%', Target, 'text-[#facc15]', ui.t('probability')), cell(proposal ? 'Aquesta setmana' : 'Avui · 16:30', CalendarCheck, 'text-[#00c2d7]', ui.t('nextContact'))] }] }; }
function jobDetail(job: Job, ui: ReturnType<typeof useSoftwareText>) { return { summary: job.description, groups: [{ title: ui.t('detail'), cells: [cell(job.client, UserRound, 'text-[#8b5cf6]', ui.t('client')), cell(job.contact, Phone, 'text-[#22c55e]', ui.t('contact')), cell(job.location, MapPin, 'text-[#f59e0b]', ui.t('location')), cell(job.asset, Wrench, 'text-[#6b7cff]', ui.t('asset'))] }, { title: ui.t('resolution'), cells: [cell(job.diagnosis, SearchCheck, 'text-[#00c2d7]', ui.t('diagnosis')), cell(job.resolution, ClipboardCheck, 'text-[#22c55e]', job.state === 'Completat' ? ui.t('applied') : ui.t('resolution')), cell(job.eta, Circle, 'text-[#facc15]', ui.t('eta'))] }, { title: ui.t('materials'), cells: job.materials.length ? job.materials.map((item) => cell(`${item.name} · ${item.qty} · ${item.state}`, Package, 'text-[#6b7cff]', ui.t('material'))) : [cell(ui.t('noReserved'), Package, 'text-[#8a8f98]', ui.t('materials'))] }, { title: ui.t('evidence'), cells: (job.photos.length ? job.photos : [{ label: ui.t('pending') }]).map((photo) => cell(photo.label, Camera, 'text-[#8b5cf6]', ui.t('evidence'))) }] }; }
function materialDetail(item: Material, profile: ReturnType<typeof getMaterialProfile>, ui: ReturnType<typeof useSoftwareText>) { return { summary: `${profile.recommendation} ${ui.t('available')}: ${profile.available}`, groups: [{ title: ui.t('stock'), cells: [cell(`${item.qty} / ${item.min}`, Boxes, 'text-[#6b7cff]', `${ui.t('stock')} / ${ui.t('minStock')}`), cell(String(profile.reserved), Check, 'text-[#22c55e]', ui.t('reserved')), cell(profile.ordered ? String(profile.ordered) : ui.t('noOrder'), Truck, 'text-[#facc15]', ui.t('order'))] }, { title: ui.t('supplier'), cells: [cell(profile.supplier, Truck, 'text-[#00c2d7]', ui.t('supplier')), cell(profile.supplierContact, UserRound, 'text-[#8b5cf6]', ui.t('supplierContact')), cell(profile.leadTime, CalendarCheck, 'text-[#facc15]', ui.t('leadTime')), cell(`${profile.unitPrice.toFixed(2)} €`, Euro, 'text-[#22c55e]', ui.t('price')), cell(profile.location, MapPin, 'text-[#ef4444]', ui.t('location'))] }, { title: ui.t('history'), cells: profile.history.map((entry) => cell(entry, FileText, 'text-[#8a8f98]', ui.t('history'))) }] }; }
function typeIcon(type: Job['type']) { return type === 'Reparacio' ? Wrench : type === 'Manteniment' ? ClipboardCheck : type === 'Muntatge' ? Hammer : SearchCheck; }
function typeTone(type: Job['type']) { return type === 'Reparacio' ? 'text-[#00c2d7]' : type === 'Manteniment' ? 'text-[#22c55e]' : type === 'Muntatge' ? 'text-[#6b7cff]' : 'text-[#facc15]'; }
function stateTone(state: JobState) { return state === 'Completat' ? 'bg-[#22c55e]/12 text-[#15803d]' : state === 'Blocat' ? 'bg-[#ef4444]/12 text-[#b91c1c]' : state === 'En curs' ? 'bg-[#00c2d7]/12 text-[#0e7490]' : 'bg-[#8a8f98]/12 text-[#62666d]'; }
function stateIcon(state: JobState) { return state === 'Completat' ? Check : state === 'Blocat' ? X : state === 'En curs' ? Wrench : Circle; }
function priorityIcon(value: Job['priority']) { return value === 'Alta' ? SignalHigh : value === 'Mitja' ? SignalMedium : SignalLow; }
function priorityTone(value: Job['priority']) { return value === 'Alta' ? 'text-[#ff5c5c]' : value === 'Mitja' ? 'text-[#facc15]' : 'text-[#6b7cff]'; }
function slaIcon(value: Job['sla']) { return value === 'OK' ? Check : value === 'Risc' ? CircleAlert : X; }
function slaTone(value: Job['sla']) { return value === 'OK' ? 'text-[#22c55e]' : value === 'Risc' ? 'text-[#facc15]' : 'text-[#ff5c5c]'; }
function stockIcon(value: Material['state']) { return value === 'OK' ? Check : value === 'Baix' ? CircleAlert : X; }
function stockIconTone(value: Material['state']) { return value === 'OK' ? 'text-[#22c55e]' : value === 'Baix' ? 'text-[#facc15]' : 'text-[#ff5c5c]'; }
