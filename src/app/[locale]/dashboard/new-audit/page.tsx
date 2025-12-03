import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server'; // Importem getTranslations
import { CreateAuditForm } from '@/features/audit/ui/components/CreateAuditForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewAuditPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations('NewAudit'); // Namespace NewAudit
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      
      <Link 
        href="/dashboard/audits" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit"
      >
         <ArrowLeft className="w-4 h-4 mr-2" /> {t('back_to_list')}
      </Link>

      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

         <div className="relative z-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">{t('title')}</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
               {t('description')}
            </p>

            <CreateAuditForm  />
         </div>
      </div>
    </div>
  );
}