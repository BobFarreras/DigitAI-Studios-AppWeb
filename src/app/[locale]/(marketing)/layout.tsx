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
