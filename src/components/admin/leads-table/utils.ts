/**
 * @file src/components/admin/leads-table/utils.ts
 * @updated 2026-05-09
 * @summary Helpers de format per la llista de leads.
 * @scope Transformacions pures per representació de dades.
 */

export function formatLeadDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
