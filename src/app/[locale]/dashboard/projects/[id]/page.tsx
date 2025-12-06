import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Link } from '@/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Layout, ArrowRight, CheckCircle2 } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>
}

// ✅ 1. TIPATGE ESTRICTE: Definim l'estructura de la resposta del Join
type AssignmentResponse = {
  id: string; // ID de l'assignació
  campaign: {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    project_id: string; // Necessari per verificar que pertany al projecte actual
    test_tasks: { count: number }[]; // Array d'objectes amb count
  } | null; // Pot ser null si la campanya s'ha esborrat
};

// Tipus net per a la UI
type ProjectTest = {
  id: string;
  title: string;
  description: string | null;
  taskCount: number;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // 1. Dades del Projecte
  const { data: project } = await supabase
    .from('projects')
    .select('name, domain, repository_url')
    .eq('id', id)
    .single();

  if (!project) return notFound();

  // 2. Buscar TOTS els tests assignats a l'usuari
  const { data: rawAssignments } = await supabase
      .from('test_assignments')
      .select(`
        id,
        campaign:test_campaigns (
            id, title, description, status, project_id,
            test_tasks ( count )
        )
      `)
      .eq('user_id', user.id)
      .not('campaign', 'is', null);

  // 3. Processament i Filtratge (Lògica de Negoci)
  const assignments = rawAssignments as unknown as AssignmentResponse[];

  const projectTests: ProjectTest[] = assignments
    .map(a => a.campaign)
    // Filtrem: Que existeixi, que sigui actiu I que pertanyi a AQUEST projecte (id)
    .filter((c): c is NonNullable<typeof c> => 
        c !== null && 
        c.status === 'active' && 
        c.project_id === id // 👈 Aquest filtre és clau
    )
    .map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        taskCount: c.test_tasks?.[0]?.count || 0
    }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      
      {/* CAPÇALERA DE PROJECTE */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-6 md:px-12 mb-8">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">
                <Layout className="w-4 h-4" /> Projecte
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {project.name}
            </h1>
            <a href={`https://${project.domain}`} target="_blank" className="text-blue-600 hover:underline text-sm font-mono mt-1 block">
                {project.domain} ↗
            </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" /> Missions de Test Disponibles
        </h2>

        {projectTests.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <FlaskConical className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Cap missió activa</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                    No tens proves assignades per a aquest projecte ara mateix.
                </p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectTests.map((test) => (
                    <Link key={test.id} href={`/dashboard/projects/${id}/${test.id}`} className="group block h-full">
                        <Card className="h-full hover:border-purple-500/50 transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                        TEST
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 group-hover:text-purple-600 transition-colors">
                                    {test.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                    {test.description || "Sense descripció..."}
                                </p>
                                <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-t pt-4 mt-auto">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {test.taskCount} Tasques
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-purple-500">
                                        Començar <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}