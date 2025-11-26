import { requireAdmin } from '@/lib/auth/admin-guard';
import { Link } from '@/routing';
import { ShieldAlert } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⛔ BLOQUEIG DE SEGURETAT
  // Només amb aquesta línia, protegim totes les pàgines filles
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar Admin Minimalista */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-white mb-10 text-xl">
           <ShieldAlert className="text-red-500" />
           TORRE DE CONTROL
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="px-4 py-2 rounded hover:bg-slate-900 transition-colors">
             Dashboard
          </Link>
          <Link href="/admin/analytics" className="px-4 py-2 rounded hover:bg-slate-900 transition-colors text-blue-400">
             Analítiques
          </Link>
          <Link href="/" className="px-4 py-2 rounded hover:bg-slate-900 transition-colors mt-auto text-slate-500 text-sm">
             ← Tornar a la Web
          </Link>
        </nav>
      </aside>

      {/* Contingut */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}