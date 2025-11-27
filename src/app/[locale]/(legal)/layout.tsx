import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
    
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        {/* Estils base per a textos legals llargs (prose) */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
        </div>
      </main>
    
    </div>
  );
}