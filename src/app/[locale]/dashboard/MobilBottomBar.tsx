'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderKanban, Settings, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

// 1. DEFINIM LA INTERFÍCIE
interface MobileBottomBarProps {
  userRole: 'admin' | 'client' | 'lead';
}

// 2. ACCEPTEM LA PROP
export function MobileBottomBar({ userRole }: MobileBottomBarProps) {
  console.log("🔍 [CLIENT MOBILE] Prop rebuda userRole:", userRole);
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  const cleanPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  // 3. DEFINIM ELS ÍTEMS BÀSICS
  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: t('summary'), href: '/dashboard' },
    { icon: FileText, label: t('audits'), href: '/dashboard/audits' },
    { icon: FolderKanban, label: 'Tests', href: '#proves' },
    { icon: Settings, label: t('settings'), href: '#ajustos' },
  ];

  // 4. AFEGIM L'ADMIN NOMÉS SI TOCA
  if (userRole === 'admin') {
    MENU_ITEMS.push({ // 'push' ho posa al final (dreta)
      icon: ShieldAlert, 
      label: 'Admin', // O t('admin') si tens la traducció
      href: '/admin' 
    });
  }

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      alert(`${label} estarà disponible properament! 🚀`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-colors duration-300">
        <div className="flex justify-around items-center h-16 px-2">
            {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                let isActive = false;
                
                // Lògica activa
                if (!item.href.startsWith('#')) {
                   if (item.href === '/dashboard') {
                      isActive = cleanPath === '/dashboard';
                   } else {
                      isActive = cleanPath.startsWith(item.href);
                   }
                }

                // Detectem si és admin per donar-li color especial (opcional)
                const isAdminItem = item.href === '/admin';

                return (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href, item.label)}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                            isActive 
                                ? "text-primary" 
                                : "text-muted-foreground hover:text-foreground",
                            // Color vermellós per a l'admin si vols que destaqui
                            (isAdminItem && !isActive) && "text-red-400 hover:text-red-500"
                        )}
                    >
                        <Icon 
                            className={cn("w-6 h-6 transition-all", isActive && "fill-current/20 scale-110")} 
                            strokeWidth={isActive ? 2.5 : 2} 
                        />
                        <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    </div>
  );
}