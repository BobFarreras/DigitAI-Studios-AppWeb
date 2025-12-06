import { requireAdmin } from '@/lib/auth/admin-guard';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/routing';
import { Plus, Github, ExternalLink, Clock, CheckCircle, AlertCircle, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminProjectsPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Obtenim projectes i la seva organització vinculada
  const { data: projects } = await supabase
    .from('projects')
    .select('*, organizations(plan)')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Projectes Clients</h1>
            <p className="text-muted-foreground">Gestió de les PWA generades ({projects?.length || 0})</p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border-0 gap-2">
              <Plus className="w-5 h-5" /> Generar Nova Web
            </Button>
          </Link>
        </div>

        {/* Grid de Projectes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col h-full">
              
              {/* Capçalera Card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary/20 to-purple-500/20 border border-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {project.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-foreground truncate" title={project.name}>{project.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono truncate">{project.domain}</p>
                  </div>
                </div>
                <StatusBadge status={project.status ?? 'pending'} />
              </div>

              {/* Detalls */}
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center justify-between text-sm py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Pla:</span>
                  <span className="font-medium capitalize text-foreground">
                    {project.organizations?.plan || 'Bàsic'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-muted-foreground">Creat:</span>
                  <span className="text-foreground">
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Desconegut'}
                  </span>
                </div>
              </div>

              {/* Accions */}
              <div className="flex gap-2 pt-4 border-t border-border mt-auto">
                <a 
                  href={project.repository_url ?? '#'} 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" /> Codi
                </a>
                
                <Link 
                  href={`/admin/projects/${project.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-sm font-bold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Gestionar
                </Link>
              </div>

            </div>
          ))}

          {projects?.length === 0 && (
            <div className="col-span-full py-24 text-center bg-muted/20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                 <LayoutGrid className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Sense projectes</h3>
              <p className="text-muted-foreground mt-1 mb-6">Encara no has creat cap projecte per a clients.</p>
              <Link href="/admin/projects/new">
                <Button variant="outline">Crear el primer</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Component Status Badge - Adaptable al tema
function StatusBadge({ status }: { status: string }) {
  // Mapeig de colors semàntics (amb opacitat per suportar dark mode)
  const styles = {
    active: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    maintenance: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    archived: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
  };
  
  const icons = {
    active: CheckCircle,
    pending: Clock,
    maintenance: AlertCircle,
    archived: AlertCircle
  };

  // Type-safe key access
  const normalizedStatus = status.toLowerCase() as keyof typeof styles;
  const Icon = icons[normalizedStatus] || Clock;
  const style = styles[normalizedStatus] || styles.pending;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}