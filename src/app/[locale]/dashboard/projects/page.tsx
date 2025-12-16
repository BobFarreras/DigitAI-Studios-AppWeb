import { createClient } from '@/lib/supabase/server';
import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderGit2, FlaskConical, Globe, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getTranslations, getFormatter } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.projects' });
  return { title: `${t('meta_title')} | DigitAI Studios` };
}

export default async function ProjectsListPage() {
  const supabase = await createClient();
  const t = await getTranslations('Dashboard.projects');
  const format = await getFormatter();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // 1. Busquem IDs on és membre
  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user.id);

  const memberProjectIds = memberships?.map(m => m.project_id) || [];

  // 2. Busquem projectes
  const { data: projects } = await supabase
    .from('projects')
    .select(`*, test_campaigns(count)`)
    .or(`client_id.eq.${user.id},id.in.(${memberProjectIds.join(',') || '00000000-0000-0000-0000-000000000000'})`)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 p-6 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-primary" /> {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10">
          <FolderGit2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-foreground">{t('empty_title')}</h3>
          <p className="text-muted-foreground mt-2 mb-6">{t('empty_desc')}</p>
          <Link href="/#contacte">
            <Button>{t('btn_request')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const hasActiveTests = project.test_campaigns?.[0]?.count > 0;

            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group block h-full">
                <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">

                  {hasActiveTests && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" /> {t('badge_beta')}
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2.5 rounded-lg ${hasActiveTests ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-1">
                      <Globe className="w-3 h-3" /> {project.domain || t('status_configuring')}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider 
                            ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          project.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-600'}
                        `}>
                        {project.status || t('status_pending')}
                      </span>

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {/* Format de data segur per a SSR/CSR */}
                        {format.dateTime(new Date(project.created_at ?? new Date().toISOString()), { year: 'numeric', month: 'short', day: 'numeric' })}                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}