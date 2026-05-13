'use client';
/**
 * @file src/components/landing/v2/CustomSoftwareSection.tsx
 * @updated 2026-05-13
 * @summary Showcase interactiu d'un SAT real amb CRM, pipeline, material i accessos.
 * @scope Simulacio client-side usable dins la landing, sense persistencia.
 */

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Boxes,
  Database,
  KeyRound,
  LayoutDashboard,
  PackagePlus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { BrandRevealText } from '@/components/ui/brand-reveal';

type ViewId = 'dashboard' | 'crm' | 'pipeline' | 'inventory' | 'access';
type LeadStage = 'Nou' | 'Qualificat' | 'Proposta' | 'Tancat';
type JobState = 'Pendent' | 'En curs' | 'Blocat' | 'Completat';
type StockState = 'OK' | 'Baix' | 'Crític';
type Role = 'Tècnic' | 'Coordinador' | 'Admin';

type Client = { id: number; name: string; segment: string; owner: string; stage: LeadStage; nextAction: string };
type Job = { id: string; title: string; client: string; state: JobState; eta: string };
type Material = { id: string; name: string; qty: number; min: number; state: StockState };
type Member = { id: string; name: string; role: Role; zone: string; enabled: boolean };

type View = { id: ViewId; label: string; icon: LucideIcon };
const VIEWS: View[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'pipeline', label: 'Pipeline SAT', icon: Wrench },
  { id: 'inventory', label: 'Material', icon: Boxes },
  { id: 'access', label: 'Accessos', icon: KeyRound },
];

const START_CLIENTS: Client[] = [
  { id: 1, name: 'Hotel Costa Brava', segment: 'Manteniment', owner: 'Marta', stage: 'Qualificat', nextAction: 'Trucada 16:30' },
  { id: 2, name: 'Clínica Nexe', segment: 'Instal·lació', owner: 'Nil', stage: 'Proposta', nextAction: 'Enviar pressupost' },
  { id: 3, name: 'LogisNord', segment: 'SAT 24/7', owner: 'Júlia', stage: 'Nou', nextAction: 'Validar incidència' },
];

const START_JOBS: Job[] = [
  { id: 'SAT-912', title: 'Revisió centraleta', client: 'Hotel Costa Brava', state: 'En curs', eta: '14:45' },
  { id: 'SAT-913', title: 'Fallada accés remot', client: 'Clínica Nexe', state: 'Blocat', eta: 'Espera validació' },
  { id: 'SAT-914', title: 'Manteniment preventiu', client: 'LogisNord', state: 'Pendent', eta: 'Demà 09:00' },
];

const START_MATERIAL: Material[] = [
  { id: 'MAT-011', name: 'Router industrial', qty: 7, min: 4, state: 'OK' },
  { id: 'MAT-023', name: 'Switch PoE 16p', qty: 3, min: 5, state: 'Baix' },
  { id: 'MAT-045', name: 'SSD 1TB', qty: 1, min: 3, state: 'Crític' },
];

const START_TEAM: Member[] = [
  { id: 'USR-01', name: 'Marta Casas', role: 'Admin', zone: 'Girona', enabled: true },
  { id: 'USR-02', name: 'Nil Ruiz', role: 'Coordinador', zone: 'Barcelona', enabled: true },
  { id: 'USR-03', name: 'Júlia Serra', role: 'Tècnic', zone: 'Tarragona', enabled: true },
];

function nextLeadStage(stage: LeadStage): LeadStage {
  if (stage === 'Nou') return 'Qualificat';
  if (stage === 'Qualificat') return 'Proposta';
  if (stage === 'Proposta') return 'Tancat';
  return 'Nou';
}

function nextJobState(state: JobState): JobState {
  if (state === 'Pendent') return 'En curs';
  if (state === 'En curs') return 'Completat';
  if (state === 'Completat') return 'Pendent';
  return 'Pendent';
}

function toStockState(qty: number, min: number): StockState {
  if (qty <= Math.max(1, Math.floor(min / 2))) return 'Crític';
  if (qty <= min) return 'Baix';
  return 'OK';
}

export function CustomSoftwareSection() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(START_CLIENTS);
  const [jobs, setJobs] = useState<Job[]>(START_JOBS);
  const [material, setMaterial] = useState<Material[]>(START_MATERIAL);
  const [team, setTeam] = useState<Member[]>(START_TEAM);
  const [clientName, setClientName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [userName, setUserName] = useState('');

  const filteredClients = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) => `${c.name} ${c.segment} ${c.owner}`.toLowerCase().includes(term));
  }, [clients, query]);

  const openJobs = jobs.filter((job) => job.state !== 'Completat').length;
  const criticalMaterial = material.filter((m) => m.state === 'Crític').length;
  const activeUsers = team.filter((u) => u.enabled).length;

  const addClient = () => {
    const name = clientName.trim();
    if (!name) return;
    setClients((prev) => [{ id: Date.now(), name, segment: 'Nou servei', owner: 'Assignar', stage: 'Nou', nextAction: 'Contacte inicial' }, ...prev]);
    setClientName('');
  };

  const addJob = () => {
    const title = jobTitle.trim();
    if (!title) return;
    setJobs((prev) => [{ id: `SAT-${Math.floor(Math.random() * 900 + 100)}`, title, client: clients[0]?.name ?? 'Client nou', state: 'Pendent', eta: 'Planificar' }, ...prev]);
    setJobTitle('');
  };

  const addMaterial = () => {
    const name = materialName.trim();
    if (!name) return;
    setMaterial((prev) => [{ id: `MAT-${Math.floor(Math.random() * 900 + 100)}`, name, qty: 2, min: 5, state: 'Baix' }, ...prev]);
    setMaterialName('');
  };

  const addUser = () => {
    const name = userName.trim();
    if (!name) return;
    setTeam((prev) => [{ id: `USR-${Math.floor(Math.random() * 90 + 10)}`, name, role: 'Tècnic', zone: 'Nova zona', enabled: true }, ...prev]);
    setUserName('');
  };

  return (
    <section
      id="software-a-mida"
      className="relative w-full border-t border-[#d0d6e0] px-4 pb-5 pt-[88px] dark:border-[#23252a] md:px-6 md:pb-6 md:pt-[94px] lg:pb-8 lg:pt-[102px]"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-5xl sm:mb-7 lg:mb-8">
          <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] tracking-normal text-[#08090a] dark:text-[#f7f8f8] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
            Tecnologia que s&apos;adapta al teu equip
            <BrandRevealText className="ml-1 text-[#383b3f] dark:text-[#8a8f98]">i creix amb el teu negoci.</BrandRevealText>
          </h2>
          <p className="mt-4 max-w-4xl text-[14px] leading-[1.5] text-[#62666d] dark:text-[#8a8f98] sm:text-[15px]">
            Demo real d&apos;un SAT amb CRM, pipeline, materials i control d&apos;accessos. També podem integrar
            chatbots, automatitzacio RRSS, finances, marketing, atencio client i qualsevol modul intern que necessiti
            la teva operacio. Pots navegar, afegir dades i moure estats en viu.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-[12px] border border-[#d0d6e0] bg-white/70 shadow-[0_12px_44px_-26px_rgba(8,9,10,0.26)] dark:border-[#323334] dark:bg-[#0f1011]/95 dark:shadow-[0_16px_60px_-28px_rgba(0,0,0,0.85)]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5e6ad2]/55 to-transparent" />
          <div className="flex min-h-[clamp(560px,73svh,760px)] flex-col md:min-h-[clamp(580px,72svh,780px)] md:flex-row">
            <aside className="w-full border-b border-[#d0d6e0] bg-white/78 md:w-[240px] md:border-b-0 md:border-r dark:border-[#23252a] dark:bg-[#08090a]/90">
              <div className="flex h-14 items-center gap-3 px-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#5e6ad2] to-[#27a644]">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <span className="text-[14px] font-[590] text-[#08090a] dark:text-[#f7f8f8]">DigitAI SAT</span>
              </div>
              <nav className="grid grid-cols-2 gap-2 p-3 md:grid-cols-1">
                {VIEWS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-left text-[13px] transition ${
                      view === item.id
                        ? 'border border-[#b8c0ce] bg-[#eceff4] text-[#08090a] dark:border-[#323334] dark:bg-[#161718] dark:text-[#f7f8f8]'
                        : 'border border-transparent text-[#62666d] hover:bg-[#eef1f6] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:bg-[#161718] dark:hover:text-[#d0d6e0]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="hidden border-t border-[#d0d6e0] p-4 md:block dark:border-[#23252a]">
                <div className="flex items-center gap-2 text-[12px] text-[#62666d] dark:text-[#8a8f98]">
                  <ShieldCheck className="h-4 w-4 text-[#27a644]" />
                  Control segur i traçable
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1">
              <header className="flex h-14 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a] md:px-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-[14px] font-[590] text-[#08090a] dark:text-[#f7f8f8]">{VIEWS.find((v) => v.id === view)?.label}</h3>
                  <span className="rounded-full border border-[#b8c0ce] bg-[#eceff4] px-2 py-0.5 text-[11px] text-[#62666d] dark:border-[#323334] dark:bg-[#161718] dark:text-[#8a8f98]">LIVE</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="hidden items-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-2.5 py-1.5 dark:border-[#323334] dark:bg-[#08090a] md:flex">
                    <Search className="h-3.5 w-3.5 text-[#8a8f98] dark:text-[#62666d]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Cerca client o segment..."
                      className="w-48 bg-transparent text-[12px] text-[#383b3f] outline-none placeholder:text-[#8a8f98] dark:text-[#d0d6e0] dark:placeholder:text-[#62666d]"
                    />
                  </label>
                  <button className="relative text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e4f222]" />
                  </button>
                </div>
              </header>

              <div className="p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {view === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                        <div className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-4 dark:border-[#23252a] dark:bg-[#161718]">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-[13px] text-[#383b3f] dark:text-[#d0d6e0]">Centraleta operativa</h4>
                            <span className="text-[11px] text-[#62666d] dark:text-[#8a8f98]">Flux viu</span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]">
                              <p className="text-[11px] text-[#8a8f98]">Incidències obertes</p>
                              <p className="mt-1 text-xl font-semibold text-[#08090a] dark:text-[#f7f8f8]">{openJobs}</p>
                              <div className="mt-2 h-1.5 rounded-full bg-[#dfe4ec] dark:bg-[#23252a]">
                                <motion.div className="h-1.5 rounded-full bg-[#e4f222]" initial={{ width: 0 }} animate={{ width: `${Math.min(100, openJobs * 16)}%` }} />
                              </div>
                            </div>
                            <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]">
                              <p className="text-[11px] text-[#8a8f98]">Materials crítics</p>
                              <p className="mt-1 text-xl font-semibold text-[#08090a] dark:text-[#f7f8f8]">{criticalMaterial}</p>
                              <div className="mt-2 h-1.5 rounded-full bg-[#dfe4ec] dark:bg-[#23252a]">
                                <motion.div className="h-1.5 rounded-full bg-[#eb5757]" initial={{ width: 0 }} animate={{ width: `${Math.min(100, criticalMaterial * 28)}%` }} />
                              </div>
                            </div>
                            <div className="rounded-[6px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]">
                              <p className="text-[11px] text-[#8a8f98]">Usuaris actius</p>
                              <p className="mt-1 text-xl font-semibold text-[#08090a] dark:text-[#f7f8f8]">{activeUsers}</p>
                              <div className="mt-2 h-1.5 rounded-full bg-[#dfe4ec] dark:bg-[#23252a]">
                                <motion.div className="h-1.5 rounded-full bg-[#27a644]" initial={{ width: 0 }} animate={{ width: `${Math.min(100, activeUsers * 18)}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-[6px] border border-[#c0c8d5] bg-white p-3 dark:border-[#323334] dark:bg-[#08090a]">
                            <div className="mb-2 flex items-center justify-between text-[11px] text-[#8a8f98]">
                              <span>Bus de processos</span>
                              <span>{jobs.length} tasques</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-2 text-[11px]">
                              {(['Nou', 'Qualificat', 'Proposta', 'Tancat'] as LeadStage[]).map((stage, idx) => {
                                const count = clients.filter((c) => c.stage === stage).length;
                                return (
                                  <div key={stage} className="relative rounded-[6px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-center dark:border-[#23252a] dark:bg-[#161718]">
                                    <p className="text-[#62666d] dark:text-[#8a8f98]">{stage}</p>
                                    <p className="font-semibold text-[#08090a] dark:text-[#f7f8f8]">{count}</p>
                                    {idx < 3 && (
                                      <motion.span
                                        className="pointer-events-none absolute -right-[11px] top-1/2 h-[2px] w-5 -translate-y-1/2 bg-gradient-to-r from-[#5e6ad2] to-transparent"
                                        animate={{ opacity: [0.25, 1, 0.25], x: [0, 3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.8, delay: idx * 0.18 }}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-4 dark:border-[#23252a] dark:bg-[#161718]">
                            <h4 className="mb-3 text-[13px] text-[#383b3f] dark:text-[#d0d6e0]">Radar de salut</h4>
                            <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
                              <motion.div className="absolute h-44 w-44 rounded-full border border-[#c4cede] dark:border-[#323334]" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} />
                              <motion.div className="absolute h-32 w-32 rounded-full border border-[#c4cede] dark:border-[#323334]" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
                              <motion.div className="absolute h-20 w-20 rounded-full border border-[#c4cede] dark:border-[#323334]" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
                              <motion.span className="absolute h-2.5 w-2.5 rounded-full bg-[#5e6ad2]" animate={{ scale: [1, 1.28, 1] }} transition={{ repeat: Infinity, duration: 1.7 }} />
                              <span className="z-10 rounded-full border border-[#c0c8d5] bg-white px-2 py-1 text-[11px] text-[#383b3f] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]">Visió global</span>
                            </div>
                          </div>

                          <div className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-4 dark:border-[#23252a] dark:bg-[#161718]">
                            <h4 className="mb-3 text-[13px] text-[#383b3f] dark:text-[#d0d6e0]">Acció ràpida</h4>
                            <button onClick={addJob} className="mb-2 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#e4f222] px-3 py-2 text-[12px] font-semibold text-[#08090a]">
                              <PackagePlus className="h-4 w-4" /> Crear ordre SAT
                            </button>
                            <button onClick={addClient} className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 text-[12px] text-[#383b3f] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]">
                              <UserPlus className="h-4 w-4" /> Afegir client
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {view === 'crm' && (
                    <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nom empresa" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] text-[#08090a] outline-none placeholder:text-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#f7f8f8]" />
                        <button onClick={addClient} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir client</button>
                      </div>
                      <div className="overflow-hidden rounded-[8px] border border-[#d0d6e0] dark:border-[#23252a]">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-[#eceff4] text-[#8a8f98] dark:bg-[#161718]"><tr><th className="px-3 py-2">Client</th><th className="px-3 py-2">Responsable</th><th className="px-3 py-2">Fase</th><th className="px-3 py-2">Acció</th></tr></thead>
                          <tbody>{filteredClients.map((c) => (
                            <tr key={c.id} className="border-t border-[#d0d6e0] bg-white dark:border-[#23252a] dark:bg-[#0f1011]">
                              <td className="px-3 py-2 text-[#08090a] dark:text-[#f7f8f8]">{c.name}<p className="text-[11px] text-[#62666d]">{c.segment}</p></td>
                              <td className="px-3 py-2 text-[#383b3f] dark:text-[#d0d6e0]">{c.owner}</td>
                              <td className="px-3 py-2"><span className="rounded-[4px] border border-[#c0c8d5] bg-[#eceff4] px-2 py-0.5 text-[11px] text-[#383b3f] dark:border-[#323334] dark:bg-[#161718] dark:text-[#d0d6e0]">{c.stage}</span></td>
                              <td className="px-3 py-2"><button onClick={() => setClients((prev) => prev.map((x) => (x.id === c.id ? { ...x, stage: nextLeadStage(x.stage) } : x)))} className="text-[11px] text-[#5e6ad2] hover:text-[#d0d6e0]">Moure fase</button></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {view === 'pipeline' && (
                    <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Nova tasca SAT" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] text-[#08090a] outline-none placeholder:text-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#f7f8f8]" />
                        <button onClick={addJob} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir tasca</button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-4">
                        {(['Pendent', 'En curs', 'Blocat', 'Completat'] as JobState[]).map((state) => (
                          <div key={state} className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
                            <div className="mb-2 flex items-center justify-between"><p className="text-[12px] text-[#383b3f] dark:text-[#d0d6e0]">{state}</p><span className="text-[11px] text-[#8a8f98]">{jobs.filter((j) => j.state === state).length}</span></div>
                            <div className="space-y-2">
                              {jobs.filter((j) => j.state === state).map((j) => (
                                <button key={j.id} onClick={() => setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, state: nextJobState(x.state) } : x)))} className="w-full rounded-[6px] border border-[#c0c8d5] bg-white p-2 text-left dark:border-[#323334] dark:bg-[#08090a]">
                                  <p className="text-[12px] text-[#08090a] dark:text-[#f7f8f8]">{j.title}</p>
                                  <p className="text-[11px] text-[#62666d]">{j.id} · {j.client}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {view === 'inventory' && (
                    <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input value={materialName} onChange={(e) => setMaterialName(e.target.value)} placeholder="Nou material" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] text-[#08090a] outline-none placeholder:text-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#f7f8f8]" />
                        <button onClick={addMaterial} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir material</button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {material.map((m) => (
                          <article key={m.id} className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
                            <p className="text-[12px] text-[#08090a] dark:text-[#f7f8f8]">{m.name}</p>
                            <p className="text-[11px] text-[#62666d]">{m.id}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[12px] text-[#383b3f] dark:text-[#d0d6e0]">Stock: {m.qty}</span>
                              <span className={`rounded-[4px] px-2 py-0.5 text-[11px] ${m.state === 'Crític' ? 'bg-[#eb5757]/20 text-[#eb5757]' : m.state === 'Baix' ? 'bg-[#f5a623]/20 text-[#f5a623]' : 'bg-[#27a644]/20 text-[#27a644]'}`}>{m.state}</span>
                            </div>
                            <button onClick={() => setMaterial((prev) => prev.map((x) => x.id === m.id ? { ...x, qty: x.qty + 1, state: toStockState(x.qty + 1, x.min) } : x))} className="mt-3 w-full rounded-[6px] border border-[#c0c8d5] bg-white py-1.5 text-[11px] text-[#383b3f] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#d0d6e0]">+1 unitat</button>
                          </article>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {view === 'access' && (
                    <motion.div key="access" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Nom nou usuari" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] text-[#08090a] outline-none placeholder:text-[#8a8f98] dark:border-[#323334] dark:bg-[#08090a] dark:text-[#f7f8f8]" />
                        <button onClick={addUser} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Crear usuari</button>
                      </div>
                      <div className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
                        <div className="space-y-2">
                          {team.map((u) => (
                            <div key={u.id} className="flex items-center justify-between rounded-[6px] border border-[#c0c8d5] bg-white px-3 py-2 dark:border-[#323334] dark:bg-[#08090a]">
                              <div>
                                <p className="text-[12px] text-[#08090a] dark:text-[#f7f8f8]">{u.name}</p>
                                <p className="text-[11px] text-[#62666d]">{u.role} · {u.zone}</p>
                              </div>
                              <button onClick={() => setTeam((prev) => prev.map((x) => (x.id === u.id ? { ...x, enabled: !x.enabled } : x)))} className={`rounded-[5px] px-2 py-1 text-[11px] ${u.enabled ? 'bg-[#27a644]/20 text-[#27a644]' : 'bg-[#eb5757]/20 text-[#eb5757]'}`}>
                                {u.enabled ? 'Actiu' : 'Bloquejat'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
