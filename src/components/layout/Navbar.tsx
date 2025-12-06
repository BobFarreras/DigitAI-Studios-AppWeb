'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ✅ Importem Link
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  LayoutDashboard,
  Home,
  Zap,
  FolderGit2,
  BookOpen,

  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
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
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Funció per gestionar l'scroll suau
  // Canviem el tipus d'event a un genèric o HTMLAnchorElement ja que Link renderitza un <a>
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Si estem a la home, fem scroll suau
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    // Si no estem a la home, el Link de Next.js ja gestionarà la navegació cap a la ruta correcta
  };

  const isAdmin = user?.email === 'digitaistudios.developer@gmail.com';

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm border-border py-3"
            : "bg-transparent py-4 md:py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight z-50 flex items-center gap-2">
            <span className="bg-primary/10 p-1.5 rounded-lg md:hidden">
              <Zap className="w-5 h-5 text-primary" />
            </span>
            <span>DigitAI <span className="gradient-text">Studios</span></span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">

            {/* INICI */}
            <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/' ? "text-primary" : "text-muted-foreground")}>
              {t('home')}
            </Link>

            {/* DESPLEGABLE SOLUCIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none">
                {t('solutions')} <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-48">
                {/* CORRECCIÓ: Usem <Link> en lloc de <a>.
                    Com que DropdownMenuItem té asChild, passarà els props i refs al Link.
                */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/#serveis"
                    onClick={(e) => handleScrollToSection(e, '/#serveis')}
                    className="cursor-pointer w-full block"
                  >
                    Serveis Generals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/#LatestPostsSection"
                    onClick={(e) => handleScrollToSection(e, '/#LatestPostsSection')}
                    className="cursor-pointer w-full block"
                  >
                    Últims Articles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/#audit"
                    onClick={(e) => handleScrollToSection(e, '/#audit')}
                    className="cursor-pointer w-full block"
                  >
                    Auditoria
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/#testimonis"
                    onClick={(e) => handleScrollToSection(e, '/#testimonis')}
                    className="cursor-pointer w-full block"
                  >
                    Testimonis
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/#contacte"
                    onClick={(e) => handleScrollToSection(e, '/#contacte')}
                    className="cursor-pointer w-full block"
                  >
                    Contacte
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ALTRES LINKS */}
            <Link href="/projectes" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/projectes' ? "text-primary" : "text-muted-foreground")}>
              {t('projects')}
            </Link>
            <Link href="/blog" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/blog' ? "text-primary" : "text-muted-foreground")}>
              {t('blog')}
            </Link>

            <div className="h-6 w-px bg-border mx-2"></div>
            <ThemeToggle />
            <LanguageSwitcher />

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                  pathname.startsWith('/admin') ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                )}
              >
                <ShieldAlert className="w-6 h-6" strokeWidth={2} />
                <span className="text-[10px] font-bold">Admin</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> {t('dashboard')}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title={t('logout')}>
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                  {t('login')}
                </Link>
                <Link href="/auth/register">
                  <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* MOBILE TOGGLES */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            {user && (
              <Link href="/dashboard">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-border"
                  />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform", pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <Home className="w-6 h-6" strokeWidth={pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('home')}</span>
          </Link>

          {/* Enllaç directe a serveis pel mòbil per simplificar, o podries posar un Drawer */}
          <Link href="/#serveis" onClick={(e) => handleScrollToSection(e, '/#serveis')} className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-muted-foreground hover:text-foreground">
            <Zap className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">{t('solutions')}</span>
          </Link>

          <Link href="/projectes" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform", pathname === '/projectes' ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <FolderGit2 className="w-6 h-6" strokeWidth={pathname === '/projectes' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('projects')}</span>
          </Link>
          <Link href="/blog" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform", pathname === '/blog' ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <BookOpen className="w-6 h-6" strokeWidth={pathname === '/blog' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('blog')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}