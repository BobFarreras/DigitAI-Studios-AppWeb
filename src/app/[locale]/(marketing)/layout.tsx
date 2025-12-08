import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { ScrollManager } from '@/components/layout/ScrollManager'; // 👈 Importem el component, NO el hook

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Obtenim la sessió al servidor (correcte)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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