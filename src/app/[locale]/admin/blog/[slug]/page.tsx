// src/app/[locale]/admin/blog/[slug]/page.tsx

import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { ArrowLeft, Save, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react'; // 👈 Importem CheckCircle2
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PostStatusToggle } from '@/features/blog/ui/PostStatusToggle';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function AdminPostDetailPage({ params }: Props) {
    await requireAdmin();
    const { slug } = await params;

    const post = await postRepository.getAdminPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8"> {/* Ampliat max-w a 6xl per més espai */}

            {/* HEADER MILLORAT */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border pb-6">
                
                {/* BLOC ESQUERRA: Títol i Estat */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Link href="/admin/blog">
                        <Button variant="outline" size="icon" className="shrink-0 rounded-full border-muted-foreground/20 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate max-w-full leading-tight">
                                {post.title}
                            </h1>
                            {/* INDICADOR DE REVISAT */}
                            {post.reviewed && (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full text-xs font-medium border border-green-500/20" title="Aquest post ha estat revisat">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Revisat</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                                post.published 
                                    ? 'bg-primary/10 text-primary border-primary/20' 
                                    : 'bg-muted text-muted-foreground border-border'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                {post.published ? 'Publicat' : 'Esborrany'}
                            </span>
                            <span className="font-mono text-xs opacity-60 hidden sm:inline-block">/ {post.slug}</span>
                        </div>
                    </div>
                </div>

                {/* BLOC DRETA: Accions */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    
                    {/* Grup Secundari */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar Post">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                        
                        {post.published && (
                            <Link href={`/blog/${post.slug}`} target="_blank">
                                <Button variant="outline" size="icon" title="Veure Web Pública">
                                    <ExternalLink className="w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="h-8 w-px bg-border hidden md:block mx-1" />

                    {/* Grup Principal */}
                    <PostStatusToggle postId={post.id || ''} isPublished={post.published} />

                    <Link href={`/admin/blog/${post.slug}/edit`}>
                        <Button className="bg-foreground text-background hover:bg-foreground/90 shadow-sm font-semibold px-6">
                            <Save className="w-4 h-4 mr-2" /> Editar
                        </Button>
                    </Link>
                </div>
            </div>

            {/* CONTINGUT (GRID) */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* COLUMNA PRINCIPAL */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Imatge de Portada (Millorada) */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-sm group">
                        {post.coverImage ? (
                            <>
                                <Image
                                    src={post.coverImage}
                                    alt="Cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                                <div className="p-4 bg-background/50 rounded-full">
                                    <Image className="w-8 h-8 opacity-50" src={''} alt={''} />
                                </div>
                                <span className="text-sm font-medium">Sense imatge de portada</span>
                            </div>
                        )}
                    </div>

                    {/* Contingut MDX */}
                    <Card className="border-border shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border py-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                Contingut de l'Article
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
                            <MDXContent source={post.content || ''} />
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR DRET */}
                <div className="space-y-6">
                    <Card className="border-border shadow-sm sticky top-6">
                        <CardHeader className="pb-3 border-b border-border bg-muted/10">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Metadades SEO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-6">
                            
                            <div>
                                <label className="text-xs font-bold text-muted-foreground block mb-2">Slug URL</label>
                                <div className="bg-muted/50 p-2.5 rounded-lg border border-border flex items-center gap-2 group cursor-pointer hover:border-primary/30 transition-colors">
                                    <span className="text-muted-foreground text-xs select-none">/blog/</span>
                                    <code className="text-sm text-foreground font-mono truncate">{post.slug}</code>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground block mb-2">Meta Descripció</label>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border text-sm text-muted-foreground leading-relaxed italic">
                                    {post.description || "Sense descripció definida."}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground block mb-2">Etiquetes</label>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.length > 0 ? (
                                        post.tags.map(tag => (
                                            <span key={tag} className="text-xs font-medium bg-background border border-border px-2.5 py-1 rounded-md text-foreground shadow-sm">
                                                #{tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Sense tags</span>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}