import { getTranslations, getLocale } from 'next-intl/server'; // Afegim getLocale
import { Link } from '@/routing';
import { redirect } from 'next/navigation'; // 👈 CANVI CLAU: Usem el natiu
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server'; 
import { auditRepository } from '@/services/container';

export default async function AuditsListPage() {
  const t = await getTranslations('Dashboard');
  const locale = await getLocale(); // Necessitem saber l'idioma per redirigir manualment
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // ✅ SOLUCIÓ: Redirecció nativa amb return implícit (Next.js sap que redirect llança error)
  if (!user || !user.email) {
    redirect(`/${locale}/auth/login`); 
  }

  // Ara TypeScript sap segur que user.email és un string perquè si no, hauria petat a dalt
  const audits = await auditRepository.getAuditsByUserEmail(user.email);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('my_audits')}</h1>
          <p className="text-muted-foreground mt-1">
            Històric complet.
          </p>
        </div>
        <Link href="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Auditoria
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit) => (
          <Link key={audit.id} href={`/dashboard/audits/${audit.id}`} className="block transition-transform hover:scale-[1.02]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg truncate" title={audit.url}>
                  {audit.url}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-2">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wide ${
                    audit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {audit.status}
                  </span>
                  <span className="text-sm text-slate-500">
                    {audit.createdAt.toLocaleDateString()}
                  </span>
                </div>
                {audit.status === 'completed' && audit.seoScore !== null && (
                   <div className="mt-4 flex gap-2 text-sm font-medium">
                      <span className="text-slate-600">SEO: <span className="text-black">{audit.seoScore}</span></span>
                   </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {audits.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
            <p className="text-slate-500 mb-4">No tens auditories.</p>
          </div>
        )}
      </div>
    </div>
  );
}