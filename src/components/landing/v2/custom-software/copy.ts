/**
 * @file src/components/landing/v2/custom-software/copy.ts
 * @updated 2026-05-13
 * @summary Textos per idioma de la seccio software.
 * @scope Copy de UI; no inclou logica de negoci.
 */

export type SoftwareCopy = {
  title: string;
  subtitle: string;
  revenue: string;
  sla: string;
  workload: string;
  quotes: string;
  sent: string;
  accepted: string;
  rejected: string;
  pending: string;
  conversion: string;
  incidentTrend: string;
  avgTime: string;
  crmHealth: string;
  crmCta: string;
  quick: string;
  incidents: string;
  critical: string;
  activeUsers: string;
};

const COPY: Record<'ca' | 'es' | 'en' | 'it', SoftwareCopy> = {
  ca: { title: 'Visió global de negoci', subtitle: 'Operació, suport i vendes en una sola pantalla', revenue: 'Ingressos operatius', sla: 'SLA suport', workload: 'Càrrega equip', quotes: 'Pressupostos del mes', sent: 'Enviats', accepted: 'Acceptats', rejected: 'Rebutjats', pending: 'Pendents', conversion: 'Conversió', incidentTrend: 'Tendència d incidències', avgTime: 'Temps mig per incidència', crmHealth: 'Salut CRM', crmCta: 'Obrir CRM', quick: 'Acció ràpida', incidents: 'Incidències', critical: 'Material crític', activeUsers: 'Usuaris actius' },
  es: { title: 'Visión global de negocio', subtitle: 'Operación, soporte y ventas en una sola pantalla', revenue: 'Ingresos operativos', sla: 'SLA soporte', workload: 'Carga equipo', quotes: 'Presupuestos del mes', sent: 'Enviados', accepted: 'Aceptados', rejected: 'Rechazados', pending: 'Pendientes', conversion: 'Conversión', incidentTrend: 'Tendencia de incidencias', avgTime: 'Tiempo medio por incidencia', crmHealth: 'Salud CRM', crmCta: 'Abrir CRM', quick: 'Acción rápida', incidents: 'Incidencias', critical: 'Material crítico', activeUsers: 'Usuarios activos' },
  en: { title: 'Global business view', subtitle: 'Operations, support and sales on one screen', revenue: 'Operating revenue', sla: 'Support SLA', workload: 'Team workload', quotes: 'Monthly quotes', sent: 'Sent', accepted: 'Accepted', rejected: 'Rejected', pending: 'Pending', conversion: 'Conversion', incidentTrend: 'Incident trend', avgTime: 'Avg. time per incident', crmHealth: 'CRM health', crmCta: 'Open CRM', quick: 'Quick actions', incidents: 'Incidents', critical: 'Critical stock', activeUsers: 'Active users' },
  it: { title: 'Vista globale del business', subtitle: 'Operazioni, supporto e vendite in un solo pannello', revenue: 'Ricavi operativi', sla: 'SLA supporto', workload: 'Carico team', quotes: 'Preventivi del mese', sent: 'Inviati', accepted: 'Accettati', rejected: 'Rifiutati', pending: 'In attesa', conversion: 'Conversione', incidentTrend: 'Trend incidenti', avgTime: 'Tempo medio per incidente', crmHealth: 'Salute CRM', crmCta: 'Apri CRM', quick: 'Azioni rapide', incidents: 'Incidenti', critical: 'Materiale critico', activeUsers: 'Utenti attivi' },
};

export function getSoftwareCopy(locale: string): SoftwareCopy {
  if (locale.startsWith('es')) return COPY.es;
  if (locale.startsWith('en')) return COPY.en;
  if (locale.startsWith('it')) return COPY.it;
  return COPY.ca;
}
