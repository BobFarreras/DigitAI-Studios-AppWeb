/**
 * @file src/components/admin/leads-table/LeadsDesktopTable.tsx
 * @updated 2026-05-09
 * @summary Vista desktop en format taula per leads.
 * @scope Render tabular i accions de detall/eliminació.
 */
'use client';

import Link from 'next/link';
import { Eye, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadsViewProps } from './types';
import { formatLeadDate } from './utils';

export function LeadsDesktopTable({ leads, isPending, onRequestDelete }: LeadsViewProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-border shadow-sm bg-card">
      <table className={`w-full text-sm text-left ${isPending ? 'opacity-70' : ''}`}>
        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4">Nom</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Servei</th>
            <th className="px-6 py-4">Missatge</th>
            <th className="px-6 py-4 text-right">Accions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="group hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {formatLeadDate(lead.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 font-medium">{lead.full_name || 'Anònim'}</td>
              <td className="px-6 py-4">{lead.email}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {lead.service || 'General'}
                </span>
              </td>
              <td className="px-6 py-4 max-w-xs text-muted-foreground truncate">{lead.message}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`./missatges/${lead.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-red-100 hover:text-red-600"
                    onClick={() => onRequestDelete(lead.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
