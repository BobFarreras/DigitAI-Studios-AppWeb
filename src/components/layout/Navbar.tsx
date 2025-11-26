'use client';

import { useState, useEffect } from 'react';
// 👇 CANVI IMPORTANT: Importa del nostre routing per suportar idiomes
import { Link } from '@/routing'; 
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { name: 'Inici', href: '/' }, // Millor '/' que '#inici' per SEO
  { name: 'Solucions', href: '/#solucions' },
  { name: 'Blog', href: '/blog' }, // 👈 AFEGIT
  { name: 'Beneficis', href: '/#beneficis' },
  // { name: 'Testimonis', href: '/#testimonis' },
];

export function Navbar() {
  // ... (La resta de la lògica es manté igual: useState, useEffect)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3 border-border/40" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
           DigitAI <span className="text-primary">Studios</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-border/50">
            <ThemeToggle />
            <Link href="/#contacte">
              <Button>Contactar</Button>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
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