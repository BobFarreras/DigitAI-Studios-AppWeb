import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // 👈 SOLUCIÓ 1: Importar el natiu
import { getLocale } from 'next-intl/server'; // 👈 SOLUCIÓ 2: Per saber l'idioma
import { CreateAuditForm } from '@/features/audit/ui/components/CreateAuditForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewAuditPage() {
  const supabase = await createClient();
  const locale = await getLocale(); // Obtenim 'ca', 'es', etc.
  
  const { data: { user } } = await supabase.auth.getUser();

  // TypeScript ara entén que 'redirect' atura l'execució aquí.
  // Per tant, a baix 'user' mai serà null.
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      
      <Link 
        href="/dashboard/audits" 
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit"
      >
         <ArrowLeft className="w-4 h-4 mr-2" /> Tornar al llistat
      </Link>

      {/* CONTENIDOR: Adaptat a Light (bg-white) i Dark (bg-fosc) */}
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         
         {/* Fons decoratiu (Glow) */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

         <div className="relative z-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">Nova Auditoria Web</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
               Introdueix la URL del lloc web que vols analitzar. La nostra IA escanejarà el SEO, el rendiment i l'accessibilitat en temps real.
            </p>

            {/* El formulari client-side */}
            {/* Ara TypeScript no es queixa perquè sap que user existeix segur */}
            <CreateAuditForm  />
         </div>
      </div>
    </div>
  );
}