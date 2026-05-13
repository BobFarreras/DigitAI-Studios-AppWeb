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
export type JobType = 'Reparacio' | 'Manteniment' | 'Muntatge' | 'Auditoria';
export type StockState = 'OK' | 'Baix' | 'Crític';
export type Role = 'Tècnic' | 'Coordinador' | 'Admin';

export type Client = { id: number; name: string; segment: string; owner: string; stage: LeadStage };
export type JobMaterial = { name: string; qty: number; state: 'Reservat' | 'Instal·lat' | 'Pendent' };
export type JobPhoto = { label: string; tone: 'blue' | 'green' | 'amber' };
export type Job = {
  id: string;
  title: string;
  client: string;
  state: JobState;
  priority: JobPriority;
  sla: JobSla;
  technician: string;
  eta: string;
  type: JobType;
  contact: string;
  location: string;
  asset: string;
  description: string;
  diagnosis: string;
  resolution: string;
  finishedAt?: string;
  materials: JobMaterial[];
  photos: JobPhoto[];
};
export type NewSatOrder = { title: string; client: string; technician: string; priority: JobPriority; sla: JobSla; eta: string; type: JobType; contact: string; location: string; description: string };
export type Material = { id: string; name: string; qty: number; min: number; state: StockState; category?: string; supplier?: string; supplierContact?: string; unitPrice?: number; leadTime?: string; location?: string };
export type NewMaterial = { name: string; qty: number; min: number; category?: string; supplier?: string; supplierContact?: string; unitPrice?: number; leadTime?: string };
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
  { id: 1, name: 'Comunitat Mar Blava', segment: 'Manteniment comunitari', owner: 'Marta', stage: 'Qualificat' },
  { id: 2, name: 'Hotel Costa Brava', segment: 'Calderes i ACS', owner: 'Nil', stage: 'Proposta' },
  { id: 3, name: 'Residència Bellmar', segment: 'Urgències 24/7', owner: 'Júlia', stage: 'Nou' },
  { id: 4, name: 'Restaurant Sa Riera', segment: 'Cuina industrial', owner: 'Marta', stage: 'Qualificat' },
  { id: 5, name: 'Finques Tramuntana', segment: 'Contracte mensual', owner: 'Nil', stage: 'Proposta' },
  { id: 6, name: 'Escola Montclar', segment: 'Revisió preventiva', owner: 'Júlia', stage: 'Nou' },
  { id: 7, name: 'Apartaments Nord', segment: 'Reformes banys', owner: 'Marta', stage: 'Tancat' },
  { id: 8, name: 'Gimnàs Activa', segment: 'Dutxes i pressió', owner: 'Nil', stage: 'Qualificat' },
  { id: 9, name: 'Mercat Central', segment: 'Cambres i desaigües', owner: 'Júlia', stage: 'Proposta' },
  { id: 10, name: 'Clínica Nexe', segment: 'Aigua sanitària', owner: 'Marta', stage: 'Nou' },
  { id: 11, name: 'Nàutic Girona', segment: 'Bombes i dipòsits', owner: 'Nil', stage: 'Qualificat' },
  { id: 12, name: 'UrbanFoods BCN', segment: 'Instal·lació gas', owner: 'Júlia', stage: 'Proposta' },
  { id: 13, name: 'Campus EduNova', segment: 'Pla de manteniment', owner: 'Marta', stage: 'Tancat' },
  { id: 14, name: 'Forn Sant Pau', segment: 'Aigua calenta', owner: 'Nil', stage: 'Qualificat' },
  { id: 15, name: 'GreenVolt Oficines', segment: 'Eficiència hídrica', owner: 'Júlia', stage: 'Nou' },
];

export const startJobs: Job[] = [
  { id: 'SAT-912', title: 'Fuita al muntant principal', client: 'Comunitat Mar Blava', state: 'En curs', priority: 'Alta', sla: 'Risc', technician: 'Júlia Serra', eta: 'Avui 14:45', type: 'Reparacio', contact: 'Laura Prats', location: 'Escala B · planta 3', asset: 'Muntant aigua freda', description: 'Degoteig constant al calaix del muntant amb humitat visible al replà.', diagnosis: 'Junta de compressió deteriorada i tram de coure amb oxidació.', resolution: 'Tall parcial, substitució de junta i prova de pressió durant 20 minuts.', materials: [{ name: 'Junta 22 mm', qty: 2, state: 'Reservat' }, { name: 'Maniguet coure', qty: 1, state: 'Reservat' }], photos: [{ label: 'Fuita inicial', tone: 'amber' }] },
  { id: 'SAT-913', title: 'Caldera sense aigua calenta', client: 'Hotel Costa Brava', state: 'Blocat', priority: 'Alta', sla: 'Fora SLA', technician: 'Nil Ruiz', eta: 'Urgent', type: 'Reparacio', contact: 'Arnau Vidal', location: 'Sala tècnica soterrani', asset: 'Caldera mural ACS', description: 'Habitacions sense aigua calenta en hora punta de check-in.', diagnosis: 'Vàlvula de tres vies bloquejada i sonda NTC fora de rang.', resolution: 'Canviar vàlvula, substituir sonda i purgar circuit ACS.', materials: [{ name: 'Vàlvula 3 vies', qty: 1, state: 'Pendent' }], photos: [{ label: 'Error caldera', tone: 'amber' }, { label: 'Sala tècnica', tone: 'blue' }] },
  { id: 'SAT-914', title: 'Revisió preventiva trimestral', client: 'Finques Tramuntana', state: 'Pendent', priority: 'Baixa', sla: 'OK', technician: 'Marta Casas', eta: 'Demà 09:00', type: 'Manteniment', contact: 'Pau Mir', location: 'Carrer Major 18', asset: 'Instal·lació comunitària', description: 'Revisió programada de claus de pas, pressió, sifons i estat de desguassos.', diagnosis: 'Pendent de visita programada.', resolution: 'Checklist preventiu, registre fotogràfic i informe de recomanacions.', materials: [{ name: 'Tefló professional', qty: 3, state: 'Reservat' }], photos: [] },
  { id: 'SAT-915', title: 'Embús a cuina industrial', client: 'Restaurant Sa Riera', state: 'En curs', priority: 'Alta', sla: 'Risc', technician: 'Júlia Serra', eta: 'Avui 12:10', type: 'Reparacio', contact: 'Anna Camps', location: 'Cuina principal', asset: 'Desaigüe rentaplats', description: 'El rentaplats retorna aigua i atura el servei de migdia.', diagnosis: 'Greix acumulat al tram horitzontal i sifó col·lapsat.', resolution: 'Desembussar amb màquina, netejar sifó i recomanar separador de greixos.', materials: [{ name: 'Sifó industrial', qty: 1, state: 'Reservat' }], photos: [{ label: 'Desaigüe', tone: 'amber' }] },
  { id: 'SAT-916', title: 'Muntatge de bomba de pressió', client: 'Gimnàs Activa', state: 'Pendent', priority: 'Mitja', sla: 'OK', technician: 'Nil Ruiz', eta: 'Demà 12:30', type: 'Muntatge', contact: 'Marc Vila', location: 'Vestidors planta -1', asset: 'Grup de pressió', description: 'Les dutxes perden cabal quan hi ha ocupació alta.', diagnosis: 'Disseny validat, pendent finestra de muntatge.', resolution: 'Instal·lar bomba, vas d expansió i pressòstat amb prova simultània de dutxes.', materials: [{ name: 'Bomba pressió', qty: 1, state: 'Reservat' }, { name: 'Vas expansió 24L', qty: 1, state: 'Reservat' }], photos: [{ label: 'Sala bombes', tone: 'blue' }] },
  { id: 'SAT-917', title: 'Canvi de termo i prova final', client: 'Apartaments Nord', state: 'Completat', priority: 'Mitja', sla: 'OK', technician: 'Marta Casas', eta: 'Tancat 11:08', type: 'Muntatge', contact: 'Irene Font', location: 'Apartament 2B', asset: 'Termo elèctric 80L', description: 'Termo antic amb pèrdua a la base i baixa recuperació d aigua calenta.', diagnosis: 'Dipòsit perforat per corrosió interna.', resolution: 'Termo substituït, vàlvula de seguretat nova i prova d estanquitat correcta.', finishedAt: 'Avui 11:08', materials: [{ name: 'Termo 80L', qty: 1, state: 'Instal·lat' }, { name: 'Vàlvula seguretat', qty: 1, state: 'Instal·lat' }], photos: [{ label: 'Abans', tone: 'amber' }, { label: 'Després', tone: 'green' }] },
];

export const startMaterial: Material[] = [
  { id: 'MAT-011', name: 'Junta 22 mm', qty: 34, min: 12, state: 'OK' },
  { id: 'MAT-023', name: 'Vàlvula 3 vies', qty: 2, min: 4, state: 'Baix' },
  { id: 'MAT-045', name: 'Termo 80L', qty: 1, min: 3, state: 'Crític' },
  { id: 'MAT-052', name: 'Sifó industrial inox', qty: 5, min: 4, state: 'OK' },
  { id: 'MAT-064', name: 'Bomba pressió 1.5CV', qty: 2, min: 2, state: 'Baix' },
  { id: 'MAT-071', name: 'Vas expansió 24L', qty: 3, min: 2, state: 'OK' },
  { id: 'MAT-088', name: 'Kit instal·lació gas', qty: 1, min: 3, state: 'Crític' },
  { id: 'MAT-096', name: 'Tefló professional', qty: 28, min: 10, state: 'OK' },
  { id: 'MAT-104', name: 'Clau de pas 1/2', qty: 8, min: 12, state: 'Baix' },
  { id: 'MAT-115', name: 'Aixeta temporitzada', qty: 4, min: 3, state: 'OK' },
  { id: 'MAT-126', name: 'Maniguet coure 22 mm', qty: 16, min: 8, state: 'OK' },
  { id: 'MAT-135', name: 'Detector fuita aigua', qty: 1, min: 2, state: 'Crític' },
  { id: 'MAT-142', name: 'Desaigüe flexible reforçat', qty: 7, min: 6, state: 'OK' },
  { id: 'MAT-150', name: 'Cartutx anticalç ACS', qty: 2, min: 5, state: 'Crític' },
  { id: 'MAT-161', name: 'Ràcord llautó 3/4', qty: 22, min: 10, state: 'OK' },
  { id: 'MAT-172', name: 'Sonda NTC caldera', qty: 3, min: 4, state: 'Baix' },
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
