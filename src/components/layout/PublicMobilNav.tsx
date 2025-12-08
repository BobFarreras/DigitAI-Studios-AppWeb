'use client';

import { Link, usePathname } from '@/routing';
import { Home, Zap, FolderGit2, BookOpen, LayoutDashboard, UserCircle, type LucideIcon, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 1. Definim el tipus d'item
type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  isDropdown?: boolean;
};

interface PublicMobileNavProps {
  user: User | null;
}

export function PublicMobileNav({ user }: PublicMobileNavProps) {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isHomePage = pathname.replace(/^\/[a-z]{2}/, '') === '' || pathname === '/';

    if (isHomePage && href.includes('#')) {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);

      if (element) {
        // Tanquem el menú (si fos un dropdown) donant temps
        setTimeout(() => {
          const headerOffset = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          window.history.pushState(null, '', href);
        }, 100);
      }
    }
  };
  // Llista de sub-enllaços (coincideix amb Escriptori)
  const SOLUTIONS_LINKS = [
    { href: '/#solutions', label: 'Solucions Tech' },
    { href: '/#services', label: 'Serveis' },
    { href: '/#audit', label: 'Auditoria Web' },
    { href: '/#testimonials', label: "Casos d'Èxit" },
    { href: '/#contacte', label: 'Contacte' }
  ];

  // Element dinàmic d'Usuari
  const authItem: NavItem = user
    ? { id: 'auth', label: t('dashboard'), href: '/dashboard', icon: LayoutDashboard }
    : { id: 'auth', label: t('login'), href: '/auth/login', icon: UserCircle };

  const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: t('home'), href: '/', icon: Home },
    // El botó central que obre el menú 👇
    { id: 'solutions', label: t('solutions'), href: '#', icon: Zap, isDropdown: true },
    { id: 'projects', label: t('projects'), href: '/projectes', icon: FolderGit2 },
    { id: 'blog', label: t('blog'), href: '/blog', icon: BookOpen },
    authItem,
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-all duration-300">
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {

          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href.replace('/#', ''));

          const Icon = item.icon;
          const isAuthItem = item.id === 'auth';

          // --- CAS A: ÉS UN DROPDOWN (Solucions) ---
          if (item.isDropdown) {
            return (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform outline-none group focus:outline-none">
                  <div className="relative">
                    <Icon className={cn("w-6 h-6 group-data-[state=open]:text-primary text-muted-foreground")} strokeWidth={2.5} />
                    {/* Fletxeta indicadora */}
                    <div className="absolute -top-1 -right-1 bg-background rounded-full p-px border border-border">
                      <ChevronUp className="w-2 h-2 text-muted-foreground" />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground group-data-[state=open]:text-primary">
                    {item.label}
                  </span>
                </DropdownMenuTrigger>

                {/* Menú desplegable cap amunt */}
                <DropdownMenuContent
                  side="top"
                  align="center"
                  className="w-56 mb-4 p-2 bg-card/95 backdrop-blur-md border-border shadow-2xl rounded-xl z-[60]"
                >
                  {SOLUTIONS_LINKS.map((subLink) => (
                    <DropdownMenuItem key={subLink.href} asChild>
                      <Link
                        href={subLink.href}
                        // Aquí connectem l'event de clic amb la funció d'scroll
                        onClick={(e) => handleScrollToSection(e, subLink.href)}
                        className="w-full cursor-pointer text-sm py-2.5 px-2 font-medium rounded-lg focus:bg-primary/10 active:bg-primary/10"
                      >
                        {subLink.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          // --- CAS B: ÉS UN LINK NORMAL ---
          return (
            <Link
              key={item.id}
              href={item.href}
              // També apliquem scroll si és un link directe a secció (per si de cas)
              onClick={(e) => item.href.includes('#') && handleScrollToSection(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                isActive
                  ? "text-primary"
                  : isAuthItem && user
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive && "fill-current/20 scale-110",
                  (!isActive && isAuthItem) && "opacity-80"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "font-medium")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}