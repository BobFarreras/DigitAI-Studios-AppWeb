/**
 * @file src/components/landing/v2/custom-software/software-i18n.ts
 * @updated 2026-05-13
 * @summary Traduccions client-side del simulador de software.
 * @scope Labels, enums i textos demo per a ca, es, en i it.
 */
'use client';
import { useLocale } from 'next-intl';
import type { JobPriority, JobSla, JobState, JobType, LeadStage, StockState } from './model';

export type Locale = 'ca' | 'es' | 'en' | 'it';
type Key = keyof typeof UI.ca;
type KpiKey = keyof typeof KPI;
type TipKey = keyof typeof TIPS;
const pick = (locale: string): Locale => locale.startsWith('es') ? 'es' : locale.startsWith('en') ? 'en' : locale.startsWith('it') ? 'it' : 'ca';

const UI = {
  ca: { all: 'Tot', search: 'Cercar...', detail: 'Detall', create: 'Crear', cancel: 'Cancel·lar', client: 'Client', clients: 'Clients', access: 'Accessos', material: 'Material', materials: 'Materials', sat: 'SAT', table: 'Taula', charts: 'Gràfiques', order: 'Ordre', orders: 'Ordres', type: 'Tipus', status: 'Estat', priority: 'Prioritat', action: 'Acció', technician: 'Tècnic', location: 'Ubicació', contact: 'Contacte', supplier: 'Proveïdor', supplierContact: 'Contacte proveïdor', price: 'Preu unitari', leadTime: 'Termini', category: 'Categoria', stock: 'Stock', minStock: 'Stock mínim', initialStock: 'Stock inicial', units: 'unitats', available: 'disp.', reserved: 'Reservat SAT', orderSupplier: 'Demanar proveïdor', reserveSat: 'Reservar per SAT', addEntry: '+1 entrada', quote: 'Pressupost', history: 'Historial', evidence: 'Evidències', diagnosis: 'Diagnòstic', resolution: 'Pla de resolució', applied: 'Solució aplicada', businessScope: 'Abast comercial', nextStep: 'Proper pas', sourceQualification: 'Origen i qualificació', decisionMaker: 'Decisor', interest: 'Interès', closeForecast: 'Tancament previst', estimatedValue: 'Valor estimat', probability: 'Probabilitat', nextContact: 'Proper contacte', owner: 'Responsable', phone: 'Telèfon', email: 'Email', leadSource: 'Canal', active: 'Actiu', blocked: 'Bloquejat', createUser: 'Crear usuari', newUser: 'Nom nou usuari', createMaterial: 'Crear material', addMaterialTitle: 'Afegir material', materialHelp: 'Crea una referència amb proveïdor, preu i criteri de reposició.', topUsed: 'Materials més utilitzats', savingPotential: 'Estalvi potencial', automations: 'Automatismes suggerits', alerts: 'avisos', perMonth: 'mes', supplierPrice: 'Preu proveïdor', cheaperAlternative: 'Alternativa barata', satReorder: 'Reposició SAT', noReserved: 'Sense material reservat.', noOrder: 'Sense comanda', pending: 'Pendent', close: 'Tancament', asset: 'Instal·lació', eta: 'ETA', createSatOrder: 'Crear ordre SAT', satDialogHelp: 'Registra la incidència amb dades suficients per assignar, prioritzar i resoldre.', issueSummary: 'Resum de l avaria', assignedTech: 'Tècnic assignat', clearIssue: 'Descripció clara de l avaria', addClient: 'Afegir client', createOpportunity: 'Crea una oportunitat nova al CRM.', companyName: 'Nom empresa', phase: 'Fase', segment: 'Segment' },
  es: { all: 'Todo', search: 'Buscar...', detail: 'Detalle', create: 'Crear', cancel: 'Cancelar', client: 'Cliente', clients: 'Clientes', access: 'Accesos', material: 'Material', materials: 'Materiales', sat: 'SAT', table: 'Tabla', charts: 'Gráficas', order: 'Orden', orders: 'Órdenes', type: 'Tipo', status: 'Estado', priority: 'Prioridad', action: 'Acción', technician: 'Técnico', location: 'Ubicación', contact: 'Contacto', supplier: 'Proveedor', supplierContact: 'Contacto proveedor', price: 'Precio unitario', leadTime: 'Plazo', category: 'Categoría', stock: 'Stock', minStock: 'Stock mínimo', initialStock: 'Stock inicial', units: 'unidades', available: 'disp.', reserved: 'Reservado SAT', orderSupplier: 'Pedir proveedor', reserveSat: 'Reservar para SAT', addEntry: '+1 entrada', quote: 'Presupuesto', history: 'Historial', evidence: 'Evidencias', diagnosis: 'Diagnóstico', resolution: 'Plan de resolución', applied: 'Solución aplicada', businessScope: 'Alcance comercial', nextStep: 'Siguiente paso', sourceQualification: 'Origen y cualificación', decisionMaker: 'Decisor', interest: 'Interés', closeForecast: 'Cierre previsto', estimatedValue: 'Valor estimado', probability: 'Probabilidad', nextContact: 'Próximo contacto', owner: 'Responsable', phone: 'Teléfono', email: 'Email', leadSource: 'Canal', active: 'Activo', blocked: 'Bloqueado', createUser: 'Crear usuario', newUser: 'Nombre nuevo usuario', createMaterial: 'Crear material', addMaterialTitle: 'Añadir material', materialHelp: 'Crea una referencia con proveedor, precio y criterio de reposición.', topUsed: 'Materiales más utilizados', savingPotential: 'Ahorro potencial', automations: 'Automatismos sugeridos', alerts: 'avisos', perMonth: 'mes', supplierPrice: 'Precio proveedor', cheaperAlternative: 'Alternativa barata', satReorder: 'Reposición SAT', noReserved: 'Sin material reservado.', noOrder: 'Sin pedido', pending: 'Pendiente', close: 'Cierre', asset: 'Instalación', eta: 'ETA', createSatOrder: 'Crear orden SAT', satDialogHelp: 'Registra la incidencia con datos suficientes para asignar, priorizar y resolver.', issueSummary: 'Resumen de la avería', assignedTech: 'Técnico asignado', clearIssue: 'Descripción clara de la avería', addClient: 'Añadir cliente', createOpportunity: 'Crea una oportunidad nueva en el CRM.', companyName: 'Nombre empresa', phase: 'Fase', segment: 'Segmento' },
  en: { all: 'All', search: 'Search...', detail: 'Detail', create: 'Create', cancel: 'Cancel', client: 'Client', clients: 'Clients', access: 'Access', material: 'Material', materials: 'Materials', sat: 'SAT', table: 'Table', charts: 'Charts', order: 'Order', orders: 'Orders', type: 'Type', status: 'Status', priority: 'Priority', action: 'Action', technician: 'Technician', location: 'Location', contact: 'Contact', supplier: 'Supplier', supplierContact: 'Supplier contact', price: 'Unit price', leadTime: 'Lead time', category: 'Category', stock: 'Stock', minStock: 'Min stock', initialStock: 'Initial stock', units: 'units', available: 'available', reserved: 'Reserved SAT', orderSupplier: 'Order supplier', reserveSat: 'Reserve for SAT', addEntry: '+1 entry', quote: 'Quote', history: 'History', evidence: 'Evidence', diagnosis: 'Diagnosis', resolution: 'Resolution plan', applied: 'Applied solution', businessScope: 'Commercial scope', nextStep: 'Next step', sourceQualification: 'Source and qualification', decisionMaker: 'Decision maker', interest: 'Interest', closeForecast: 'Expected close', estimatedValue: 'Estimated value', probability: 'Probability', nextContact: 'Next contact', owner: 'Owner', phone: 'Phone', email: 'Email', leadSource: 'Channel', active: 'Active', blocked: 'Blocked', createUser: 'Create user', newUser: 'New user name', createMaterial: 'Create material', addMaterialTitle: 'Add material', materialHelp: 'Create an item with supplier, price and reorder rule.', topUsed: 'Most used materials', savingPotential: 'Potential saving', automations: 'Suggested automations', alerts: 'alerts', perMonth: 'month', supplierPrice: 'Supplier price', cheaperAlternative: 'Cheaper alternative', satReorder: 'SAT reorder', noReserved: 'No material reserved.', noOrder: 'No order', pending: 'Pending', close: 'Close', asset: 'Installation', eta: 'ETA', createSatOrder: 'Create SAT order', satDialogHelp: 'Log the incident with enough data to assign, prioritize and resolve.', issueSummary: 'Issue summary', assignedTech: 'Assigned technician', clearIssue: 'Clear issue description', addClient: 'Add client', createOpportunity: 'Create a new CRM opportunity.', companyName: 'Company name', phase: 'Stage', segment: 'Segment' },
  it: { all: 'Tutto', search: 'Cerca...', detail: 'Dettaglio', create: 'Crea', cancel: 'Annulla', client: 'Cliente', clients: 'Clienti', access: 'Accessi', material: 'Materiale', materials: 'Materiali', sat: 'SAT', table: 'Tabella', charts: 'Grafici', order: 'Ordine', orders: 'Ordini', type: 'Tipo', status: 'Stato', priority: 'Priorità', action: 'Azione', technician: 'Tecnico', location: 'Posizione', contact: 'Contatto', supplier: 'Fornitore', supplierContact: 'Contatto fornitore', price: 'Prezzo unitario', leadTime: 'Tempi', category: 'Categoria', stock: 'Stock', minStock: 'Stock minimo', initialStock: 'Stock iniziale', units: 'unità', available: 'disp.', reserved: 'Riservato SAT', orderSupplier: 'Ordina fornitore', reserveSat: 'Riserva per SAT', addEntry: '+1 entrata', quote: 'Preventivo', history: 'Storico', evidence: 'Evidenze', diagnosis: 'Diagnosi', resolution: 'Piano di risoluzione', applied: 'Soluzione applicata', businessScope: 'Ambito commerciale', nextStep: 'Prossimo passo', sourceQualification: 'Origine e qualifica', decisionMaker: 'Decisore', interest: 'Interesse', closeForecast: 'Chiusura prevista', estimatedValue: 'Valore stimato', probability: 'Probabilità', nextContact: 'Prossimo contatto', owner: 'Responsabile', phone: 'Telefono', email: 'Email', leadSource: 'Canale', active: 'Attivo', blocked: 'Bloccato', createUser: 'Crea utente', newUser: 'Nome nuovo utente', createMaterial: 'Crea materiale', addMaterialTitle: 'Aggiungi materiale', materialHelp: 'Crea una referenza con fornitore, prezzo e criterio di riordino.', topUsed: 'Materiali più usati', savingPotential: 'Risparmio potenziale', automations: 'Automazioni suggerite', alerts: 'avvisi', perMonth: 'mese', supplierPrice: 'Prezzo fornitore', cheaperAlternative: 'Alternativa economica', satReorder: 'Riordino SAT', noReserved: 'Nessun materiale riservato.', noOrder: 'Nessun ordine', pending: 'In attesa', close: 'Chiusura', asset: 'Impianto', eta: 'ETA', createSatOrder: 'Crea ordine SAT', satDialogHelp: 'Registra l’incidente con dati sufficienti per assegnare, prioritizzare e risolvere.', issueSummary: 'Riepilogo guasto', assignedTech: 'Tecnico assegnato', clearIssue: 'Descrizione chiara del guasto', addClient: 'Aggiungi cliente', createOpportunity: 'Crea una nuova opportunità nel CRM.', companyName: 'Nome azienda', phase: 'Fase', segment: 'Segmento' },
} as const;

const MAP = {
  stages: { Nou: ['Nou', 'Nuevo', 'New', 'Nuovo'], Qualificat: ['Qualificat', 'Cualificado', 'Qualified', 'Qualificato'], Proposta: ['Proposta', 'Propuesta', 'Proposal', 'Proposta'], Tancat: ['Tancat', 'Cerrado', 'Closed', 'Chiuso'] },
  states: { Pendent: ['Pendent', 'Pendiente', 'Pending', 'In attesa'], 'En curs': ['En curs', 'En curso', 'In progress', 'In corso'], Blocat: ['Blocat', 'Bloqueado', 'Blocked', 'Bloccato'], Completat: ['Completat', 'Completado', 'Completed', 'Completato'] },
  types: { Reparacio: ['Reparació', 'Reparación', 'Repair', 'Riparazione'], Manteniment: ['Manteniment', 'Mantenimiento', 'Maintenance', 'Manutenzione'], Muntatge: ['Muntatge', 'Montaje', 'Installation', 'Montaggio'], Auditoria: ['Auditoria', 'Auditoría', 'Audit', 'Audit'] },
  priorities: { Alta: ['Alta', 'Alta', 'High', 'Alta'], Mitja: ['Mitja', 'Media', 'Medium', 'Media'], Baixa: ['Baixa', 'Baja', 'Low', 'Bassa'] },
  sla: { OK: ['OK', 'OK', 'OK', 'OK'], Risc: ['Risc', 'Riesgo', 'At risk', 'A rischio'], 'Fora SLA': ['Fora SLA', 'Fuera SLA', 'Out of SLA', 'Fuori SLA'] },
  stock: { OK: ['OK', 'OK', 'OK', 'OK'], Baix: ['Baix', 'Bajo', 'Low', 'Basso'], Crític: ['Crític', 'Crítico', 'Critical', 'Critico'] },
} as const;

const KPI = {
  refs: ['Refs', 'Refs', 'Refs', 'Refs'],
  critical: ['Crítics', 'Críticos', 'Critical', 'Critici'],
  orders: ['Comandes', 'Pedidos', 'Orders', 'Ordini'],
  value: ['Valor', 'Valor', 'Value', 'Valore'],
  active: ['Actius', 'Activos', 'Active', 'Attivi'],
  proposals: ['Propostes', 'Propuestas', 'Proposals', 'Proposte'],
  closed: ['Tancats', 'Cerrados', 'Closed', 'Chiusi'],
  win: ['Win', 'Win', 'Win', 'Win'],
} as const;

const TIPS = {
  client: ['Empresa o compte del pipeline comercial.', 'Empresa o cuenta del pipeline comercial.', 'Company or account in the sales pipeline.', 'Azienda o account nel pipeline commerciale.'],
  segment: ['Necessitat principal o tipus de servei contractable.', 'Necesidad principal o tipo de servicio contratable.', 'Main need or service type.', 'Necessità principale o tipo di servizio.'],
  owner: ['Persona responsable del seguiment.', 'Persona responsable del seguimiento.', 'Person responsible for follow-up.', 'Responsabile del follow-up.'],
  phase: ['Moment del cicle comercial, editable des del desplegable.', 'Momento del ciclo comercial, editable desde el desplegable.', 'Sales cycle stage, editable from the menu.', 'Fase del ciclo commerciale, modificabile dal menu.'],
  detail: ['Obre la fitxa completa.', 'Abre la ficha completa.', 'Open the full record.', 'Apri la scheda completa.'],
  material: ['Referència de magatzem i categoria.', 'Referencia de almacén y categoría.', 'Warehouse reference and category.', 'Referenza magazzino e categoria.'],
  stock: ['Unitats físiques, mínim i disponibilitat real.', 'Unidades físicas, mínimo y disponibilidad real.', 'Physical units, minimum and real availability.', 'Unità fisiche, minimo e disponibilità reale.'],
  status: ['Semàfor operatiu segons el llindar definit.', 'Semáforo operativo según el umbral definido.', 'Operational status based on the configured threshold.', 'Semaforo operativo secondo la soglia definita.'],
  type: ['Classifica reparació, manteniment, muntatge o auditoria.', 'Clasifica reparación, mantenimiento, montaje o auditoría.', 'Classifies repair, maintenance, installation or audit.', 'Classifica riparazione, manutenzione, montaggio o audit.'],
  supplier: ['Compra habitual i termini estimat.', 'Compra habitual y plazo estimado.', 'Main supplier and estimated lead time.', 'Fornitore principale e tempi stimati.'],
  sat: ['Unitats reservades o comandes obertes.', 'Unidades reservadas o pedidos abiertos.', 'Reserved units or open orders.', 'Unità riservate o ordini aperti.'],
  order: ['El color i la icona indiquen el tipus de treball.', 'El color y el icono indican el tipo de trabajo.', 'Color and icon indicate the work type.', 'Colore e icona indicano il tipo di lavoro.'],
  priority: ['Insígnia d impacte: baixa, mitja o alta.', 'Insignia de impacto: baja, media o alta.', 'Impact badge: low, medium or high.', 'Indicatore impatto: basso, medio o alto.'],
  sla: ['Salut del compromís: verd, groc o vermell.', 'Salud del compromiso: verde, amarillo o rojo.', 'Commitment health: green, yellow or red.', 'Salute SLA: verde, giallo o rosso.'],
  technician: ['Persona responsable de la intervenció.', 'Persona responsable de la intervención.', 'Person responsible for the intervention.', 'Persona responsabile dell’intervento.'],
} as const;

export function useSoftwareText() {
  const locale = pick(useLocale()), idx = locale === 'ca' ? 0 : locale === 'es' ? 1 : locale === 'en' ? 2 : 3;
  return {
    locale,
    t: (key: Key) => UI[locale][key],
    stage: (value: LeadStage) => MAP.stages[value][idx],
    state: (value: JobState) => MAP.states[value][idx],
    type: (value: JobType) => MAP.types[value][idx],
    priority: (value: JobPriority) => MAP.priorities[value][idx],
    sla: (value: JobSla) => MAP.sla[value][idx],
    stock: (value: StockState) => MAP.stock[value][idx],
    kpi: (key: KpiKey) => KPI[key][idx],
    tip: (key: TipKey) => TIPS[key][idx],
    text: (value: string) => TEXT[value]?.[idx] ?? value,
  };
}

const TEXT: Record<string, readonly [string, string, string, string]> = {
  'Control segur i traçable': ['Control segur i traçable', 'Control seguro y trazable', 'Secure and traceable control', 'Controllo sicuro e tracciabile'],
  'Demo real d\'un SAT per a una empresa de lampisteria amb CRM, ordres de treball, materials i accessos.': ['Demo real d\'un SAT per a una empresa de lampisteria amb CRM, ordres de treball, materials i accessos.', 'Demo real de un SAT para una empresa de fontanería con CRM, órdenes de trabajo, materiales y accesos.', 'Real SAT demo for a plumbing company with CRM, work orders, materials and access control.', 'Demo reale di un SAT per un’azienda idraulica con CRM, ordini di lavoro, materiali e accessi.'],
  'Tecnologia que s\'adapta al teu equip': ['Tecnologia que s\'adapta al teu equip', 'Tecnología que se adapta a tu equipo', 'Technology that adapts to your team', 'Tecnologia che si adatta al tuo team'],
  'i creix amb el teu negoci.': ['i creix amb el teu negoci.', 'y crece con tu negocio.', 'and grows with your business.', 'e cresce con il tuo business.'],
};

