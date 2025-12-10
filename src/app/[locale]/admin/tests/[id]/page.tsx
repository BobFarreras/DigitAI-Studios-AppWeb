import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TesterManager } from '@/features/tests/ui/TesterManager';
import { VisualFlowBuilder } from '@/features/tests/ui/VisualFlowBuilder';
import { CampaignDetailsForm } from '@/features/tests/ui/CampaignDetailsForm';
import { createClient } from '@/lib/supabase/server';
import { BackButton } from '@/components/ui/back-button';
import { DeleteCampaignButton } from '@/features/tests/ui/DeleteCampaignButton';
import { CampaignAnalytics } from '@/features/tests/ui/CampaignAnalytics';

export default async function AdminTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const repo = new SupabaseTestRepository();
  const supabase = await createClient();

  const ctx = await repo.getCampaignWithContext(id, 'admin');
  if (!ctx.campaign) return <div className="p-8 text-center text-muted-foreground">Campanya no trobada</div>;

  const { data: project } = await supabase
    .from('projects')
    .select('organization_id')
    .eq('id', ctx.campaign.projectId)
    .single();

  if (!project || !project.organization_id) return <div>Error d'integritat: Projecte sense organització</div>;

  const [assigned, available] = await Promise.all([
    repo.getAssignedTesters(id),
    repo.getProjectMembersForTest(id, ctx.campaign.projectId, project.organization_id)
  ]);
  const analyticsData = await repo.getCampaignResults(id);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <BackButton projectId={ctx.campaign.projectId} />
          <DeleteCampaignButton
            campaignId={ctx.campaign.id}
            projectId={ctx.campaign.projectId}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                 {ctx.campaign.title}
               </h1>
               <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-mono font-bold border border-purple-200 dark:border-purple-800">
                 {ctx.campaign.status}
               </span>
            </div>
            <p className="text-muted-foreground text-lg">Gestió integral i resultats de la prova</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <span>ID:</span>
            <span className="font-bold text-foreground">{ctx.campaign.id.split('-')[0]}...</span>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <Tabs defaultValue="results" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl border border-border">
          <TabsTrigger value="results" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">📊 Resultats</TabsTrigger>
          <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">📝 Detalls</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">✅ Checklist</TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">👥 Equip</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="focus-visible:outline-none">
          <CampaignAnalytics data={analyticsData} />
        </TabsContent>

        <TabsContent value="details" className="focus-visible:outline-none">
          <CampaignDetailsForm campaign={ctx.campaign} />
        </TabsContent>

        <TabsContent value="tasks" className="focus-visible:outline-none">
          <VisualFlowBuilder campaignId={id} tasks={ctx.tasks} />
        </TabsContent>

        <TabsContent value="team" className="focus-visible:outline-none">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30">
                <CardTitle className="text-foreground">Assignar Usuaris</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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