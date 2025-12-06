import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TesterManager } from '@/features/tests/ui/TesterManager';
import { VisualFlowBuilder } from '@/features/tests/ui/VisualFlowBuilder';
import { CampaignDetailsForm } from '@/features/tests/ui/CampaignDetailsForm';
import { createClient } from '@/lib/supabase/server';
// 👇 1. Importem el nou component
import { BackButton } from '@/components/ui/back-button';
import { DeleteCampaignButton } from '@/features/tests/ui/DeleteCampaignButton';
export default async function AdminTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const repo = new SupabaseTestRepository();
  const supabase = await createClient();

  // 1. Context de la Campanya
  const ctx = await repo.getCampaignWithContext(id, 'admin');
  if (!ctx.campaign) return <div>Campanya no trobada</div>;

  // 2. Busquem el Projecte
  const { data: project } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', ctx.campaign.projectId)
    .single();

  if (!project || !project.organization_id) return <div>Error d'integritat: Projecte sense organització</div>;

  // 3. Carreguem les llistes
  const [assigned, available] = await Promise.all([
    repo.getAssignedTesters(id),
    repo.getProjectMembersForTest(id, ctx.campaign.projectId, project.organization_id)
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header Simple amb Botó Enrere Intel·ligent */}
      <div className="flex flex-col gap-4">
        {/* 👇 2. Col·loquem el botó a dalt de tot. Passem el projectId per si cal. */}
        <div>
          <BackButton projectId={ctx.campaign.projectId} />
          {/* 👇 BOTÓ D'ELIMINAR A LA DRETA */}
          <DeleteCampaignButton
            campaignId={ctx.campaign.id}
            projectId={ctx.campaign.projectId}
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {ctx.campaign.title}
            </h1>
            <p className="text-slate-400 mt-1">Gestió integral de la prova</p>
          </div>
          <div className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded text-xs font-mono border border-purple-500/30">
            ID: {ctx.campaign.id.slice(0, 8)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        {/* ... (La resta de Tabs es queda igual) ... */}
        <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
          <TabsTrigger value="details">📝 Detalls i Documentació</TabsTrigger>
          <TabsTrigger value="tasks">✅ Checklist (Tasques)</TabsTrigger>
          <TabsTrigger value="team">👥 Equip de Testers</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <CampaignDetailsForm campaign={ctx.campaign} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <VisualFlowBuilder campaignId={id} tasks={ctx.tasks} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Assignar Usuaris</CardTitle></CardHeader>
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