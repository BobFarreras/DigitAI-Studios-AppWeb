/**
 * @file src/components/landing/v2/custom-software/model.ts
 * @updated 2026-05-13
 * @summary Tipus, dades inicials i utilitats del simulador de software.
 * @scope Model de domini client-side per a la seccio de software.
 */

import { type LucideIcon, Boxes, KeyRound, LayoutDashboard, Users, Wrench } from 'lucide-react';

export type ViewId = 'dashboard' | 'crm' | 'pipeline' | 'inventory' | 'access';
export type LeadStage = 'Nou' | 'Qualificat' | 'Proposta' | 'Tancat';
export type JobState = 'Pendent' | 'En curs' | 'Blocat' | 'Completat';
export type JobPriority = 'Alta' | 'Mitja' | 'Baixa';
export type JobSla = 'OK' | 'Risc' | 'Fora SLA';
export type StockState = 'OK' | 'Baix' | 'Crític';
export type Role = 'Tècnic' | 'Coordinador' | 'Admin';

export type Client = { id: number; name: string; segment: string; owner: string; stage: LeadStage };
export type Job = { id: string; title: string; client: string; state: JobState; priority: JobPriority; sla: JobSla; technician: string; eta: string };
export type NewSatOrder = { title: string; client: string; technician: string; priority: JobPriority; sla: JobSla; eta: string };
export type Material = { id: string; name: string; qty: number; min: number; state: StockState };
export type Member = { id: string; name: string; role: Role; zone: string; enabled: boolean };
export type View = { id: ViewId; label: string; icon: LucideIcon };

export const views: View[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'pipeline', label: 'SAT', icon: Wrench },
  { id: 'inventory', label: 'Material', icon: Boxes },
  { id: 'access', label: 'Accessos', icon: KeyRound },
];

export const startClients: Client[] = [
  { id: 1, name: 'Hotel Costa Brava', segment: 'Manteniment', owner: 'Marta', stage: 'Qualificat' },
  { id: 2, name: 'Clínica Nexe', segment: 'Instal·lació', owner: 'Nil', stage: 'Proposta' },
  { id: 3, name: 'LogisNord', segment: 'SAT 24/7', owner: 'Júlia', stage: 'Nou' },
  { id: 4, name: 'EcoMarket Girona', segment: 'TPV + ERP', owner: 'Marta', stage: 'Qualificat' },
  { id: 5, name: 'TransCat Nord', segment: 'Tracking flota', owner: 'Nil', stage: 'Proposta' },
  { id: 6, name: 'Residència Bellmar', segment: 'Helpdesk intern', owner: 'Júlia', stage: 'Nou' },
  { id: 7, name: 'AquaNex Solutions', segment: 'Portal client', owner: 'Marta', stage: 'Tancat' },
  { id: 8, name: 'ServeiTec Lleida', segment: 'Automatització CRM', owner: 'Nil', stage: 'Qualificat' },
  { id: 9, name: 'MediCore Labs', segment: 'Seguretat i backup', owner: 'Júlia', stage: 'Proposta' },
  { id: 10, name: 'BioHealth Center', segment: 'Portal pacients', owner: 'Marta', stage: 'Nou' },
  { id: 11, name: 'Nautic Girona', segment: 'SAT + inventari', owner: 'Nil', stage: 'Qualificat' },
  { id: 12, name: 'UrbanFoods BCN', segment: 'BI comercial', owner: 'Júlia', stage: 'Proposta' },
  { id: 13, name: 'EduNova Campus', segment: 'Suport IT 24/7', owner: 'Marta', stage: 'Tancat' },
  { id: 14, name: 'ClinicData Pro', segment: 'Integració API', owner: 'Nil', stage: 'Qualificat' },
  { id: 15, name: 'GreenVolt Energy', segment: 'Automatització lead', owner: 'Júlia', stage: 'Nou' },
];

export const startJobs: Job[] = [
  { id: 'SAT-912', title: 'Revisió centraleta', client: 'Hotel Costa Brava', state: 'En curs', priority: 'Mitja', sla: 'OK', technician: 'Júlia Serra', eta: 'Avui 14:45' },
  { id: 'SAT-913', title: 'Fallada accés remot', client: 'Clínica Nexe', state: 'Blocat', priority: 'Alta', sla: 'Risc', technician: 'Nil Ruiz', eta: 'Avui 16:20' },
  { id: 'SAT-914', title: 'Manteniment preventiu', client: 'LogisNord', state: 'Pendent', priority: 'Baixa', sla: 'OK', technician: 'Marta Casas', eta: 'Demà 09:00' },
  { id: 'SAT-915', title: 'Tall VPN delegació', client: 'UrbanFoods BCN', state: 'En curs', priority: 'Alta', sla: 'Fora SLA', technician: 'Júlia Serra', eta: 'Urgent' },
  { id: 'SAT-916', title: 'Reconfiguració switch core', client: 'Nautic Girona', state: 'Pendent', priority: 'Mitja', sla: 'Risc', technician: 'Nil Ruiz', eta: 'Demà 12:30' },
  { id: 'SAT-917', title: 'Error còpia nocturna', client: 'MediCore Labs', state: 'Completat', priority: 'Alta', sla: 'OK', technician: 'Marta Casas', eta: 'Tancat 11:08' },
];

export const startMaterial: Material[] = [
  { id: 'MAT-011', name: 'Router industrial', qty: 7, min: 4, state: 'OK' },
  { id: 'MAT-023', name: 'Switch PoE 16p', qty: 3, min: 5, state: 'Baix' },
  { id: 'MAT-045', name: 'SSD 1TB', qty: 1, min: 3, state: 'Crític' },
];

export const startTeam: Member[] = [
  { id: 'USR-01', name: 'Marta Casas', role: 'Admin', zone: 'Girona', enabled: true },
  { id: 'USR-02', name: 'Nil Ruiz', role: 'Coordinador', zone: 'Barcelona', enabled: true },
  { id: 'USR-03', name: 'Júlia Serra', role: 'Tècnic', zone: 'Tarragona', enabled: true },
];

export function nextLeadStage(stage: LeadStage): LeadStage {
  if (stage === 'Nou') return 'Qualificat';
  if (stage === 'Qualificat') return 'Proposta';
  if (stage === 'Proposta') return 'Tancat';
  return 'Nou';
}

export function nextJobState(state: JobState): JobState {
  if (state === 'Pendent') return 'En curs';
  if (state === 'En curs') return 'Completat';
  if (state === 'Completat') return 'Pendent';
  return 'Pendent';
}

export function toStockState(qty: number, min: number): StockState {
  if (qty <= Math.max(1, Math.floor(min / 2))) return 'Crític';
  if (qty <= min) return 'Baix';
  return 'OK';
}
