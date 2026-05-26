/**
 * @file src/app/[locale]/dashboard/layout.tsx
 * @updated 2026-05-13
 * @summary Route module: src/app/[locale]/dashboard/layout.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileBottomBar } from './MobilBottomBar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { redirect } from '@/routing';
import { getDashboardSessionData } from '@/actions/dashboard-session';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

type DashboardRole = 'admin' | 'client' | 'lead';

function normalizeDashboardRole(role: string | undefined): DashboardRole {
  if (role === 'admin' || role === 'lead') return role;
  return 'client';
}

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;
  const result = await getDashboardSessionData();

  if (!result.success && result.authRequired) {
    redirect({ href: '/auth/login', locale });
  }

  const userRole = normalizeDashboardRole(result.success ? result.userRole : undefined);
  const userEmail = result.success ? result.userEmail : '';
  const profilesCount = result.success ? result.profilesCount : 0;
  console.log(`✅ Rol calculat per ${userEmail}: ${userRole} (Perfils trobats: ${profilesCount})`);

  return (
    <div className="min-h-screen bg-muted/10 flex font-sans text-foreground">
      
      {/* SIDEBAR */}
      <div className="hidden md:block w-64 shrink-0 z-40">
         <Sidebar userRole={userRole} />
      </div>

      {/* AREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[150px] pointer-events-none"></div>

         <DashboardHeader userEmail={userEmail} />
         
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

