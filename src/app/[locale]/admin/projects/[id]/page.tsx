import { requireAdmin } from '@/lib/auth/admin-guard';
import { notFound } from 'next/navigation';
import { Link } from '@/routing';
import { Github, Globe, Server, LayoutDashboard, FlaskConical, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCampaignsList } from '@/features/projects/ui/ProjectCampaignsList';
import { ProjectTeamManager } from '@/features/projects/ui/ProjectTeamManager';
import { DestructionButton } from '@/features/projects/ui/DeleteProjectButton';
import { getAdminProjectPageData } from '@/actions/admin/project-page';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
    await requireAdmin();
    const { id } = await params;
    const result = await getAdminProjectPageData(id);
    if (!result.success) notFound();
    const { project, campaigns, members, candidates, cleanRepoName } = result;
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">

                {/* Header de Navegació */}
                <Link href="/admin/projects" className="text-sm text-slate-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Tornar al llistat
                </Link>

                {/* Header Principal */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            {project.name}
                            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-800">
                                {project.status}
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-mono text-sm">{project.domain || 'Sense domini assignat'}</p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={project.repository_url || '#'}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Github className="w-4 h-4" /> Repo
                        </a>
                        {project.hosting_url && (
                            <a
                                href={`https://${project.hosting_url}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
                            >
                                <Globe className="w-4 h-4" /> Web
                            </a>
                        )}
                        {/* 👇 PASSEM EL NOM NETEJAT AL BOTÓ */}
                        <div className="ml-2 pl-2 border-l border-slate-300 dark:border-slate-700">
                            {cleanRepoName ? (
                                <DestructionButton repoName={cleanRepoName} />
                            ) : (
                                <span className="text-xs text-red-400 px-2">
                                    ⚠️ No puc destruir (falta Repo Name)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ESTRUCTURA DE PESTANYES */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-8 w-full justify-start h-auto p-1">
                        <TabsTrigger value="overview" className="px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Equip & Configuració
                        </TabsTrigger>
                        <TabsTrigger value="qa" className="px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <FlaskConical className="w-4 h-4 mr-2" /> QA & Tests
                            <span className="ml-2 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-xs">{campaigns.length}</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: VISIÓ GENERAL */}
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* ✅ Component de Gestió d'Equip (TIPAT CORRECTAMENT) */}
                            <div className="h-full min-h-100">
                                <ProjectTeamManager
                                    projectId={id}
                                    members={members}
                                    candidates={candidates}
                                />
                            </div>

                            {/* Targeta Tècnica */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm h-fit">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Server className="w-5 h-5 text-blue-500" /> Infraestructura
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-500">Base de Dades ID</span>
                                        <span className="font-mono text-sm">{project.organization_id}</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mt-4">
                                        <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Configuració Visual</h4>
                                        <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                                            {JSON.stringify(project.branding_config, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: QA & TESTS */}
                    <TabsContent value="qa">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm min-h-100">
                            <ProjectCampaignsList campaigns={campaigns} projectId={id} />
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
