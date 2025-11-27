'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/ui/theme-toggle"; 
import type { User as SupabaseUser } from '@supabase/supabase-js';

const NAV_LINKS = [
  { name: 'Inici', href: '#inici' },
  { name: 'Solucions', href: '#serveis' },
  { name: 'Beneficis', href: '#beneficis' },
];

type Props = {
  user: SupabaseUser | null; // Rebem l'usuari des del servidor
};

export function Navbar({ user }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
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

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-border py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight z-50">
          DigitAI <span className="gradient-text">Studios</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              {link.name}
            </Link>
          ))}

          {/* Separador vertical */}
          <div className="h-6 w-[1px] bg-border mx-2"></div>

          <ThemeToggle />

          {/* LÒGICA D'AUTH */}
          {user ? (
            // SI ESTÀ LOGUEJAT
            <div className="flex items-center gap-4">
               <Link href="/dashboard">
                  <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20">
                     <LayoutDashboard className="w-4 h-4 mr-2" />
                     Dashboard
                  </Button>
               </Link>
               <Button variant="ghost" size="icon" onClick={handleSignOut} title="Tancar Sessió">
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors" />
               </Button>
            </div>
          ) : (
            // SI NO ESTÀ LOGUEJAT
            <div className="flex items-center gap-4">
               <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Inicia Sessió
               </Link>
               <Link href="/auth/register">
                  <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20">
                     Registra't
                  </Button>
               </Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="z-50">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-background border-b p-8 flex flex-col gap-8 items-center justify-center shadow-xl animate-in slide-in-from-top-10">
          {NAV_LINKS.map((link) => (
             <Link 
                key={link.name} 
                href={link.href} 
                className="text-2xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
             >
                {link.name}
             </Link>
          ))}
          
          <div className="w-20 h-[1px] bg-border my-4"></div>

          {user ? (
             <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button className="w-full text-lg h-12 gradient-bg px-8">Dashboard</Button>
                </Link>
                <button onClick={handleSignOut} className="text-red-500 font-medium flex items-center gap-2">
                   <LogOut className="w-5 h-5" /> Tancar Sessió
                </button>
             </>
          ) : (
             <>
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium">
                   Inicia Sessió
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button className="w-full text-lg h-12 gradient-bg px-8">Registra't</Button>
                </Link>
             </>
          )}
        </div>
      )}
    </header>
  );
}