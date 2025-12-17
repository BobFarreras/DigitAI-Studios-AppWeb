// src/app/[locale]/admin/blog/[slug]/page.tsx

import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { ArrowLeft, Save, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PostStatusToggle } from '@/features/blog/ui/PostStatusToggle';
import { createClient } from '@/lib/supabase/server';
import { PostViewTabs } from '@/components/admin/posts/PostViewTabs';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function AdminPostDetailPage({ params }: Props) {
    await requireAdmin();
    const { slug } = await params;

    const post = await postRepository.getAdminPostBySlug(slug);
    if (!post) return notFound();

    const supabase = await createClient();
    const { data: socialPosts } = await supabase
        .from('social_posts')
        .select('*')
        .eq('post_id', post.id);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
            
            {/* --- CAPÇALERA RESPONSIVE UNIFICADA --- */}
            {/* flex-col en mòbil (un sota l'altre), flex-row en PC (al costat) */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border pb-6">
                
                {/* 1. BLOC TÍTOL I INFO */}
                <div className="flex items-start gap-3 w-full md:w-auto">
                    <Link href="/admin/blog" className="shrink-0 mt-1">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    
                    <div className="space-y-2 min-w-0 flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight break-words">
                            {post.title}
                        </h1>
                        
                        {/* Metadades petites */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${
                                post.published 
                                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-600' : 'bg-yellow-600'}`} />
                                {post.published ? 'PUBLICAT' : 'ESBORRANY'}
                            </span>
                            <span className="font-mono text-xs opacity-50 truncate max-w-[200px]">
                                / {post.slug}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. BLOC BOTONS (La part que es tallava) */}
                {/* flex-wrap: Si no hi caben, baixen de línia. NO es tallen. */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
                    
                    <Button variant="ghost" size="icon" className="text-destructive shrink-0">
                        <Trash2 className="w-5 h-5"/>
                    </Button>
                    
                    {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="outline" size="icon" className="shrink-0">
                                <ExternalLink className="w-5 h-5"/>
                            </Button>
                        </Link>
                    )}
                    
                    {/* Separador vertical (només estètic) */}
                    <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
                    
                    {/* Toggle d'estat */}
                    <div className="shrink-0">
                        <PostStatusToggle postId={post.id || ''} isPublished={post.published} />
                    </div>
                    
                    {/* Botó Editar */}
                    <Link href={`/admin/blog/${post.slug}/edit`}>
                        <Button className="font-semibold shadow-sm shrink-0">
                            <Save className="w-4 h-4 mr-2"/> 
                            Editar
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- CONTINGUT (TABS & GRID) --- */}
            <PostViewTabs postId={post.id} socialPosts={socialPosts || []}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
                    
                    {/* COLUMNA ESQUERRA (Contingut) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                            {post.coverImage ? (
                                <Image src={post.coverImage} alt="Cover" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground/50 text-sm">Sense Imatge</div>
                            )}
                        </div>

                        <Card>
                            <CardHeader className="py-3 bg-muted/10 border-b"><CardTitle className="text-sm">Contingut del Post</CardTitle></CardHeader>
                            <CardContent className="p-4 md:p-6 prose dark:prose-invert max-w-none prose-sm md:prose-base">
                                <MDXContent source={post.content || ''} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* COLUMNA DRETA (Info) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="py-3 bg-muted/10 border-b"><CardTitle className="text-xs font-bold uppercase text-muted-foreground">Detalls SEO</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-4 text-sm">
                                <div>
                                    <label className="font-bold text-muted-foreground text-xs block mb-1">URL Slug</label>
                                    <code className="bg-muted p-1.5 rounded text-xs block truncate">{post.slug}</code>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground text-xs block mb-1">Descripció</label>
                                    <p className="text-muted-foreground italic text-xs leading-relaxed">{post.description || 'Sense descripció'}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-muted-foreground text-xs block mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map(t => (
                                            <span key={t} className="bg-muted border px-2 py-1 rounded text-[10px] font-medium">#{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PostViewTabs>
        </div>
    );
}