import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileBottomBar } from './MobilBottomBar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const { locale } = await params;

  if (error || !user) {
    redirect({ href: '/auth/login', locale });
  }

  // 👇 CORRECCIÓ: NO usem .single() perquè pot tenir múltiples perfils
  const { data: profiles } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id);

  // Busquem si en ALGUN dels seus perfils és admin
  // També pots afegir el "Super Admin Override" per email per seguretat extra
  const isAdmin = profiles?.some(p => p.role === 'admin') || user!.email === process.env.ADMIN_EMAIL;
  
  const userRole = isAdmin ? 'admin' : 'client';

  // (Opcional) Deixem un log net per confirmar que ara funciona
  console.log(`✅ Rol calculat per ${user!.email}: ${userRole} (Perfils trobats: ${profiles?.length})`);

  return (
    <div className="min-h-screen bg-muted/10 flex font-sans text-foreground">
      
      {/* SIDEBAR */}
      <div className="hidden md:block w-64 shrink-0 z-40">
         <Sidebar userRole={userRole} />
      </div>

      {/* AREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[150px] pointer-events-none"></div>

         <DashboardHeader userEmail={user?.email ?? ''} />
         
         <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10 pb-24 md:pb-8">
            {children}
         </main>

         <div className="md:hidden">
            <MobileBottomBar userRole={userRole} />
         </div>
      </div>
    </div>
  );
}