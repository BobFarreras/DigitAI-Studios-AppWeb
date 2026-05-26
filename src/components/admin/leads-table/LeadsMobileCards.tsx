/**
 * @file src/components/admin/leads-table/LeadsMobileCards.tsx
 * @updated 2026-05-09
 * @summary Vista mòbil en format card per leads.
 * @scope Render de dades i accions bàsiques en pantalles petites.
 */
'use client';

import Link from 'next/link';
import { Mail, Trash2, User } from 'lucide-react';
import { LeadsViewProps } from './types';

export function LeadsMobileCards({ leads, isPending, onRequestDelete }: LeadsViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {leads.map((lead) => (
        <div key={lead.id} className={`relative bg-card border border-border rounded-xl p-5 shadow-sm transition-opacity ${isPending ? 'opacity-50' : ''}`}>
          <button
            onClick={() => onRequestDelete(lead.id)}
            disabled={isPending}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link href={`./missatges/${lead.id}`} className="block">
            <div className="flex justify-between items-start mb-3 pr-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{lead.full_name || 'Anònim'}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="truncate">{lead.email}</span>
              </div>
              <p className="line-clamp-2 text-xs italic">{lead.message}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
