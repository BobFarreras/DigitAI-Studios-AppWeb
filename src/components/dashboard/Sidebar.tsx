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
  { icon: FolderKanban, label: 'Projectes', href: '#projectes' },
  { icon: Settings, label: 'Configuració', href: '#config' },
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

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      alert(`${label} estarà disponible properament! 🚀`);
    }
  };

  // Funció per netejar l'idioma del path (ex: /es/dashboard -> /dashboard)
  const cleanPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col sticky top-0 transition-colors duration-300">
      
      {/* LOGO AREA */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
           DigitAI <span className="text-primary">Hub</span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
           Plataforma
        </div>
        
        {MENU_ITEMS.map((item) => {
          // LÒGICA MILLORADA D'ACTIU:
          // 1. Si és un placeholder (#), mai és actiu.
          // 2. Si és el Dashboard principal, ha de ser EXACTE ('/dashboard').
          // 3. Si és qualsevol altre (ex: /dashboard/audits), ha de COMENÇAR per la ruta.
          
          let isActive = false;
          if (!item.href.startsWith('#')) {
             if (item.href === '/dashboard') {
                isActive = cleanPath === '/dashboard';
             } else {
                isActive = cleanPath.startsWith(item.href);
             }
          }
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              onClick={(e) => handleClick(e, item.href, item.label)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          );
        })}

        {/* CAIXA PROMO */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
           <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Pla Pro
           </div>
           <p className="text-xs text-muted-foreground mb-3">Desbloqueja auditories il·limitades.</p>
           <button className="w-full py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Millorar
           </button>
        </div>
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-border">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Tancar Sessió
        </button>
      </div>
    </aside>
  );
}