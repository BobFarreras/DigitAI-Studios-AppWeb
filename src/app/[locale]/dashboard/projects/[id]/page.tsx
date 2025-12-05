import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { TaskRunner } from '@/features/tests/ui/TaskRunner';
import { FlaskConical, LayoutDashboard, Info, Github, Globe } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // 1. INFO DEL PROJECTE
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) return notFound();

  // 2. INFO DELS TESTS (TestFlow)
  // Busquem la primera campanya activa
  const { data: campaign } = await supabase
    .from('test_campaigns')
    .select('id')
    .eq('project_id', id)
    .eq('status', 'active')
    .single();

  // Carreguem dades del test si n'hi ha
  const repo = new SupabaseTestRepository();
  const { tasks, results, campaign: campDetails } = campaign 
    ? await repo.getCampaignWithContext(campaign.id, user.id)
    : { tasks: [], results: [], campaign: null };

  // Mètriques de test
  const completed = results.filter(r => r.status === 'pass').length;
  const totalTasks = tasks.length;
  const percent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 p-6 md:p-8">
      
      {/* CAPÇALERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <a href={`https://${project.domain}`} target="_blank" className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-1">
                <Globe className="w-3 h-3" /> {project.domain}
            </a>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {project.status || 'Active'}
        </div>
      </div>

      {/* PESTANYES */}
      <Tabs defaultValue="qa" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto rounded-none mb-6">
          <TabsTrigger 
            value="qa" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3 text-sm"
          >
            <FlaskConical className="w-4 h-4 mr-2" /> QA & Testing
            {campDetails && (
                <span className="ml-2 bg-muted text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                    {percent}%
                </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="info" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3 text-sm"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" /> Detalls Tècnics
          </TabsTrigger>
        </TabsList>

        {/* --- PESTANYA QA (Testing) --- */}
        <TabsContent value="qa" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {!campDetails ? (
                <div className="text-center py-16 bg-muted/10 rounded-xl border border-dashed border-border">
                    <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-medium text-foreground text-lg">No hi ha proves actives</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                        Actualment no hi ha cap fase de beta testing oberta per a aquest projecte. Rebràs una notificació quan n'hi hagi.
                    </p>
                </div>
            ) : (
                <div className="max-w-4xl">
                    {/* Test Info Card */}
                    <div className="mb-8 bg-card border border-border p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-foreground">{campDetails.title}</h2>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">BETA</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-4 text-xs font-medium mb-4 text-muted-foreground">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-700 ease-out" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span>{completed} de {totalTasks} tasques</span>
                        </div>
                        
                        {/* Instruccions */}
                        {campDetails.instructions && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 leading-relaxed border border-blue-100 dark:border-blue-800/50 flex gap-3 items-start">
                                <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <strong className="block mb-1 font-semibold">Instruccions de la prova:</strong>
                                    <p className="whitespace-pre-wrap opacity-90">{campDetails.instructions}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Task List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1 mb-4">
                            Llista de Verificació
                        </h3>
                        {tasks.map((task) => {
                            const result = results.find(r => r.taskId === task.id);
                            return (
                                <TaskRunner 
                                    key={task.id}
                                    task={task}
                                    existingResult={result}
                                />
                            );
                        })}
                        {tasks.length === 0 && (
                            <p className="text-muted-foreground text-center py-8">No s'han trobat tasques.</p>
                        )}
                    </div>
                </div>
            )}
        </TabsContent>

        {/* --- PESTANYA INFO (General) --- */}
        <TabsContent value="info" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Github className="w-5 h-5" /> Repositori
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        {project.repository_url ? (
                            <a href={project.repository_url} target="_blank" className="text-primary hover:underline break-all">
                                {project.repository_url}
                            </a>
                        ) : (
                            <span className="text-muted-foreground">No connectat</span>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" /> Allotjament
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <div className="flex justify-between py-2 border-b border-border/50">
                            <span className="text-muted-foreground">Provider</span>
                            <span>Vercel</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Status</span>
                            <span className="text-green-500 font-bold">● Online</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}