'use client';

import { Link, usePathname } from '@/routing';
import { LayoutDashboard, BarChart3, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminBottomNav() {
  const pathname = usePathname();

  const navLinks = [
    { 
      href: '/admin', 
      label: 'Inici', 
      icon: LayoutDashboard 
    },
    { 
      href: '/admin/analytics', 
      label: 'Mètriques', 
      icon: BarChart3 
    },
    { 
      href: '/admin/users', 
      label: 'Usuaris', 
      icon: Users 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 pb-safe">
      <nav className="flex items-center justify-around h-16">
        {navLinks.map((link) => {
          const Icon = link.icon;
          // Comprovem si la ruta coincideix exactament o si és una subruta
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
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

        {/* Botó separat per tornar a la web pública */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-600 hover:text-slate-400"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Web</span>
        </Link>
      </nav>
    </div>
  );
}