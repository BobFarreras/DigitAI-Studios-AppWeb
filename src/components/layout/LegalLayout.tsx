import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
// 1. Obtenim la sessió al Layout (es comparteix per a totes les rutes marketing)
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar user= {user} />


      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        {/* Estils base per a textos legals llargs (prose) */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}