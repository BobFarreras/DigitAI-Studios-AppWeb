'use client';

import { Link } from '@/routing';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Settings,
  FileText,
  BarChart3,
  Users,
  ShieldCheck // <--- Icona per Admin
  
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assegura't de tenir aquesta utilitat o fes servir template strings
import { LogoutButton } from './LogoutButton'; // <--- Importa el nou component
interface SidebarProps {
  userRole?: 'admin' | 'client' | 'lead';
}

export function Sidebar({ userRole = 'client' }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  // Definim els items segons el rol
  const menuItems = [
    {
      label: t('overview'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'client', 'lead'],
    },
    {
      label: 'Admin Panel', // Pots posar t('admin_panel')
      href: '/admin',       // <--- La ruta on vols anar
      icon: ShieldCheck,
      roles: ['admin'],     // <--- NOMÉS ADMIN
    },
    {
      label: t('projects'),
      href: '/dashboard/projects',
      icon: FileText,
      roles: ['admin', 'client'],
    },
    {
      label: t('analytics'),
      href: '/dashboard/audits',
      icon: BarChart3,
      roles: ['admin', 'client'],
    },
    {
      label: t('users'),
      href: '/dashboard/users',
      icon: Users,
      roles: ['admin'], // Només admin
    },
    {
      label: t('settings'),
      href: '/dashboard/settings',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  // Filtrem els items segons el rol de l'usuari
  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0">

      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <span className="font-bold text-xl tracking-tight">DigitAI<span className="text-blue-600">.</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href} // UTILITZEM LA URL COM A KEY (És única)
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-current")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <LogoutButton /> {/* <--- Substituïm el <button> antic per aquest */}
        </div>
      </div>
    </aside>
  );
}