'use client';
/**
 * @file src/components/admin/RoleBadge.tsx
 * @updated 2026-05-08
 * @summary Badge visual de rol d'usuari per taules i llistats admin.
 * @scope Mapeig rol -> estil/icona, sense dependències de dades.
 */

import { ShieldCheck, UserCheck, UserPlus, User } from 'lucide-react';

/**
 * Mostra l'etiqueta visual del rol d'usuari.
 * Responsabilitat: mapatge rol -> estil/icona.
 */
export function RoleBadge({ role }: { role: string }) {
  const styles = {
    admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    client: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    lead: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    staff: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    unknown: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  const icons = {
    admin: ShieldCheck,
    client: UserCheck,
    lead: UserPlus,
    staff: User,
    unknown: User,
  };

  const normalizedRole = (role || 'unknown').toLowerCase() as keyof typeof styles;
  const styleClass = styles[normalizedRole] || styles.unknown;
  const Icon = icons[normalizedRole] || icons.unknown;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${styleClass}`}>
      <Icon className="w-3 h-3" />
      {normalizedRole.toUpperCase()}
    </span>
  );
}
