'use client';

import { Card, CardContent } from '@/components/ui/card'; // ❌ Treu CardTitle, CardHeader
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// ❌ Treu Badge (no es fa servir)
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare, Activity } from 'lucide-react';

// ✅ Definim tipus per a les dades que rebem (COINCIDENT AMB EL REPOSITORI)
type TestResult = {
    id: string;
    status: 'pass' | 'fail' | 'blocked'; // Aquí és on fallava
    comment?: string | null;
    updated_at: string;
    taskTitle: string;
    user_id: string;
    tester: {
        id?: string; // Opcional perquè a vegades ve del map
        full_name: string | null;
        email: string;
        avatar_url: string | null;
    };
};

type AnalyticsData = {
    results: TestResult[];
    totalTasks: number;
};

// Tipus auxiliar per a les estadístiques d'usuari
type UserStat = {
    user: TestResult['tester'];
    completed: number;
    passed: number;
    failed: number;
};

export function CampaignAnalytics({ data }: { data: AnalyticsData }) {
    const { results, totalTasks } = data;

    // 1. Càlculs KPI Globals
    const totalExecutions = results.length;
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    // const blocked = results.filter(r => r.status === 'blocked').length; // No l'usem al KPI card, però existeix
    
    const successRate = totalExecutions > 0 ? Math.round((passed / totalExecutions) * 100) : 0;

    // 2. Agrupar per Usuari (Leaderboard)
    const userStats = new Map<string, UserStat>();
    
    results.forEach(r => {
        if (!userStats.has(r.user_id)) {
            userStats.set(r.user_id, { 
                user: r.tester, 
                completed: 0, 
                passed: 0, 
                failed: 0 
            });
        }
        const stats = userStats.get(r.user_id)!;
        stats.completed++;
        if (r.status === 'pass') stats.passed++;
        if (r.status === 'fail') stats.failed++;
    });

    const leaderboard = Array.from(userStats.values());

    // 3. Filtrar Incidències (Fails, Blocked o amb Comentaris)
    const issues = results.filter(r => r.status === 'fail' || r.status === 'blocked' || r.comment);

    return (
        <div className="space-y-8">
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Validacions</div>
                        <div className="text-3xl font-bold text-white">{totalExecutions}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Taxa d'Èxit</div>
                        <div className={`text-3xl font-bold ${successRate > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {successRate}%
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-900/10 border-red-900/20">
                    <CardContent className="p-6">
                        <div className="text-red-400 text-xs uppercase font-bold mb-1">Errors Crítics</div>
                        <div className="text-3xl font-bold text-red-500">{failed}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Testers Actius</div>
                        <div className="text-3xl font-bold text-blue-400">{leaderboard.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* FEEDBACK & INCIDÈNCIES (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-400" />
                        Feedback i Incidències Recents
                    </h3>
                    
                    {issues.length === 0 ? (
                        <div className="p-8 border border-slate-800 rounded-xl text-center text-slate-500 bg-slate-900/50">
                            Tot net! No hi ha comentaris ni errors reportats.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {issues.map((issue) => (
                                <div key={issue.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-start">
                                    <div className="mt-1">
                                        {issue.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                                        {issue.status === 'blocked' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                                        {issue.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-200 text-sm">{issue.taskTitle}</h4>
                                            <span className="text-xs text-slate-500">
                                                {new Date(issue.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {issue.comment && (
                                            <p className="text-sm text-slate-400 bg-black/20 p-2 rounded mb-2">
                                                "{issue.comment}"
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-5 h-5">
                                                <AvatarImage src={issue.tester.avatar_url || ''} />
                                                <AvatarFallback className="text-[9px]">{issue.tester.email[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-slate-500">{issue.tester.full_name || issue.tester.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* LEADERBOARD / PROGRÉS USUARIS (1 col) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Progrés de l'Equip
                    </h3>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-6">
                        {leaderboard.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center">Encara ningú ha començat.</p>
                        ) : (
                            leaderboard.map((stat, index) => {
                                // Evitem divisió per zero
                                const progress = totalTasks > 0 ? Math.round((stat.completed / totalTasks) * 100) : 0;
                                
                                return (
                                    // Afegim index a la clau per seguretat extra
                                    <div key={`${stat.user.email}-${index}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={stat.user.avatar_url || ''} />
                                                    <AvatarFallback className="text-[10px]">{stat.user.email[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium text-slate-300 truncate max-w-[100px]">
                                                    {stat.user.full_name || 'Usuari'}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-white">{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-slate-800" />
                                        <div className="flex gap-2 mt-1 justify-end">
                                            <span className="text-[10px] text-green-500">{stat.passed} OK</span>
                                            <span className="text-[10px] text-red-500">{stat.failed} KO</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}