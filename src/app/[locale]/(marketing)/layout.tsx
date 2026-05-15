/**
 * @file src/app/[locale]/(marketing)/layout.tsx
 * @updated 2026-05-12
 * @summary Route module: src/app/[locale]/(marketing)/layout.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NavbarV2 } from '@/components/layout/NavbarV2';
import { Footer } from '@/components/layout/Footer';
import { ScrollManager } from '@/components/layout/ScrollManager'; // 👈 Importem el component, NO el hook
import { getSessionUser } from '@/actions/session-user';
import { CustomCursor } from '@/components/ui/CustomCursor';

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
      <CustomCursor />

      <NavbarV2 user={user} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

