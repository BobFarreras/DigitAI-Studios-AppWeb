'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Wrench, Search, Bell, 
  Plus, MoreHorizontal, ArrowRight, ShieldCheck, 
  Database, Activity,
  type LucideIcon
} from 'lucide-react';
import Link from 'next/link';

// --- INTERFÍCIES I DADES (MÉS RIQUES) ---
interface Client {
  id: number;
  name: string;
  email: string;
  value: string;
  lastContact: string;
  status: 'Actiu' | 'Pendent' | 'Nou Lead';
}

interface Ticket {
  id: string;
  issue: string;
  client: string;
  priority: 'Alta' | 'Mitjana' | 'Baixa';
  status: 'Pendent' | 'En curs' | 'Completat';
}

type TabId = 'dashboard' | 'crm' | 'sat';

const DASHBOARD_TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Resum Global', icon: LayoutDashboard },
  { id: 'crm', label: 'Base de dades (CRM)', icon: Users },
  { id: 'sat', label: 'Operacions (SAT)', icon: Wrench },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 1, name: 'Instal·lacions Martí SL', email: 'contacte@imarti.cat', value: '12.450 €', lastContact: 'Avui, 10:30', status: 'Actiu' },
  { id: 2, name: 'Clínica Dental Soler', email: 'info@dentalsoler.com', value: '3.200 €', lastContact: 'Ahir, 16:45', status: 'Pendent' },
  { id: 3, name: 'Grup Logístic BCN', email: 'ops@grupbcn.es', value: '28.900 €', lastContact: 'Fa 2 dies', status: 'Actiu' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 'SAT-1042', issue: 'Caiguda servidor principal', client: 'Grup Logístic BCN', priority: 'Alta', status: 'Pendent' },
  { id: 'SAT-1043', issue: 'Configuració xarxa VPN', client: 'Instal·lacions Martí SL', priority: 'Mitjana', status: 'En curs' },
  { id: 'SAT-1044', issue: 'Actualització equips', client: 'Clínica Dental Soler', priority: 'Baixa', status: 'Completat' },
];

export function CustomSoftwareSection() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [newClientName, setNewClientName] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  // Funcions
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: Date.now(),
      name: newClientName,
      email: `${newClientName.toLowerCase().replace(/\s+/g, '')}@empresa.cat`,
      value: '0 €',
      lastContact: 'Ara mateix',
      status: 'Nou Lead'
    };
    setClients([newClient, ...clients]);
    setNewClientName('');
  };

  const advanceTicket = (id: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Pendent' ? 'En curs' : t.status === 'En curs' ? 'Completat' : 'Pendent';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <section id="software-a-mida" className="relative w-full bg-[#08090a] px-4 md:px-6 py-24 lg:py-32 border-t border-[#23252a] overflow-hidden">
      
      {/* FONS TRANSLÚCIDS (GLOWS) */}
      <div className="absolute top-0 left-1/2 -z-10 h-[800px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.08)_0%,rgba(8,9,10,0)_70%)] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl flex flex-col items-center">
        
        {/* --- HEADER: COPYWRITING --- */}
        <div className="text-center max-w-3xl mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
         
            
            <h2 className="text-[clamp(36px,5vw,56px)] font-[590] leading-[1.05] tracking-[-0.02em] text-[#f7f8f8]">
              Deixa d'adaptar-te a l'Excel.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5e6ad2] to-[#8b5cf6]">Creem el teu propi software.</span>
            </h2>
            
         
          </motion.div>
        </div>

        {/* --- DASHBOARD INTERACTIU (COMMAND CENTER) --- */}
        <div className="w-full relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full rounded-[12px] border border-[#323334] bg-[#0f1011] shadow-[0_8px_40px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(94,106,210,0.1)] overflow-hidden"
          >
            {/* Lluentor superior a la vora de la targeta */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5e6ad2]/50 to-transparent opacity-50" />

            <div className="flex flex-col md:flex-row h-[700px]">
              
              {/* SIDEBAR */}
              <aside className="w-full md:w-[260px] bg-[#08090a] border-b md:border-b-0 md:border-r border-[#23252a] flex flex-col shrink-0 z-10">
                <div className="flex items-center h-16 px-6 border-b border-[#23252a]">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-[4px] bg-gradient-to-br from-[#5e6ad2] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_15px_rgba(94,106,210,0.4)]">
                      <Database className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-[15px] tracking-tight text-[#f7f8f8]">DigitAI OS</span>
                  </div>
                </div>

                <nav className="p-4 space-y-1.5 flex-1 overflow-x-auto md:overflow-visible">
                  <div className="px-2 mb-3 hidden md:block text-[11px] font-semibold text-[#62666d] uppercase tracking-[0.05em]">
                    Espai de Treball
                  </div>
                  {DASHBOARD_TABS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-[6px] px-3 py-2.5 text-[14px] font-medium transition-all ${
                        activeTab === item.id 
                          ? 'bg-[#161718] text-[#f7f8f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-[#23252a]' 
                          : 'text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#161718]/40 border border-transparent'
                      }`}
                    >
                      <item.icon className={`h-4.5 w-4.5 ${activeTab === item.id ? 'text-[#5e6ad2]' : ''}`} />
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="p-4 border-t border-[#23252a] hidden md:block">
                  <div className="flex items-center gap-3 px-2">
                    <ShieldCheck className="h-5 w-5 text-[#27a644]" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#d0d6e0]">Connexió Segura</span>
                      <span className="text-[11px] text-[#62666d]">Encriptació AES-256</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* CONTINGUT PRINCIPAL */}
              <main className="flex-1 flex flex-col bg-[#0f1011] min-w-0 relative">
                
                {/* Header Topbar */}
                <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-[#23252a] bg-[#0f1011]/80 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="text-[16px] font-[590] text-[#f7f8f8]">
                    {activeTab === 'dashboard' ? 'Mètriques en Temps Real' : activeTab === 'crm' ? 'Gestió de Clients' : 'Tauler d\'Operacions'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center h-9 w-64 rounded-[6px] border border-[#323334] bg-[#08090a] px-3 text-[#62666d] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                      <Search className="h-4 w-4 mr-2" />
                      <span className="text-[13px]">Cercar dades...</span>
                    </div>
                    <button className="relative text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#eb5757]" />
                    </button>
                  </div>
                </header>

                {/* Contingut Dinàmic */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    
                    {/* --- VIEW: DASHBOARD --- */}
                    {activeTab === 'dashboard' && (
                      <motion.div key="db" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          {[
                            { label: 'Ingressos Recurrents', val: '€ 44.550', trend: '+12.5%', color: 'text-[#27a644]' },
                            { label: 'Nous Leads (30 dies)', val: clients.length * 14, trend: '+4', color: 'text-[#e4f222]' },
                            { label: 'Incidències Obertes', val: tickets.filter(t => t.status !== 'Completat').length, trend: '-2', color: 'text-[#eb5757]' },
                          ].map((s, i) => (
                            <div key={i} className="rounded-[8px] border border-[#23252a] bg-[#161718] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:border-[#323334] transition-colors">
                              <p className="text-[12px] font-medium text-[#8a8f98] mb-2">{s.label}</p>
                              <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-[#f7f8f8]">{s.val}</span>
                                <span className={`text-[12px] font-medium ${s.color}`}>{s.trend}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-[8px] border border-[#23252a] bg-[#161718] h-64 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-[14px] font-medium text-[#f7f8f8]">Activitat del Sistema (Simulada)</span>
                            <Activity className="h-4 w-4 text-[#5e6ad2]" />
                          </div>
                          <div className="flex-1 flex items-end gap-2 md:gap-4">
                            {[40, 55, 45, 75, 60, 95, 70, 85, 50, 90, 65, 80].map((h, i) => (
                              <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-[#5e6ad2]/20 to-[#5e6ad2]/60 hover:to-[#5e6ad2] rounded-t-[4px] relative group transition-all"
                              >
                                {/* Tooltip al hover */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#08090a] border border-[#323334] text-[#f7f8f8] text-[11px] py-1 px-2 rounded-[4px] pointer-events-none transition-opacity shadow-lg z-10 whitespace-nowrap">
                                  {h * 12} ops
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* --- VIEW: CRM --- */}
                    {activeTab === 'crm' && (
                      <motion.div key="crm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full">
                        
                        {/* Formulari d'entrada interactiu */}
                        <form onSubmit={handleAddClient} className="flex gap-3 mb-6">
                          <input 
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="Nom de la nova empresa..."
                            className="flex-1 bg-[#08090a] border border-[#323334] rounded-[6px] px-4 py-3 text-[14px] text-[#f7f8f8] outline-none focus:border-[#e4f222] focus:ring-1 focus:ring-[#e4f222]/30 transition-all placeholder:text-[#62666d]"
                          />
                          <button 
                            disabled={!newClientName.trim()}
                            className="bg-[#e4f222] text-[#08090a] px-5 py-3 rounded-[6px] text-[14px] font-[590] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_15px_rgba(228,242,34,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-5 w-5" /> <span className="hidden sm:inline">Afegir Registre</span>
                          </button>
                        </form>

                        {/* Taula Completa */}
                        <div className="rounded-[8px] border border-[#23252a] bg-[#161718] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[14px]">
                              <thead className="bg-[#0f1011] text-[#8a8f98] font-medium text-[12px] uppercase border-b border-[#23252a]">
                                <tr>
                                  <th className="px-6 py-4">Client</th>
                                  <th className="px-6 py-4 hidden md:table-cell">Valor (LTV)</th>
                                  <th className="px-6 py-4 hidden sm:table-cell">Últim Contacte</th>
                                  <th className="px-6 py-4">Estat</th>
                                  <th className="px-6 py-4 text-right">Acció</th>
                                </tr>
                              </thead>
                              <tbody>
                                <AnimatePresence>
                                  {clients.map((c) => (
                                    <motion.tr 
                                      key={c.id} 
                                      initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(228,242,34,0.1)' }}
                                      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                                      className="border-b border-[#23252a] hover:bg-[#23252a]/40 transition-colors group"
                                    >
                                      <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                          <span className="font-medium text-[#f7f8f8]">{c.name}</span>
                                          <span className="text-[12px] text-[#62666d]">{c.email}</span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 hidden md:table-cell text-[#d0d6e0] font-mono">{c.value}</td>
                                      <td className="px-6 py-4 hidden sm:table-cell text-[#8a8f98] text-[13px]">{c.lastContact}</td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-medium border ${
                                          c.status === 'Actiu' ? 'border-[#27a644]/30 bg-[#27a644]/10 text-[#27a644]' : 
                                          c.status === 'Nou Lead' ? 'border-[#e4f222]/30 bg-[#e4f222]/10 text-[#e4f222]' :
                                          'border-[#8a8f98]/30 bg-[#8a8f98]/10 text-[#d0d6e0]'
                                        }`}>
                                          {c.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <button className="text-[#62666d] hover:text-[#f7f8f8] p-1.5 rounded-md hover:bg-[#323334] transition-colors"><MoreHorizontal className="h-5 w-5" /></button>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </AnimatePresence>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* --- VIEW: SAT (KANBAN BOARD) --- */}
                    {activeTab === 'sat' && (
                      <motion.div key="sat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                          <p className="text-[14px] text-[#8a8f98]">
                            Tauler Kanban. Clica a un tiquet per moure'l de fase.
                          </p>
                        </div>
                        
                        {/* Columnes Kanban */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {['Pendent', 'En curs', 'Completat'].map((colStatus) => (
                            <div key={colStatus} className="flex flex-col bg-[#08090a] rounded-[8px] border border-[#23252a] p-4">
                              <div className="flex items-center justify-between mb-4 px-2">
                                <h4 className="text-[13px] font-[590] text-[#d0d6e0] uppercase tracking-wider">{colStatus}</h4>
                                <span className="bg-[#161718] text-[#8a8f98] text-[11px] px-2 py-0.5 rounded-full border border-[#323334]">
                                  {tickets.filter(t => t.status === colStatus).length}
                                </span>
                              </div>
                              
                              <div className="flex flex-col gap-3 min-h-[100px]">
                                <AnimatePresence>
                                  {tickets.filter(t => t.status === colStatus).map((ticket) => (
                                    <motion.div 
                                      key={ticket.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      onClick={() => advanceTicket(ticket.id)}
                                      className="rounded-[6px] border border-[#323334] bg-[#161718] p-4 cursor-pointer hover:border-[#5e6ad2] hover:shadow-[0_4px_20px_rgba(94,106,210,0.15)] transition-all group"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-[11px] text-[#62666d]">{ticket.id}</span>
                                        <span className={`h-2 w-2 rounded-full ${
                                          ticket.priority === 'Alta' ? 'bg-[#eb5757]' : 
                                          ticket.priority === 'Mitjana' ? 'bg-[#f5a623]' : 'bg-[#27a644]'
                                        }`} title={`Prioritat ${ticket.priority}`} />
                                      </div>
                                      <h5 className="text-[14px] font-medium text-[#f7f8f8] mb-1.5 leading-snug group-hover:text-[#5e6ad2] transition-colors">{ticket.issue}</h5>
                                      <p className="text-[12px] text-[#8a8f98] truncate">{ticket.client}</p>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </main>
            </div>
          </motion.div>
        </div>

        {/* CTA General (Button Linear Style) */}
        <div className="mt-16 text-center z-10 relative">
          <Link 
            href="#contacte"
            className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[#e4f222] px-8 text-[15px] font-[590] text-[#08090a] shadow-[0_0_20px_rgba(228,242,34,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Vull un software per la meva empresa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
