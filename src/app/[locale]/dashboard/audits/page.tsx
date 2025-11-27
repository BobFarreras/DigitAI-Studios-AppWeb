import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/routing';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Globe, Calendar, ArrowRight, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/server'; 
import { auditRepository } from '@/services/container'; // El teu repositori

export default async function AuditsListPage() {
  const t = await getTranslations('Dashboard');
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect(`/${locale}/auth/login`); 
  }

  // Obtenim les dades reals
  const audits = await auditRepository.getAuditsByUserEmail(user.email);

  return (
    <div className="space-y-8">
      
      {/* Header de la secció */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('my_audits', { defaultMessage: "Les meves Auditories" })}</h1>
          <p className="text-muted-foreground mt-1">
            Històric complet i anàlisi de rendiment.
          </p>
        </div>
        <Link href="/dashboard/new-audit">
          <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" /> Nova Auditoria
          </Button>
        </Link>
      </div>

      {/* Grid de Targetes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit) => (
          <Link key={audit.id} href={`/dashboard/audits/${audit.id}`} className="block group h-full">
            <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col">
              
              {/* Capçalera Targeta: Icona i Estat */}
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-primary/10 rounded-lg text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Globe className="w-6 h-6" />
                 </div>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    audit.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : audit.status === 'failed'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                 }`}>
                    {audit.status === 'completed' ? 'COMPLETAT' : audit.status === 'failed' ? 'ERROR' : 'PROCESSANT'}
                 </span>
              </div>

              {/* Cos Targeta: URL i Data */}
              <div className="mb-6 grow">
                 <h3 className="text-lg font-bold text-foreground truncate mb-2" title={audit.url}>
                    {audit.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                 </h3>
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {/* Formatem la data de manera llegible */}
                    {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(audit.createdAt)}
                 </div>
              </div>

              {/* Peu Targeta: Puntuacions */}
              {audit.status === 'completed' && (
                 <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">SEO</span>
                       <div className="flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-muted-foreground" />
                          <span className={`text-lg font-bold ${getScoreColor(audit.seoScore || 0)}`}>
                             {audit.seoScore || '-'}
                          </span>
                       </div>
                    </div>
                    <div className="flex flex-col border-l border-border pl-3">
                       <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Rendiment</span>
                       <div className="flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-muted-foreground" />
                          <span className={`text-lg font-bold ${getScoreColor(audit.performanceScore || 0)}`}>
                             {audit.performanceScore || '-'}
                          </span>
                       </div>
                    </div>
                 </div>
              )}

              {/* Fletxa Hover (Decorativa) */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                 <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Link>
        ))}

        {/* Estat Buit (Empty State) */}
        {audits.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-card/30">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
               <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No tens cap auditoria registrada</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Comença analitzant la teva primera pàgina web per obtenir mètriques de SEO i rendiment.
            </p>
            <Link href="/dashboard/new-audit">
               <Button variant="outline" className="border-border hover:bg-muted text-foreground">
                  Crear primera auditoria
               </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper per colors de puntuació (adaptat a Tailwind classes)
function getScoreColor(score: number) {
   if (score >= 90) return 'text-green-500';
   if (score >= 50) return 'text-yellow-500';
   return 'text-red-500';
}