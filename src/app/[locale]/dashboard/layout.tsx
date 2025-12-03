// FITXER: src/app/[locale]/dashboard/layout.tsx

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

  // 👇 1. OBTENIM EL ROL DE L'USUARI (Consulta extra ràpida)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  const userRole = profile?.role || 'lead'; // Fallback segur

  return (
    <div className="min-h-screen bg-muted/10 flex font-sans text-foreground">
      
      {/* SIDEBAR */}
      <div className="hidden md:block w-64 shrink-0 z-40">
         {/* 👇 2. PASSEM EL ROL A LA SIDEBAR */}
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
            <MobileBottomBar />
         </div>
      </div>
    </div>
  );
}