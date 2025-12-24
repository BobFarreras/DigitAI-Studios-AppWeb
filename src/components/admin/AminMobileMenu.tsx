'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, usePathname } from '@/routing';
import { 
 
  BarChart3, 
  Users, 
  Home, 
  BookOpenCheck, 
  FlaskConical, 
  Inbox, 
  MoreHorizontal, // Icona per al menú "Més"
  Briefcase // Icona per a Projectes
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Tancar el menú si cliquem a fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. ITEMS PRINCIPALS (Es veuran sempre a la barra)
  // Màxim 4 items + el botó "Més"
  const mainLinks = [
    {
      href: '/admin/analytics',
      label: 'Mètriques',
      icon: BarChart3
    },
    {
      href: '/admin/projects', // NOVA SECCIÓ
      label: 'Projectes',
      icon: Briefcase 
    },
    {
      href: '/admin/users',
      label: 'Usuaris',
      icon: Users
    },
    {
      href: '/admin/tests',
      label: 'Tests',
      icon: FlaskConical
    },
  ];

  // 2. ITEMS SECUNDARIS (Dins del desplegable "Més")
  const secondaryLinks = [
    {
      href: '/admin/blog',
      label: 'Blog',
      icon: BookOpenCheck
    },
    {
      href: '/admin/missatges',
      label: 'Missatges',
      icon: Inbox
    },
    {
      href: '/', // Tornar a la web pública
      label: 'Web Pública',
      icon: Home,
      separate: true // Per posar-li un estil diferent si cal
    }
  ];

  // Comprovar si algun item del menú "Més" està actiu per il·luminar el botó "..."
  const isMoreActive = secondaryLinks.some(link => pathname === link.href);

  return (
    <>
      {/* MENU DESPLEGABLE (Tipus Popover) */}
      {isMoreOpen && (
        <div className="md:hidden fixed bottom-20 right-2 z-50 w-48 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div 
            ref={menuRef}
            className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-1">
              {secondaryLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMoreOpen(false)} // Tanquem en clicar
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-500/10 text-blue-400" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                      link.separate && "border-t border-slate-800 mt-1 pt-3 text-slate-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 pb-safe">
        <nav className="flex items-center justify-around h-16 px-2">
          
          {/* Renderitzem els links principals */}
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}

          {/* Botó "Més" (...) */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 focus:outline-none",
              (isMoreOpen || isMoreActive)
                ? "text-blue-400"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <MoreHorizontal className={cn("w-6 h-6", (isMoreOpen || isMoreActive) && "bg-slate-800 rounded-md")} />
            <span className="text-[10px] font-medium">Més</span>
          </button>

        </nav>
      </div>
    </>
  );
}