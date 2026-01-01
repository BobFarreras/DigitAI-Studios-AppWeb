import { getAdminLeads } from '@/actions/admin/leads';
import { getAdminAudits } from '@/actions/admin/audits'; // 👈 Importem la nova acció
import { LeadsTable } from '@/components/admin/LeadsTable';
import { AuditsTable } from '@/components/admin/AuditsTable'; // 👈 Importem la nova taula
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Shadcn Tabs

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminInboxPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;

  console.log(`👀 [PAGE] Renderitzant pàgina ${page}...`);

  const [leadsResult, auditsResult] = await Promise.all([
    getAdminLeads(page),
    getAdminAudits()
  ]);

  // AFEGEIX AQUEST LOG:
  if (leadsResult.success) {
    const ids = leadsResult.leads.map(l => l.id.substring(0, 5) + '...');
    console.log(`📦 [PAGE] Leads rebuts del servidor:`, ids);
    console.log(`🔢 [PAGE] Total leads:`, leadsResult.metadata.total);
  } else {
    console.error(`❌ [PAGE] Error rebent leads:`, leadsResult.error);
  }

  const totalLeads = leadsResult.success ? leadsResult.metadata.total : 0;
  // ✅ CORRECCIÓ: Fem servir l'operador '?' o un fallback '|| []'
  // Si auditsResult.data és undefined, el total serà 0.
  const totalAudits = auditsResult.success && auditsResult.data ? auditsResult.data.length : 0;

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bústia d'Entrada</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona totes les interaccions dels usuaris.
          </p>
        </div>
      </div>

      {/* SISTEMA DE PESTANYES */}
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full max-w-100 grid-cols-2 mb-6">
          <TabsTrigger value="messages">
            Missatges ({totalLeads})
          </TabsTrigger>
          <TabsTrigger value="audits">
            Auditories ({totalAudits})
          </TabsTrigger>
        </TabsList>

        {/* --- PESTANYA 1: MISSATGES --- */}
        <TabsContent value="messages" className="space-y-4">
          {leadsResult.success ? (
            <>
              <LeadsTable leads={leadsResult.leads} />
              {leadsResult.metadata.totalPages > 1 && (
                <PaginationControls metadata={leadsResult.metadata} />
              )}
            </>
          ) : (
            <div className="text-red-500">Error: {leadsResult.error}</div>
          )}
        </TabsContent>

        {/* --- PESTANYA 2: AUDITORIEs --- */}
        <TabsContent value="audits" className="space-y-4">
          {auditsResult.success && auditsResult.data ? (
            <AuditsTable audits={auditsResult.data} />
          ) : (
            <div className="text-red-500">Error carregant auditories</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}