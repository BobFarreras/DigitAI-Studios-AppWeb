import { createClient } from '@/lib/supabase/server';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { GamificationService } from '@/services/GamificationService';
import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap } from 'lucide-react';

export default async function TesterDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return <div>No user</div>;

    const repo = new SupabaseTestRepository();
    const gameService = new GamificationService();

    // Paral·lelitzem les dades
    const [assignments, stats] = await Promise.all([
        repo.getMyAssignments(user.id),
        gameService.getUserStats(user.id)
    ]);

    return (
        <div className="p-6 space-y-8">
            
            {/* 1. HEADER GAMIFICAT */}
            <div className="bg-linear-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <Trophy className="w-64 h-64 -rotate-12 transform translate-x-10 -translate-y-10" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        {/* ⚠️ CORRECCIÓ: stats.rankName en lloc de stats.rank */}
                        <span className="text-4xl">{stats.rankName.split(' ')[1]}</span>
                        <div>
                            {/* ⚠️ CORRECCIÓ: stats.rankName en lloc de stats.rank */}
                            <h1 className="text-2xl font-bold">{stats.rankName.split(' ')[0]}</h1>
                            <p className="text-purple-200 text-sm">Nivell {stats.level}</p>
                        </div>
                    </div>

                    <div className="max-w-md mt-4">
                        <div className="flex justify-between text-xs mb-1 uppercase font-bold tracking-wider opacity-70">
                            <span>XP: {stats.xp}</span>
                            <span>Següent Nivell: {stats.nextLevelXp}</span>
                        </div>
                        <Progress value={stats.progressToNext} className="h-3 bg-black/30" />
                        <p className="text-xs mt-2 text-purple-300">
                            Completa tasques per guanyar XP i pujar de rang!
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. GRID DE MISSIONS */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" /> Missions Actives
                </h2>

                {assignments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <p className="text-slate-500">No tens cap missió assignada encara.</p>
                        <p className="text-xs text-slate-400">Demana al teu Project Manager que t'assigni!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map(mission => (
                            <Link key={mission.assignmentId} href={`/dashboard/projects/${mission.campaignId}`} className="group block"> {/* ⚠️ Nota: He corregit l'enllaç per apuntar a /projects/ que és on tenim el detall */}
                                <Card className="h-full hover:border-purple-500 transition-all hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-900">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-mono text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
                                                {mission.projectName}
                                            </span>
                                            {/* Aquí podries posar el % completat si el calculéssim */}
                                        </div>
                                        <CardTitle className="mt-2 group-hover:text-purple-600 transition-colors">
                                            {mission.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                            {mission.description || "Sense descripció..."}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <Zap className="w-3 h-3 text-yellow-500" />
                                            {mission.totalTasks} Tasques
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}