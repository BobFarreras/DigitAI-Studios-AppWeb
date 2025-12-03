'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  LayoutDashboard,
  Home,
  Zap,
  FolderGit2,
  BookOpen,
  User,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

type Props = {
  user: SupabaseUser | null;
};

export function Navbar({ user }: Props) {
  const t = useTranslations('Navbar'); // Hook de traducció
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

  // Definim els enllaços DINS del component per poder usar 't'
  const NAV_LINKS = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('solutions'), href: '/#serveis', icon: Zap },
    { name: t('projects'), href: '/projectes', icon: FolderGit2 },
    { name: t('blog'), href: '/blog', icon: BookOpen },
  ];
  // 2. DEFINIM SI ÉS ADMIN (Pots usar una variable d'entorn pública o hardcodejar el teu email aquí per UI)
  // Nota: La seguretat real està a /admin/layout.tsx, això és només visual.
  const isAdmin = user?.email === 'digitaistudios.developer@gmail.com';
  return (
    <>
      {/* 1. TOP NAVBAR */}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-6 w-px bg-border mx-2"></div>
            <ThemeToggle />
            <LanguageSwitcher />
            {/* 3. BOTÓ ADMIN (EXCLUSIU PER A TU) */}
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
            {/* AUTH BUTTONS */}
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

      {/* 2. BOTTOM TAB BAR (Mòbil) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex justify-around items-center h-16 px-2">

          {NAV_LINKS.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            )
          })}

          {user ? (
            <Link
              href="/dashboard"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                pathname.startsWith('/dashboard') ? "text-primary" : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">Dash</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-muted-foreground hover:text-foreground"
            >
              <User className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">Login</span>
            </Link>
          )}

        </div>
      </div>
    </>
  );
}