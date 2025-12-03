import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/routing';
import { createClient } from '@/lib/supabase/server';
import { auditRepository } from '@/services/container';
import { Activity, BarChart3, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuditCard } from '@/components/dashboard/AuditCard';

export default async function DashboardPage() {
    const supabase = await createClient();
    // Use the namespace we created
    const t = await getTranslations('DashboardHome'); 
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
        redirect('/');
    }

    const audits = await auditRepository.getAuditsByUserEmail(user.email);
    const totalAudits = audits.length;
    const validSeoScores = audits
        .filter(a => a.seoScore !== null && a.seoScore !== undefined)
        .map(a => a.seoScore as number);
    const avgSeo = validSeoScores.length > 0
        ? Math.round(validSeoScores.reduce((a, b) => a + b, 0) / validSeoScores.length)
        : 0;

    return (
        <div className="space-y-8 pb-24 md:pb-8"> 

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {t('welcome', { name: user.email.split('@')[0] })}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">{t('subtitle')}</p>
                </div>
                <Link href="/dashboard/new-audit" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto gradient-bg text-white border-0 shadow-lg shadow-primary/20 hover:opacity-90">
                         <Plus className="w-4 h-4 mr-2" /> {t('new_audit')}
                    </Button>
                </Link>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <KpiCard
                    label={t('kpi_audits')}
                    value={totalAudits.toString()}
                    icon={Activity}
                    color="text-blue-600 dark:text-blue-400"
                    bg="bg-blue-100 dark:bg-blue-500/10"
                />
                <KpiCard
                    label={t('kpi_seo')}
                    value={avgSeo > 0 ? `${avgSeo}/100` : '-'}
                    icon={BarChart3}
                    color="text-green-600 dark:text-green-400"
                    bg="bg-green-100 dark:bg-green-500/10"
                />
                <KpiCard
                    label={t('kpi_system')}
                    value={t('system_status')}
                    icon={Clock}
                    color="text-purple-600 dark:text-purple-400"
                    bg="bg-purple-100 dark:bg-purple-500/10"
                />
            </div>

            {/* LLISTAT AUDITORIA */}
            {audits.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">{t('recent_projects')}</h2>
                        <Link href="/dashboard/audits" className="text-sm text-primary hover:underline font-medium">
                           {t('view_all')}
                        </Link>
                    </div>

                    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {audits.slice(0, 6).map((audit) => (
                            <AuditCard key={audit.id} audit={audit} />
                        ))}
                    </div>
                </div>
            ) : (
                /* EMPTY STATE */
                <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-card/50">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{t('empty_title')}</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                        {t('empty_desc')}
                    </p>
                    <Link href="/dashboard/new-audit">
                        <Button variant="outline">{t('empty_button')}</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

// Helpers es mantenen igual...
type KpiCardProps = {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
};

function KpiCard({ label, value, icon: Icon, color, bg }: KpiCardProps) {
    return (
        <div className="bg-card dark:bg-[#0f111a]/50 border border-border dark:border-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between md:justify-start transition-colors">
            <div className="flex md:block items-center gap-3 md:gap-0 md:w-full md:mb-4">
                <div className={`p-2.5 md:p-3 rounded-lg md:rounded-xl ${bg} shrink-0`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
                </div>
                <span className="text-sm text-muted-foreground md:hidden font-medium">{label}</span>
            </div>
            <div className="text-right md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground hidden md:block font-medium">{label}</div>
            </div>
        </div>
    );
}