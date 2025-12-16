import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { TaskRunner } from '@/features/tests/ui/TaskRunner';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Trophy } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ id: string; testId: string }>;
};

export default async function TestRunnerPage({ params }: Props) {
  const { id: projectId, testId } = await params;
  const t = await getTranslations('Dashboard.test_runner');
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const repo = new SupabaseTestRepository();
  const ctx = await repo.getCampaignWithContext(testId, user.id);

  if (!ctx.campaign) return notFound();
  if (ctx.campaign.projectId !== projectId) return notFound();

  const totalTasks = ctx.tasks.length;
  const completedTasks = ctx.results.filter(r => r.status === 'pass').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Lògica de selecció de clau de traducció
  let motivationKey = 'motivation_start';
  if (progress > 0) motivationKey = 'motivation_early';
  if (progress > 50) motivationKey = 'motivation_late';
  if (progress === 100) motivationKey = 'motivation_done';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* HEADER IMMERSIU */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
            
            <div className="flex items-center justify-between mb-4">
                <BackButton projectId={projectId} />
                <Badge variant="outline" className="text-purple-400 border-purple-500/50">
                    {t('badge_mode')}
                </Badge>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        {ctx.campaign.title}
                    </h1>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                        {t(motivationKey)}
                    </p>
                </div>

                {/* BARRA DE PROGRÉS */}
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold uppercase">
                        <span>{t('label_progress')}</span>
                        <span className={progress === 100 ? "text-green-400" : "text-white"}>{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-purple-600'}`}
                            style={{ width: `${progress}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* CONTINGUT PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* COLUMNA ESQUERRA: Guia */}
        <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-36 space-y-6">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BookOpen className="w-5 h-5 text-blue-500" /> {t('card_instructions')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                        {ctx.campaign.instructions ? (
                            <div className="whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300">
                                {ctx.campaign.instructions}
                            </div>
                        ) : (
                            <p className="italic text-slate-400">{t('no_instructions')}</p>
                        )}
                    </CardContent>
                </Card>

                {progress === 100 && (
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center animate-in zoom-in">
                        <Trophy className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <h3 className="text-lg font-bold text-green-600 dark:text-green-400">{t('success_title')}</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">{t('success_msg')}</p>
                    </div>
                )}
            </div>
        </div>

        {/* COLUMNA DRETA: Tasques */}
        <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
                {t('checklist_title')} ({completedTasks}/{totalTasks})
            </h2>

            {ctx.tasks.map((task) => {
                const result = ctx.results.find(r => r.taskId === task.id);
                return (
                    <TaskRunner 
                        key={task.id}
                        task={task}
                        existingResult={result}
                    />
                );
            })}
        </div>

      </div>
    </div>
  );
}