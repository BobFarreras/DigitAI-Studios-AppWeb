'use client';

import { useState, useEffect } from 'react';
import { Link} from '@/routing';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { name: 'Inici', href: '/' },
  { name: 'Solucions', href: '/#solucions' },
  { name: 'Blog', href: '/blog' },
  { name: 'Beneficis', href: '/#beneficis' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detectem scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        // LÒGICA: Si fem scroll -> Sòlid i Borrós (Glassmorphism)
        // Si estem a dalt de tot -> Transparent total
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/40 py-3" 
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
           {/* El logotip s'adapta automàticament al tema */}
           DigitAI <span className="text-primary">Studios</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                // Truc de disseny: Si la navbar és transparent (estem sobre una imatge fosca), 
                // volem text blanc o lluminós? O deixem que s'adapti?
                // Per seguretat usem 'foreground' que funciona sempre.
                "text-foreground/80 hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-border/50">
            <ThemeToggle />
            <Link href="/#contacte">
              <Button variant={isScrolled ? "default" : "secondary"}>
                Contactar
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b p-4 flex flex-col gap-4 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/#contacte" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full">Contactar</Button>
          </Link>
        </div>
      )}
    </header>
  );
}