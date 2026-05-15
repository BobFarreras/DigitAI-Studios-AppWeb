/**
 * @file src/components/admin/LeadsTable.tsx
 * @updated 2026-05-09
 * @summary Contenidor de visualització i eliminació de leads.
 * @scope Estat de confirmació/eliminació i composició de vistes mobile/desktop.
 */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAdminLead } from '@/actions/admin/leads';
import { LeadDeleteDialog } from './leads-table/LeadDeleteDialog';
import { LeadsDesktopTable } from './leads-table/LeadsDesktopTable';
import { LeadsMobileCards } from './leads-table/LeadsMobileCards';
import { Lead } from './leads-table/types';

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    const id = leadToDelete;
    setLeadToDelete(null);
    startTransition(async () => {
      const res = await deleteAdminLead(id);
      if (res.success) router.refresh();
      else alert(`Error: ${res.error}`);
    });
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">Encara no hi ha missatges de contacte.</p>
      </div>
    );
  }

  return (
    <>
      <LeadDeleteDialog
        isOpen={!!leadToDelete}
        isPending={isPending}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
      <LeadsMobileCards leads={leads} isPending={isPending} onRequestDelete={setLeadToDelete} />
      <LeadsDesktopTable leads={leads} isPending={isPending} onRequestDelete={setLeadToDelete} />
    </>
  );
}
