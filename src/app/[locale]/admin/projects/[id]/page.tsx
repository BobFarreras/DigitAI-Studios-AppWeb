import { requireAdmin } from '@/lib/auth/admin-guard';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { InviteClientForm } from '@/features/projects/ui/InviteClientForm';
import { AlertCircle, Github, Globe, Server, User } from 'lucide-react';
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

  // 🛡️ Integritat de dades
  if (!project.organization_id) {
    return <div className="p-8 text-destructive">Error d'integritat: Aquest projecte no té organització vinculada.</div>;
  }

  const { data: team } = await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', project.organization_id);

  const owner = team?.find(u => u.role === 'client');
  const createdAt = project.created_at
    ? new Date(project.created_at)
    : new Date(); // <-- equivalente a Date.now(), pero usado fuera del render JSX
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground mb-4 block transition-colors">
            ← Tornar al llistat
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              {project.name}
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-mono border border-primary/20">
                {project.organizations?.slug}
              </span>
            </h1>

            <div className="flex gap-3">
              {/* 🛡️ Botó Github */}
              <a
                href={project.repository_url || '#'}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>

              {/* 🛡️ Botó Web */}
              {project.hosting_url && (
                <a
                  href={`https://${project.hosting_url}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-colors shadow-sm"
                >
                  <Globe className="w-4 h-4" /> Veure Web
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {/* TARGETA INFRAESTRUCTURA */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                <Server className="w-5 h-5 text-blue-500" /> Infraestructura
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <span className="text-muted-foreground block text-xs uppercase font-bold mb-1">Domini</span>
                  <span className="font-mono text-foreground">{project.domain}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <span className="text-muted-foreground block text-xs uppercase font-bold mb-1">Base de Dades</span>
                  <span className="font-mono text-xs text-foreground truncate block" title={project.organization_id}>
                    {project.organization_id}
                  </span>
                </div>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <span className="text-muted-foreground block text-xs uppercase font-bold mb-1">Estat</span>
                  <span className="font-bold text-foreground capitalize">{project.status}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <span className="text-muted-foreground block text-xs uppercase font-bold mb-1">Creat</span>
                  <span className="text-foreground">    {createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* TARGETA EQUIP */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-green-500" /> Equip & Propietat
              </h3>

              {owner ? (
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                    {owner.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-green-900 dark:text-green-100">{owner.full_name || 'Client'}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{owner.email}</p>
                  </div>
                  <span className="ml-auto px-2 py-1 bg-background text-xs font-bold rounded text-green-600 border border-green-500/20">
                    PROPIETARI
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Aquest projecte encara no té cap client assignat.
                  </div>
                  {/* Component Client (Ja té el seu estil, revisa que usi classes genèriques si cal) */}
                  <InviteClientForm projectId={project.id} orgId={project.organization_id} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-2 text-sm uppercase">Configuració Visual</h4>
              <pre className="text-xs bg-background p-3 rounded border border-border overflow-auto max-h-60 text-muted-foreground font-mono">
                {JSON.stringify(project.organizations?.branding_config, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}