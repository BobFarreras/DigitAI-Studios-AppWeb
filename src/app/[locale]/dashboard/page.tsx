import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/routing';
import { createClient } from '@/lib/supabase/server';
import { auditRepository } from '@/services/container';
import { Activity, BarChart3, Clock, Plus, Search, ArrowRight, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const supabase = await createClient();
    const t = await getTranslations('Dashboard');

    // 1. Obtenim l'usuari
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        redirect('/');
    }

    // 2. DADES REALS
    const audits = await auditRepository.getAuditsByUserId(user.id);
    
    // 3. CÀLCUL DE KPIs
    const totalAudits = audits.length;

    const validSeoScores = audits
        .filter(a => a.seoScore !== null && a.seoScore !== undefined)
        .map(a => a.seoScore as number);

    const avgSeo = validSeoScores.length > 0
        ? Math.round(validSeoScores.reduce((a, b) => a + b, 0) / validSeoScores.length)
        : 0;

    return (
        <div className="space-y-8 pb-20">

            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Hola, {user.email.split('@')[0]} 👋</h1>
                    <p className="text-muted-foreground mt-1">Aquí tens el resum del teu ecosistema digital.</p>
                </div>
                <Link href="/dashboard/new-audit">
                    <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20 hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Nova Auditoria
                    </Button>
                </Link>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    label="Auditories Realitzades"
                    value={totalAudits.toString()}
                    icon={Activity}
                    color="text-blue-500 dark:text-blue-400"
                    bg="bg-blue-100 dark:bg-blue-500/10"
                />
                <KpiCard
                    label="SEO Mitjà"
                    value={avgSeo > 0 ? `${avgSeo}/100` : '-'}
                    icon={BarChart3}
                    color="text-green-500 dark:text-green-400"
                    bg="bg-green-100 dark:bg-green-500/10"
                />
                <KpiCard
                    label="Estat del Sistema"
                    value="Operatiu"
                    icon={Clock}
                    color="text-purple-500 dark:text-purple-400"
                    bg="bg-purple-100 dark:bg-purple-500/10"
                />
            </div>

            {/* LLISTAT D'AUDITORIES */}
            {audits.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Projectes Recents</h2>
                        <Link href="/dashboard/audits" className="text-sm text-primary hover:underline font-medium">
                            Veure tot
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {audits.map((audit) => (
                            <Link key={audit.id} href={`/dashboard/audits/${audit.id}`} className="block group h-full">
                                <Card className="bg-card border-border hover:border-primary/50 transition-all h-full shadow-sm hover:shadow-md group-hover:-translate-y-1">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 bg-muted rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <StatusBadge status={audit.status} />
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-foreground truncate mb-1" title={audit.url}>
                                                {audit.url.replace(/^https?:\/\//, '')}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-6">
                                                {new Date(audit.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">SEO SCORE</span>
                                                <span className={`text-xl font-bold ${getScoreColor(audit.seoScore ?? 0)}`}>
                                                    {audit.seoScore ?? '-'}
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                    <div className="max-w-md mx-auto py-8">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Encara no tens projectes</h3>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Analitza la teva primera web per descobrir errors de SEO, problemes de rendiment i oportunitats de creixement.
                        </p>
                        <Link href="/dashboard/new-audit">
                            <Button className="gradient-bg text-white border-0">
                                Començar Auditoria Gratuïta
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPONENTS AUXILIARS ---

type KpiCardProps = {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
};

function KpiCard({ label, value, icon: Icon, color, bg }: KpiCardProps) {
    return (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        completed: 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20',
        processing: 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 animate-pulse',
        failed: 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20'
    };

    const label = status === 'completed' ? 'Completada' : status === 'processing' ? 'Analitzant' : 'Error';

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${styles[status as keyof typeof styles] || 'text-slate-500 bg-slate-100 border-slate-200'}`}>
            {label}
        </span>
    );
}

function getScoreColor(score: number) {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}