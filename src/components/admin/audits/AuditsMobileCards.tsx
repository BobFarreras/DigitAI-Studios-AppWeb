'use client';
/**
 * @file src/components/admin/audits/AuditsMobileCards.tsx
 * @updated 2026-05-08
 * @summary Renderitzat mòbil de la llista d'auditories.
 * @scope Presentació UI mobile; no conté lògica de dades.
 */

import { ExternalLink, Search, Gauge, User, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cleanAuditUrl, formatAuditDate, getAuditScoreColor, type AuditRowsProps } from './audit-table-utils';

export function AuditsMobileCards({ audits, isPending, onDelete }: AuditRowsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
      {audits.map((audit) => (
        <div key={audit.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 relative">
          <div className="flex justify-between items-start">
            <a
              href={audit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary truncate pr-2 flex items-center gap-2 max-w-[70%]"
            >
              {cleanAuditUrl(audit.url)}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {formatAuditDate(audit.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="truncate">{audit.email || 'Anònim'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
              <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Search className="w-3 h-3" /> SEO
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getAuditScoreColor(audit.seoScore)}`}>
                {audit.seoScore ?? '-'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
              <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Gauge className="w-3 h-3" /> Rendiment
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getAuditScoreColor(audit.performanceScore)}`}>
                {audit.performanceScore ?? '-'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Link
              href={`/admin/audits/${audit.id}`}
              className="flex items-center justify-center gap-2 flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-4 h-4" /> Veure Informe
            </Link>
            <button
              onClick={() => onDelete(audit.id)}
              disabled={isPending}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50"
              title="Eliminar Auditoria"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
