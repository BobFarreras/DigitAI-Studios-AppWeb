/**
 * @file src/components/landing/v2/custom-software/CustomSoftwareMobileDemo.tsx
 * @updated 2026-05-15
 * @summary Mockup mobil realista del simulador de software.
 * @scope Shell mobil, bottom nav i orquestracio de taules compactes.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Boxes, CheckCircle2, CircleAlert, Plus, ShieldCheck, Users, Wrench, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { Client, Job, JobState, LeadStage, Material, Member, ViewId } from './model';
import { views } from './model';
import { MobileDashboardCharts } from './MobileDashboardCharts';
import { MobileSoftwareDetail } from './MobileSoftwareDetail';
import { MobileSoftwareTable, type MobileSoftwareSelection } from './MobileSoftwareTable';
import { useSoftwareText } from './software-i18n';

type Props = {
  view: ViewId;
  clients: Client[];
  jobs: Job[];
  material: Material[];
  team: Member[];
  onOpenView: (id: ViewId) => void;
  onAddClient: () => void;
  onAddJob: () => void;
  onAddMaterial: () => void;
  onSetStage: (id: number, stage: LeadStage) => void;
  onSetJobState: (id: string, state: JobState) => void;
  onIncrement: (id: string) => void;
  onToggle: (id: string) => void;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function CustomSoftwareMobileDemo(props: Props) {
  const { view, clients, jobs, material, team, onOpenView, onAddClient, onAddJob, onAddMaterial } = props;
  const ui = useSoftwareText();
  const [selected, setSelected] = useState<MobileSoftwareSelection | null>(null);
  const activeView = views.find((item) => item.id === view) ?? views[0];
  const cta = view === 'crm' ? onAddClient : view === 'pipeline' ? onAddJob : view === 'inventory' ? onAddMaterial : undefined;
  const selectedRow = selected?.view === view ? selected.row : null;

  return (
    <motion.div initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.24 }} transition={{ duration: 0.86, ease: smoothEase }} className="md:hidden">
      <div className="mx-auto w-full max-w-[360px] rounded-[28px] border border-[#b8c0ce] bg-[#08090a] p-1.5 shadow-[0_22px_58px_rgba(8,9,10,0.22)] dark:border-[#3a3d44]">
        <div className="relative overflow-hidden rounded-[23px] bg-[#f7f8f8] dark:bg-[#0f1011]">
          <div className="flex h-5 items-center justify-center bg-[#08090a] dark:bg-black">
            <span className="h-1 w-16 rounded-full bg-[#323334]" />
          </div>
          <div className="border-b border-[#d0d6e0] bg-white px-3 py-2 dark:border-[#23252a] dark:bg-[#08090a]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#5e6ad2] to-[#27a644]"><Activity className="h-4 w-4 text-white" /></div>
                <div><p className="text-[12px] font-[740] leading-tight">Lampisteria Costa Brava</p><p className="mt-0.5 text-[10px] font-[560] text-[#62666d] dark:text-[#aeb7c6]">Demo app</p></div>
              </div>
              {cta ? <button onClick={cta} className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] dark:border-[#323334] dark:bg-[#161718]"><Plus className="h-4 w-4" /></button> : null}
            </div>
          </div>
          <main className="h-[min(430px,58svh)] overflow-y-auto bg-[#eef1f6] p-2.5 pb-3 dark:bg-[#111315]">
            <section className="flex items-center justify-between gap-2 rounded-[9px] border border-[#d0d6e0] bg-white p-2 shadow-[0_10px_24px_rgba(8,9,10,0.07)] dark:border-[#23252a] dark:bg-[#161718]">
              <div className="min-w-0"><p className="text-[9px] font-[650] uppercase text-[#62666d] dark:text-[#8a8f98]">{labelFor(activeView.id, activeView.label, ui)}</p><p className="truncate text-[14px] font-[760] leading-tight">{titleFor(view, ui)}</p></div>
              <Summary view={view} clients={clients} jobs={jobs} material={material} team={team} />
            </section>
            {view === 'dashboard' ? <MobileDashboardCharts /> : null}
            <MobileSoftwareTable {...props} onOpenDetail={setSelected} />
          </main>
          <nav className="grid grid-cols-5 border-t border-[#d0d6e0] bg-white px-1 py-1.5 dark:border-[#23252a] dark:bg-[#08090a]">
            {views.map((item) => {
              const Icon = item.icon, isActive = item.id === view;
              return <button key={item.id} onClick={() => onOpenView(item.id)} className={`flex flex-col items-center gap-1 rounded-[7px] px-1 py-1 text-[9px] font-[680] ${isActive ? 'bg-[#eceff4] text-[#08090a] dark:bg-[#23252a] dark:text-[#f7f8f8]' : 'text-[#62666d] dark:text-[#8a8f98]'}`}><Icon className={`h-4 w-4 ${isActive ? 'text-[#5e6ad2]' : ''}`} />{labelFor(item.id, item.label, ui)}</button>;
            })}
          </nav>
          <AnimatePresence>{selectedRow ? <MobileSoftwareDetail row={selectedRow} onBack={() => setSelected(null)} /> : null}</AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Summary({ view, clients, jobs, material, team }: Pick<Props, 'view' | 'clients' | 'jobs' | 'material' | 'team'>) {
  const stats = view === 'dashboard'
    ? [{ icon: Users, label: 'CRM', value: clients.length }, { icon: Wrench, label: 'SAT', value: jobs.filter((x) => x.state !== 'Completat').length }, { icon: Boxes, label: 'Stock', value: material.filter((x) => x.state !== 'OK').length }]
    : view === 'crm' ? [{ icon: Users, label: 'Actius', value: clients.length }, { icon: CheckCircle2, label: 'Proposta', value: clients.filter((x) => x.stage === 'Proposta').length }]
    : view === 'pipeline' ? [{ icon: Wrench, label: 'Oberts', value: jobs.filter((x) => x.state !== 'Completat').length }, { icon: CircleAlert, label: 'Risc', value: jobs.filter((x) => x.sla !== 'OK').length }]
    : view === 'inventory' ? [{ icon: Boxes, label: 'Refs', value: material.length }, { icon: CircleAlert, label: 'Crítics', value: material.filter((x) => x.state === 'Crític').length }]
    : [{ icon: Users, label: 'Equip', value: team.length }, { icon: ShieldCheck, label: 'Actius', value: team.filter((x) => x.enabled).length }];
  return <div className="flex shrink-0 items-center gap-1">{stats.map((stat) => <Stat key={stat.label} {...stat} />)}</div>;
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return <div className="flex items-center gap-1 rounded-[6px] bg-[#eef1f6] px-1.5 py-1 dark:bg-[#08090a]"><Icon className="h-3 w-3 text-[#5e6ad2]" /><span className="text-[11px] font-[760] leading-none">{value}</span><span className="text-[8px] font-[620] text-[#62666d] dark:text-[#8a8f98]">{label}</span></div>;
}

function labelFor(id: ViewId, label: string, ui: ReturnType<typeof useSoftwareText>) {
  if (id === 'pipeline') return ui.t('sat');
  if (id === 'inventory') return ui.t('materials');
  if (id === 'access') return ui.t('access');
  return label;
}

function titleFor(id: ViewId, ui: ReturnType<typeof useSoftwareText>) {
  if (id === 'dashboard') return 'Vista operativa';
  return id === 'crm' ? ui.t('clients') : id === 'pipeline' ? ui.t('orders') : id === 'inventory' ? ui.t('materials') : ui.t('access');
}
