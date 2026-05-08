/**
 * @file src/app/[locale]/(marketing)/layout.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/(marketing)/layout.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollManager } from '@/components/layout/ScrollManager'; // 👈 Importem el component, NO el hook
import { getSessionUser } from '@/actions/session-user';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getSessionUser();
  const user = result.user;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      {/* 2. Inserim el gestor d'scroll aquí */}
      <ScrollManager />

      <Navbar user={user} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

