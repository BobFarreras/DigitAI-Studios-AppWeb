import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { Link } from '@/routing';
export default async function DashboardPage() {
    const supabase = await createClient();
    const t = await getTranslations('Dashboard');

    // Obtenim l'usuari actual
    const { data: { user } } = await supabase.auth.getUser();

    // Protecció extra per TypeScript (encara que el layout ja ho fa)
    if (!user || !user.email) {
        redirect('/');
    }

    // Consultem les auditories
    const { data: audits } = await supabase
        .from('web_audits') // Ara els tipus funcionaran bé
        .select('*')
        .eq('email', user.email) // 👈 Ara és segur perquè hem fet el check a dalt
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            {/* 👈 Usem ?? '' per si de cas, per evitar l'error de tipatge */}
            <h1 className="text-3xl font-bold">{t('welcome', { name: user.email ?? 'Client' })}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {audits?.map((audit) => (
                    // Embolcallem la Card amb el Link
                    <Link key={audit.id} href={`/dashboard/audits/${audit.id}`} className="block transition-transform hover:scale-[1.02]">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg truncate" title={audit.url}>
                                    {audit.url}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* ... el mateix contingut d'abans ... */}
                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded text-xs ${audit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {audit.status}
                                    </span>
                                    {/* Mostrar puntuació si existeix */}
                                    {audit.seo_score && (
                                        <span className="font-bold text-slate-700">SEO: {audit.seo_score}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {(!audits || audits.length === 0) && (
                    <p className="text-slate-500 col-span-3 text-center py-10">
                        Encara no tens cap auditoria registrada.
                    </p>
                )}
            </div>
        </div>
    );
}