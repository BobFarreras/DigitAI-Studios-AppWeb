'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/routing';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Resum', href: '/dashboard' },
  { icon: FileText, label: 'Auditories', href: '/dashboard/audits' },
  { icon: FolderKanban, label: 'Projectes', href: '/dashboard/projects' },
  { icon: Settings, label: 'Configuració', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#0f111a] border-r border-white/5 flex flex-col sticky top-0">
      
      {/* LOGO AREA */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
           DigitAI <span className="text-[#a855f7]">Hub</span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
           Plataforma
        </div>
        
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-500")} />
              {item.label}
            </Link>
          );
        })}

        {/* CAIXA PROMO (Opcional) */}
        <div className="mt-8 p-4 rounded-xl bg-linear-to-br from-primary/10 to-blue-500/10 border border-primary/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
           <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Pla Pro
           </div>
           <p className="text-xs text-slate-400 mb-3">Desbloqueja auditories il·limitades.</p>
           <button className="w-full py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Millorar
           </button>
        </div>
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Tancar Sessió
        </button>
      </div>
    </aside>
  );
}