import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Obtenim la sessió al Layout (es comparteix per a totes les rutes marketing)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      {/* 2. Passem l'usuari al Navbar */}
      <Navbar user={user} />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}