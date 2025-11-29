import { requireAdmin } from '@/lib/auth/admin-guard';
import { Link } from '@/routing';
import { ShieldAlert, LayoutDashboard, BarChart3, Users, Home } from 'lucide-react';
import { AdminBottomNav } from '@/components/admin/AminMobileMenu';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⛔ BLOQUEIG DE SEGURETAT
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      
      {/* === 1. SIDEBAR DESKTOP (Només visible en pantalles mitjanes/grans) === */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 p-6 flex-col bg-slate-950">
        <div className="flex items-center gap-2 font-bold text-white mb-10 text-xl">
           <ShieldAlert className="text-red-500" />
           TORRE DE CONTROL
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-900 transition-colors text-slate-300 hover:text-white">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-900 transition-colors text-blue-400 font-medium">
              <BarChart3 className="w-5 h-5" /> Analítiques
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-900 transition-colors text-blue-400 font-medium">
              <Users className="w-5 h-5" /> Usuaris
          </Link>
          
          <div className="mt-auto pt-4 border-t border-slate-800">
            <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-900 transition-colors text-slate-500 text-sm">
               <Home className="w-4 h-4" /> ← Tornar a la Web
            </Link>
          </div>
        </nav>
      </aside>

      {/* === CONTINGUT PRINCIPAL === */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header Mòbil (Opcional: Només títol, sense menú perquè tenim bottombar) */}
        <header className="md:hidden h-14 border-b border-slate-800 flex items-center justify-center bg-slate-950 shrink-0">
           <span className="flex items-center gap-2 font-bold text-white text-sm">
             <ShieldAlert className="w-4 h-4 text-red-500" /> ADMIN PANEL
           </span>
        </header>

        {/* Zona de contingut amb scroll */}
        {/* Afegim 'mb-16' a mòbil per evitar que la bottombar tapi el final del contingut */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mb-16 md:mb-0">
          {children}
        </main>

        {/* === 2. BOTTOM BAR (Només visible a mòbil) === */}
        <AdminBottomNav />
        
      </div>
    </div>
  );
}