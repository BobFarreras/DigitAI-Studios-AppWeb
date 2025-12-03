import { requireAdmin } from '@/lib/auth/admin-guard';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/routing';
import { Plus, Github, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default async function AdminProjectsPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Obtenim projectes i la seva organització vinculada
  const { data: projects } = await supabase
    .from('projects')
    .select('*, organizations(plan)')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projectes Clients</h1>
            <p className="text-slate-500">Gestió de les PWA generades</p>
          </div>
          <Link href="/admin/projects/new">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg">
              <Plus className="w-5 h-5" /> Generar Nova Web
            </button>
          </Link>
        </div>

        {/* Grid de Projectes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              
              {/* Capçalera Card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{project.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{project.domain}</p>
                  </div>
                </div>
                <StatusBadge status={project.status ?? 'pending'} />
              </div>

              {/* Detalls */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Pla:</span>
                  <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
                    {project.organizations?.plan || 'Bàsic'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Creat:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Desconegut'}
                  </span>
                </div>
              </div>

              {/* Accions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={project.repository_url ?? ''} 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" /> Codi
                </a>
                
                {/* Botó de "Deploy" o "Manage" futur */}
                <Link 
                  href={`/admin/projects/${project.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-sm font-bold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Gestionar
                </Link>
              </div>

            </div>
          ))}

          {projects?.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-100 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500">Encara no has creat cap projecte.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Component petit per l'estat
function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    maintenance: "bg-orange-100 text-orange-700 border-orange-200",
    archived: "bg-gray-100 text-gray-700 border-gray-200"
  };
  
  const icons = {
    active: CheckCircle,
    pending: Clock,
    maintenance: AlertCircle,
    archived:  AlertCircle
  };

  const Icon = icons[status as keyof typeof icons] || Clock;
  const style = styles[status as keyof typeof styles] || styles.pending;

  return (
    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      <Icon className="w-3 h-3" />
      {status.toUpperCase()}
    </span>
  );
}