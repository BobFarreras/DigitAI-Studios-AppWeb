'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Zap, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserNav } from './UserNav'; // 👈 El nou component
import { PublicMobileNav } from './PublicMobilNav'; // 👈 El nou component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  user: SupabaseUser | null;
};

export function Navbar({ user }: Props) {
  const t = useTranslations('Navbar');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Control d'scroll per canviar l'estil del header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lògica d'scroll suau (només per desktop, el mòbil ho té al seu component)
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm border-border py-3"
            : "bg-transparent py-4 md:py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">

          {/* 1. LOGO DE MARCA */}
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight z-50 flex items-center gap-2 group">
            <span className="bg-primary/10 p-1.5 rounded-lg md:hidden group-hover:bg-primary/20 transition-colors">
              <Zap className="w-5 h-5 text-primary" />
            </span>
            <span>DigitAI <span className="gradient-text">Studios</span></span>
          </Link>

          {/* 2. MENU ESCRIPTORI CENTRAL */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={cn("text-sm font-medium hover:text-primary transition-colors", pathname === '/' ? "text-primary" : "text-muted-foreground")}>
              {t('home')}
            </Link>

            {/* Dropdown "Solucions" */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none data-[state=open]:text-primary">
                {t('solutions')} <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2">
                {[
                    { href: '/#serveis', label: 'Serveis Generals' },
                    { href: '/#audit', label: 'Auditoria Web' },
                    { href: '/#LatestPostsSection', label: 'Blog & Recursos' },
                    { href: '/#testimonis', label: 'Casos d\'Èxit' },
                    { href: '/#contacte', label: 'Contacte' }
                ].map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link 
                            href={link.href} 
                            onClick={(e) => handleScrollToSection(e, link.href)}
                            className="cursor-pointer font-medium"
                        >
                            {link.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/projectes" className={cn("text-sm font-medium hover:text-primary transition-colors", pathname === '/projectes' ? "text-primary" : "text-muted-foreground")}>
              {t('projects')}
            </Link>
            
            <Link href="/blog" className={cn("text-sm font-medium hover:text-primary transition-colors", pathname === '/blog' ? "text-primary" : "text-muted-foreground")}>
              {t('blog')}
            </Link>
          </nav>

          {/* 3. ÀREA D'ACCIONS (DRETA) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Utilitats */}
            <div className="hidden md:flex items-center gap-1 pr-2 border-r border-border/50">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>
            
            {/* Mòbil: Només mostrar toggles, el menú va a baix */}
            <div className="flex md:hidden gap-1">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>

            {/* Lògica d'Usuari encapsulada */}
            <UserNav user={user} />
          </div>

        </div>
      </header>

      {/* 4. BARRA DE NAVEGACIÓ MÒBIL (Component Separat) */}
      <PublicMobileNav />
    </>
  );
}