/**
 * @file src/app/[locale]/dashboard/MobilBottomBar.tsx
 * @updated 2026-05-19
 * @summary Route module: src/app/[locale]/dashboard/MobilBottomBar.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/routing'; 
import { 
  LayoutDashboard, 
  BookOpenCheck, 
  ShieldAlert, 
  RotateCcw,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { LogoutButton } from '@/components/dashboard/LogoutButton'; // ✅ IMPORTAT

interface MobileBottomBarProps {
  userRole: 'admin' | 'client' | 'lead';
}

export function MobileBottomBar({ userRole }: MobileBottomBarProps) {
  const t = useTranslations('Dashboard.mobile_nav');
  const pathname = usePathname();
  // router no cal si utilitzem Link i el LogoutButton intern
  
  // Neteja del path per saber on som
  const cleanPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: t('summary'), href: '/dashboard' },
    { icon: BookOpenCheck, label: t('learn'), href: '/dashboard/learn' }, 
    { icon: RotateCcw, label: t('review'), href: '/dashboard/review' },
    { icon: UserCircle, label: t('profile'), href: '/dashboard/profile' },
  ];

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      alert(`${label} ${t('coming_soon')}`); 
    }
  };

  return (
    <>
      {/* --- BARRA INFERIOR --- */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-colors duration-300 md:hidden">
          <div className="flex justify-around items-center h-16 px-2">
              
              {/* 1. ELEMENTS DEL DASHBOARD */}
              {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
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
                              "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                              isActive 
                                  ? "text-primary" 
                                  : "text-muted-foreground hover:text-foreground"
                          )}
                      >
                          <Icon 
                              className={cn("w-5 h-5 transition-all", isActive && "fill-current/20 scale-110")} 
                              strokeWidth={isActive ? 2.5 : 2} 
                          />
                          <span className={cn("text-[10px] font-medium truncate max-w-15", isActive ? "font-bold" : "")}>
                              {item.label}
                          </span>
                      </Link>
                  );
              })}

              {/* 2. ADMIN (Condicional) */}
              {userRole === 'admin' && (
                  <Link 
                      href="/admin"
                      className={cn(
                          "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                          cleanPath.startsWith('/admin') ? "text-purple-500" : "text-muted-foreground hover:text-purple-500"
                      )}
                  >
                      <ShieldAlert className="w-5 h-5" strokeWidth={2} />
                      <span className="text-[10px] font-medium font-mono text-purple-500/80">ADMIN</span>
                  </Link>
              )}

              <LogoutButton 
                minimal={true} 
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-red-400 hover:text-red-500"
              />

          </div>
      </div>
    </>
  );
}
