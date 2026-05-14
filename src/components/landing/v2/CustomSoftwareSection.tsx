'use client';
/**
 * @file src/components/landing/v2/CustomSoftwareSection.tsx
 * @updated 2026-05-13
 * @summary Seccio software a mida amb simulador usable.
 * @scope Orquestracio d'estat i navegacio entre vistes del simulador.
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { useLocale } from 'next-intl';
import { BrandRevealText } from '@/components/ui/brand-reveal';
import { getSoftwareCopy } from './custom-software/copy';
import { AccessView } from './custom-software/AccessView';
import { CrmView } from './custom-software/CrmView';
import { DashboardView } from './custom-software/DashboardView';
import { InventoryView } from './custom-software/InventoryView';
import { PipelineView } from './custom-software/PipelineView';
import { startClients, startJobs, startMaterial, startTeam, toStockState, views, type JobState, type LeadStage, type NewMaterial, type NewSatOrder, type ViewId } from './custom-software/model';
import { useSoftwareText } from './custom-software/software-i18n';

export function CustomSoftwareSection() {
  const copy = getSoftwareCopy(useLocale()), ui = useSoftwareText();
  const [view, setView] = useState<ViewId>('dashboard');
  const [targetJob, setTargetJob] = useState<string | null>(null), [targetClient, setTargetClient] = useState<string | null>(null), [targetMaterial, setTargetMaterial] = useState<string | null>(null);
  const [clientName, setClientName] = useState(''), [jobTitle, setJobTitle] = useState(''), [materialName, setMaterialName] = useState(''), [userName, setUserName] = useState('');
  const [clients, setClients] = useState(startClients), [jobs, setJobs] = useState(startJobs), [material, setMaterial] = useState(startMaterial), [team, setTeam] = useState(startTeam);
  const openView = (id: ViewId) => { setTargetJob(null); setTargetClient(null); setTargetMaterial(null); setView(id); };
  const addClient = () => { const name = clientName.trim(); if (!name) return; setClients((p) => [{ id: Date.now(), name, segment: 'Nou servei', owner: 'Assignar', stage: 'Nou' }, ...p]); setClientName(''); };
  const addJob = (input?: NewSatOrder) => {
    const title = input?.title?.trim() || jobTitle.trim();
    if (!title) return;
    setJobs((p) => [{
      id: `SAT-${Math.floor(Math.random() * 900 + 100)}`,
      title,
      client: input?.client || clients[0]?.name || 'Client nou',
      state: 'Pendent',
      priority: input?.priority || 'Mitja',
      sla: input?.sla || 'OK',
      technician: input?.technician || 'Assignar',
      eta: input?.eta || 'Planificar',
      type: input?.type || 'Reparacio',
      contact: input?.contact || 'Contacte pendent',
      location: input?.location || 'Ubicacio pendent',
      asset: 'Instal·lació pendent de revisar',
      description: input?.description || 'Avaria de lampisteria pendent de qualificar pel coordinador SAT.',
      diagnosis: 'Pendent de diagnosi tecnica a obra.',
      resolution: 'Proxim pas: confirmar acces, preparar material i validar tall d aigua si cal.',
      materials: [],
      photos: [],
    }, ...p]);
    if (!input) setJobTitle('');
  };
  const addMaterial = (input?: NewMaterial) => { const name = (input?.name ?? materialName).trim(); if (!name) return; const qty = input?.qty ?? 2, min = input?.min ?? 5; setMaterial((p) => [{ id: `MAT-${Math.floor(Math.random() * 900 + 100)}`, name, qty, min, category: input?.category, supplier: input?.supplier, supplierContact: input?.supplierContact, unitPrice: input?.unitPrice, leadTime: input?.leadTime, state: toStockState(qty, min) }, ...p]); setMaterialName(''); };
  const addUser = (inputName?: string) => { const name = (inputName ?? userName).trim(); if (!name) return; setTeam((p) => [{ id: `USR-${Math.floor(Math.random() * 90 + 10)}`, name, role: 'Tècnic', zone: 'Nova zona', enabled: true }, ...p]); setUserName(''); };

  return (
    <section id="software-a-mida" className="relative w-full px-4 pb-5 pt-[88px] md:px-6 md:pb-6 md:pt-[94px] lg:pb-8 lg:pt-[102px]">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-6 max-w-5xl text-center sm:mb-7 lg:mb-8">
          <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">{ui.text('Tecnologia que s\'adapta al teu equip')}<BrandRevealText className="ml-1 text-[#383b3f] dark:text-[#8a8f98]">{ui.text('i creix amb el teu negoci.')}</BrandRevealText></h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="relative overflow-hidden rounded-[12px] border border-[#d0d6e0] bg-white/70 [filter:grayscale(1)_saturate(0)_contrast(.94)] transition-all duration-500 hover:[filter:grayscale(0)_saturate(1)_contrast(1)] dark:border-[#323334] dark:bg-[#0f1011]/95">
          <div className="flex min-h-[clamp(560px,73svh,760px)] flex-col md:flex-row">
            <aside className="w-full border-b border-[#d0d6e0] bg-white/78 md:w-[240px] md:border-b-0 md:border-r dark:border-[#23252a] dark:bg-[#08090a]/90">
              <div className="flex h-14 items-center gap-3 px-4"><div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#5e6ad2] to-[#27a644]"><Database className="h-4 w-4 text-white" /></div><span className="text-[14px] font-[590]">Lampisteria Costa Brava</span></div>
              <nav className="grid grid-cols-2 gap-2 p-3 md:grid-cols-1">{views.map((item) => <button key={item.id} onClick={() => openView(item.id)} className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-left text-[13px] ${view === item.id ? 'border border-[#b8c0ce] bg-[#eceff4] dark:border-[#323334] dark:bg-[#161718]' : 'border border-transparent text-[#62666d] hover:bg-[#eef1f6] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}><item.icon className="h-4 w-4" />{item.id === 'pipeline' ? ui.t('sat') : item.id === 'inventory' ? ui.t('materials') : item.id === 'access' ? ui.t('access') : item.label}</button>)}</nav>
            </aside>
            <main className="min-w-0 flex-1">
              <div className="h-[clamp(616px,70svh,796px)] overflow-hidden p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {view === 'dashboard' && <DashboardView copy={copy} onOpenCrm={() => setView('crm')} onAddJob={addJob} onAddClient={addClient} />}
                  {view === 'crm' && <CrmView clients={clients} targetClient={targetClient} clientName={clientName} onSetClientName={setClientName} onAddClient={addClient} onSetStage={(id, stage: LeadStage) => setClients((p) => p.map((x) => (x.id === id ? { ...x, stage } : x)))} />}
                  {view === 'pipeline' && <PipelineView jobs={jobs} targetJob={targetJob} jobTitle={jobTitle} onSetJobTitle={setJobTitle} onAddJob={addJob} onSetJobState={(id, state: JobState) => setJobs((p) => p.map((x) => (x.id === id ? { ...x, state } : x)))} />}
                  {view === 'inventory' && <InventoryView material={material} targetMaterial={targetMaterial} materialName={materialName} onSetMaterialName={setMaterialName} onAddMaterial={addMaterial} onIncrement={(id) => setMaterial((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1, state: toStockState(x.qty + 1, x.min) } : x)))} />}
                  {view === 'access' && <AccessView team={team} jobs={jobs} userName={userName} onSetUserName={setUserName} onAddUser={addUser} onOpenSat={(id) => { setTargetJob(id); setView('pipeline'); }} onOpenCrm={(name) => { setTargetClient(name); setView('crm'); }} onOpenMaterial={(name) => { setTargetMaterial(name); setView('inventory'); }} onToggle={(id) => setTeam((p) => p.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)))} />}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
