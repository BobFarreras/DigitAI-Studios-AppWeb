// FITXER: src/components/dashboard/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 👇 Importem ShieldAlert per a la icona d'Admin
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut, Sparkles, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/routing';
import { useTranslations } from 'next-intl';

// 👇 Definim la interfície de les Props
interface SidebarProps {
  userRole: 'admin' | 'client' | 'lead';
}

export function Sidebar({ userRole }: SidebarProps) {
  console.log("🔍 [CLIENT SIDEBAR] Prop rebuda userRole:", userRole);
  const t = useTranslations('Sidebar');
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

  const cleanPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  // 👇 LÒGICA DEL MENÚ DINÀMIC
  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: t('summary'), href: '/dashboard' },
    { icon: FileText, label: t('audits'), href: '/dashboard/audits' },
    { icon: FolderKanban, label: t('projects'), href: '#projectes' },
    { icon: Settings, label: t('settings'), href: '#config' },
  ];

  // Si és admin, afegim l'opció al principi o on vulguis
  if (userRole === 'admin') {
    MENU_ITEMS.unshift({ // 'unshift' ho posa al principi, 'push' al final
      icon: ShieldAlert,
      label: 'Admin Panel', // Pots afegir una clau de traducció si vols
      href: '/admin'
    });
  }

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
          {t('platform')}
        </div>

        {MENU_ITEMS.map((item) => {
          let isActive = false;
          // Lògica per marcar actiu /admin i subrutes
          if (!item.href.startsWith('#')) {
            if (item.href === '/dashboard') {
              isActive = cleanPath === '/dashboard';
            } else {
              isActive = cleanPath.startsWith(item.href);
            }
          }
          // Detectem si és el botó d'admin per donar-li estil especial encara que no estigui actiu
          const isAdminItem = item.href === '/admin';
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => item.href.startsWith('#') && handleClick(e, item.href, item.label)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                // Estil específic per l'ítem Admin quan NO està actiu (perquè destaqui una mica)
                (isAdminItem && !isActive) && "text-red-500 hover:text-red-600 hover:bg-red-500/10"
              )}
            >
              {/* 👇 Corregit "text-currentColor" a "text-current" o simplement hereta del pare */}
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-current")} />
              {item.label}
            </Link>
          );
        })}

        {/* CAIXA PROMO (Només visible per a no-admins, opcional) */}
        {userRole !== 'admin' && (
          <div className="mt-8 p-4 rounded-xl bg-linear-to-br from-primary/10 to-blue-500/10 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
            <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('pro_badge')}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t('pro_text')}</p>
            <button className="w-full py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              {t('pro_button')}
            </button>
          </div>
        )}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}