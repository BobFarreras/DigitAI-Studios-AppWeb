'use client';
import { useTransition } from 'react'; // Per gestionar l'estat de càrrega
import { deleteAdminAudit } from '@/actions/admin/audits'; // 👈 Importem l'acció
import { AuditSummary } from '@/repositories/interfaces/IAuditRepository';
import { AuditsMobileCards } from '@/components/admin/audits/AuditsMobileCards';
import { AuditsDesktopTable } from '@/components/admin/audits/AuditsDesktopTable';

export function AuditsTable({ audits }: { audits: AuditSummary[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    if (!confirm("Segur que vols eliminar aquesta auditoria permanentment?")) return;

    startTransition(async () => {
      const res = await deleteAdminAudit(id);
      if (!res.success) {
        alert(res.error || "Error eliminant");
      }
    });
  };

  if (audits.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border mt-4">
        <p className="text-muted-foreground">No hi ha auditories realitzades encara.</p>
      </div>
    );
  }

  return (
    <>
      <AuditsMobileCards audits={audits} isPending={isPending} onDelete={handleDelete} />
      <AuditsDesktopTable audits={audits} isPending={isPending} onDelete={handleDelete} />
    </>
  );
}
