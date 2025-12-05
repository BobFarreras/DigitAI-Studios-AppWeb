import { requireAdmin } from '@/lib/auth/admin-guard';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Plus, FlaskConical, ExternalLink } from 'lucide-react';

// Tipus local per a la vista (amb les dades ja processades pel repo)
type AdminCampaignView = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  projects: { name: string } | null;
  stats: {
    total_tasks: number;
    total_results: number;
  };
};

export default async function AdminTestsPage() {
  await requireAdmin();
  const repo = new SupabaseTestRepository();
  
  // Fem servir el tipus nou
  const campaigns = (await repo.getAllCampaignsForAdmin()) as unknown as AdminCampaignView[];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-purple-500" /> Gestió de QA
          </h1>
          <p className="text-slate-400 mt-1">Administra les campanyes de proves beta.</p>
        </div>
        <Link href="/admin/tests/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Nova Campanya
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-500/30 transition-colors">
            
            {/* Info Principal */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white">{camp.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${camp.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
                    {camp.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{camp.description || "Sense descripció"}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span>📂 {camp.projects?.name || 'Projecte esborrat'}</span>
                <span>📅 {new Date(camp.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Estadístiques (ARA MOLT MÉS NET) */}
            <div className="flex items-center gap-6 md:pr-8 md:border-r border-slate-800">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{camp.stats.total_tasks}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tasques</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{camp.stats.total_results}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reports</div>
                </div>
            </div>

            {/* Accions */}
            <div className="flex gap-2 w-full md:w-auto">
                <Link href={`/admin/tests/${camp.id}`} className="w-full md:w-auto">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        Gestionar <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>

          </div>
        ))}

        {campaigns.length === 0 && (
            <div className="text-center py-20 text-slate-600 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                No hi ha campanyes actives. Crea la primera!
            </div>
        )}
      </div>
    </div>
  );
}