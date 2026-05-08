'use client';

import { ExternalLink, Calendar, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cleanAuditUrl, formatAuditDate, getAuditScoreColor, type AuditRowsProps } from './audit-table-utils';

export function AuditsDesktopTable({ audits, isPending, onDelete }: AuditRowsProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-sm bg-card mt-4">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4">Web Analitzada</th>
            <th className="px-6 py-4">Usuari</th>
            <th className="px-6 py-4 text-center">SEO</th>
            <th className="px-6 py-4 text-center">Rendiment</th>
            <th className="px-6 py-4 text-right">Accions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {audits.map((audit) => (
            <tr key={audit.id} className="hover:bg-muted/20 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {formatAuditDate(audit.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 font-medium">
                <a href={audit.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary hover:underline transition-colors">
                  {cleanAuditUrl(audit.url)}
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{audit.email || 'Anònim'}</td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getAuditScoreColor(audit.seoScore)}`}>
                  {audit.seoScore ?? '-'}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getAuditScoreColor(audit.performanceScore)}`}>
                  {audit.performanceScore ?? '-'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/audits/${audit.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                  >
                    <Eye className="w-3 h-3" /> Detall
                  </Link>
                  <button
                    onClick={() => onDelete(audit.id)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Eliminar Auditoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
