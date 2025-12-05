// src/app/[locale]/admin/tests/[id]/page.tsx

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { TesterManager } from '@/features/tests/ui/TesterManager';
import { requireAdmin } from '@/lib/auth/admin-guard';

export default async function AdminTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const repo = new SupabaseTestRepository();
  
  // 1. Dades en paral·lel
  const [assigned, available, campaignData] = await Promise.all([
    repo.getAssignedTesters(id),
    repo.getAvailableTesters(),
    // Assumeixo que tens un mètode getCampaignById, sinó usa getCampaignWithContext
    repo.getCampaignWithContext(id, 'admin') 
  ]);

  if (!campaignData.campaign) return <div>Test no trobat</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{campaignData.campaign.title}</h1>
        <p className="text-slate-500 mb-8">Gestió de la campanya de proves</p>

        {/* ZONA DE GESTIÓ D'EQUIP */}
        <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">👥 Equip de Testing</h2>
            <TesterManager 
                campaignId={id} 
                assignedTesters={assigned} 
                availableTesters={available} 
            />
        </section>

        {/* AQUI POTS AFEGIR ZONA DE RESULTATS, TASQUES, ETC. */}
    </div>
  );
}