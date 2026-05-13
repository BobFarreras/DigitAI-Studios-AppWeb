'use client';
/**
 * @file src/components/landing/v2/CustomSoftwareSection.tsx
 * @updated 2026-05-13
 * @summary Seccio software a mida amb simulador usable.
 * @scope Orquestracio d'estat i navegacio entre vistes del simulador.
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Database, Search, ShieldCheck } from 'lucide-react';
import { useLocale } from 'next-intl';
import { BrandRevealText } from '@/components/ui/brand-reveal';
import { getSoftwareCopy } from './custom-software/copy';
import { AccessView } from './custom-software/AccessView';
import { CrmView } from './custom-software/CrmView';
import { DashboardView } from './custom-software/DashboardView';
import { InventoryView } from './custom-software/InventoryView';
import { PipelineView } from './custom-software/PipelineView';
import { nextJobState, nextLeadStage, startClients, startJobs, startMaterial, startTeam, toStockState, views, type NewSatOrder, type ViewId } from './custom-software/model';

export function CustomSoftwareSection() {
  const copy = getSoftwareCopy(useLocale());
  const [view, setView] = useState<ViewId>('dashboard');
  const [query, setQuery] = useState('');
  const [clientName, setClientName] = useState(''), [jobTitle, setJobTitle] = useState(''), [materialName, setMaterialName] = useState(''), [userName, setUserName] = useState('');
  const [clients, setClients] = useState(startClients), [jobs, setJobs] = useState(startJobs), [material, setMaterial] = useState(startMaterial), [team, setTeam] = useState(startTeam);
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
    }, ...p]);
    if (!input) setJobTitle('');
  };
  const addMaterial = () => { const name = materialName.trim(); if (!name) return; setMaterial((p) => [{ id: `MAT-${Math.floor(Math.random() * 900 + 100)}`, name, qty: 2, min: 5, state: 'Baix' }, ...p]); setMaterialName(''); };
  const addUser = () => { const name = userName.trim(); if (!name) return; setTeam((p) => [{ id: `USR-${Math.floor(Math.random() * 90 + 10)}`, name, role: 'Tècnic', zone: 'Nova zona', enabled: true }, ...p]); setUserName(''); };

  return (
    <section id="software-a-mida" className="relative w-full border-t border-[#d0d6e0] px-4 pb-5 pt-[88px] dark:border-[#23252a] md:px-6 md:pb-6 md:pt-[94px] lg:pb-8 lg:pt-[102px]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-5xl sm:mb-7 lg:mb-8">
          <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">Tecnologia que s&apos;adapta al teu equip<BrandRevealText className="ml-1 text-[#383b3f] dark:text-[#8a8f98]">i creix amb el teu negoci.</BrandRevealText></h2>
          <p className="mt-4 max-w-4xl text-[14px] leading-[1.5] text-[#62666d] dark:text-[#8a8f98] sm:text-[15px]">Demo real d&apos;un SAT amb CRM, pipeline, materials i accessos. Sense persistencia: si recarregues, es reinicia.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="relative overflow-hidden rounded-[12px] border border-[#d0d6e0] bg-white/70 dark:border-[#323334] dark:bg-[#0f1011]/95">
          <div className="flex min-h-[clamp(560px,73svh,760px)] flex-col md:flex-row">
            <aside className="w-full border-b border-[#d0d6e0] bg-white/78 md:w-[240px] md:border-b-0 md:border-r dark:border-[#23252a] dark:bg-[#08090a]/90">
              <div className="flex h-14 items-center gap-3 px-4"><div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#5e6ad2] to-[#27a644]"><Database className="h-4 w-4 text-white" /></div><span className="text-[14px] font-[590]">DigitAI SAT</span></div>
              <nav className="grid grid-cols-2 gap-2 p-3 md:grid-cols-1">{views.map((item) => <button key={item.id} onClick={() => setView(item.id)} className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-left text-[13px] ${view === item.id ? 'border border-[#b8c0ce] bg-[#eceff4] dark:border-[#323334] dark:bg-[#161718]' : 'border border-transparent text-[#62666d] hover:bg-[#eef1f6] dark:text-[#8a8f98] dark:hover:bg-[#161718]'}`}><item.icon className="h-4 w-4" />{item.label}</button>)}</nav>
              <div className="hidden border-t border-[#d0d6e0] p-4 md:block dark:border-[#23252a]"><div className="flex items-center gap-2 text-[12px] text-[#62666d] dark:text-[#8a8f98]"><ShieldCheck className="h-4 w-4 text-[#27a644]" />Control segur i traçable</div></div>
            </aside>
            <main className="min-w-0 flex-1">
              <header className="flex h-14 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a] md:px-6">
                <div className="flex items-center gap-3"><h3 className="text-[14px] font-[590]">{views.find((v) => v.id === view)?.label}</h3><span className="rounded-full border border-[#b8c0ce] bg-[#eceff4] px-2 py-0.5 text-[11px] text-[#62666d] dark:border-[#323334] dark:bg-[#161718] dark:text-[#8a8f98]">LIVE</span></div>
                <div className="flex items-center gap-3"><label className="hidden items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2.5 py-1.5 dark:border-[#323334] dark:bg-[#08090a] md:flex"><Search className="h-3.5 w-3.5 text-[#8a8f98]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca client..." className="w-40 bg-transparent text-[12px] outline-none placeholder:text-[#8a8f98]" /></label><button className="relative text-[#62666d] dark:text-[#8a8f98]"><Bell className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e4f222]" /></button></div>
              </header>
              <div className="h-[clamp(560px,64svh,740px)] overflow-hidden p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {view === 'dashboard' && <DashboardView copy={copy} onOpenCrm={() => setView('crm')} onAddJob={addJob} onAddClient={addClient} />}
                  {view === 'crm' && <CrmView clients={clients} query={query} clientName={clientName} onSetClientName={setClientName} onAddClient={addClient} onMoveStage={(id) => setClients((p) => p.map((x) => (x.id === id ? { ...x, stage: nextLeadStage(x.stage) } : x)))} />}
                  {view === 'pipeline' && <PipelineView jobs={jobs} jobTitle={jobTitle} onSetJobTitle={setJobTitle} onAddJob={addJob} onAdvance={(id) => setJobs((p) => p.map((x) => (x.id === id ? { ...x, state: nextJobState(x.state) } : x)))} />}
                  {view === 'inventory' && <InventoryView material={material} materialName={materialName} onSetMaterialName={setMaterialName} onAddMaterial={addMaterial} onIncrement={(id) => setMaterial((p) => p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1, state: toStockState(x.qty + 1, x.min) } : x)))} />}
                  {view === 'access' && <AccessView team={team} userName={userName} onSetUserName={setUserName} onAddUser={addUser} onToggle={(id) => setTeam((p) => p.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)))} />}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
