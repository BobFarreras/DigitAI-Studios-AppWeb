import { AuditSummary } from '@/repositories/interfaces/IAuditRepository';
/**
 * @file src/components/admin/audits/audit-table-utils.ts
 * @updated 2026-05-08
 * @summary Utilitats de format i tipus per la taula d'auditories admin.
 * @scope Helpers purs i tipatges compartits entre vistes mobile/desktop.
 */

export function formatAuditDate(dateInput: Date | string) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export function getAuditScoreColor(score: number | null | undefined) {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-600 border-gray-200';
  if (score >= 90) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
  return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
}

export function cleanAuditUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export type AuditRowActions = {
  isPending: boolean;
  onDelete: (id: string) => void;
};

export type AuditRowsProps = {
  audits: AuditSummary[];
} & AuditRowActions;
