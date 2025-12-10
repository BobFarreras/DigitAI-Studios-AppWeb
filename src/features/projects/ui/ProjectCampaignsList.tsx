'use client';

import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Users, ListChecks, ArrowRight, Plus, Folder } from 'lucide-react';

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <FlaskConical className="w-5 h-5" />
                    </div>
                    Campanyes de Test
                    <span className="ml-2 text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {campaigns.length}
                    </span>
                </h3>
                <Link href={`/admin/tests/new?projectId=${projectId}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Nova Campanya
                    </Button>
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="border-2 border-dashed border-border bg-muted/10 rounded-2xl p-12 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Folder className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h4 className="text-foreground font-semibold mb-1">Sense proves actives</h4>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                        Aquest projecte encara no té cap campanya de QA configurada. Comença creant-ne una.
                    </p>
                    <Link href={`/admin/tests/new?projectId=${projectId}`}>
                        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20">
                            Crear primera prova
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {campaigns.map((camp) => (
                        <Link key={camp.id} href={`/admin/tests/${camp.id}?source=project`} className="block group h-full">
                            <Card className="bg-card border-border hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-md transition-all duration-300 h-full overflow-hidden relative">
                                {/* Decoració Hover */}
                                <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:via-purple-500/5 transition-colors duration-500 pointer-events-none" />
                                
                                <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-base font-bold text-foreground truncate leading-tight">
                                            {camp.title}
                                        </CardTitle>
                                        <StatusBadge status={camp.status || 'unknown'} />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Users className="w-4 h-4" />
                                            <span className="font-mono font-bold text-foreground">{camp.testerCount}</span> 
                                            <span className="text-xs">testers</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                            <ListChecks className="w-4 h-4" />
                                            <span className="font-mono font-bold text-foreground">{camp.taskCount}</span> 
                                            <span className="text-xs">tasques</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-5 flex items-center justify-end">
                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2.5 group-hover:translate-x-0">
                                            Gestionar <ArrowRight className="w-3 h-3" />
                                        </span>
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

// 🎨 StatusBadge amb colors Adaptatius (Light/Dark)
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
        draft: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
        completed: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        unknown: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
    };
  
    const style = styles[status] || styles.unknown;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${style}`}>
            {status}
        </span>
    )
}