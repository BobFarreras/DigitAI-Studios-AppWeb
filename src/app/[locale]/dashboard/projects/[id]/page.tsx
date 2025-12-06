import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { TaskRunner } from '@/features/tests/ui/TaskRunner';
import { FlaskConical, CheckCircle2, AlertCircle, BookOpen, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // 1. Dades del Projecte
  const { data: project } = await supabase
    .from('projects')
    .select('name, domain, repository_url')
    .eq('id', id)
    .single();

  if (!project) return notFound();

  // 2. Buscar Campanya Activa
  const { data: campaign } = await supabase
    .from('test_campaigns')
    .select('id')
    .eq('project_id', id)
    .eq('status', 'active')
    .single();

  // 3. Carregar Context del Test
  const repo = new SupabaseTestRepository();
  const { tasks, results, campaign: campDetails } = campaign 
    ? await repo.getCampaignWithContext(campaign.id, user.id)
    : { tasks: [], results: [], campaign: null };

  // 4. Mètriques de Progrés
  const completedCount = results.filter(r => r.status === 'pass').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      
      {/* CAPÇALERA DE PROJECTE */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-6 md:px-12 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">
                    <Layout className="w-4 h-4" /> Projecte
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {project.name}
                </h1>
                <a href={`https://${project.domain}`} target="_blank" className="text-blue-600 hover:underline text-sm font-mono mt-1 block">
                    {project.domain} ↗
                </a>
            </div>

            {/* Targeta d'Estat Resumida */}
            {campDetails && (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">El teu Progrés</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                            style={{ width: `${progressPercent}%` }} 
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">
                        {completedCount} de {totalTasks} tasques completades
                    </p>
                </div>
            )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {!campDetails ? (
            // Estat Buit (Sense Tests)
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <FlaskConical className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Cap fase de test activa</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                    Actualment no hi ha proves assignades per a aquest projecte. Rebràs una notificació quan comencem.
                </p>
            </div>
        ) : (
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* COLUMNA ESQUERRA: CONTEXT I GUIA (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-l-4 border-l-purple-500 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="w-5 h-5 text-purple-500" />
                                Guia de la Campanya
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">{campDetails.title}</h3>
                                <p className="text-sm text-slate-500">{campDetails.description}</p>
                            </div>
                            
                            <hr className="border-slate-100 dark:border-slate-800" />
                            
                            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                {/* Renderitzem els salts de línia manualment si no usem MDX complet */}
                                {campDetails.instructions ? (
                                    <div className="whitespace-pre-wrap font-sans">
                                        {campDetails.instructions}
                                    </div>
                                ) : (
                                    <p className="italic text-slate-400">Sense instruccions específiques. Segueix la llista de tasques.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            Recorda reportar qualsevol error bloquejant immediatament. Els teus comentaris ajuden a millorar el producte final.
                        </p>
                    </div>
                </div>

                {/* COLUMNA DRETA: EXECUCIÓ (7 cols) */}
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            Llista de Verificació
                        </h2>
                        <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full font-mono text-slate-600 dark:text-slate-400">
                            {tasks.length} items
                        </span>
                    </div>

                    <div className="space-y-4">
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
                            <p className="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">
                                No hi ha tasques configurades encara.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
}