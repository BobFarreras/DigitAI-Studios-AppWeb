'use client';

import { Link, usePathname } from '@/routing';
import { Home, Zap, FolderGit2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function PublicMobileNav() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  // Helper per a l'scroll suau a la home
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const NAV_ITEMS = [
    { label: t('home'), href: '/', icon: Home },
    { label: t('solutions'), href: '/#serveis', icon: Zap, onClick: handleScrollToSection },
    { label: t('projects'), href: '/projectes', icon: FolderGit2 },
    { label: t('blog'), href: '/blog', icon: BookOpen },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-all duration-300">
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map((item) => {
          // Lògica activa senzilla
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href.replace('/#', ''));
            
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => item.onClick && item.onClick(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn("w-6 h-6 transition-all", isActive && "fill-current/20 scale-110")} 
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