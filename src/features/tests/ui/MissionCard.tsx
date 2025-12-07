'use client';

import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';
// 👇 Importem el tipus correcte
import type { MissionStats } from '@/services/GamificationService';

interface Props {
    id: string; 
    projectId: string;
    title: string;
    description: string | null;
    stats: MissionStats; // Ara sí que coincidirà amb el que retorna el servei
}

export function MissionCard({ id, projectId, title, description, stats }: Props) {
    // Determinem el color de la vora segons l'estat
    let borderClass = "hover:border-purple-500/50";
    if (stats.failed > 0) borderClass = "border-red-500/30 hover:border-red-500";
    else if (stats.progress === 100) borderClass = "border-green-500/50 hover:border-green-500";

    return (
        <Link href={`/dashboard/projects/${projectId}/${id}`} className="group block h-full">
            <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-900 border ${borderClass}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-mono text-[10px]">
                            {stats.xpReward} XP
                        </Badge>
                        {stats.progress === 100 && (
                            <Badge className="bg-green-500 text-white hover:bg-green-600">COMPLETAT</Badge>
                        )}
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-purple-400 transition-colors line-clamp-1 text-foreground">
                        {title}
                    </CardTitle>
                </CardHeader>
                
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                        {description || "Sense descripció disponible..."}
                    </p>

                    {/* BARRA DE PROGRÉS */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-muted-foreground">Progrés</span>
                            <span className={stats.progress === 100 ? "text-green-500" : "text-foreground"}>{stats.progress}%</span>
                        </div>
                        <Progress value={stats.progress} className="h-2 bg-slate-100 dark:bg-slate-800" />
                    </div>

                    {/* GRID D'ESTADÍSTIQUES */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-border">
                        <div className="flex flex-col items-center p-2 rounded bg-green-500/5 border border-green-500/10">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mb-1" />
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">{stats.passed}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Fets</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded bg-red-500/5 border border-red-500/10">
                            <XCircle className="w-4 h-4 text-red-500 mb-1" />
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">{stats.failed}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Errors</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded bg-muted border border-border">
                            <Zap className="w-4 h-4 text-yellow-500 mb-1" />
                            <span className="text-xs font-bold text-foreground">{stats.pending}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Queden</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-500 transition-colors">
                        Continuar Missió <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}