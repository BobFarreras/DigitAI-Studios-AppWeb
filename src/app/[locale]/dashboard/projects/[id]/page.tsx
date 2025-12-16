import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Layout, ArrowRight, Target, FlaskConical, Trophy } from 'lucide-react';
import { GamificationService } from '@/services/GamificationService';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { MissionCard } from '@/features/tests/ui/MissionCard';
import { Progress } from '@/components/ui/progress';
import { getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ id: string }>
}

// Map d'emojis (podries moure això a configuració o DB en el futur)
const RANK_EMOJIS: Record<string, string> = {
    'Novell': '🐣',
    'Bug Hunter': '🐛',
    'Expert': '🕵️',
    'Mestre': '👑',
};

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const t = await getTranslations('Dashboard.project_detail');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const gameService = new GamificationService();
    const testRepo = new SupabaseTestRepository();

    const [projectRes, stats, missions] = await Promise.all([
        supabase.from('projects').select('name, domain, repository_url').eq('id', id).single(),
        gameService.getUserStats(user.id),
        testRepo.getActiveMissionsForUser(user.id, id)
    ]);

    const project = projectRes.data;
    if (!project) return notFound();

    const currentEmoji = RANK_EMOJIS[stats.rankName] || '🌱';

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. HEADER GAMIFICAT */}
                <div className="bg-linear-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <Trophy className="w-64 h-64 -rotate-12 transform translate-x-10 -translate-y-10" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="">
                                    <span className="text-6xl filter drop-shadow-md">
                                        {currentEmoji}
                                    </span>
                                </div>
                                
                                <div>
                                    <h1 className="text-2xl font-bold">{stats.rankName}</h1>
                                    <p className="text-purple-200 text-sm">{t('level_label')} {stats.level}</p>
                                </div>
                            </div>
                            
                            <div className="max-w-md mt-4">
                                <div className="flex justify-between text-xs mb-1 uppercase font-bold tracking-wider opacity-70">
                                    <span>{t('xp_label')}: {stats.xp}</span>
                                    <span>{t('next_label')}: {stats.nextLevelXp}</span>
                                </div>
                                <Progress value={stats.progressToNext} className="h-3 bg-black/30" />
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-50">
                            <div className="flex items-center gap-2 text-purple-200 text-xs mb-1 uppercase tracking-wider font-bold">
                                <Layout className="w-3 h-3" /> {t('current_project_label')}
                            </div>
                            <div className="text-xl font-bold text-white mb-1">{project.name}</div>
                            {project.domain && (
                                <a href={`https://${project.domain}`} target="_blank" className="text-xs text-purple-300 hover:text-white hover:underline flex items-center gap-1">
                                    {project.domain} <ArrowRight className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. LLISTA DE MISSIONS */}
                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Target className="w-5 h-5 text-red-500" /> {t('missions_title')}
                    </h2>

                    {missions.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <FlaskConical className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('empty_missions_title')}</h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-2">
                                {t('empty_missions_desc')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {missions.map((mission) => (
                                <MissionCard
                                    key={mission.id}
                                    id={mission.id}
                                    projectId={id}
                                    title={mission.title}
                                    description={mission.description}
                                    stats={mission.stats}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}