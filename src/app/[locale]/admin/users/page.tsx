import { getAdminUsersList } from '@/app/actions/get-users';
import { getTranslations } from 'next-intl/server';
import { Mail, Download, User, Calendar, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminUsersPage() {
  const users = await getAdminUsersList();
  const t = await getTranslations('AdminDashboard');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* CAPÇALERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Usuaris</h1>
          <p className="text-muted-foreground text-sm">
            Base de dades de clients i leads ({users.length} totals)
          </p>
        </div>
        <Button variant="outline" className="border-border bg-card hover:bg-muted text-foreground gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* TAULA CARD */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            {/* HEAD */}
            <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 pl-6">Usuari</th>
                <th className="px-4 py-3">Rol & Estat</th>
                <th className="px-4 py-3">Registre</th>
                <th className="px-4 py-3 text-right pr-6">Accions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                  
                  {/* COLUMNA 1: IDENTITAT (Compacta) */}
                  <td className="px-4 py-3 pl-6">
                    <div className="flex items-center gap-3">
                      {/* Avatar Generat */}
                      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-none mb-1">
                          {user.full_name || 'Sense nom'}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* COLUMNA 2: ROL (Badge modern) */}
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* COLUMNA 3: DATA (Compacta) */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.created_at ? (
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {new Date(user.created_at).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </span>
                          <span className="text-[10px] opacity-70">
                            {new Date(user.created_at).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  {/* COLUMNA 4: ACCIONS */}
                  <td className="px-4 py-3 text-right pr-6">
                    <a
                      href={`mailto:${user.email}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      title="Enviar correu"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <User className="w-8 h-8 opacity-20" />
                        <span>Encara no hi ha usuaris registrats.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper component per als Badges de Rol
function RoleBadge({ role }: { role: string }) {
  const styles = {
    admin: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    client: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    lead: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    unknown: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
  };

  const icons = {
    admin: ShieldCheck,
    client: UserCheck,
    lead: UserPlus,
    unknown: User
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