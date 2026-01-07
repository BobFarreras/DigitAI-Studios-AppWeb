'use client';
import { useTransition } from 'react'; // Per gestionar l'estat de càrrega
import { ExternalLink, Calendar, Search, Gauge, User, Eye, Trash2 } from 'lucide-react'; // 👈 Importem Trash2
import Link from 'next/link';
import { deleteAdminAudit } from '@/actions/admin/audits'; // 👈 Importem l'acció

import { AuditSummary } from '@/repositories/interfaces/IAuditRepository';



export function AuditsTable({ audits }: { audits: AuditSummary[] }) {
  const [isPending, startTransition] = useTransition();

  const formatDate = (dateInput: Date | string) => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('ca-ES', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      console.log(e)
      return '-';
    }
  };

  // --- FUNCIÓ PER ELIMINAR ---
  const handleDelete = async (id: string) => {
    // 1. Confirmació simple (per no complicar amb Modals encara)
    if (!confirm("Segur que vols eliminar aquesta auditoria permanentment?")) return;

    // 2. Executem l'acció dins d'una transició
    startTransition(async () => {
      const res = await deleteAdminAudit(id);

      if (!res.success) {
        alert(res.error || "Error eliminant");
      } else {
        // Opcional: router.refresh() si revalidatePath no fos suficient
        console.log("Eliminat correctament");
      }
    });
  };
  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
  };

  const cleanUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (audits.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border mt-4">
        <p className="text-muted-foreground">No hi ha auditories realitzades encara.</p>
      </div>
    );
  }

  return (
    <>
      {/* 📱 MÒBIL (Cards) */}
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
                {cleanUrl(audit.url)}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {formatDate(audit.createdAt)}
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(audit.seoScore)}`}>
                  {audit.seoScore ?? '-'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Gauge className="w-3 h-3" /> Rendiment
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(audit.performanceScore)}`}>
                  {audit.performanceScore ?? '-'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/admin/audits/${audit.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <Eye className="w-4 h-4" /> Veure Informe Complet
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* 💻 ESCRIPTORI (Taula) */}
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
                    {formatDate(audit.createdAt)}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium">
                  <a href={audit.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary hover:underline transition-colors">
                    {cleanUrl(audit.url)}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {audit.email || 'Anònim'}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(audit.seoScore)}`}>
                    {audit.seoScore ?? '-'}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(audit.performanceScore)}`}>
                    {audit.performanceScore ?? '-'}
                  </span>
                </td>

                {/* COLUMNA ACCIONS MODIFICADA */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botó Detall */}
                    <Link
                      href={`/admin/audits/${audit.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                    >
                      <Eye className="w-3 h-3" /> Detall
                    </Link>

                    {/* 🔴 Botó Eliminar */}
                    <button
                      onClick={() => handleDelete(audit.id)}
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
    </>
  );
}