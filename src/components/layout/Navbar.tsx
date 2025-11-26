'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from "@/components/ui/theme-toggle"; // 👈 Importa el toggle
const NAV_LINKS = [
  { name: 'Inici', href: '#inici' },
  { name: 'Solucions', href: '#solucions' }, // Opcional si tens pàgina apart
  { name: 'Beneficis', href: '#beneficis' },
  { name: 'Testimonis', href: '#testimonis' },
];

export function Navbar() {
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
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          DigitAI <span className="gradient-text">Studios</span>
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
          {/* Afegim el Toggle abans del botó de contacte */}
          <ThemeToggle />
          <Link href="#contacte">
            <Button className="gradient-bg border-0 hover:opacity-90 transition-opacity">Contactar</Button>
          </Link>
        </nav>
        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle /> {/* També el volem al mòbil */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b p-4 flex flex-col gap-4 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="#contacte" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full gradient-bg">Contactar</Button>
          </Link>
        </div>
      )}
    </header>
  );
}