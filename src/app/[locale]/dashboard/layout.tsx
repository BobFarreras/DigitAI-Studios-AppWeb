import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/routing'; // 👈 IMPORTANT: Importar del nostre routing, no de next/link
import { redirect } from 'next/navigation'; // 👈 Usar el redirect natiu és més segur en Server Components

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 👈 Necessitem saber l'idioma
};

export default async function DashboardLayout({
  children,
  params
}: Props) {
  const { locale } = await params; // Resolem la promesa
  const supabase = await createClient();
  const t = await getTranslations('Dashboard');

  // 1. Verificació de Sessió al Servidor
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirecció manual incloent l'idioma
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="font-bold text-xl mb-8">DigitAI Studios</div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-slate-300">Resum</Link>
          <Link href="/dashboard/audits" className="hover:text-slate-300 font-bold text-blue-400">
            {t('my_audits')}
          </Link>
          {/* Exemple de ruta futura */}
          <button className="text-left hover:text-slate-300 text-slate-500 cursor-not-allowed">
            Configuració (Aviat)
          </button>
          
          <form action="/auth/signout" method="post" className="mt-auto">
            <button className="text-sm text-slate-400 hover:text-white w-full text-left">
              Tancar Sessió
            </button>
          </form>
        </nav>
      </aside>

      {/* Contingut Principal */}
      <main className="flex-1 bg-slate-50 p-8">
        {children}
      </main>
    </div>
  );
}