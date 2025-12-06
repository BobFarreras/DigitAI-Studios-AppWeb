'use client';

import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Users, ListChecks, ArrowRight, Plus } from 'lucide-react';

// ✅ 1. CORRECCIÓ: Acceptem 'null' perquè Supabase pot retornar nulls
type CampaignSummary = {
    id: string;
    title: string;
    status: string | null;
    testerCount: number;
    taskCount: number;
    createdAt: string | null;
};

export function ProjectCampaignsList({ campaigns, projectId }: { campaigns: CampaignSummary[], projectId: string }) {
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                    Campanyes de Test ({campaigns.length})
                </h3>
                <Link href={`/admin/tests/new?projectId=${projectId}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Nova Campanya
                    </Button>
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-10 text-center">
                    <p className="text-slate-500 mb-4">Aquest projecte no té cap prova activa.</p>
                    <Link href={`/admin/tests/new?projectId=${projectId}`}>
                        <Button variant="outline">Crear primera prova</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {campaigns.map((camp) => (
                        <Link key={camp.id} href={`/admin/tests/${camp.id}`} className="block group">
                            <Card className="bg-slate-900 border-slate-800 group-hover:border-purple-500/50 transition-all h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base text-white truncate pr-2">
                                            {camp.title}
                                        </CardTitle>
                                        {/* Passem l'estat, assegurant-nos que sigui un string o undefined */}
                                        <StatusBadge status={camp.status || 'unknown'} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6 text-sm text-slate-400 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span className="font-mono font-bold text-slate-200">{camp.testerCount}</span> testers
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ListChecks className="w-4 h-4 text-green-400" />
                                            <span className="font-mono font-bold text-slate-200">{camp.taskCount}</span> tasques
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-xs text-purple-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Gestionar Equip i Tasques <ArrowRight className="w-3 h-3 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// ✅ 2. CORRECCIÓ: Tipatge robust per a l'índex de l'objecte
function StatusBadge({ status }: { status: string }) {
    // Definim explícitament que és un Record de string -> string
    // Així TS permet indexar amb qualsevol string
    const styles: Record<string, string> = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        completed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        unknown: 'bg-slate-500/10 text-slate-500 border-slate-500/20' // Fallback visual
    };
  
    // Si l'status no existeix al mapa, fem servir 'completed' o 'unknown' per defecte
    const style = styles[status] || styles.completed;

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${style}`}>
            {status}
        </span>
    )
}