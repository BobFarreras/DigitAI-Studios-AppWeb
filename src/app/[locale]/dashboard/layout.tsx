import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 👈 CANVI CLAU: Ara és una Promesa
};

export default async function DashboardLayout({ children, params }: Props) {
  // 1. Verificació de Seguretat al Servidor
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 2. 👇 AWAIT DELS PARAMS (Solució de l'error)
  const { locale } = await params;

  if (error || !user) {
    redirect({ href: '/auth/login', locale });
  }

  return (
    <div className="min-h-screen bg-[#020817] flex font-sans text-slate-200">
      {/* SIDEBAR (Fixa a l'esquerra) */}
      <div className="hidden md:block w-64 shrink-0">
         <Sidebar />
      </div>

      {/* AREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#020817]">
         {/* Fons decoratiu global per al dashboard */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[150px] pointer-events-none"></div>

         <DashboardHeader userEmail={user?.email ?? ''} />
         
         <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10">
            {children}
         </main>
      </div>
    </div>
  );
}