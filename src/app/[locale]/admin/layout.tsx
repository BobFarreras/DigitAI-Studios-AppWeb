// src/app/[locale]/admin/layout.tsx
import { requireAdmin } from '@/lib/auth/admin-guard';
import { AdminBottomNav } from '@/components/admin/AminMobileMenu'; // Assegura't del nom correcte (AminMobileMenu o AdminMobileMenu)
import { AdminSidebar } from '@/components/admin/AdminSidebar'; // 👈 El nou component
import { ShieldAlert } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Bloqueig de seguretat (Server Side)
  await requireAdmin();

  return (
    // Usem classes semàntiques (bg-background) per preparar el Pas 2 (Themes)
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {/* SIDEBAR (Desktop) - Ara modularitzat */}
      <AdminSidebar />

      {/* CONTINGUT PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header Mòbil (Només visible en pantalles petites) */}
        <header className="md:hidden h-14 border-b border-border flex items-center justify-center bg-card/80 backdrop-blur-sm shrink-0 sticky top-0 z-30">
          <span className="flex items-center gap-2 font-bold text-foreground text-sm">
            <ShieldAlert className="w-4 h-4 text-red-500" /> ADMIN PANEL
          </span>
        </header>

        {/* Zona de Contingut amb Scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0 scroll-smooth">
          {children}
        </main>

        {/* Navegació Mòbil (Bottom Bar) */}
        <AdminBottomNav />
      </div>
    </div>
  );
}