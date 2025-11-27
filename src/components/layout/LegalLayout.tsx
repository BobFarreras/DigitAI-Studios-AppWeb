import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ara sí: això s’executa en request scope i és 100% segur
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar user={user} />

      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
