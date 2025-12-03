import { requireAdmin } from '@/lib/auth/admin-guard';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { InviteClientForm } from '@/features/projects/ui/InviteClientForm';
// 🗑️ CORRECCIÓ: Eliminem 'CheckCircle' que no es feia servir (Error ts:6133)
import { Github, Globe, Server, User } from 'lucide-react'; 
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*, organizations(*)')
    .eq('id', id)
    .single();

  if (!project) notFound();

  // 🛡️ CORRECCIÓ DE NULLS:
  // Si organization_id és null, no podem continuar amb la lògica de permisos.
  if (!project.organization_id) {
      return <div>Error d'integritat: Aquest projecte no té organització vinculada.</div>;
  }

  const { data: team } = await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', project.organization_id);

  const owner = team?.find(u => u.role === 'client');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/projects" className="text-sm text-slate-500 hover:text-slate-900 mb-4 block">← Tornar al llistat</Link>
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {project.name}
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-mono">
                {project.organizations?.slug}
              </span>
            </h1>
            <div className="flex gap-3">
               {/* 🛡️ CORRECCIÓ: Fallback segur per repository_url */}
               <a 
                 href={project.repository_url || '#'} 
                 target="_blank" 
                 className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
               >
                 <Github className="w-4 h-4" /> GitHub
               </a>
               {/* 🛡️ CORRECCIÓ: Condicional per hosting_url */}
               {project.hosting_url && (
                 <a 
                   href={`https://${project.hosting_url}`} 
                   target="_blank" 
                   className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
                 >
                   <Globe className="w-4 h-4" /> Veure Web
                 </a>
               )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-500" /> Infraestructura
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* ... (resta igual) ... */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 block text-xs uppercase font-bold">Base de Dades</span>
                        {/* Aquí project.organization_id ja sabem que no és null pel check de dalt */}
                        <span className="font-mono text-xs">{project.organization_id}</span>
                    </div>
                    {/* ... (resta igual) ... */}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-500" /> Equip & Propietat
                </h3>
                
                {owner ? (
                    // ... (bloc owner igual)
                    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                            {owner.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-green-900">{owner.full_name || 'Client'}</p>
                            <p className="text-sm text-green-700">{owner.email}</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-white text-xs font-bold rounded text-green-600 border border-green-200">
                            PROPIETARI
                        </span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-sm">
                            ⚠️ Aquest projecte encara no té cap client assignat.
                        </div>
                        {/* 🛡️ CORRECCIÓ: Passem l'ID netejat */}
                        <InviteClientForm projectId={project.id} orgId={project.organization_id} />
                    </div>
                )}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Configuració Visual</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(project.organizations?.branding_config, null, 2)}
                </pre>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}