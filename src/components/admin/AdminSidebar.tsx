// src/components/admin/AdminSidebar.tsx
'use client';

import { Link, usePathname } from '@/routing';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle'; // 👈 Importem el Toggle
import {
  ShieldAlert,
  BarChart3,
  Users,
  BookOpenCheck,
  FlaskConical,
  Home,
  Briefcase,
  Settings,
  Inbox
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Analítiques', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Usuaris', href: '/admin/users', icon: Users },
    { label: 'Projectes', href: '/admin/projects', icon: Briefcase },
    { label: 'QA / Tests', href: '/admin/tests', icon: FlaskConical },
    { label: 'Blog', href: '/admin/blog', icon: BookOpenCheck },
    { label: 'Configuració', href: '/admin/settings', icon: Settings },
    { label: 'Missatges', href: '/admin/missatges', icon: Inbox},
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-border p-6 flex-col bg-card/50 backdrop-blur-xl h-full sticky top-0">

      {/* CAPÇALERA */}
      <div className="flex items-center gap-2 font-bold text-foreground mb-10 text-xl px-2">
        <ShieldAlert className="text-primary w-6 h-6" /> {/* Usem primary en lloc de red-500 fix */}
        <span>ADMIN</span>
      </div>

      {/* NAVEGACIÓ */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/10 shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "opacity-70")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER AMB TOGGLE I RETORN */}
      <div className="mt-auto pt-6 border-t border-border space-y-4">

        {/* Selector de Tema */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground text-sm"
        >
          <Home className="w-4 h-4 opacity-70" />
          <span>Tornar a la Web</span>
        </Link>
      </div>
    </aside>
  );
}