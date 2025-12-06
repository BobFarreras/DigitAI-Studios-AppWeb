import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TesterManager } from '@/features/tests/ui/TesterManager'; // Ja el tens
import { TaskManager } from '@/features/tests/ui/TaskManager'; // 👇 EL CREAREM AL PAS 4
import { CampaignDetailsForm } from '@/features/tests/ui/CreateCampaignForm'; // 👇 EL CREAREM (per editar docs)

export default async function AdminTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const repo = new SupabaseTestRepository();

  // Obtenim totes les dades necessàries en paral·lel
  const [assigned, available, ctx] = await Promise.all([
    repo.getAssignedTesters(id),
    repo.getAvailableTesters(),
    repo.getCampaignWithContext(id, 'admin') // 'admin' és un ID fictici aquí només per carregar l'estructura
  ]);

  if (!ctx.campaign) return <div>Campanya no trobada</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header Simple */}
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{ctx.campaign.title}</h1>
            <p className="text-slate-400">Gestió integral de la prova</p>
          </div>
          <div className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded text-xs font-mono">
            ID: {ctx.campaign.id.slice(0,8)}
          </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
          <TabsTrigger value="details">📝 Detalls i Documentació</TabsTrigger>
          <TabsTrigger value="tasks">✅ Checklist (Tasques)</TabsTrigger>
          <TabsTrigger value="team">👥 Equip de Testers</TabsTrigger>
        </TabsList>

        {/* 1. DOCUMENTACIÓ */}
        <TabsContent value="details" className="mt-6">
            <CampaignDetailsForm campaign={ctx.campaign} />
        </TabsContent>

        {/* 2. TASQUES (FORMULARI) */}
        <TabsContent value="tasks" className="mt-6">
            <TaskManager campaignId={id} tasks={ctx.tasks} />
        </TabsContent>

        {/* 3. EQUIP */}
        <TabsContent value="team" className="mt-6">
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle>Assignar Usuaris</CardTitle></CardHeader>
                <CardContent>
                    <TesterManager 
                        campaignId={id} 
                        assignedTesters={assigned} 
                        availableTesters={available} 
                    />
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}