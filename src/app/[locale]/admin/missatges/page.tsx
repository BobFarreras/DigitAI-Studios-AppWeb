import { getAdminLeads } from '@/actions/admin/leads';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { PaginationControls } from '@/components/ui/pagination-controls';

export const dynamic = 'force-dynamic';

// ⚠️ CORRECCIÓ NEXT.JS 16: searchParams és ara una Promise
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  // 1. AWAIT OBLIGATORI: Primer resolem la promesa
  const resolvedParams = await searchParams;

  // 2. Ara ja podem accedir a .page de forma segura
  const page = Number(resolvedParams.page) || 1;

  // 3. Cridem l'acció
  const result = await getAdminLeads(page);

  // Calculem el total de forma segura
  const totalLeads = result.success ? result.metadata.total : 0;

  return (
    <div className="space-y-6 p-8">
      {/* ... (La resta del HTML es queda IGUAL que abans) ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bústia d'Entrada</h1>
          <p className="text-muted-foreground mt-1">
             Gestiona els leads rebuts ({totalLeads} totals).
          </p>
        </div>
      </div>

      <div className="relative">
        {result.success ? (
          <>
            <LeadsTable leads={result.leads} />
            
            {/* Paginació */}
            {result.metadata.totalPages > 1 && (
               <PaginationControls metadata={result.metadata} />
            )}
          </>
        ) : (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error carregant els missatges: {result.error}
          </div>
        )}
      </div>
    </div>
  );
}