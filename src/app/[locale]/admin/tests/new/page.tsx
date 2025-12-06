// src/app/[locale]/admin/tests/new/page.tsx
import { requireAdmin } from '@/lib/auth/admin-guard';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/routing';
import { ArrowLeft } from 'lucide-react';

// 👇 IMPORT CRÍTIC: Ha de ser entre claus { }
import { CreateCampaignForm } from '@/features/tests/ui/CreateCampaignForm';

export default async function NewCampaignPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto p-8">
        <Link href="/admin/tests" className="text-slate-500 hover:text-white flex items-center gap-2 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Cancel·lar
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Nova Campanya de Test</h1>

        <CreateCampaignForm projects={projects || []} />
    </div>
  );
}